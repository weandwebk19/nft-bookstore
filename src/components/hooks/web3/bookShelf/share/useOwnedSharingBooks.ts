import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { FilterField } from "@/types/filter";
import { BookSharing } from "@/types/nftBook";

import { useAccount } from "../..";
import { checkFilterBooks } from "../../utils/checkFilterBooks";

type OwnedSharingBooksHookFactory = CryptoHookFactory<BookSharing[]>;

export type UseOwnedSharingBooksHook = ReturnType<OwnedSharingBooksHookFactory>;

export const hookFactory: OwnedSharingBooksHookFactory =
  ({ contract }) =>
  (queryString: FilterField) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        contract ? "web3/useOwnedSharingBooks" : null,
        queryString,
        account.data
      ],
      async () => {
        const nfts = [] as BookSharing[];
        const coreNfts = await contract!.getAllOwnedBooksOnSharing();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];

          if (!Object.keys(queryString).length) {
            try {
              nfts.push({
                tokenId: item?.tokenId?.toNumber(),
                fromRenter: item?.fromRenter,
                amount: item?.amount?.toNumber(),
                price: parseFloat(ethers.utils.formatEther(item?.price)),
                sharer: item?.sharer,
                sharedPer: item?.sharedPer,
                priceOfBB: parseFloat(
                  ethers.utils.formatEther(item?.priceOfBB)
                ),
                startTime: item?.startTime?.toNumber(),
                endTime: item?.endTime?.toNumber()
              });
            } catch (err) {
              console.log(err);
            }
          } else {
            // Filter
            if (
              (await checkFilterBooks(
                item.tokenId,
                item.price,
                contract!,
                queryString
              )) === true
            ) {
              try {
                nfts.push({
                  tokenId: item?.tokenId?.toNumber(),
                  fromRenter: item?.fromRenter,
                  amount: item?.amount?.toNumber(),
                  price: parseFloat(ethers.utils.formatEther(item?.price)),
                  sharer: item?.sharer,
                  sharedPer: item?.sharedPer,
                  priceOfBB: parseFloat(
                    ethers.utils.formatEther(item?.priceOfBB)
                  ),
                  startTime: item?.startTime?.toNumber(),
                  endTime: item?.endTime?.toNumber()
                });
              } catch (err) {
                console.log(err);
              }
            }
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
