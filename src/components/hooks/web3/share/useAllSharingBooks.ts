import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import { BookSharingCore } from "@_types/nftBook";
import { ethers } from "ethers";
import useSWR from "swr";

import { FilterField } from "@/types/filter";

import { useAccount } from "..";
import { checkFilterBooks } from "../utils/checkFilterBooks";

type AllSharingBooksHookFactory = CryptoHookFactory<BookSharingCore[]>;

export type UseAllSharingBooksHook = ReturnType<AllSharingBooksHookFactory>;

export const hookFactory: AllSharingBooksHookFactory =
  ({ bookStoreContract, bookSharingContract }) =>
  (queryString: FilterField) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        bookSharingContract ? "web3/useAllSharingBooks" : null,
        queryString,
        account.data
      ],
      async () => {
        const allSharingBooks = [] as BookSharingCore[];
        const coreBookSharings =
          await bookSharingContract!.getAllBooksOnSharing();
        const limitItem = 30;
        const page = queryString.page
          ? parseInt(queryString.page as string)
          : 1;

        for (
          let i = (page - 1) * limitItem;
          i < limitItem * page && i < coreBookSharings.length;
          i++
        ) {
          const sharingBook = coreBookSharings[i];

          if (
            sharingBook.sharer !== account.data &&
            sharingBook.fromRenter !== account.data
          ) {
            if (
              !Object.keys(queryString).length ||
              (Object.keys(queryString).length == 1 &&
                Object.keys(queryString).includes("page"))
            ) {
              allSharingBooks.push({
                tokenId: sharingBook.tokenId.toNumber(),
                sharer: sharingBook.sharer,
                price: parseFloat(ethers.utils.formatEther(sharingBook.price)),
                amount: sharingBook.amount.toNumber(),
                fromRenter: sharingBook.fromRenter,
                sharedPer: sharingBook.sharedPer,
                priceOfBB: parseFloat(
                  ethers.utils.formatEther(sharingBook.priceOfBB)
                ),
                startTime: sharingBook.startTime.toNumber(),
                endTime: sharingBook.endTime.toNumber()
              });
            } else {
              // Filter
              if (
                (await checkFilterBooks(
                  sharingBook.tokenId,
                  sharingBook.price,
                  bookStoreContract!,
                  queryString
                )) === true
              ) {
                allSharingBooks.push({
                  tokenId: sharingBook.tokenId.toNumber(),
                  sharer: sharingBook.sharer,
                  price: parseFloat(
                    ethers.utils.formatEther(sharingBook.price)
                  ),
                  amount: sharingBook.amount.toNumber(),
                  fromRenter: sharingBook.fromRenter,
                  sharedPer: sharingBook.sharedPer,
                  priceOfBB: parseFloat(
                    ethers.utils.formatEther(sharingBook.priceOfBB)
                  ),
                  startTime: sharingBook.startTime.toNumber(),
                  endTime: sharingBook.endTime.toNumber()
                });
              }
            }
          }
        }

        return allSharingBooks;
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };
