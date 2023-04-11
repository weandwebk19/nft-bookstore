import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import { LeaseBook } from "@_types/nftBook";
import { ethers } from "ethers";
import useSWR from "swr";

type UseAllLeasingBooksResponse = {
  borrowBooks: (
    tokenId: number,
    renter: string,
    price: number,
    amount: number,
    rentalDuration: number
  ) => Promise<void>;
};
type AllLeasingBooksHookFactory = CryptoHookFactory<
  LeaseBook[],
  UseAllLeasingBooksResponse
>;

export type UseAllLeasingBooksHook = ReturnType<AllLeasingBooksHookFactory>;

export const hookFactory: AllLeasingBooksHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useAllLeasingBooks" : null,
      async () => {
        const allLeasingBooks = [] as LeaseBook[];
        const coreLeaseBooks = await contract!.getAllBooksOnLeasing();

        for (let i = 0; i < coreLeaseBooks.length; i++) {
          const leaseBook = coreLeaseBooks[i];
          const tokenURI = await contract!.uri(leaseBook.tokenId);
          const metaRes = await fetch(tokenURI);
          const meta = await metaRes.json();

          allLeasingBooks.push({
            tokenId: leaseBook.tokenId.toNumber(),
            renter: leaseBook.renter,
            price: parseFloat(ethers.utils.formatEther(leaseBook.price)),
            amount: leaseBook.amount.toNumber(),
            meta
          });
        }

        return allLeasingBooks;
      }
    );

    const _contract = contract;
    const borrowBooks = useCallback(
      async (
        tokenId: number,
        renter: string,
        price: number,
        amount: number,
        rentalDuration: number
      ) => {
        try {
          const value = (price * amount * rentalDuration) / 604800;
          const result = await _contract!.borrowBooks(
            tokenId,
            renter,
            ethers.utils.parseEther(price.toString()),
            amount,
            rentalDuration,
            {
              value: ethers.utils.parseEther(value.toString())
            }
          );

          await toast.promise(result!.wait(), {
            pending: "Processing transaction",
            success: "Nft is yours! Go to Profile page",
            error: "Processing error"
          });
        } catch (e: any) {
          console.error(e.message);
        }
      },
      [_contract]
    );

    return {
      ...swr,
      borrowBooks,
      data: data || []
    };
  };
