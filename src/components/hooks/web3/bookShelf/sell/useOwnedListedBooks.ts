/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { ListedBook } from "@/types/nftBook";

type OwnedListedBooksHookFactory = CryptoHookFactory<ListedBook[]>;

export type UseOwnedListedBooksHook = ReturnType<OwnedListedBooksHookFactory>;

export const hookFactory: OwnedListedBooksHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedListedBooks" : null,
      async () => {
        const nfts = [] as ListedBook[];
        const coreNfts = await contract!.getOwnedListedBooks();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.getUri(item.tokenId);
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
              seller: item?.seller,
              amount: item?.amount?.toNumber(),
              price: parseFloat(ethers.utils.formatEther(item?.price)),
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
