/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { NftBook } from "@/types/nftBook";

type UseCreatedBooksResponse = {
  listNft: (tokenId: number, price: number) => Promise<void>;
};

type CreatedBooksHookFactory = CryptoHookFactory<
  NftBook[],
  UseCreatedBooksResponse
>;

export type UseCreatedBooksHook = ReturnType<CreatedBooksHookFactory>;

export const hookFactory: CreatedBooksHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useCreatedBooks" : null,
      async () => {
        const nfts = [] as NftBook[];
        const coreNfts = await contract!.getCreatedNFTBooks();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.uri(item.tokenId);
          const meta = await (
            await axios.get(`/api/pinata/metadata?uri=${tokenURI}`)
          ).data;

          nfts.push({
            tokenId: item.tokenId.toNumber(),
            author: item.author,
            balance: item.balance.toNumber(),
            meta
          });
        }
        return nfts;
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };
