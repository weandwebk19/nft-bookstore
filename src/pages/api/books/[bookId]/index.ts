import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";

import clientPromise from "./../../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const client = await clientPromise;
    const db = client.db("NftBookStore");
    const bookId: string = req.query.bookId as string;

    const bookDetail = await db
      .collection("books")
      .findOne({ _id: new ObjectId(bookId) });

    if (bookDetail) {
      return res.json({
        success: true,
        message: "Get bookDetail successfully.",
        data: bookDetail
      });
    } else {
      return res.json({
        success: false,
        message: "bookId is wrong.",
        data: null
      });
    }
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
}
