import type { AuthorInfo } from "@_types/author";
import clientPromise from "@lib/mongodb";
import { render } from "@react-email/render";
import AuthorRegistrationSuccess from "@shared/Emails/AuthorRegistrationSuccess";
import { verify } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

import { sendEmail } from "../../../lib/email";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("NftBookStore");
    const hash = req.query.hash as string;

    const authorInfo = verify(hash, process.env.JWT_AUTHOR_KEY!) as AuthorInfo;

    if (authorInfo) {
      await db.collection("users").updateOne(
        {
          wallet_address: authorInfo.walletAddress.toLowerCase()
        },
        { $set: { is_author: true } }
      );
      await db
        .collection("authors")
        .createIndex({ wallet_address: 1 }, { unique: true });
      await db.collection("authors").insertOne(authorInfo);

      // Send email notification to author
      await sendEmail({
        to: authorInfo.email,
        subject: "[NFT BookStore] - Registration Successful",
        html: render(AuthorRegistrationSuccess(authorInfo))
      });

      return res.status(200).json({
        success: true,
        message: "Successfully"
      });
    }

    return res.status(400).json({
      success: false,
      message: "Hash not true"
    });
  } catch (err: any) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}
