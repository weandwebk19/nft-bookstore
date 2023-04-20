/* eslint-disable prettier/prettier */
import { Web3Dependencies } from "@_types/hooks";

import { UseAccountHook, hookFactory as createAccountHook } from "./useAccount";
import {
  UseAllLendingBooksHook,
  hookFactory as createAllLendingBooksHook
} from "./useAllLendingBooks";
import {
  UseAllSharingBooksHook,
  hookFactory as createAllSharingBooksHook
} from "./useAllSharingBooks";
import {
  UseBookDetailHook,
  hookFactory as createBookDetailHook
} from "./useBookDetail";
import {
  UseCreatedBooksHook,
  hookFactory as createCreatedBooksHook
} from "./useCreatedBooks";
import {
  UseListedBooksHook,
  hookFactory as createListedBooksHook
} from "./useListedBooks";
import { UseNetworkHook, hookFactory as createNetworkHook } from "./useNetwork";
import {
  UseOwnedBorrowedBooksHook,
  hookFactory as createOwnedBorrowedBooksHook
} from "./useOwnedBorrowedBooks";
import {
  UseOwnedLendingBooksHook,
  hookFactory as createOwnedLendingBooksHook
} from "./useOwnedLendingBooks";
import {
  UseOwnedLentOutBooksHook,
  hookFactory as createOwnedLentOutBooksHook
} from "./useOwnedLentOutBooks";
import {
  UseOwnedListedBooksHook,
  hookFactory as createOwnedListedBooksHook
} from "./useOwnedListedBooks";
import {
  UseOwnedNftsHook,
  hookFactory as createOwnedBooksHook
} from "./useOwnedNfts";
import {
  UseOwnedPurchasedBooksHook,
  hookFactory as createOwnedPurchasedBooksHook
} from "./useOwnedPurchasedBooks";
import {
  UseOwnedSharedBooksHook,
  hookFactory as createOwnedSharedBooksHook
} from "./useOwnedSharedBooks";
import {
  UseOwnedSharedOutBooksHook,
  hookFactory as createOwnedSharedOutBooksHook
} from "./useOwnedSharedOutBooks";
import {
  UseOwnedSharingBooksHook,
  hookFactory as createOwnedSharingBooksHook
} from "./useOwnedSharingBooks";
import {
  UseRealOwnerOfTokensHook,
  hookFactory as createRealOwnerOfTokensHook
} from "./useRealOwnerOfTokens";

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
