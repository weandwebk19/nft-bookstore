import { sendEmail } from "@lib/email";
import clientPromise from "@lib/mongodb";
import { render } from "@react-email/render";
import type { NextApiRequest, NextApiResponse } from "next";

import PublishingBookRegistrationInitiated from "@/components/shared/Emails/PublishingBookRegistrationInitiated";
import { BookTemp } from "@/types/nftBook";
import { toSnake } from "@/utils/nomalizer";

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
      const bookTemp = req.body as BookTemp;

      // Create index to ensure that tokenId is unique
      db.collection("book_temps").createIndex(
        { token_id: 1 },
        { unique: true }
      );

      // Insert book_temps into database
      db.collection("book_temps").insertOne({
        ...toSnake(bookTemp)
      });

      // send email to author
      const author = await db
        .collection("authors")
        .findOne({ wallet_address: bookTemp.author });

      if (author) {
        sendEmail({
          to: author.email,
          subject: "[NFT BookStore] - Your book is under review.",
          html: render(PublishingBookRegistrationInitiated(author.pseudonym))
        });
      }
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
