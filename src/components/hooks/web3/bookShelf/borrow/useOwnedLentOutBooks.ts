import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { FilterField } from "@/types/filter";
import { BookSharing, BorrowedBook } from "@/types/nftBook";

import { useAccount } from "../..";
import { checkFilterBooks } from "../../utils/checkFilterBooks";

type OwnedLentOutBooksHookFactory = CryptoHookFactory<BorrowedBook[]>;

export type UseOwnedLentOutBooksHook = ReturnType<OwnedLentOutBooksHookFactory>;

export const hookFactory: OwnedLentOutBooksHookFactory =
  ({ bookStoreContract, bookRentingContract, bookSharingContract }) =>
  (queryString: FilterField) => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        bookStoreContract && bookRentingContract
          ? "web3/useOwnedLentOutBooks"
          : null,
        queryString,
        account.data
      ],
      async () => {
        const borrowedBooks = [] as BorrowedBook[];
        const bookOnSharings = [] as BookSharing[];
        const sharedBooks = [] as BookSharing[];

        const allBorrowedBooks =
          await bookRentingContract!.getAllBorrowedBooks();
        const allBooksOnSharing =
          await bookSharingContract!.getAllBooksOnSharing();
        const allSharedBooks = await bookSharingContract!.getAllSharedBook();

        // Borrowed Books list
        const allOwnedBorrowedBooks = allBorrowedBooks.filter((nft) => {
          return nft.renter == account.data;
        });

        for (let i = 0; i < allOwnedBorrowedBooks.length; i++) {
          const item = allOwnedBorrowedBooks[i];

          if (!Object.keys(queryString).length) {
            try {
              borrowedBooks.push({
                tokenId: item?.tokenId?.toNumber(),
                renter: item?.renter,
                amount: item?.amount?.toNumber(),
                price: parseFloat(ethers.utils.formatEther(item?.price)),
                borrower: item?.borrower,
                startTime: item?.startTime?.toNumber(),
                endTime: item?.endTime?.toNumber()
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
                borrowedBooks.push({
                  tokenId: item?.tokenId?.toNumber(),
                  renter: item?.renter,
                  amount: item?.amount?.toNumber(),
                  price: parseFloat(ethers.utils.formatEther(item?.price)),
                  borrower: item?.borrower,
                  startTime: item?.startTime?.toNumber(),
                  endTime: item?.endTime?.toNumber()
                });
              } catch (err) {
                console.log("Something went wrong, please try again later!");
              }
            }
          }
        }

        // Books on sharing list
        let allOwnedBooksOnSharing = allBooksOnSharing.filter((nft) => {
          return nft.fromRenter == account.data;
        });

        for (let i = 0; i < allOwnedBooksOnSharing.length; i++) {
          const item = allOwnedBooksOnSharing[i];

          if (!Object.keys(queryString).length) {
            try {
              bookOnSharings.push({
                tokenId: item?.tokenId?.toNumber(),
                fromRenter: item?.fromRenter,
                amount: item?.amount?.toNumber(),
                price: parseFloat(ethers.utils.formatEther(item?.price)),
                priceOfBB: parseFloat(
                  ethers.utils.formatEther(item?.priceOfBB)
                ),
                sharer: item?.sharer,
                sharedPer: item?.sharedPer,
                startTime: item?.startTime?.toNumber(),
                endTime: item?.endTime?.toNumber()
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
                bookOnSharings.push({
                  tokenId: item?.tokenId?.toNumber(),
                  fromRenter: item?.fromRenter,
                  amount: item?.amount?.toNumber(),
                  price: parseFloat(ethers.utils.formatEther(item?.price)),
                  priceOfBB: parseFloat(
                    ethers.utils.formatEther(item?.priceOfBB)
                  ),
                  sharer: item?.sharer,
                  sharedPer: item?.sharedPer,
                  startTime: item?.startTime?.toNumber(),
                  endTime: item?.endTime?.toNumber()
                });
              } catch (err) {
                console.log("Something went wrong, please try again later!");
              }
            }
          }
        }

        // Shared books list
        let allOwnedSharedBooks = allSharedBooks.filter((nft) => {
          return nft.fromRenter == account.data;
        });

        for (let i = 0; i < allOwnedSharedBooks.length; i++) {
          const item = allOwnedSharedBooks[i];

          if (!Object.keys(queryString).length) {
            try {
              sharedBooks.push({
                tokenId: item?.tokenId?.toNumber(),
                fromRenter: item?.fromRenter,
                amount: item?.amount?.toNumber(),
                price: parseFloat(ethers.utils.formatEther(item?.price)),
                priceOfBB: parseFloat(
                  ethers.utils.formatEther(item?.priceOfBB)
                ),
                sharer: item?.sharer,
                sharedPer: item?.sharedPer,
                startTime: item?.startTime?.toNumber(),
                endTime: item?.endTime?.toNumber()
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
                sharedBooks.push({
                  tokenId: item?.tokenId?.toNumber(),
                  fromRenter: item?.fromRenter,
                  amount: item?.amount?.toNumber(),
                  price: parseFloat(ethers.utils.formatEther(item?.price)),
                  priceOfBB: parseFloat(
                    ethers.utils.formatEther(item?.priceOfBB)
                  ),
                  sharer: item?.sharer,
                  sharedPer: item?.sharedPer,
                  startTime: item?.startTime?.toNumber(),
                  endTime: item?.endTime?.toNumber()
                });
              } catch (err) {
                console.log("Something went wrong, please try again later!");
              }
            }
          }
        }
        return { borrowedBooks, bookOnSharings, sharedBooks };
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };
