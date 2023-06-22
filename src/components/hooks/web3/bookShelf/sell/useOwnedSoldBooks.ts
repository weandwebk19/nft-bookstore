/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { FilterField } from "@/types/filter";
import { BookSellingCore } from "@/types/nftBook";

import { useAccount } from "../..";
import { checkFilterBooks } from "../../utils/checkFilterBooks";

type OwnedSoldBooksHookFactory = CryptoHookFactory<BookSellingCore[]>;

export type UseOwnedSoldBooksHook = ReturnType<OwnedSoldBooksHookFactory>;

export const hookFactory: OwnedSoldBooksHookFactory =
  ({ bookStoreContract, bookSellingContract }) =>
  (queryString: FilterField) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        bookStoreContract && bookSellingContract
          ? "web3/useOwnedSoldBooks"
          : null,
        queryString,
        account.data
      ],
      async () => {
        const nfts = [] as BookSellingCore[];
        const coreNfts = await bookSellingContract!.getAllListedBooks();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          if (
            item.seller === account.data &&
            item.buyer !== "0x0000000000000000000000000000000000000000"
          ) {
            if (!Object.keys(queryString).length) {
              try {
                nfts.push({
                  tokenId: item?.tokenId?.toNumber(),
                  seller: item?.seller,
                  buyer: item?.buyer,
                  amount: item?.amount?.toNumber(),
                  price: parseFloat(ethers.utils.formatEther(item?.price))
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
                    seller: item?.seller,
                    buyer: item?.buyer,
                    amount: item?.amount?.toNumber(),
                    price: parseFloat(ethers.utils.formatEther(item?.price))
                  });
                } catch (err) {
                  console.log("Something went wrong, please try again later!");
                }
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
