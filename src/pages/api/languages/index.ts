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

    const languages = await db.collection("languages").find().toArray();

    return res.json({
      success: true,
      message: "Get languages successfully.",
      data: languages
    });
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
}
