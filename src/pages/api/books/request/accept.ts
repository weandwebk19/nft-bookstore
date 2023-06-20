import { sendEmail } from "@lib/email";
import clientPromise from "@lib/mongodb";
import { render } from "@react-email/render";
import PublishingBookRegistrationSuccess from "@shared/Emails/PublishingBookRegistrationSuccess";
import { verify } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

import { BookBrief } from "@/types/nftBook";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("NftBookStore");
    const hash = req.query.hash as string;

    const bookBrief = verify(hash, process.env.JWT_AUTHOR_KEY!) as BookBrief;
    if (bookBrief) {
      // Update approved status book
      await db.collection("books").updateOne(
        {
          token_id: bookBrief.tokenId
        },
        { $set: { is_approved: true } }
      );

      // Send email notification to author
      const author = await db
        .collection("authors")
        .findOne({ wallet_address: bookBrief.author });
      if (author) {
        await sendEmail({
          to: author.email,
          subject: "[NFT BookStore] - Your NFT book is approved",
          html: render(
            PublishingBookRegistrationSuccess({
              ...bookBrief,
              author: author.pseudonym
            })
          )
        });
      }

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
