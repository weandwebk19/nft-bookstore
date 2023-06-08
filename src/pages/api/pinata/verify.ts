import { NftBookMeta } from "@_types/nftBook";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

import {
  addressCheckMiddleware,
  contractAddress,
  pinataApiKey,
  pinataSecretApiKey,
  withSessionAPI
} from "../utils";

export default withSessionAPI(
  async (req: NextApiRequest & { session: any }, res: NextApiResponse) => {
    if (req.method === "POST") {
      try {
        const { body } = req;
        const nftBook = body.nftBook as NftBookMeta;
        if (!nftBook.title || !nftBook.bookFile || !nftBook.bookCover) {
          return res
            .status(422)
            .send({ message: "Some of the form data are missing!" });
        }

        await addressCheckMiddleware(req, res);

        const jsonRes = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          {
            pinataMetadata: {
              name: uuidv4()
            },
            pinataContent: nftBook
          },
          {
            headers: {
              pinata_api_key: pinataApiKey,
              pinata_secret_api_key: pinataSecretApiKey
            }
          }
        );

        return res.status(200).send(jsonRes.data);
      } catch {
        return res.status(422).send({ message: "Cannot create JSON" });
      }
    } else if (req.method === "GET") {
      try {
        const message = { contractAddress, id: uuidv4() };

        // req.session.set("message-session", message);
        req.session["message-session"] = await message;
        await req.session.save();

        return res.json(message);
      } catch {
        return res.status(422).send({ message: "Cannot generate a message!" });
      }
    } else {
      return res.status(200).json({ message: "Invalid api route" });
    }
  }
);
