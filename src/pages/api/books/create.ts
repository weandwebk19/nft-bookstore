import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { BookInfo } from "@/types/nftBook";
import { toSnake } from "@/utils/nomalizer";

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
    const { languages, genres, ...rest } = bookInfo;

    // Create index to ensure that tokenId is unique
    db.collection("books").createIndex({ token_id: 1 }, { unique: true });

    // Insert book into database
    const newBooks = await db.collection("books").insertOne(toSnake(rest));

    const newBookId: ObjectId = newBooks.insertedId;

    // Insert languages into database
    languages.map(async (language) => {
      db.collection("book_languages").insertOne({
        language_id: new ObjectId(language),
        book_id: newBookId
      });
    });

    // Insert genres into database
    genres.map(async (genre) => {
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
