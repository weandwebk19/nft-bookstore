import { useEffect, useState } from "react";

import axios from "axios";
import useSWR from "swr";

import { useWeb3 } from "@/components/providers/web3";

export const useMetadata = (tokenId: number) => {
  const { bookStoreContract } = useWeb3();
  const [tokenURI, setTokenURI] = useState<string>();
  useEffect(() => {
    if (tokenId) {
      (async () => {
        const tokenURI = await bookStoreContract!.getUri(tokenId);
        setTokenURI(tokenURI);
      })();
    }
  }, []);
  const { data, ...swr } = useSWR(
    tokenURI ? `/api/pinata/metadata?nftUri=${tokenURI}` : null,
    fetcher
  );

  return {
    data: data,
    ...swr
  };
};

// This is the function that will be used to fetch the metadata
async function fetcher(url: string) {
  const metaRes = await (await axios.get(url)).data;
  if (metaRes.success === true) {
    return metaRes.data;
  }
}
