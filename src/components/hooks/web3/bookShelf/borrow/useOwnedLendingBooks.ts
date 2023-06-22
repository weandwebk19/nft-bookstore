import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { FilterField } from "@/types/filter";
import { LendBook } from "@/types/nftBook";

import { useAccount } from "../..";
import { checkFilterBooks } from "../../utils/checkFilterBooks";

type OwnedLendingBooksHookFactory = CryptoHookFactory<LendBook[]>;

export type UseOwnedLendingBooksHook = ReturnType<OwnedLendingBooksHookFactory>;

export const hookFactory: OwnedLendingBooksHookFactory =
  ({ bookStoreContract }) =>
  (queryString: FilterField) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        bookStoreContract ? "web3/useOwnedLendingBooks" : null,
        queryString,
        account.data
      ],
      async () => {
        const nfts = [] as LendBook[];
        const coreNfts = await bookStoreContract!.getOwnedLendingBooks();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          if (!Object.keys(queryString).length) {
            try {
              nfts.push({
                tokenId: item?.tokenId?.toNumber(),
                renter: item?.renter,
                amount: item?.amount?.toNumber(),
                price: parseFloat(ethers.utils.formatEther(item?.price))
              });
            } catch (err) {
              console.log("Something went wrong, please try again later!");
            }
          } else {
            // Filter
            if (
              (await checkFilterBooks(
                item.tokenId,
                item.price,
                bookStoreContract!,
                queryString
              )) === true
            ) {
              try {
                nfts.push({
                  tokenId: item?.tokenId?.toNumber(),
                  renter: item?.renter,
                  amount: item?.amount?.toNumber(),
                  price: parseFloat(ethers.utils.formatEther(item?.price))
                });
              } catch (err) {
                console.log("Something went wrong, please try again later!");
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
