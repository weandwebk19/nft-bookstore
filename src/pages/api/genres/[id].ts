import { ObjectId } from "mongodb";
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
    const id: string = req.query.id as string;

    const genre = await db
      .collection("genres")
      .findOne({ _id: new ObjectId(id) });

    return res.json({
      success: true,
      message: "Get genre successfully.",
      data: genre
    });
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
}
