import type { AuthorInfo } from "@_types/author";
// import { deleteImage } from "@lib/cloudinary";
import clientPromise from "@lib/mongodb";
import { render } from "@react-email/render";
import AuthorRegistrationSuccess from "@shared/Emails/AuthorRegistrationSuccess";
import { verify } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

import AuthorRegistrationFail from "@/components/shared/Emails/AuthorRegistrationFail";

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

    console.log("authorInfo", authorInfo);

    if (authorInfo) {
      // Delete image from cloudinary
      // deleteImage(authorInfo.picture.public_id);
      // deleteImage(authorInfo.frontDocument.public_id);
      // deleteImage(authorInfo.backDocument.public_id);

      // Send email notification to author
      await sendEmail({
        to: authorInfo.email,
        subject: "[NFT BookStore] - Registration Failed",
        html: render(AuthorRegistrationFail(authorInfo))
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
