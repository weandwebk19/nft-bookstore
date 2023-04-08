import clientPromise from "@lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const client = await clientPromise;
    const db = client.db("NftBookStore");
    const tokenId: string = req.query.tokenId as string;

    const bookDetail = await db
      .collection("books")
      .findOne({ token_id: parseInt(tokenId) });

    if (bookDetail) {
      return res.json({
        success: true,
        message: "Get bookId successfully.",
        data: bookDetail?._id
      });
    } else {
      return res.json({
        success: false,
        message: "TokenId is wrong.",
        data: null
      });
    }
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
}
