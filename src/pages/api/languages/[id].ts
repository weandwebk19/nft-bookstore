import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

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

    const language = await db
      .collection("languages")
      .findOne({ _id: new ObjectId(id) });

    return res.json({
      success: true,
      message: "Get language successfully.",
      data: language
    });
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
}
