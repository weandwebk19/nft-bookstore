import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { LeaseBook } from "@/types/nftBook";

type OwnedLeasingBooksHookFactory = CryptoHookFactory<LeaseBook[]>;

export type UseOwnedLeasingBooksHook = ReturnType<OwnedLeasingBooksHookFactory>;

export const hookFactory: OwnedLeasingBooksHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedLeasingBooks" : null,
      async () => {
        const nfts = [] as LeaseBook[];
        const coreNfts = await contract!.getOwnedLeasingBooks();

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
              renter: item?.renter,
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
