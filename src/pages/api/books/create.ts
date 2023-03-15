import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { BookInfo } from "@/types/nftBook";
import { toSnake } from "@/utils/nomalizer";

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
    const bookInfo: BookInfo = req.body.bookInfo;

    // Insert book into database
    const newBooks = await db.collection("books").insertOne(toSnake(bookInfo));

    const newBookId: ObjectId = newBooks.insertedId;

    // Insert languages into database
    bookInfo?.languages.map(async (language) => {
      db.collection("book_languages").insertOne({
        language_id: new ObjectId(language),
        book_id: newBookId
      });
    });

    // Insert genres into database
    bookInfo?.genres.map(async (genre) => {
      db.collection("book_genres").insertOne({
        genre_id: new ObjectId(genre),
        book_id: newBookId
      });
    });

    return res.json({
      success: true,
      message: "Book created",
      data: newBooks
    });
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
}
