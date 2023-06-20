import { sendEmail } from "@lib/email";
import clientPromise from "@lib/mongodb";
import { render } from "@react-email/render";
import PublishingBookRequestEmail from "@shared/Emails/PublishingBookRequestEmail";
import { sign } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

import PublishingBookRegistrationInitiated from "@/components/shared/Emails/PublishingBookRegistrationInitiated";
import { BookBrief } from "@/types/nftBook";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1000mb"
    }
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const client = await clientPromise;
      const db = client.db("NftBookStore");
      const { bookFile, bookFileName, ...bookBrief } = req.body;

      const hash = sign(bookBrief, process.env.JWT_AUTHOR_KEY!, {
        expiresIn: "15d"
      });

      const author = await db
        .collection("authors")
        .findOne({ wallet_address: bookBrief.author });

      // send email to author
      if (author) {
        sendEmail({
          to: author.email,
          subject: "[NFT BookStore] - Your book is under review.",
          html: render(
            PublishingBookRegistrationInitiated({
              ...bookBrief,
              author: author.pseudonym
            })
          )
        });
      }

      const buffer = Buffer.from(Object.values(bookFile));
      // send email to admin
      sendEmail({
        to: process.env.SMTP_FROM_EMAIL!,
        subject: "[NFT BookStore] - Request to review publishing book.",
        html: render(PublishingBookRequestEmail(bookBrief, hash)),
        attachments: [
          {
            filename: bookFileName,
            content: buffer
          }
        ]
      });

      return res.status(200).json({
        success: true,
        message: "Email sent successfully"
      });
    } else {
      return res.status(400).json({
        message: "Invalid api route",
        success: false,
        data: null
      });
    }
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
      success: false,
      data: null
    });
  }
}
