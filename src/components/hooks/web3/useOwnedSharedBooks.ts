/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { SharedBook } from "@/types/nftBook";

type OwnedSharedBooksHookFactory = CryptoHookFactory<SharedBook[]>;

export type UseOwnedSharedBooksHook = ReturnType<OwnedSharedBooksHookFactory>;

export const hookFactory: OwnedSharedBooksHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedSharedBooks" : null,
      async () => {
        const nfts = [] as SharedBook[];
        const coreNfts = await contract!.getAllOwnedSharedBook();

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
              fromRenter: item?.fromRenter,
              sharer: item?.sharer,
              sharedPer: item?.sharedPer,
              amount: item?.amount?.toNumber(),
              startTime: item?.startTime?.toNumber(),
              endTime: item?.endTime?.toNumber(),
              priceOfBB: parseInt(ethers.utils.formatEther(item?.priceOfBB)),
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
