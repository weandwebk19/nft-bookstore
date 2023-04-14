import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import { LeaseBook } from "@_types/nftBook";
import { ethers } from "ethers";
import useSWR from "swr";

import { useAccount } from ".";

type UseAllLeasingBooksResponse = {
  borrowBooks: (
    tokenId: number,
    renter: string,
    price: number,
    amount: number,
    rentalDuration: number,
    supplyAmount: number
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
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      contract ? "web3/useAllLeasingBooks" : null,
      async () => {
        const allLeasingBooks = [] as LeaseBook[];
        const coreLeaseBooks = await contract!.getAllBooksOnLeasing();

        for (let i = 0; i < coreLeaseBooks.length; i++) {
          const leaseBook = coreLeaseBooks[i];
          const tokenURI = await contract!.getUri(leaseBook.tokenId);
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
        rentalDuration: number,
        supplyAmount: number
      ) => {
        try {
          // Handle errors
          if (rentalDuration < 604800) {
            return toast.error("Minimum borrow book period is 7 days", {
              position: toast.POSITION.TOP_CENTER
            });
          } else if (amount > supplyAmount) {
            return toast.error(`Amount must be less than ${supplyAmount}.`, {
              position: toast.POSITION.TOP_CENTER
            });
          } else if (account.data == renter) {
            return toast.error(
              "You are not allowed to borrow the book leased by yourself.",
              {
                position: toast.POSITION.TOP_CENTER
              }
            );
          }

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
          toast.error(`${e.message}.`, {
            position: toast.POSITION.TOP_CENTER
          });
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
