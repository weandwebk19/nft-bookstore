/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";

import { FilterField } from "@/types/filter";
import { NftBook } from "@/types/nftBook";

import { checkFilterBooks } from "../utils/checkFilterBooks";

type OwnedNftsHookFactory = CryptoHookFactory<NftBook[]>;

export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>;

export const hookFactory: OwnedNftsHookFactory =
  ({ bookStoreContract }) =>
  (queryString: FilterField) => {
    const { data, ...swr } = useSWR(
      [bookStoreContract ? "web3/useOwnedNfts" : null, queryString],
      async () => {
        const nfts = [] as NftBook[];
        const coreNfts = await bookStoreContract!.getOwnedNFTBooks();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];

          const amountOwned = await bookStoreContract!.getBalanceOfOwnerBook(
            item.tokenId
          );

          const amountTradeable = await bookStoreContract!.getAmountUnUsedBook(
            item.tokenId
          );

          if (!Object.keys(queryString).length) {
            nfts.push({
              tokenId: item.tokenId.toNumber(),
              author: item.author,
              quantity: item.quantity.toNumber(),
              amountOwned: amountOwned.toNumber(),
              amountTradeable: amountTradeable.toNumber()
            });
          } else {
            // Filter
            if (
              (await checkFilterBooks(
                item.tokenId,
                undefined,
                bookStoreContract!,
                queryString
              )) === true
            ) {
              nfts.push({
                tokenId: item.tokenId.toNumber(),
                author: item.author,
                quantity: item.quantity.toNumber(),
                amountOwned: amountOwned.toNumber(),
                amountTradeable: amountTradeable.toNumber()
              });
            }
          }
        }
        return nfts;
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };
