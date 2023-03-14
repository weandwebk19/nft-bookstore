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

export const useBookDetail = (bookId: string, seller?: string) => {
  const hooks = useHooks();
  const swrRes = hooks.useBookDetail(bookId, seller);

  return {
    bookDetail: swrRes
  };
};
