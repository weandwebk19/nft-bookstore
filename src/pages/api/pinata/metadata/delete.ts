import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";

import { addressCheckMiddleware, withSession } from "../utils";
import { deleteFile } from "../utils";

export default withSession(
  async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    console.log("Delete metadata");
    if (req.method === "DELETE") {
      try {
        const nftUri: string = req.body.nftUri as string;

        await addressCheckMiddleware(req, res);
        const jsonRes = await deleteFile(nftUri);

        return res.status(200).json({
          message: "Delete successfully",
          success: true,
          data: jsonRes
        });
      } catch (err) {
        console.log("err", err);
        return res.status(422).json({
          message: "Delete successfully",
          success: true,
          data: err
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
);
