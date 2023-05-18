import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";
import { BookInfoForUpdate } from "@/types/nftBook";
import { toSnake } from "@/utils/nomalizer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "PUT") {
    try {
      const client = await clientPromise;
      const db = client.db("NftBookStore");
      const reviewId: string = req.query.reviewId as string;
      const reviewInfo = req.body.reviewInfo;

      let objForUpdate: any = {};

      if (reviewInfo.reply) objForUpdate.reply = reviewInfo.reply;
      if (reviewInfo.review) objForUpdate.review = reviewInfo.review;
      if (reviewInfo.rating) objForUpdate.rating = reviewInfo.rating;
      const newReview = await db.collection("reviews").updateOne(
        {
          _id: new ObjectId(reviewId)
        },
        {
          $set: objForUpdate
        }
      );

      return res.json({
        success: true,
        message: "Review updated successfully",
        data: newReview
      });
    } catch (e: any) {
      return res.json({
        success: true,
        message: e.message,
        data: e
      });
    }
  } else {
    return res.status(400).json({
      message: "Invalid api route",
      success: false,
      data: null
    });
  }
}
