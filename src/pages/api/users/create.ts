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
      const { wallet_address, fullname } = req.body;

      // Check if the address is exists
      const countAccount = await db.collection("users").count({
        wallet_address
      });

      if (countAccount > 0) {
        return res.status(400).json({
          success: false,
          message: "Address already exists",
          data: null
        });
      } else {
        db.collection("users").createIndex(
          { wallet_address: 1 },
          { unique: true }
        );
        const newAccount = await db
          .collection("users")
          .insertOne({ wallet_address, fullname });

        return res.json({
          success: true,
          message: "Account created",
          data: newAccount
        });
      }
    } catch (e: any) {
      console.error(e);
    }
  } else {
    return res.status(400).json({
      message: "Invalid api route",
      success: false,
      data: null
    });
  }
}
