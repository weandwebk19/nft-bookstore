import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { BorrowedBook } from "@/types/nftBook";

import { useAccount } from ".";

type OwnedLeasedOutBooksHookFactory = CryptoHookFactory<BorrowedBook[]>;

export type UseOwnedLeasedOutBooksHook =
  ReturnType<OwnedLeasedOutBooksHookFactory>;

export const hookFactory: OwnedLeasedOutBooksHookFactory =
  ({ contract }) =>
  () => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedLeasedOutBooks" : null,
      async () => {
        const nfts = [] as BorrowedBook[];
        const allBorrowedBooks = await contract!.getAllBorrowedBooks();
        const coreNfts = allBorrowedBooks.filter((nft) => {
          return nft.renter == account.data;
        });

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.getUri(item.tokenId);
          const metaRes = await (
            await axios.get(`/api/pinata/metadata?nftUri=${tokenURI}`)
          ).data;
          let meta = null;
          if (metaRes.success === true) {
            meta = metaRes.data;
          }
          try {
            nfts.push({
              tokenId: item?.tokenId?.toNumber(),
              renter: item?.renter,
              amount: item?.amount?.toNumber(),
              price: parseFloat(ethers.utils.formatEther(item?.price)),
              borrower: item?.borrower,
              startTime: item?.startTime?.toNumber(),
              endTime: item?.endTime?.toNumber(),
              meta
            });
          } catch (err) {
            console.log(err);
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
