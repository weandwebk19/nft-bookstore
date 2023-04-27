import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import { BookInfo, BookSellingCore } from "@_types/nftBook";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { FilterField } from "@/types/filter";

import { useAccount } from "..";
import { checkFilterBooks } from "../utils/checkFilterBooks";

type PublishingBooksHookFactory = CryptoHookFactory<BookSellingCore[]>;

export type UsePublishingBooksHook = ReturnType<PublishingBooksHookFactory>;

export const hookFactory: PublishingBooksHookFactory =
  ({ contract }) =>
  (queryString: FilterField) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [contract ? "web3/usePublishingBooks" : null, queryString, account.data],
      async () => {
        const listedBooks = [] as BookSellingCore[];
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

          if (listedBook.seller !== account.data) {
            if (
              !Object.keys(queryString).length ||
              (Object.keys(queryString).length == 1 &&
                Object.keys(queryString).includes("page"))
            ) {
              listedBooks.push({
                tokenId: listedBook.tokenId.toNumber(),
                seller: listedBook.seller,
                buyer: listedBook.buyer,
                price: parseFloat(ethers.utils.formatEther(listedBook.price)),
                amount: listedBook.amount.toNumber()
              });
            } else {
              // Filter
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
        }

        return listedBooks;
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };
