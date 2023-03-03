import axios from "axios";
import axiosRetry from "axios-retry";
import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay
});

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
        },
        timeout: 20000
      });
      return res.status(200).json({
        success: true,
        message: "Get metadata from pinata successfully.",
        data: nftRes.data
      });
    } catch (e: any) {
      console.error("e.response", e.response);
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
