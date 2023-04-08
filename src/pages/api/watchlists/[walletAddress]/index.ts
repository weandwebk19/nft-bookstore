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
    const { walletAddress } = req.query;

    const watchlists = await db
      .collection("watchlists")
      .find({
        wallet_address: (walletAddress as string).toLowerCase()
      })
      .toArray();

    if (watchlists) {
      return res.json({
        success: true,
        message: "Get watchlist successfully.",
        data: watchlists
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
