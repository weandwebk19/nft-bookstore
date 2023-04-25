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
  ({ contract }) =>
  (queryString: FilterField) => {
    const { data, ...swr } = useSWR(
      [contract ? "web3/useOwnedNfts" : null, queryString],
      async () => {
        const nfts = [] as NftBook[];
        const coreNfts = await contract!.getOwnedNFTBooks();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];

          const amountOwned = await contract!.getBalanceOfOwnerBook(
            item.tokenId
          );

          const amountTradeable = await contract!.getAmountUnUsedBook(
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
                contract!,
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
