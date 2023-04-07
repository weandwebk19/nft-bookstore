/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { BorrowedBook } from "@/types/nftBook";

type OwnedBorrowedBooksHookFactory = CryptoHookFactory<BorrowedBook[]>;

export type UseOwnedBorrowedBooksHook =
  ReturnType<OwnedBorrowedBooksHookFactory>;

export const hookFactory: OwnedBorrowedBooksHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedBorrowedBooks" : null,
      async () => {
        const nfts = [] as BorrowedBook[];
        const coreNfts = await contract!.getOwnedBorrowedBooks();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.uri(item.tokenId);
          const metaRes = await (
            await axios.get(`/api/pinata/metadata?nftUri=${tokenURI}`)
          ).data;
          let meta = null;
          if (metaRes.success === true) {
            meta = metaRes.data;
          }
          try {
            nfts.push({
              tokenId: item?.tokenId?.toNumber(),
              renter: item?.renter,
              amount: item?.amount?.toNumber(),
              price: parseInt(ethers.utils.formatEther(item?.price)),
              meta
            });
          } catch (err) {
            console.log(err);
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
