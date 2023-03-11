import { BookStoreContract } from "@_types/BookStoreContract";
import * as util from "ethereumjs-util";
import { ethers } from "ethers";
import { IronSessionOptions } from "iron-session";
import { ironSession } from "iron-session/express";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import contract from "../../../public/contracts/BookStore.json";

const NETWORKS = {
  "5777": "Ganache"
  // "3": "Ropsten"
};

type NETWORK = typeof NETWORKS;

const abi = contract.abi;
const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

export const contractAddress = contract["networks"][targetNetwork]["address"];
export const pinataApiKey = process.env.PINATA_API_KEY as string;
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY as string;

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
    ? process.env.INFURA_ROPSTEN_URL
    : "http://127.0.0.1:7545";

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
