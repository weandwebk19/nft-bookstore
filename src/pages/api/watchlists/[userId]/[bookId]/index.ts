import clientPromise from "@lib/mongodb";
import { toCamel } from "@utils/nomalizer";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const client = await clientPromise;
    const db = client.db("NftBookStore");
    const { bookId, userId } = req.query;

    const watchlist = await db.collection("watchlists").findOne({
      user_id: new ObjectId(userId as string),
      book_id: new ObjectId(bookId as string)
    });

    if (watchlist) {
      return res.json({
        success: true,
        message: "Get watchlist successfully.",
        data: toCamel(watchlist)
      });
    } else {
      return res.json({
        success: false,
        message: "bookId or userId is wrong.",
        data: null
      });
    }
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message,
      data: e
    });
  }
}
