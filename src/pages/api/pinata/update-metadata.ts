import { NftBookMeta } from "@_types/nftBook";
import pinataSDK from "@pinata/sdk";
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
  withSession
} from "../utils";

/* 
To update an existing metadata file we need to follow following steps:
1. Get the content of existing metadata file
2. Upadte content 
3. Upload new metadata file to pinata 
4. Update tokenURI of NFT.
5. Delete old metadata file  */

const getContent = async (hash: string) => {
  const nftUri = `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${hash}`;
  console.log("nftUri", nftUri);
  const nftRes = await axios.get(nftUri, {
    headers: {
      Accept: "text/plain"
    },
    timeout: 20000
  });

  const data = nftRes.data;
  return data;
};

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

const deleteFile = async (hash: string) => {
  try {
    const pinata = new pinataSDK(pinataUnpinApiKey, pinataUnpinSecretApiKey);
    const jsonRes = await pinata.unpin(hash);

    return jsonRes;
  } catch (e) {
    return e;
  }
};

export default withSession(
  async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    console.log("Update metadata");
    if (req.method === "POST") {
      try {
        const nftUri: string = req.body.nftUri as string;
        const data: any = req.body.data;

        await addressCheckMiddleware(req, res);

        const content = await getContent(nftUri);
        const newContent = updateContent(content, data);
        const jsonRes = await uploadMetadata(newContent);
        deleteFile(nftUri);

        return res.status(200).send(jsonRes);
      } catch (err) {
        console.log("err", err);
        return res.status(422).send(err);
      }
    } else {
      return res.status(400).json({ message: "Invalid api route" });
    }
  }
);
