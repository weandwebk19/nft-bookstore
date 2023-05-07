import { CryptoHookFactory } from "@_types/hooks";
import { BookSellingCore } from "@_types/nftBook";
import { ethers } from "ethers";
import useSWR from "swr";

import { useAccount } from "..";

type RandomBooksHookFactory = CryptoHookFactory<BookSellingCore[]>;

export type UseRandomBooksHook = ReturnType<RandomBooksHookFactory>;

export const hookFactory: RandomBooksHookFactory =
  ({ contract }) =>
  () => {
    const { account } = useAccount();

    const { data, ...swr } = useSWR(
      [contract ? "web3/useRandomBooks" : null, account.data],
      async () => {
        const listedBooks = [] as BookSellingCore[];
        const coreListedBooks = await contract!.getAllBooksOnSale();

        let count = 0;
        while (count < 6 && count < coreListedBooks.length) {
          const randomIndex = Math.floor(
            Math.random() * coreListedBooks.length
          );
          const randomItem = coreListedBooks[randomIndex];
          const listedBook = {
            tokenId: randomItem.tokenId.toNumber(),
            seller: randomItem.seller,
            buyer: randomItem.buyer,
            price: parseFloat(ethers.utils.formatEther(randomItem.price)),
            amount: randomItem.amount.toNumber()
          };
          if (
            !listedBooks.includes(listedBook) &&
            listedBook.seller !== account.data
          ) {
            listedBooks.push(listedBook);
            count++;
          }
        }

        return listedBooks;
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };