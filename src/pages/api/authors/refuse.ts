import type { AuthorInfo } from "@_types/author";
import { sendEmail } from "@lib/email";
import clientPromise from "@lib/mongodb";
import { render } from "@react-email/render";
import cloudinary from "cloudinary";
import { verify } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

import AuthorRegistrationFail from "@/components/shared/Emails/AuthorRegistrationFail";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
});
const deleteImage = async (public_id: string) => {
  cloudinary.v2.uploader
    .destroy(public_id, function (error, result) {
      if (error) {
        throw error;
      }
    })
    .then((resp) => console.log(resp))
    .catch((_err) =>
      console.log("Something went wrong, please try again later.", _err)
    );
};
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
      // Delete image from cloudinary
      deleteImage(authorInfo.picture.public_id);
      deleteImage(authorInfo.frontDocument.public_id);
      deleteImage(authorInfo.backDocument.public_id);

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
