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
    const { bookId, category } = req.query;

    const pricingHistories = await db
      .collection("pricing_histories")
      .find({
        book_id: bookId as string,
        category: (category as string).toUpperCase()
      })
      .toArray();

    if (pricingHistories) {
      const rawpricingHistories = pricingHistories.map((pricingHistory) => {
        return toCamel({
          ...pricingHistory,
          _id: pricingHistory._id.toString(),
          book_id: pricingHistory.book_id.toString()
        });
      });
      return res.json({
        success: true,
        message: "Get pricing histories successfully.",
        data: rawpricingHistories
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
