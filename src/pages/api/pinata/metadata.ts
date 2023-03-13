import axios from "axios";
import axiosRetry from "axios-retry";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";

// axiosRetry(axios, {
//   retries: 3,
//   retryDelay: axiosRetry.exponentialDelay
// });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    try {
      const nftUri: string = req.query.uri as string;
      const nftRes = await axios.get(nftUri, {
        headers: {
          Accept: "text/plain"
        },
        timeout: 20000
      });
      return res.status(200).json({
        success: true,
        message: "Get metadata from pinata successfully.",
        data: nftRes.data
      });
    } catch (e: any) {
      console.error("e", e);
      return res.status(500).json({
        message: "Something went wrong.",
        success: false,
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
