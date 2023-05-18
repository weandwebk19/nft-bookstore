import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";
import { toCamel } from "@/utils/nomalizer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const client = await clientPromise;
    const db = client.db("NftBookStore");
    const reviewId: string = req.query.reviewId as string;

    const review = await db.collection("reviews").findOne({
      _id: new ObjectId(reviewId as string)
    });

    if (review) {
      return res.json({
        success: true,
        message: "Get review successfully.",
        data: toCamel({
          ...review,
          _id: review._id.toString(),
          book_id: review.book_id.toString(),
          user_id: review.user_id.toString()
        })
      });
    } else {
      return res.json({
        success: false,
        message: "BookId is wrong.",
        data: null
      });
    }
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
      data: null
    });
  }
}
