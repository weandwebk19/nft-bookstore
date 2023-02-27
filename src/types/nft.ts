/* eslint-disable prettier/prettier */

export type Trait = "attack" | "health" | "speed";

export type NftAttribute = {
  trait_type: Trait;
  value: string;
};

export type NftMeta = {
  name: string;
  description: string;
  image: string;
  attributes: NftAttribute[];
};

export type NftCore = {
  tokenId: number;
  author: string;
  balance: number;
}

export type Nft = {
  meta: NftMeta;
} & NftCore;

export type FileReq = {
  bytes: Uint8Array;
  contentType: string;
  fileName: string;
};

export type PinataRes = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
};