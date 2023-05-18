/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory, NftBookSellingHookType } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { BookInfo, NftBook, NftBookDetail } from "@/types/nftBook";
import { toNumber } from "@/utils/nomalizer";

type BookDetailHookFactory = CryptoHookFactory<NftBookDetail>;

export type UseBookDetailHook = ReturnType<BookDetailHookFactory>;

export const hookFactory: BookDetailHookFactory =
  ({ bookStoreContract, bookSellingContract }) =>
  (params: NftBookSellingHookType) => {
    const { data, ...swr } = useSWR(
      bookStoreContract && bookSellingContract ? "web3/useBookDetail" : null,
      async () => {
        if (params.bookId) {
          const bookInfo = await (
            await axios.get(`/api/books/${params.bookId}`)
          ).data?.data;
          const coreNftBook = await bookStoreContract!.getNftBook(
            bookInfo?.tokenId
          );
          const tokenURI = await bookStoreContract!.getUri(bookInfo?.tokenId);
          const metaRes = await (
            await axios.get(`/api/pinata/metadata?nftUri=${tokenURI}`)
          ).data;
          let meta = null;
          if (metaRes.success === true) {
            meta = metaRes.data;
          }

          const sellerDefault = params.seller
            ? params.seller
            : coreNftBook?.author;
          const isListing = await bookSellingContract!.isListing(
            bookInfo?.tokenId,
            sellerDefault
          );
          if (isListing === true) {
            try {
              const listedNftBook = await bookSellingContract!.getListedBook(
                bookInfo?.tokenId,
                sellerDefault
              );
              const { price, tokenId, seller, amount } = listedNftBook;
              return {
                bookId: params.bookId,
                nftCore: toNumber(coreNftBook),
                listedCore: toNumber({
                  tokenId,
                  seller,
                  amount,
                  price: parseFloat(ethers.utils.formatEther(price))
                }),
                meta: meta,
                info: bookInfo
              };
            } catch (error) {
              console.error(error);
            }
          } else {
            return {
              bookId: params.bookId,
              nftCore: toNumber(coreNftBook),
              listedCore: null,
              meta: meta,
              info: bookInfo
            };
          }
        }
      }
    );

    return {
      ...swr,
      data: data || undefined
    };
  };
