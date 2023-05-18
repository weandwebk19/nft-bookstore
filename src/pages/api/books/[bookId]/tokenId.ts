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
    const bookId: string = req.query.bookId as string;

    const tokenId = await db
      .collection("books")
      .findOne({ _id: new ObjectId(bookId) }, { projection: { token_id: 1 } });

    if (tokenId) {
      return res.json({
        success: true,
        message: "Get tokenId successfully.",
        data: tokenId.token_id
      });
    } else {
      return res.json({
        success: false,
        message: "bookId is wrong.",
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
