/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { FilterField } from "@/types/filter";
import { BookSelling } from "@/types/nftBook";
import { toNumber } from "@/utils/nomalizer";

import { useAccount } from "../..";
import { checkFilterBooks } from "../../utils/checkFilterBooks";

type OwnedPurchasedBooksHookFactory = CryptoHookFactory<BookSelling[]>;

export type UseOwnedPurchasedBooksHook =
  ReturnType<OwnedPurchasedBooksHookFactory>;

export const hookFactory: OwnedPurchasedBooksHookFactory =
  ({ bookStoreContract, bookSellingContract }) =>
  (queryString: FilterField) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        bookStoreContract && bookSellingContract
          ? "web3/useOwnedPurchasedBooks"
          : null,
        queryString,
        account.data
      ],
      async () => {
        try {
          const nfts = [] as BookSelling[];
          const coreNfts = await bookSellingContract!.getOwnedPurchasedBooks();

          for (let i = 0; i < coreNfts.length; i++) {
            try {
              const item = coreNfts[i];

              const amountTradeable =
                await bookStoreContract!.getAmountUnUsedBook(item.tokenId);

              if (!Object.keys(queryString).length) {
                nfts.push({
                  buyer: item?.buyer,
                  amount: item?.amount?.toNumber(),
                  amountTradeable: amountTradeable.toNumber(),
                  tokenId: item?.tokenId.toNumber(),
                  seller: item?.seller,
                  price: parseFloat(ethers.utils.formatEther(item?.price))
                });
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
                  nfts.push({
                    buyer: item?.buyer,
                    amount: item?.amount?.toNumber(),
                    amountTradeable: amountTradeable.toNumber(),
                    tokenId: item?.tokenId.toNumber(),
                    seller: item?.seller,
                    price: parseFloat(ethers.utils.formatEther(item?.price))
                  });
                }
              }
            } catch (err) {
              console.log("Something went wrong, please try again later!");
            }
          }
          return nfts;
        } catch (err) {
          return [];
        }
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };
