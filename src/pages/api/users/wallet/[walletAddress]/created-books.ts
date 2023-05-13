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

    const books = await db
      .collection("books")
      .find({ user_created: walletAddress })
      .toArray();

    if (books) {
      const rawBooks = books.map((book) => {
        return toCamel({
          ...book,
          _id: book._id.toString()
        });
      });
      return res.json({
        success: true,
        message: "Get created books successfully.",
        data: rawBooks
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
