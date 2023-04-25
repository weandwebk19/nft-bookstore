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
  ({ contract }) =>
  (queryString: FilterField) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        contract ? "web3/useOwnedPurchasedBooks" : null,
        queryString,
        account.data
      ],
      async () => {
        try {
          const nfts = [] as BookSelling[];
          const coreNfts = await contract!.getOwnedPurchasedBooks();

          for (let i = 0; i < coreNfts.length; i++) {
            const item = coreNfts[i];
            if (item.tokenId.toNumber() !== 0) {
              const amountTradeable = await contract!.getAmountUnUsedBook(
                item.tokenId
              );

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
                    contract!,
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
            }
          }
          return nfts;
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };
