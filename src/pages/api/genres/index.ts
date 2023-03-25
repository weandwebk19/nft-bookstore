import clientPromise from "@lib/mongodb";
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

    const genres = await db.collection("genres").find().toArray();

    return res.json({
      success: true,
      message: "Get genres successfully.",
      data: genres
    });
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
}
