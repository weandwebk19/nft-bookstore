import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { BookSharing } from "@/types/nftBook";

type OwnedSharingBooksHookFactory = CryptoHookFactory<BookSharing[]>;

export type UseOwnedSharingBooksHook = ReturnType<OwnedSharingBooksHookFactory>;

export const hookFactory: OwnedSharingBooksHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedSharingBooks" : null,
      async () => {
        const nfts = [] as BookSharing[];
        const coreNfts = await contract!.getAllOwnedBooksOnSharing();

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
              amount: item?.amount?.toNumber(),
              price: parseFloat(ethers.utils.formatEther(item?.price)),
              sharer: item?.sharer,
              sharedPer: item?.sharedPer,
              priceOfBB: parseFloat(ethers.utils.formatEther(item?.priceOfBB)),
              startTime: item?.startTime?.toNumber(),
              endTime: item?.endTime?.toNumber(),
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
