import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import { NftBook } from "@_types/nftBook";
import { ethers } from "ethers";
import useSWR from "swr";

type UseListedBooksResponse = {
  buyBooks: (
    tokenId: number,
    seller: string,
    value: number,
    amount: number
  ) => Promise<void>;
};
type ListedBooksHookFactory = CryptoHookFactory<
  NftBook[],
  UseListedBooksResponse
>;

export type UseListedBooksHook = ReturnType<ListedBooksHookFactory>;

export const hookFactory: ListedBooksHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useListedBooks" : null,
      async () => {
        const nftBooks = [] as NftBook[];
        const coreListedBooks = await contract!.getAllBooksOnSale();

        for (let i = 0; i < coreListedBooks.length; i++) {
          const listedBook = coreListedBooks[i];
          const nftBook = await contract!.getNftBook(listedBook.tokenId);
          const tokenURI = await contract!.uri(listedBook.tokenId);
          const metaRes = await fetch(tokenURI);
          const meta = await metaRes.json();

          nftBooks.push({
            tokenId: listedBook.tokenId.toNumber(),
            author: nftBook.author,
            balance: nftBook.balance.toNumber(),
            price: parseFloat(ethers.utils.formatEther(listedBook.price)),
            seller: listedBook.seller,
            amount: listedBook.amount.toNumber(),
            meta
          });
        }

        return nftBooks;
      }
    );

    const _contract = contract;
    const buyBooks = useCallback(
      async (
        tokenId: number,
        seller: string,
        value: number,
        amount: number
      ) => {
        try {
          const result = await _contract!.buyBooks(tokenId, seller, amount, {
            value: ethers.utils.parseEther(value.toString())
          });

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
      buyBooks,
      data: data || []
    };
  };
