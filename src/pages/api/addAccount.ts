import clientPromise from "../../lib/mongodb";

import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  message: string;
  data: object | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const client = await clientPromise;
    const db = client.db("accounts");
    const { address, username, wallet, email, bio, avatar, phone } = req.body;

    const account = await db.collection("accounts").insertOne({
      address,
      username,
      wallet,
      email,
      bio,
      avatar,
      phone,
    });

    res.json({
      success: true,
      message: "Account created",
      data: account,
    });
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
}
