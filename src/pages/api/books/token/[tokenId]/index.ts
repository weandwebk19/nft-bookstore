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
    const tokenId: string = req.query.tokenId as string;

    const bookDetail = await db
      .collection("books")
      .findOne({ token_id: parseInt(tokenId) });

    const languagesRaw = await db
      .collection("book_languages")
      .find({ book_id: bookDetail?._id })
      .toArray();
    const languages = await Promise.all(
      languagesRaw.map(async (e) => {
        const language = await db
          .collection("languages")
          .findOne({ _id: new ObjectId(e.language_id) });
        return language?.name;
      })
    );

    const genresRaw = await db
      .collection("book_genres")
      .find({ book_id: bookDetail?._id })
      .toArray();

    const genres = await Promise.all(
      genresRaw.map(async (e) => {
        const genre = await db
          .collection("genres")
          .findOne({ _id: new ObjectId(e.genre_id) });
        return genre?.name;
      })
    );

    if (bookDetail) {
      return res.json({
        success: true,
        message: "Get bookDetail successfully.",
        data: {
          ...toCamel({ ...bookDetail, _id: bookDetail._id.toString() }),
          languages,
          genres
        }
      });
    } else {
      return res.json({
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
