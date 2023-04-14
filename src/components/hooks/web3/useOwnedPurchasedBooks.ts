/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { PurchasedBook } from "@/types/nftBook";
import { toNumber } from "@/utils/nomalizer";

type OwnedPurchasedBooksHookFactory = CryptoHookFactory<PurchasedBook[]>;

export type UseOwnedPurchasedBooksHook =
  ReturnType<OwnedPurchasedBooksHookFactory>;

export const hookFactory: OwnedPurchasedBooksHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedPurchasedBooks" : null,
      async () => {
        try {
          const nfts = [] as PurchasedBook[];
          const coreNfts = await contract!.getOwnedPurchasedBooks();

          for (let i = 0; i < coreNfts.length; i++) {
            const item = coreNfts[i];
            const listedBook = await contract!.getListedBookById(item.listedId);
            const tokenURI = await contract!.getUri(listedBook.tokenId);
            const metaRes = await (
              await axios.get(`/api/pinata/metadata?nftUri=${tokenURI}`)
            ).data;
            let meta = null;
            if (metaRes.success === true) {
              meta = metaRes.data;
            }

            const amountTradeable = await contract!.getAmountUnUsedBook(
              listedBook.tokenId
            );

            nfts.push({
              listedBook: toNumber({
                tokenId: listedBook.tokenId,
                seller: listedBook.seller,
                amount: listedBook.amount,
                price: parseFloat(ethers.utils.formatEther(listedBook.price))
              }),
              listedId: item?.listedId?.toNumber(),
              buyer: item?.buyer,
              amount: item?.amount?.toNumber(),
              amountTradeable: amountTradeable.toNumber(),
              meta
            });
          }
          return nfts;
        } catch (err) {
          console.log(err);
        }
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };
