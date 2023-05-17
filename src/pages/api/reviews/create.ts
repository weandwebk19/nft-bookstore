import clientPromise from "@lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("NftBookStore");
      const { walletAddress, tokenId, review, rating } = req.body;

      const user = await db.collection("users").findOne({
        wallet_address: walletAddress
      });

      const book = await db.collection("books").findOne({
        token_id: tokenId
      });

      if (user && book) {
        db.collection("reviews").createIndex(
          { book_id: 1, user_id: 2 },
          { unique: true }
        );
        const newReview = await db.collection("reviews").insertOne({
          book_id: book._id,
          user_id: user._id,
          rating: parseInt(rating),
          review: review,
          created_at: new Date()
        });

        return res.status(201).json({
          success: true,
          message: "Review created.",
          data: newReview
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Address is not exists.",
          data: null
        });
      }
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        message: e.message,
        data: null
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
