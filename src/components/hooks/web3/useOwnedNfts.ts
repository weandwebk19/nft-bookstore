/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { NftBook } from "@/types/nftBook";

type UseOwnedNftsResponse = {
  listNft: (tokenId: number, price: number) => Promise<void>;
};

type OwnedNftsHookFactory = CryptoHookFactory<NftBook[], UseOwnedNftsResponse>;

export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>;

export const hookFactory: OwnedNftsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedNfts" : null,
      async () => {
        const nfts = [] as NftBook[];
        const coreNfts = await contract!.getOwnedNFTBooks();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.uri(item.tokenId);
          const meta = await (
            await axios.get(`/api/pinata/metadata?nftUri=${tokenURI}`)
          ).data.data;

          nfts.push({
            tokenId: item.tokenId.toNumber(),
            author: item.author,
            quantity: item.balance.toNumber(),
            meta
          });
        }
        return nfts;
      }
    );

    const _contract = contract;
    const listNft = useCallback(
      async (tokenId: number, price: number) => {
        try {
          // const result = await _contract!.placeNftOnSale(
          //   tokenId,
          //   ethers.utils.parseEther(price.toString()),
          //   {
          //     value: ethers.utils.parseEther((0.025).toString())
          //   }
          // );
          // await toast.promise(
          //   result!.wait(), {
          //     pending: "Processing transaction",
          //     success: "Item has been listed",
          //     error: "Processing error"
          //   }
          // );
        } catch (e: any) {}
      },
      [_contract]
    );

    return {
      ...swr,
      listNft,
      data: data || []
    };
  };
