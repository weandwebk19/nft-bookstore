import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";
import { toSnake } from "@/utils/nomalizer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("NftBookStore");
      const { tokenId, walletAddress } = req.body;

      // Check if the user is exists
      const countUsers = await db.collection("users").count({
        wallet_address: walletAddress.toLowerCase()
      });
      // Check if the book is exists
      const countBooks = await db.collection("books").count({
        token_id: tokenId
      });

      if (countUsers > 0 && countBooks > 0) {
        db.collection("watchlists").createIndex(
          { token_id: 1, wallet_address: 2 },
          { unique: true }
        );
        const newWatchlist = await db.collection("watchlists").insertOne({
          token_id: tokenId,
          wallet_address: walletAddress.toLowerCase()
        });

        return res.json({
          success: true,
          message: "Watchlist created",
          data: newWatchlist
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "User or Book is not exists",
          data: null
        });
      }
    } catch (e: any) {
      return res.status(400).json({
        message: "Something went wrong.",
        success: false,
        data: e
      });
    }
  } else {
    return res.status(400).json({
      message: "Invalid api route",
      success: false,
      data: null
    });
  }
}
