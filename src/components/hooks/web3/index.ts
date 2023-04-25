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

export const useOwnedNfts = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedNfts(queryString);

  return {
    nfts: swrRes
  };
};

export const useCreatedBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useCreatedBooks(queryString);

  return {
    nfts: swrRes
  };
};

export const useOwnedListedBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedListedBooks(queryString);

  return {
    nfts: swrRes
  };
};

export const useOwnedPurchasedBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedPurchasedBooks(queryString);

  return {
    nfts: swrRes
  };
};

export const useOwnedBorrowedBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedBorrowedBooks(queryString);

  return {
    nfts: swrRes
  };
};

export const useOwnedLendingBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedLendingBooks(queryString);

  return {
    nfts: swrRes
  };
};

export const useOwnedLentOutBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedLentOutBooks(queryString);

  return {
    nfts: swrRes
  };
};

export const useOwnedSharingBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedSharingBooks(queryString);

  return {
    nfts: swrRes
  };
};

export const useOwnedSharedBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedSharedBooks(queryString);

  return {
    nfts: swrRes
  };
};

export const useOwnedSharedOutBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedSharedOutBooks(queryString);

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
