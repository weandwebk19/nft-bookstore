/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { FilterField } from "@/types/filter";
import { CreatedBook } from "@/types/nftBook";

import { useAccount } from "..";
import { checkFilterBooks } from "../utils/checkFilterBooks";

type CreatedBooksHookFactory = CryptoHookFactory<CreatedBook[]>;

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
        const nfts = [] as CreatedBook[];
        const res = await axios.get(
          `/api/users/wallet/${account.data}/created-books`
        );
        if (res.data.success === true) {
          const createdBooks = res.data.data;

          for (let i = 0; i < createdBooks.length; i++) {
            try {
              const item = createdBooks[i];
              const nftBook = await bookStoreContract!.getNftBook(item.tokenId);

              const amountTradeable =
                await bookStoreContract!.getAmountUnUsedBook(item.tokenId);

              if (!Object.keys(queryString).length) {
                nfts.push({
                  tokenId: item?.tokenId,
                  author: nftBook?.author,
                  quantity: nftBook?.quantity?.toNumber(),
                  amountTradeable: amountTradeable.toNumber(),
                  isApproved: item.isApproved
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
                    tokenId: item?.tokenId,
                    author: nftBook?.author,
                    quantity: nftBook?.quantity?.toNumber(),
                    amountTradeable: amountTradeable.toNumber(),
                    isApproved: item.isApproved
                  });
                }
              }
            } catch (err) {
              console.error(err);
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
