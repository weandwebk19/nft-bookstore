import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import { BookSharing } from "@_types/nftBook";
import { ethers } from "ethers";
import useSWR from "swr";

import { useAccount } from ".";

type AllSharingBooksHookFactory = CryptoHookFactory<BookSharing[]>;

export type UseAllSharingBooksHook = ReturnType<AllSharingBooksHookFactory>;

export const hookFactory: AllSharingBooksHookFactory =
  ({ contract }) =>
  () => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      contract ? "web3/useAllSharingBooks" : null,
      async () => {
        const allSharingBooks = [] as BookSharing[];
        const coreBookSharings = await contract!.getAllBooksOnSharing();

        for (let i = 0; i < coreBookSharings.length; i++) {
          const sharingBook = coreBookSharings[i];
          const tokenURI = await contract!.getUri(sharingBook.tokenId);
          const metaRes = await fetch(tokenURI);
          const meta = await metaRes.json();

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
            endTime: sharingBook.endTime.toNumber(),
            meta
          });
        }

        return allSharingBooks;
      }
    );

    const _contract = contract;

    return {
      ...swr,
      data: data || []
    };
  };
