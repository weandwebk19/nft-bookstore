/* eslint-disable prettier/prettier */
import { Web3Dependencies } from "@_types/hooks";

import {
  UseOwnedBorrowedBooksHook,
  hookFactory as createOwnedBorrowedBooksHook
} from "./bookShelf/borrow/useOwnedBorrowedBooks";
import {
  UseOwnedLendingBooksHook,
  hookFactory as createOwnedLendingBooksHook
} from "./bookShelf/borrow/useOwnedLendingBooks";
import {
  UseOwnedLentOutBooksHook,
  hookFactory as createOwnedLentOutBooksHook
} from "./bookShelf/borrow/useOwnedLentOutBooks";
import {
  UseOwnedListedBooksHook,
  hookFactory as createOwnedListedBooksHook
} from "./bookShelf/sell/useOwnedListedBooks";
import {
  UseOwnedPurchasedBooksHook,
  hookFactory as createOwnedPurchasedBooksHook
} from "./bookShelf/sell/useOwnedPurchasedBooks";
import {
  UseOwnedSharedBooksHook,
  hookFactory as createOwnedSharedBooksHook
} from "./bookShelf/share/useOwnedSharedBooks";
import {
  UseOwnedSharedOutBooksHook,
  hookFactory as createOwnedSharedOutBooksHook
} from "./bookShelf/share/useOwnedSharedOutBooks";
import {
  UseOwnedSharingBooksHook,
  hookFactory as createOwnedSharingBooksHook
} from "./bookShelf/share/useOwnedSharingBooks";
import {
  UseCreatedBooksHook,
  hookFactory as createCreatedBooksHook
} from "./bookShelf/useCreatedBooks";
import {
  UseOwnedNftsHook,
  hookFactory as createOwnedBooksHook
} from "./bookShelf/useOwnedNfts";
import {
  UseAllLendingBooksHook,
  hookFactory as createAllLendingBooksHook
} from "./borrow/useAllLendingBooks";
import {
  UseBookDetailHook,
  hookFactory as createBookDetailHook
} from "./detailPage/useBookDetail";
import {
  UseRealOwnerOfTokensHook,
  hookFactory as createRealOwnerOfTokensHook
} from "./detailPage/useRealOwnerOfTokens";
import {
  UseListedBooksHook,
  hookFactory as createListedBooksHook
} from "./publishing/useListedBooks";
import {
  UseAllSharingBooksHook,
  hookFactory as createAllSharingBooksHook
} from "./share/useAllSharingBooks";
import { UseAccountHook, hookFactory as createAccountHook } from "./useAccount";
import { UseNetworkHook, hookFactory as createNetworkHook } from "./useNetwork";

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
  useListedBooks: UseListedBooksHook;
  useAllLendingBooks: UseAllLendingBooksHook;
  useAllSharingBooks: UseAllSharingBooksHook;
  useOwnedNfts: UseOwnedNftsHook;
  useCreatedBooks: UseCreatedBooksHook;
  useOwnedListedBooks: UseOwnedListedBooksHook;
  useOwnedPurchasedBooks: UseOwnedPurchasedBooksHook;
  useOwnedBorrowedBooks: UseOwnedBorrowedBooksHook;
  useOwnedLendingBooks: UseOwnedLendingBooksHook;
  useOwnedLentOutBooks: UseOwnedLentOutBooksHook;
  useOwnedSharingBooks: UseOwnedSharingBooksHook;
  useOwnedSharedBooks: UseOwnedSharedBooksHook;
  useOwnedSharedOutBooks: UseOwnedSharedOutBooksHook;
  useBookDetail: UseBookDetailHook;
  useRealOwnerOfTokens: UseRealOwnerOfTokensHook;
};

export type SetupHooks = {
  (d: Web3Dependencies): Web3Hooks;
};

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps),
    useListedBooks: createListedBooksHook(deps),
    useAllLendingBooks: createAllLendingBooksHook(deps),
    useAllSharingBooks: createAllSharingBooksHook(deps),
    useOwnedNfts: createOwnedBooksHook(deps),
    useCreatedBooks: createCreatedBooksHook(deps),
    useOwnedListedBooks: createOwnedListedBooksHook(deps),
    useOwnedPurchasedBooks: createOwnedPurchasedBooksHook(deps),
    useOwnedLendingBooks: createOwnedLendingBooksHook(deps),
    useOwnedLentOutBooks: createOwnedLentOutBooksHook(deps),
    useOwnedBorrowedBooks: createOwnedBorrowedBooksHook(deps),
    useOwnedSharingBooks: createOwnedSharingBooksHook(deps),
    useOwnedSharedBooks: createOwnedSharedBooksHook(deps),
    useOwnedSharedOutBooks: createOwnedSharedOutBooksHook(deps),
    useBookDetail: createBookDetailHook(deps),
    useRealOwnerOfTokens: createRealOwnerOfTokensHook(deps)
  };
};
