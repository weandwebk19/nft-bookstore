import clientPromise from "@lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { toCamel } from "@/utils/nomalizer";

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
    if (req.method === "GET") {
      const client = await clientPromise;
      const db = client.db("NftBookStore");
      const query = req.query;

      if (Object.keys(query).length > 0) {
        const pseudonym = query.pseudonym;
        if (pseudonym) {
          const authors = await db
            .collection("authors")
            .find({ pseudonym: new RegExp(".*" + pseudonym + ".*") })
            .toArray();

          return res.json({
            success: true,
            message: "Get authors successfully.",
            data: toCamel(authors)
          });
        }
      } else {
        const authors = await db.collection("authors").find().toArray();

        return res.json({
          success: true,
          message: "Get authors successfully.",
          data: toCamel(authors)
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid api route",
        success: false,
        data: null
      });
    }
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
}
