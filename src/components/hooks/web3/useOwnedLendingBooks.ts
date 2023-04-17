import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { LendBook } from "@/types/nftBook";

type OwnedLendingBooksHookFactory = CryptoHookFactory<LendBook[]>;

export type UseOwnedLendingBooksHook = ReturnType<OwnedLendingBooksHookFactory>;

export const hookFactory: OwnedLendingBooksHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedLendingBooks" : null,
      async () => {
        const nfts = [] as LendBook[];
        const coreNfts = await contract!.getOwnedLendingBooks();

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
