import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";
import { BookHistoriesNoId } from "@/types/bookHistories";
import { toSnake } from "@/utils/nomalizer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("NftBookStore");
      const bookHistory = req.body;

      // // Insert bookHistories into database
      const newHistory = await db
        .collection("book_histories")
        .insertOne(toSnake(bookHistory));

      return res.json({
        success: true,
        message: "History created",
        data: newHistory
      });
    } catch (e: any) {
      console.error(e);
      throw new Error(e).message;
    }
  } else {
    return res.status(400).json({
      message: "Invalid api route",
      success: false,
      data: null
    });
  }
}
