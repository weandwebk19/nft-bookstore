/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { Address } from "ethereumjs-util";
import { ethers } from "ethers";
import useSWR from "swr";

import { ListedBookCore } from "@/types/nftBook";

type RealOwnerOfTokensHookFactory = CryptoHookFactory<ListedBookCore[]>;

export type UseRealOwnerOfTokensHook = ReturnType<RealOwnerOfTokensHookFactory>;

export const hookFactory: RealOwnerOfTokensHookFactory =
  ({ contract }) =>
  (tokenId: number) => {
    const { data, ...swr } = useSWR(
      [contract ? "web3/useRealOwnerOfTokens" : null, tokenId],
      async () => {
        try {
          if (tokenId) {
            const nfts = [] as ListedBookCore[];
            const coreNfts = await contract!.getAllRealOwnerOfTokenId(tokenId);

            for (let i = 0; i < coreNfts.length; i++) {
              const item = coreNfts[i];
              const listedBook = await contract!.getListedBook(tokenId, item);

              if (
                listedBook &&
                listedBook.seller !==
                  "0x0000000000000000000000000000000000000000"
              )
                nfts.push({
                  tokenId: listedBook.tokenId.toNumber(),
                  seller: listedBook.seller,
                  price: parseFloat(ethers.utils.formatEther(listedBook.price)),
                  amount: listedBook.amount.toNumber()
                });
            }
            return nfts;
          }
          return [];
        } catch (err) {
          console.log(err);
        }
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };
