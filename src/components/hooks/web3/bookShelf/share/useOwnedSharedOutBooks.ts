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

type OwnedSharedOutBooksHookFactory = CryptoHookFactory<BookSharing[]>;

export type UseOwnedSharedOutBooksHook =
  ReturnType<OwnedSharedOutBooksHookFactory>;

export const hookFactory: OwnedSharedOutBooksHookFactory =
  ({ contract }) =>
  (queryString: FilterField) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        contract ? "web3/useOwnedSharedOutBooks" : null,
        queryString,
        account.data
      ],
      async () => {
        const nfts = [] as BookSharing[];
        const allSharedBooks = await contract!.getAllSharedBook();
        const coreNfts = allSharedBooks.filter((nft) => {
          return nft.sharer == account.data;
        });

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
                contract!,
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
