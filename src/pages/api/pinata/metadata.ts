import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";

import clientPromise from "../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    try {
      const { nftUri } = req.body;
      const nftRes = await axios.get(nftUri, {
        headers: {
          Accept: "text/plain"
        }
      });
      return res.status(200).json({
        success: true,
        message: "Get metadata from pinata successfully.",
        data: nftRes.data
      });
    } catch (e: any) {
      console.error(e);
      // throw new Error(e).message;
    }
  } else {
    return res.status(400).json({
      message: "Invalid api route",
      success: false,
      data: null
    });
  }
}
