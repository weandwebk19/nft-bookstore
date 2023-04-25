import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { FilterField } from "@/types/filter";
import { BorrowedBook } from "@/types/nftBook";

import { useAccount } from "../..";
import { checkFilterBooks } from "../../utils/checkFilterBooks";

type OwnedLentOutBooksHookFactory = CryptoHookFactory<BorrowedBook[]>;

export type UseOwnedLentOutBooksHook = ReturnType<OwnedLentOutBooksHookFactory>;

export const hookFactory: OwnedLentOutBooksHookFactory =
  ({ contract }) =>
  (queryString: FilterField) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        contract ? "web3/useOwnedLentOutBooks" : null,
        queryString,
        account.data
      ],
      async () => {
        const nfts = [] as BorrowedBook[];
        const allBorrowedBooks = await contract!.getAllBorrowedBooks();
        const coreNfts = allBorrowedBooks.filter((nft) => {
          return nft.renter == account.data;
        });

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];

          if (!Object.keys(queryString).length) {
            try {
              nfts.push({
                tokenId: item?.tokenId?.toNumber(),
                renter: item?.renter,
                amount: item?.amount?.toNumber(),
                price: parseFloat(ethers.utils.formatEther(item?.price)),
                borrower: item?.borrower,
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
                  renter: item?.renter,
                  amount: item?.amount?.toNumber(),
                  price: parseFloat(ethers.utils.formatEther(item?.price)),
                  borrower: item?.borrower,
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
