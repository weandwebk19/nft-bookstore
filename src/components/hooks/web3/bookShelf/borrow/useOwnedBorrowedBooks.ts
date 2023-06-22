/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { FilterField } from "@/types/filter";
import { BorrowedBook } from "@/types/nftBook";

import { useAccount } from "../..";
import { checkFilterBooks } from "../../utils/checkFilterBooks";

type OwnedBorrowedBooksHookFactory = CryptoHookFactory<BorrowedBook[]>;

export type UseOwnedBorrowedBooksHook =
  ReturnType<OwnedBorrowedBooksHookFactory>;

export const hookFactory: OwnedBorrowedBooksHookFactory =
  ({ bookStoreContract, bookRentingContract }) =>
  (queryString: FilterField) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        bookStoreContract && bookRentingContract
          ? "web3/useOwnedBorrowedBooks"
          : null,
        queryString,
        account.data
      ],
      async () => {
        const nfts = [] as BorrowedBook[];
        const coreNfts = await bookRentingContract!.getOwnedBorrowedBooks();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];

          if (!Object.keys(queryString).length) {
            try {
              nfts.push({
                tokenId: item?.tokenId?.toNumber(),
                renter: item?.renter,
                amount: item?.amount?.toNumber(),
                price: parseFloat(ethers.utils.formatEther(item?.price)),
                borrower: item?.borrower,
                startTime: item?.startTime?.toNumber(),
                endTime: item?.endTime?.toNumber()
              });
            } catch (err) {
              console.log("Something went wrong, please try again later!");
            }
          } else {
            // Filter
            if (
              (await checkFilterBooks(
                item.tokenId,
                item.price,
                bookStoreContract!,
                queryString
              )) === true
            ) {
              try {
                nfts.push({
                  tokenId: item?.tokenId?.toNumber(),
                  renter: item?.renter,
                  amount: item?.amount?.toNumber(),
                  price: parseFloat(ethers.utils.formatEther(item?.price)),
                  borrower: item?.borrower,
                  startTime: item?.startTime?.toNumber(),
                  endTime: item?.endTime?.toNumber()
                });
              } catch (err) {
                console.log("Something went wrong, please try again later!");
              }
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
