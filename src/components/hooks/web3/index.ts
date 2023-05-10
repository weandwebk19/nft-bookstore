/* eslint-disable prettier/prettier */
import { useHooks } from "@providers/web3";
import { ParsedUrlQuery } from "querystring";

import { FilterField } from "@/types/filter";
import { NftBookSellingHookType } from "@/types/hooks";

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

export const usePublishingBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.usePublishingBooks(queryString);

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

export const useOwnedSellingBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedSellingBooks(queryString);

  return {
    nfts: swrRes
  };
};

export const useOwnedSoldBooks = (queryString: FilterField) => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedSoldBooks(queryString);

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

export const useNftBookCore = (bookId: string) => {
  const hooks = useHooks();
  const swrRes = hooks.useNftBookCore(bookId);
  return {
    nftBookCore: swrRes
  };
};

export const useNftBookSelling = (params: NftBookSellingHookType) => {
  const hooks = useHooks();
  const swrRes = hooks.useNftBookSelling(params);
  return {
    nftBookSelling: swrRes
  };
};

export const useNftBookMeta = (bookId: string) => {
  const hooks = useHooks();
  const swrRes = hooks.useNftBookMeta(bookId);
  return {
    nftBookMeta: swrRes
  };
};

export const useMetadata = (tokenId: number) => {
  const hooks = useHooks();
  const swrRes = hooks.useMetadata(tokenId);
  return {
    metadata: swrRes
  };
};

export const useRandomBooks = () => {
  const hooks = useHooks();
  const swrRes = hooks.useRandomBooks();
  return {
    nfts: swrRes
  };
};

export const useRealOwnerOfTokens = (bookId: string) => {
  const hooks = useHooks();
  const swrRes = hooks.useRealOwnerOfTokens(bookId);
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
