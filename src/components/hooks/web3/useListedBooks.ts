import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import { ListedBook } from "@_types/nftBook";
import axios from "axios";
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
  ListedBook[],
  UseListedBooksResponse
>;

export type UseListedBooksHook = ReturnType<ListedBooksHookFactory>;

export const hookFactory: ListedBooksHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useListedBooks" : null,
      async () => {
        const listedBooks = [] as ListedBook[];
        const coreListedBooks = await contract!.getAllBooksOnSale();

        for (let i = 0; i < coreListedBooks.length; i++) {
          const listedBook = coreListedBooks[i];
          // const nftBook = await contract!.getNftBook(listedBook.tokenId);
          const tokenURI = await contract!.getUri(listedBook.tokenId);
          const metaRes = await (
            await axios.get(`/api/pinata/metadata?nftUri=${tokenURI}`)
          ).data;
          let meta = null;
          if (metaRes.success === true) {
            meta = metaRes.data;
          }

          listedBooks.push({
            tokenId: listedBook.tokenId.toNumber(),
            seller: listedBook.seller,
            price: parseFloat(ethers.utils.formatEther(listedBook.price)),
            amount: listedBook.amount.toNumber(),
            meta
          });
        }

        return listedBooks;
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
