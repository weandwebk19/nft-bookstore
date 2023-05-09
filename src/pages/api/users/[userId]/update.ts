import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";
import { toSnake } from "@/utils/nomalizer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("NftBookStore");
      const { userId } = req.query;
      const userInfo = req.body;

      if (userId) {
        const newAccount = await db.collection("users").updateOne(
          {
            _id: new ObjectId(userId as string)
          },
          {
            $set: {
              avatar: userInfo.avatar,
              avatar_public_id: userInfo.avatarPublicId,
              fullname: userInfo.fullname,
              email: userInfo.email,
              bio: userInfo.bio,
              website: userInfo.website,
              facebook: userInfo.facebook,
              twitter: userInfo.twitter,
              instagram: userInfo.instagram,
              linked_in: userInfo.linkedIn
            }
          }
        );

        return res.json({
          success: true,
          message: "Account updated successfully",
          data: newAccount
        });
      } else {
        return res.json({
          success: false,
          message: "userId not found",
          data: null
        });
      }
    } catch (e: any) {
      console.error(e);
    }
  } else {
    return res.status(400).json({
      message: "Invalid api route",
      success: false,
      data: null
    });
  }
}
