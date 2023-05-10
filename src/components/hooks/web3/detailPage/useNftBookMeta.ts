import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import useSWR from "swr";

import { NftBookMeta } from "@/types/nftBook";
import { toNumber } from "@/utils/nomalizer";

type NftBookMetaHookFactory = CryptoHookFactory<NftBookMeta>;

export type UseNftBookMetaHook = ReturnType<NftBookMetaHookFactory>;

export const hookFactory: NftBookMetaHookFactory =
  ({ bookStoreContract }) =>
  (bookId: string) => {
    const { data, ...swr } = useSWR(
      [bookStoreContract ? "web3/useNftBookMeta" : null, bookId],
      async () => {
        if (bookId) {
          const tokenId = await (
            await axios.get(`/api/books/${bookId}/tokenId`)
          ).data?.data;
          if (tokenId) {
            const tokenURI = await bookStoreContract!.getUri(tokenId);

            const url = `/api/pinata/metadata?nftUri=${tokenURI}`;
            const metaRes = await (await axios.get(url)).data;

            return metaRes.data;
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
