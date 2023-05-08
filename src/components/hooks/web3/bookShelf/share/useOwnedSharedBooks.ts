/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { FilterField } from "@/types/filter";
import { BookSharing } from "@/types/nftBook";

import { useAccount } from "../..";
import { checkFilterBooks } from "../../utils/checkFilterBooks";

type OwnedSharedBooksHookFactory = CryptoHookFactory<BookSharing[]>;

export type UseOwnedSharedBooksHook = ReturnType<OwnedSharedBooksHookFactory>;

export const hookFactory: OwnedSharedBooksHookFactory =
  ({ bookStoreContract, bookSharingContract }) =>
  (queryString: FilterField) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        bookStoreContract && bookSharingContract
          ? "web3/useOwnedSharedBooks"
          : null,
        queryString,
        account.data
      ],
      async () => {
        const nfts = [] as BookSharing[];
        const coreNfts = await bookSharingContract!.getAllOwnedSharedBook();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];

          if (!Object.keys(queryString).length) {
            try {
              nfts.push({
                tokenId: item?.tokenId?.toNumber(),
                fromRenter: item?.fromRenter,
                sharer: item?.sharer,
                sharedPer: item?.sharedPer,
                amount: item?.amount?.toNumber(),
                startTime: item?.startTime?.toNumber(),
                endTime: item?.endTime?.toNumber(),
                priceOfBB: parseFloat(
                  ethers.utils.formatEther(item?.priceOfBB)
                ),
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
                bookStoreContract!,
                queryString
              )) === true
            ) {
              try {
                nfts.push({
                  tokenId: item?.tokenId?.toNumber(),
                  fromRenter: item?.fromRenter,
                  sharer: item?.sharer,
                  sharedPer: item?.sharedPer,
                  amount: item?.amount?.toNumber(),
                  startTime: item?.startTime?.toNumber(),
                  endTime: item?.endTime?.toNumber(),
                  priceOfBB: parseFloat(
                    ethers.utils.formatEther(item?.priceOfBB)
                  ),
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
