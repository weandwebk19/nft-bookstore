import { useCallback } from "react";
import { Id, toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import { LendBookCore } from "@_types/nftBook";
import { ethers } from "ethers";
import useSWR from "swr";

import { FilterField } from "@/types/filter";

import { checkFilterBooks } from "../utils/checkFilterBooks";

type AllLendingBooksHookFactory = CryptoHookFactory<LendBookCore[]>;

export type UseAllLendingBooksHook = ReturnType<AllLendingBooksHookFactory>;

export const hookFactory: AllLendingBooksHookFactory =
  ({ contract }) =>
  (queryString: FilterField) => {
    const { data, ...swr } = useSWR(
      [contract ? "web3/useAllLendingBooks" : null, queryString],
      async () => {
        const allLendingBooks = [] as LendBookCore[];
        const coreLendBooks = await contract!.getAllBooksOnLending();
        const limitItem = 30;
        const page = queryString.page
          ? parseInt(queryString.page as string)
          : 1;

        for (
          let i = (page - 1) * limitItem;
          i < limitItem * page && i < coreLendBooks.length;
          i++
        ) {
          const lendBook = coreLendBooks[i];

          if (
            !Object.keys(queryString).length ||
            (Object.keys(queryString).length == 1 &&
              Object.keys(queryString).includes("page"))
          ) {
            allLendingBooks.push({
              tokenId: lendBook.tokenId.toNumber(),
              renter: lendBook.renter,
              price: parseFloat(ethers.utils.formatEther(lendBook.price)),
              amount: lendBook.amount.toNumber()
            });
          } else {
            // Filter
            if (
              (await checkFilterBooks(
                lendBook.tokenId,
                lendBook.price,
                contract!,
                queryString
              )) === true
            ) {
              allLendingBooks.push({
                tokenId: lendBook.tokenId.toNumber(),
                renter: lendBook.renter,
                price: parseFloat(ethers.utils.formatEther(lendBook.price)),
                amount: lendBook.amount.toNumber()
              });
            }
          }
        }

        return allLendingBooks;
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };
