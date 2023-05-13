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
    const { bookId } = req.query;

    const reviews = await db
      .collection("reviews")
      .find({
        book_id: new ObjectId(bookId as string)
      })
      .toArray();

    if (reviews) {
      const rawReviews = reviews.map((review) => {
        return toCamel({
          ...review,
          _id: review._id.toString(),
          book_id: review.book_id.toString(),
          user_id: review.user_id.toString()
        });
      });
      return res.json({
        success: true,
        message: "Get reviews successfully.",
        data: rawReviews
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
