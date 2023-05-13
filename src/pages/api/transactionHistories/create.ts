import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";
import { TransactionHistoriesNoId } from "@/types/transactionHistories";
import { toSnake } from "@/utils/nomalizer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("NftBookStore");
      const transactionHistory = req.body;

      // // Insert transactionHistories into database
      const newHistory = await db
        .collection("transaction_histories")
        .insertOne(toSnake(transactionHistory));

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
