import clientPromise from "@lib/mongodb";
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
    const walletAddress: string = req.query.walletAddress as string;

    const transactions = await db
      .collection("transaction_histories")
      .find({ from_address: walletAddress })
      .toArray();

    if (transactions) {
      const rawTransactions = transactions.map((transaction) => {
        return toCamel({
          ...transaction,
          _id: transaction._id.toString()
        });
      });
      return res.json({
        success: true,
        message: "Get transactions successfully.",
        data: rawTransactions
      });
    } else {
      return res.json({
        success: false,
        message: "walletAddress is wrong.",
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
