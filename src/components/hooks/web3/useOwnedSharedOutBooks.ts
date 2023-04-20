/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { BookSharing } from "@/types/nftBook";

import { useAccount } from ".";

type OwnedSharedOutBooksHookFactory = CryptoHookFactory<BookSharing[]>;

export type UseOwnedSharedOutBooksHook =
  ReturnType<OwnedSharedOutBooksHookFactory>;

export const hookFactory: OwnedSharedOutBooksHookFactory =
  ({ contract }) =>
  () => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedSharedOutBooks" : null,
      async () => {
        const nfts = [] as BookSharing[];
        const allSharedBooks = await contract!.getAllSharedBook();
        const coreNfts = allSharedBooks.filter((nft) => {
          return nft.sharer == account.data;
        });

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
              fromRenter: item?.fromRenter,
              sharer: item?.sharer,
              sharedPer: item?.sharedPer,
              amount: item?.amount?.toNumber(),
              startTime: item?.startTime?.toNumber(),
              endTime: item?.endTime?.toNumber(),
              priceOfBB: parseFloat(ethers.utils.formatEther(item?.priceOfBB)),
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
