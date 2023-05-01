import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";
import { BookInfoForUpdate } from "@/types/nftBook";
import { toSnake } from "@/utils/nomalizer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "PUT") {
    try {
      const client = await clientPromise;
      const db = client.db("NftBookStore");
      const bookInfo: BookInfoForUpdate = req.body.bookInfo;

      await db.collection("books").updateOne(
        {
          _id: new ObjectId(bookInfo.id)
        },
        {
          $set: {
            description: bookInfo.description,
            external_link: bookInfo.externalLink,
            total_pages: bookInfo.totalPages,
            keywords: bookInfo.keywords
          }
        }
      );

      // // Update languages
      // Delete old languages
      bookInfo.oldLanguages?.map(async (language) => {
        db.collection("book_languages").deleteOne({
          book_id: new ObjectId(bookInfo.id),
          language_id: new ObjectId(language)
        });
      });
      // Insert languages
      bookInfo.languages?.map(async (language) => {
        db.collection("book_languages").insertOne({
          book_id: new ObjectId(bookInfo.id),
          language_id: new ObjectId(language)
        });
      });

      // // Update genres
      // Delete old genres
      bookInfo.oldGenres?.map(async (genre) => {
        db.collection("book_genres").deleteOne({
          book_id: new ObjectId(bookInfo.id),
          genre_id: new ObjectId(genre)
        });
      });
      // Insert genres
      bookInfo.genres?.map(async (genre) => {
        db.collection("book_genres").insertOne({
          book_id: new ObjectId(bookInfo.id),
          genre_id: new ObjectId(genre)
        });
      });

      return res.json({
        success: true,
        message: "Book updated successfully",
        data: {}
      });
    } catch (e: any) {
      return res.json({
        success: true,
        message: e.message,
        data: e
      });
    }
  } else {
    return res.status(400).json({
      message: "Invalid api route",
      success: false,
      data: null
    });
  }
}
