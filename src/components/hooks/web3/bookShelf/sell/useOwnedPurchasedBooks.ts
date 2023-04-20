/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { BookSelling } from "@/types/nftBook";
import { toNumber } from "@/utils/nomalizer";

type OwnedPurchasedBooksHookFactory = CryptoHookFactory<BookSelling[]>;

export type UseOwnedPurchasedBooksHook =
  ReturnType<OwnedPurchasedBooksHookFactory>;

export const hookFactory: OwnedPurchasedBooksHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedPurchasedBooks" : null,
      async () => {
        try {
          const nfts = [] as BookSelling[];
          const coreNfts = await contract!.getOwnedPurchasedBooks();

          for (let i = 0; i < coreNfts.length; i++) {
            const item = coreNfts[i];
            const tokenURI = await contract!.getUri(item.tokenId);
            if (item.tokenId.toNumber() !== 0) {
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
                buyer: item?.buyer,
                amount: item?.amount?.toNumber(),
                amountTradeable: amountTradeable.toNumber(),
                meta,
                tokenId: item?.tokenId.toNumber(),
                seller: item?.seller,
                price: parseFloat(ethers.utils.formatEther(item?.price))
              });
            }
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
