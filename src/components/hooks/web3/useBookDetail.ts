/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { BookInfo, NftBook, NftBookDetails } from "@/types/nftBook";

// type UseBookDetailResponse = {
//   listNft: (tokenId: number, price: number) => Promise<void>;
// };

type BookDetailHookFactory = CryptoHookFactory<NftBookDetails>;

export type UseBookDetailHook = ReturnType<BookDetailHookFactory>;

export const hookFactory: BookDetailHookFactory =
  ({ contract }) =>
  (bookId: string, seller?: string) => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useBookDetail" : null,
      async () => {
        const bookInfo = await (
          await axios.get(`/api/books/${bookId}`)
        ).data?.data;
        const coreNftBook = await contract!.getNftBook(bookInfo?.tokenId);
        let listedNftBook = null;
        if ((await contract!.isListed(bookInfo?.tokenId)) === true) {
          if (seller) {
            listedNftBook = await contract!.getListedBook(
              bookInfo?.tokenId,
              seller
            );
          } else {
            listedNftBook = await contract!.getListedBook(
              bookInfo?.tokenId,
              coreNftBook?.author
            );
          }
        }
        const tokenURI = await contract!.uri(bookInfo?.tokenId);
        const meta = await (await fetch(tokenURI)).json();

        return {
          bookId: bookId,
          nftCore: coreNftBook,
          listedCore: listedNftBook,
          meta: meta,
          info: bookInfo
        };
      }
    );

    return {
      ...swr,
      data: data || undefined
    };
  };
