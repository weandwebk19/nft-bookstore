import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import useSWR from "swr";

import { NftBookCore } from "@/types/nftBook";
import { toNumber } from "@/utils/nomalizer";

type NftBookCoreHookFactory = CryptoHookFactory<NftBookCore>;

export type UseNftBookCoreHook = ReturnType<NftBookCoreHookFactory>;

export const hookFactory: NftBookCoreHookFactory =
  ({ bookStoreContract }) =>
  (bookId: string) => {
    const { data, ...swr } = useSWR(
      [bookStoreContract ? "web3/useNftBookCore" : null, bookId],
      async () => {
        if (bookId) {
          const tokenId = await (
            await axios.get(`/api/books/${bookId}/tokenId`)
          ).data?.data;
          const coreNftBook = await bookStoreContract!.getNftBook(tokenId);

          return toNumber(coreNftBook);
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
