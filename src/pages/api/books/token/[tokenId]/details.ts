import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";

import clientPromise from "../../../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const client = await clientPromise;
    const db = client.db("NftBookStore");
    const { tokenId } = req.query;

    const bookDetail = await db.collection("books").findOne({ tokenId });

    return res.json({
      success: true,
      message: "Get bookDetail successfully.",
      data: bookDetail
    });
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
}
