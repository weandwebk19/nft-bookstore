import type { AuthorInfo } from "@_types/author";
import { sendEmail } from "@lib/email";
import clientPromise from "@lib/mongodb";
import { render } from "@react-email/render";
import AuthorRegistrationInitiated from "@shared/Emails/AuthorRegistrationInitiated";
import AuthorRequestEmail from "@shared/Emails/AuthorRequestEmail";
import { sign } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

import { toSnake } from "@/utils/nomalizer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const client = await clientPromise;
      const db = client.db("NftBookStore");
      const authorInfo = req.body as AuthorInfo;

      const hash = sign(authorInfo, process.env.JWT_AUTHOR_KEY!, {
        expiresIn: "15d"
      });

      // Insert author_request into database
      db.collection("author_requests").insertOne({
        hash: hash
      });

      // sendEmail({
      //   to: process.env.SMTP_FROM_EMAIL!,
      //   subject: "[NFT BookStore] - Require become author",
      //   html: render(AuthorRequestEmail(authorInfo, hash))
      // });

      sendEmail({
        to: authorInfo.email,
        subject: "[NFT BookStore] - Registration Initiated",
        html: render(AuthorRegistrationInitiated(authorInfo))
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
  } catch (err) {
    console.log("Something went wrong, please try again later!");
  }
}
