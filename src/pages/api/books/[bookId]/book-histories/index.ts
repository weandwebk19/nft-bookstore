import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";
import { toCamel } from "@/utils/nomalizer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const client = await clientPromise;
    const db = client.db("NftBookStore");
    const bookId: string = req.query.bookId as string;

    const tokenId = await db
      .collection("books")
      .findOne({ _id: new ObjectId(bookId) }, { projection: { token_id: 1 } });

    if (tokenId) {
      const books = await db
        .collection("book_histories")
        .find({ token_id: tokenId.token_id })
        .toArray();

      if (books) {
        const rawHistories = books.map((book) => {
          return toCamel({
            ...book,
            _id: book._id.toString()
          });
        });
        return res.json({
          success: true,
          message: "Get books history successfully.",
          data: rawHistories
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "No data found.",
          data: null
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "bookId is wrong.",
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
