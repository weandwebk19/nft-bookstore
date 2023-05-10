import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import useSWR from "swr";

import { NftBookMeta } from "@/types/nftBook";

type MetadataHookFactory = CryptoHookFactory<NftBookMeta>;

export type UseMetadataHook = ReturnType<MetadataHookFactory>;

export const hookFactory: MetadataHookFactory =
  ({ bookStoreContract }) =>
  (tokenId: number) => {
    const { data, ...swr } = useSWR(
      [bookStoreContract ? "web3/useMetadata" : null, tokenId],
      async () => {
        if (tokenId) {
          const tokenURI = await bookStoreContract!.getUri(tokenId);

          const url = `/api/pinata/metadata?nftUri=${tokenURI}`;
          const metaRes = await (await axios.get(url)).data;

          return metaRes.data;
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
