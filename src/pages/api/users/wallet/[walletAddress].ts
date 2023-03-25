import clientPromise from "@lib/mongodb";
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
    const walletAddress: string = req.query.walletAddress as string;

    const user = await db
      .collection("users")
      .findOne({ wallet_address: walletAddress.toLowerCase() });

    if (user) {
      return res.json({
        success: true,
        message: "Get user successfully.",
        data: user
      });
    } else {
      return res.json({
        success: false,
        message: "walletAddress is wrong.",
        data: null
      });
    }
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
}
