import { BookStoreContract } from "@_types/BookStoreContract";
import pinataSDK from "@pinata/sdk";
import axios from "axios";
import axiosRetry from "axios-retry";
import * as util from "ethereumjs-util";
import { ethers } from "ethers";
import { IronSessionOptions } from "iron-session";
import { ironSession } from "iron-session/express";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import contract from "../../../public/contracts/BookStore.json";

axiosRetry(axios, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    return retryCount * 2000; // time interval between retries
  },
  retryCondition: (error: any) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return error!.response!.status === 503;
  }
});

const NETWORKS = {
  "5777": "Ganache",
  "11155111": "Sepolia"
};

type NETWORK = typeof NETWORKS;

const abi = contract.abi;
const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

export const contractAddress = (contract as any)["networks"][targetNetwork][
  "address"
];
export const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY as string;
export const pinataSecretApiKey = process.env
  .NEXT_PUBLIC_PINATA_SECRET_API_KEY as string;
export const pinataUnpinApiKey = process.env
  .NEXT_PUBLIC_PINATA_UNPIN_API_KEY as string;
export const pinataUnpinSecretApiKey = process.env
  .NEXT_PUBLIC_PINATA_UNPIN_SECRET_API_KEY as string;

const sessionOptions = {
  cookieName: "userSession",
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production"
  }
} as IronSessionOptions;

export function withSessionSSR(handler: any) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionAPI(handler: any) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

const url =
  process.env.NODE_ENV === "production"
    ? process.env.INFURA_SEPOLIA_URL
    : "http://127.0.0.1:7545";
// "http://192.168.71.2:7545";

export const addressCheckMiddleware = async (
  req: NextApiRequest & { session: any },
  res: NextApiResponse
) => {
  return new Promise(async (resolve, reject) => {
    const message = req.session["message-session"];
    const provider = new ethers.providers.JsonRpcProvider(url);
    const contract = new ethers.Contract(
      contractAddress,
      abi,
      provider
    ) as unknown as BookStoreContract;

    let nonce: string | Buffer =
      "\x19Ethereum Signed Message:\n" +
      JSON.stringify(message).length +
      JSON.stringify(message);

    nonce = util.keccak(Buffer.from(nonce, "utf-8"));
    const { v, r, s } = util.fromRpcSig(req.body.signature);
    const pubKey = util.ecrecover(util.toBuffer(nonce), v, r, s);
    const addrBuffer = util.pubToAddress(pubKey);
    const address = util.bufferToHex(addrBuffer);

    if (address === req.body.address) {
      resolve("Correct Address");
    } else {
      reject("Wrong Address");
    }
  });
};

export const getMetadata = async (nftUri: string) => {
  const nftRes = await axios.get(nftUri, {
    headers: {
      Accept: "text/plain"
    },
    timeout: 150000
  });

  const data = nftRes.data;
  return data;
};

export const deleteFile = async (hash: string) => {
  try {
    const pinata = new pinataSDK(pinataUnpinApiKey, pinataUnpinSecretApiKey);
    const jsonRes = await pinata.unpin(hash);

    return jsonRes;
  } catch (e) {
    return e;
  }
};
