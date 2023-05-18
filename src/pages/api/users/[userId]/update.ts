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
        let objForUpdate: any = {};
        if (userInfo.avatar) objForUpdate.avatar = userInfo.avatar;
        if (userInfo.avatarPublicId)
          objForUpdate.avatar_public_id = userInfo.avatarPublicId;
        if (userInfo.fullname) objForUpdate.fullname = userInfo.fullname;
        if (userInfo.email) objForUpdate.email = userInfo.email;
        if (userInfo.fullname) objForUpdate.fullname = userInfo.fullname;
        if (userInfo.bio) objForUpdate.bio = userInfo.bio;
        if (userInfo.website) objForUpdate.website = userInfo.website;
        if (userInfo.facebook) objForUpdate.facebook = userInfo.facebook;
        if (userInfo.twitter) objForUpdate.twitter = userInfo.twitter;
        if (userInfo.instagram) objForUpdate.instagram = userInfo.instagram;
        if (userInfo.linkedIn) objForUpdate.linked_in = userInfo.linkedIn;
        const newAccount = await db.collection("users").updateOne(
          {
            _id: new ObjectId(userId as string)
          },
          {
            $set: objForUpdate
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
