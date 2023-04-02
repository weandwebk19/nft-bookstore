import type { NextApiRequest, NextApiResponse } from "next";

import { ResponseData } from "@/types/api";

import { getMetadata } from "../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    try {
      const nftUri: string = req.query.nftUri as string;
      const data = await getMetadata(nftUri);
      return res.status(200).json({
        success: true,
        message: "Get metadata from pinata successfully.",
        data
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
