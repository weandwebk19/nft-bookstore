/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { FilterField } from "@/types/filter";
import { NftBook } from "@/types/nftBook";

import { useAccount } from "..";
import { checkFilterBooks } from "../utils/checkFilterBooks";

type UseCreatedBooksResponse = {
  // listNft: (tokenId: number, price: number) => Promise<void>;
};

type CreatedBooksHookFactory = CryptoHookFactory<
  NftBook[],
  UseCreatedBooksResponse
>;

export type UseCreatedBooksHook = ReturnType<CreatedBooksHookFactory>;

export const hookFactory: CreatedBooksHookFactory =
  ({ bookStoreContract }) =>
  (queryString: FilterField) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        bookStoreContract ? "web3/useCreatedBooks" : null,
        queryString,
        account.data
      ],
      async () => {
        const nfts = [] as NftBook[];
        const ownedBooks = await bookStoreContract!.getOwnedNFTBooks();
        const createdBooks = ownedBooks.filter((e) => e.author == account.data);

        for (let i = 0; i < createdBooks.length; i++) {
          const item = createdBooks[i];

          const amountTradeable = await bookStoreContract!.getAmountUnUsedBook(
            item.tokenId
          );

          if (!Object.keys(queryString).length) {
            nfts.push({
              tokenId: item?.tokenId?.toNumber(),
              author: item?.author,
              quantity: item?.quantity?.toNumber(),
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
                tokenId: item?.tokenId?.toNumber(),
                author: item?.author,
                quantity: item?.quantity?.toNumber(),
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
