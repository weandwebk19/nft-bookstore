/* eslint-disable prettier/prettier */
import { useHooks } from "@providers/web3";
import { ParsedUrlQuery } from "querystring";

import { FilterField } from "@/types/filter";

export const useAccount = () => {
  const hooks = useHooks();
  const swrRes = hooks.useAccount();

  return {
    account: swrRes
  };
};

export const useNetwork = () => {
  const hooks = useHooks();
  const swrRes = hooks.useNetwork();

  return {
    network: swrRes
  };
};

export const useListedBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useListedBooks(queryString);

  return {
    listedBooks: swrRes
  };
};

export const useOwnedNfts = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedNfts();

  return {
    nfts: swrRes
  };
};

export const useCreatedBooks = () => {
  const hooks = useHooks();
  const swrRes = hooks.useCreatedBooks();

  return {
    nfts: swrRes
  };
};

export const useOwnedListedBooks = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedListedBooks();

  return {
    nfts: swrRes
  };
};

export const useOwnedPurchasedBooks = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedPurchasedBooks();

  return {
    nfts: swrRes
  };
};

export const useOwnedBorrowedBooks = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedBorrowedBooks();

  return {
    nfts: swrRes
  };
};

export const useOwnedLendingBooks = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedLendingBooks();

  return {
    nfts: swrRes
  };
};

export const useOwnedLentOutBooks = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedLentOutBooks();

  return {
    nfts: swrRes
  };
};

export const useOwnedSharingBooks = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedSharingBooks();

  return {
    nfts: swrRes
  };
};

export const useOwnedSharedBooks = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedSharedBooks();

  return {
    nfts: swrRes
  };
};

export const useOwnedSharedOutBooks = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedSharedOutBooks();

  return {
    nfts: swrRes
  };
};

export const useBookDetail = (bookId: string, seller?: string) => {
  const hooks = useHooks();
  const swrRes = hooks.useBookDetail(bookId, seller);
  return {
    bookDetail: swrRes
  };
};

export const useRealOwnerOfTokens = (tokenId: number) => {
  const hooks = useHooks();
  const swrRes = hooks.useRealOwnerOfTokens(tokenId);
  return {
    ownerTokens: swrRes
  };
};

export const useAllLendingBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useAllLendingBooks(queryString);

  return {
    nfts: swrRes
  };
};

export const useAllSharingBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useAllSharingBooks(queryString);

  return {
    nfts: swrRes
  };
};

export const useOwnedRequestsOnExtending = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedRequestsOnExtending();

  return {
    swr: swrRes
  };
};

export const useOwnedResponsesOnExtending = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedResponsesOnExtending();

  return {
    swr: swrRes
  };
};
