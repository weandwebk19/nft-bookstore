import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db("NftBookStore");
      const { userId, bookId } = req.query;

      const watchlist = await db.collection("watchlists").deleteOne({
        book_id: new ObjectId(bookId as string),
        user_id: new ObjectId(userId as string)
      });

      return res.json({
        success: true,
        message: "Watchlist deleted successfully.",
        data: watchlist
      });
    } catch (e: any) {
      return res.status(400).json({
        message: "Something went wrong.",
        success: false,
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
