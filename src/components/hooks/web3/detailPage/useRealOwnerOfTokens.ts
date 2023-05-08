/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { Address } from "ethereumjs-util";
import { ethers } from "ethers";
import useSWR from "swr";

import { BookSellingCore } from "@/types/nftBook";

type RealOwnerOfTokensHookFactory = CryptoHookFactory<BookSellingCore[]>;

export type UseRealOwnerOfTokensHook = ReturnType<RealOwnerOfTokensHookFactory>;

export const hookFactory: RealOwnerOfTokensHookFactory =
  ({ bookStoreContract, bookSellingContract }) =>
  (tokenId: number) => {
    const { data, ...swr } = useSWR(
      [
        bookStoreContract && bookSellingContract
          ? "web3/useRealOwnerOfTokens"
          : null,
        tokenId
      ],
      async () => {
        try {
          if (tokenId) {
            const nfts = [] as BookSellingCore[];
            const coreNfts = await bookStoreContract!.getAllRealOwnerOfTokenId(
              tokenId
            );

            for (let i = 0; i < coreNfts.length; i++) {
              const item = coreNfts[i];
              const listedBook = await bookSellingContract!.getListedBook(
                tokenId,
                item
              );

              if (
                listedBook &&
                listedBook.seller !==
                  "0x0000000000000000000000000000000000000000"
              )
                nfts.push({
                  tokenId: listedBook.tokenId.toNumber(),
                  seller: listedBook.seller,
                  buyer: listedBook.buyer,
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
