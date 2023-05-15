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
    const { tokenId, walletAddress } = req.query;

    const watchlist = await db.collection("watchlists").findOne({
      wallet_address: walletAddress as string,
      token_id: parseInt(tokenId as string)
    });

    if (watchlist) {
      return res.json({
        success: true,
        message: "Get watchlist successfully.",
        data: toCamel({ ...watchlist, _id: watchlist._id.toString() })
      });
    } else {
      return res.json({
        success: false,
        message: "tokenId or walletAddress is wrong.",
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
