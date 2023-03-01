import type { NextApiRequest, NextApiResponse } from "next";

import clientPromise from "../../../lib/mongodb";

type ResponseData = {
  success: boolean;
  message: string;
  data: object | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const client = await clientPromise;
    const db = client.db("NftBookStore");
    const { address, username } = req.body;

    // Check if the address is exists
    const countAccount = await db.collection("users").count({
      address: address
    });

    if (countAccount > 0) {
      return res.status(400).json({
        success: false,
        message: "Address already exists",
        data: null
      });
    } else {
      const newAccount = await db
        .collection("users")
        .insertOne({ address, username });

      return res.json({
        success: true,
        message: "Account created",
        data: newAccount
      });
    }
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
}
