/* eslint-disable prettier/prettier */
import { useHooks } from "@providers/web3";

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

export const useListedBooks = () => {
  const hooks = useHooks();
  const swrRes = hooks.useListedBooks();

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

export const useAllLendingBooks = () => {
  const hooks = useHooks();
  const swrRes = hooks.useAllLendingBooks();

  return {
    nfts: swrRes
  };
};

export const useAllSharingBooks = () => {
  const hooks = useHooks();
  const swrRes = hooks.useAllSharingBooks();

  return {
    nfts: swrRes
  };
};
