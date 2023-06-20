import { CryptoHookFactory, NftBookSellingHookType } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethersv5";
import useSWR from "swr";

import { BookSelling } from "@/types/nftBook";
import { toNumber } from "@/utils/nomalizer";

type NftBookSellingHookFactory = CryptoHookFactory<BookSelling>;

export type UseNftBookSellingHook = ReturnType<NftBookSellingHookFactory>;

export const hookFactory: NftBookSellingHookFactory =
  ({ bookStoreContract, bookSellingContract }) =>
  (params: NftBookSellingHookType) => {
    const { data, ...swr } = useSWR(
      [
        bookStoreContract && bookSellingContract
          ? "web3/useNftBookSelling"
          : null,
        params
      ],
      async () => {
        if (params.bookId) {
          // get tokenId
          const tokenId = await (
            await axios.get(`/api/books/${params.bookId}/tokenId`)
          ).data?.data;
          if (tokenId) {
            // get  NftBook from contract
            const coreNftBook = await bookStoreContract!.getNftBook(tokenId);

            const sellerDefault = params.seller
              ? params.seller
              : coreNftBook?.author;
            const isListing = await bookSellingContract!.isListing(
              tokenId,
              sellerDefault
            );

            if (isListing === true) {
              try {
                const listedNftBook = await bookSellingContract!.getListedBook(
                  tokenId,
                  sellerDefault
                );

                return {
                  tokenId: listedNftBook.tokenId.toNumber(),
                  seller: listedNftBook.seller,
                  amount: listedNftBook.amount.toNumber(),
                  price: parseFloat(
                    ethers.utils.formatEther(listedNftBook.price)
                  )
                };
              } catch (error) {
                console.log("Something went wrong, please try again later!");
                return null;
              }
            } else {
              return null;
            }
          } else {
            return null;
          }
        } else {
          return null;
        }
      }
    );

    return {
      ...swr,
      data: data
    };
  };
