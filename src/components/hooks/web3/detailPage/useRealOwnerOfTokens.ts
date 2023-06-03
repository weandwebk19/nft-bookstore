/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { Address } from "ethereumjs-util";
import { ethers } from "ethers";
import useSWR from "swr";

import { BookSellingCore } from "@/types/nftBook";

import { useAccount } from "..";

type RealOwnerOfTokensHookFactory = CryptoHookFactory<BookSellingCore[]>;

export type UseRealOwnerOfTokensHook = ReturnType<RealOwnerOfTokensHookFactory>;

export const hookFactory: RealOwnerOfTokensHookFactory =
  ({ bookStoreContract, bookSellingContract }) =>
  (bookId: string) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        bookStoreContract && bookSellingContract
          ? "web3/useRealOwnerOfTokens"
          : null,
        bookId,
        account.data
      ],
      async () => {
        try {
          if (bookId) {
            const tokenRes = await axios.get(`/api/books/${bookId}/tokenId`);
            if (tokenRes.data.success === true) {
              const tokenId = tokenRes.data.data;
              const nfts = [] as BookSellingCore[];
              const coreNfts =
                await bookStoreContract?.getAllRealOwnerOfTokenId(tokenId);
              if (coreNfts) {
                for (let i = 0; i < coreNfts?.length; i++) {
                  try {
                    const item = coreNfts[i];
                    const listedBook = await bookSellingContract!.getListedBook(
                      tokenId,
                      item
                    );

                    if (
                      listedBook &&
                      listedBook.seller !=
                        "0x0000000000000000000000000000000000000000" &&
                      listedBook.seller != account.data
                    ) {
                      nfts.push({
                        tokenId: listedBook.tokenId.toNumber(),
                        seller: listedBook.seller,
                        buyer: listedBook.buyer,
                        price: parseFloat(
                          ethers.utils.formatEther(listedBook.price)
                        ),
                        amount: listedBook.amount.toNumber()
                      });
                    }
                  } catch (err) {
                    console.log(err);
                  }
                }
              }
              return nfts;
            }
            return [];
          } else {
            return [];
          }
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
