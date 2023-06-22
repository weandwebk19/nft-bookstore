import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";

import { addressCheckMiddleware, withSessionSSR } from "../../../utils";
import { deleteFile } from "../../../utils";

export default withSessionSSR(
  async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    if (req.method === "DELETE") {
      try {
        const cid: string = req.query.cid as string;

        await addressCheckMiddleware(req, res);
        const jsonRes = await deleteFile(cid);

        return res.status(200).json({
          message: "Delete successfully",
          success: true,
          data: jsonRes
        });
      } catch (err) {
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
