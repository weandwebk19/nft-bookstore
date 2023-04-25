/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { FilterField } from "@/types/filter";
import { ListedBook } from "@/types/nftBook";

import { useAccount } from "../..";
import { checkFilterBooks } from "../../utils/checkFilterBooks";

type OwnedListedBooksHookFactory = CryptoHookFactory<ListedBook[]>;

export type UseOwnedListedBooksHook = ReturnType<OwnedListedBooksHookFactory>;

export const hookFactory: OwnedListedBooksHookFactory =
  ({ contract }) =>
  (queryString: FilterField) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [contract ? "web3/useOwnedListedBooks" : null, queryString, account.data],
      async () => {
        const nfts = [] as ListedBook[];
        const coreNfts = await contract!.getOwnedListedBooks();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          if (!Object.keys(queryString).length) {
            try {
              nfts.push({
                tokenId: item?.tokenId?.toNumber(),
                seller: item?.seller,
                amount: item?.amount?.toNumber(),
                price: parseFloat(ethers.utils.formatEther(item?.price))
              });
            } catch (err) {
              console.log(err);
            }
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
              try {
                nfts.push({
                  tokenId: item?.tokenId?.toNumber(),
                  seller: item?.seller,
                  amount: item?.amount?.toNumber(),
                  price: parseFloat(ethers.utils.formatEther(item?.price))
                });
              } catch (err) {
                console.log(err);
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
