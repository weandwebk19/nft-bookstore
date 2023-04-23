import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import { BookInfo, ListedBookCore } from "@_types/nftBook";
import axios from "axios";
import { ethers } from "ethers";
import { ParsedUrlQuery } from "querystring";
import useSWR from "swr";

import { FilterField } from "@/types/filter";

import { checkFilterBooks } from "../utils/checkFilterBooks";

type ListedBooksHookFactory = CryptoHookFactory<ListedBookCore[]>;

export type UseListedBooksHook = ReturnType<ListedBooksHookFactory>;

export const hookFactory: ListedBooksHookFactory =
  ({ contract }) =>
  (queryString: FilterField) => {
    const { data, ...swr } = useSWR(
      [contract ? "web3/useListedBooks" : null, queryString],
      async () => {
        const listedBooks = [] as ListedBookCore[];
        const coreListedBooks = await contract!.getAllBooksOnSale();
        const limitItem = 30;
        const page = queryString.page
          ? parseInt(queryString.page as string)
          : 1;

        for (
          let i = (page - 1) * limitItem;
          i < limitItem * page && i < coreListedBooks.length;
          i++
        ) {
          const listedBook = coreListedBooks[i];

          // Filter
          if (
            !Object.keys(queryString).length ||
            (Object.keys(queryString).length == 1 &&
              Object.keys(queryString).includes("page"))
          ) {
            listedBooks.push({
              tokenId: listedBook.tokenId.toNumber(),
              seller: listedBook.seller,
              price: parseFloat(ethers.utils.formatEther(listedBook.price)),
              amount: listedBook.amount.toNumber()
            });
          } else {
            if (
              (await checkFilterBooks(
                listedBook.tokenId,
                listedBook.price,
                contract!,
                queryString
              )) === true
            ) {
              listedBooks.push({
                tokenId: listedBook.tokenId.toNumber(),
                seller: listedBook.seller,
                price: parseFloat(ethers.utils.formatEther(listedBook.price)),
                amount: listedBook.amount.toNumber()
              });
            }
          }
        }

        return listedBooks;
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };
