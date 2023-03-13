import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { BookInfo } from "@/types/nftBook";

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
    const {
      tokenId,
      description,
      externalLink,
      version,
      maxSupply,
      genres,
      languages,
      totalPages,
      keywords,
      publishingTime
    }: BookInfo = req.body;

    // Insert book into database
    const newBooks = await db.collection("books").insertOne({
      token_id: tokenId,
      description,
      external_link: externalLink,
      version,
      max_supply: maxSupply,
      total_pages: totalPages,
      keywords,
      publishing_time: publishingTime
    });

    const newBookId: ObjectId = newBooks.insertedId;

    // Insert languages into database
    languages.map(async (language) => {
      const languageDetail = await db
        .collection("languages")
        .findOne({ language });
      if (languageDetail) {
        db.collection("book_languages").insertOne({
          language_id: languageDetail._id,
          book_id: newBookId
        });
      }
    });

    // Insert genres into database
    genres.map(async (genre) => {
      const genreDetail = await db.collection("genres").findOne({ genre });
      if (genreDetail) {
        db.collection("book_genres").insertOne({
          genre_id: genreDetail._id,
          book_id: newBookId
        });
      }
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
