import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";
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

    const author = await db
      .collection("authors")
      .findOne({ wallet_address: walletAddress });

    if (author) {
      return res.json({
        success: true,
        message: "Get author successfully.",
        data: toCamel({ ...author, _id: author._id.toString() })
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
