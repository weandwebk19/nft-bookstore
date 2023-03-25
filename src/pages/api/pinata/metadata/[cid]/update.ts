import { NftBookMeta } from "@_types/nftBook";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";
import { v4 as uuidv4 } from "uuid";

import {
  addressCheckMiddleware,
  contractAddress,
  pinataApiKey,
  pinataSecretApiKey,
  pinataUnpinApiKey,
  pinataUnpinSecretApiKey,
  setURI,
  withSession
} from "../../utils";
import { deleteFile, getMetadata } from "../../utils";

/* 
To update an existing metadata file we need to follow following steps:
1. Get the content of existing metadata file
2. Upadte content 
3. Upload new metadata file to pinata 
4. Update tokenURI of NFT.
5. Delete old metadata file  */

const updateContent = (oldData: any, updateData: any) => {
  const newData = { ...oldData, ...updateData };
  return newData;
};

const uploadMetadata = async (content: any) => {
  try {
    const jsonRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataMetadata: {
          name: uuidv4()
        },
        pinataContent: content
      },
      {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey
        }
      }
    );

    return jsonRes.data;
  } catch (e) {
    return e;
  }
};

export default withSession(
  async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    console.log("Update metadata");
    if (req.method === "PUT" || req.method === "PATCH") {
      try {
        const nftUri: string = req.query.nftUri as string;
        const data: any = req.body.data;
        const tokenId: number = req.body.tokenId;

        await addressCheckMiddleware(req, res);

        const content = await getMetadata(nftUri);
        const newContent = updateContent(content, data);
        const jsonRes = await uploadMetadata(newContent);
        setURI(tokenId, jsonRes);
        deleteFile(nftUri);

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
