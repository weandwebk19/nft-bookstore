/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { NftBook } from "@/types/nftBook";

import { useAccount } from ".";

type UseCreatedBooksResponse = {
  // listNft: (tokenId: number, price: number) => Promise<void>;
};

type CreatedBooksHookFactory = CryptoHookFactory<
  NftBook[],
  UseCreatedBooksResponse
>;

export type UseCreatedBooksHook = ReturnType<CreatedBooksHookFactory>;

export const hookFactory: CreatedBooksHookFactory =
  ({ contract }) =>
  () => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      contract ? "web3/useCreatedBooks" : null,
      async () => {
        const nfts = [] as NftBook[];
        const ownedBooks = await contract!.getOwnedNFTBooks();
        const createdBooks = ownedBooks.filter((e) => e.author == account.data);

        for (let i = 0; i < createdBooks.length; i++) {
          const item = createdBooks[i];
          const tokenURI = await contract!.getUri(item.tokenId);
          const metaRes = await (
            await axios.get(`/api/pinata/metadata?nftUri=${tokenURI}`)
          ).data;
          let meta = null;
          if (metaRes.success === true) {
            meta = metaRes.data;
          }

          const amountTradeable = await contract!.getAmountUnUsedBook(
            item.tokenId
          );

          nfts.push({
            tokenId: item?.tokenId?.toNumber(),
            author: item?.author,
            quantity: item?.quantity?.toNumber(),
            amountTradeable: amountTradeable.toNumber(),
            meta
          });
        }
        return nfts;
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };
