import { FileReq } from "@_types/nftBook";
import axios from "axios";
import FormData from "form-data";
import { IronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

import {
  addressCheckMiddleware,
  pinataApiKey,
  pinataSecretApiKey,
  withSessionAPI
} from "../utils";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb"
    }
  }
};

export default withSessionAPI(
  async (
    req: NextApiRequest & { session: IronSession },
    res: NextApiResponse
  ) => {
    if (req.method === "POST") {
      try {
        const { bytes, fileName, contentType } = req.body as FileReq;

        if (!bytes || !fileName || !contentType) {
          return res.status(422).send({ message: "Image data are missing" });
        }

        await addressCheckMiddleware(req, res);

        const buffer = Buffer.from(Object.values(bytes));
        const formData = new FormData();

        formData.append("file", buffer, {
          contentType,
          filename: fileName + "-" + uuidv4()
        });

        const fileRes = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            maxBodyLength: Infinity,
            headers: {
              "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
              pinata_api_key: pinataApiKey,
              pinata_secret_api_key: pinataSecretApiKey
            }
          }
        );

        return res.status(200).send(fileRes.data);
      } catch (err: any) {
        console.log("Something went wrong, please try again later!");
      }
    } else {
      return res.status(422).send({ message: "Invalid endpoint" });
    }
  }
);
