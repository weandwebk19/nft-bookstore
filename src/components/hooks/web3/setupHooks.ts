/* eslint-disable prettier/prettier */
import { Web3Dependencies } from "@_types/hooks";

import { UseAccountHook, hookFactory as createAccountHook } from "./useAccount";
import {
  UseAllLeasingBooksHook,
  hookFactory as createAllLeasingBooksHook
} from "./useAllLeasingBooks";
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
  UseOwnedLeasedOutBooksHook,
  hookFactory as createOwnedLeasedOutBooksHook
} from "./useOwnedLeasedOutBooks";
import {
  UseOwnedLeasingBooksHook,
  hookFactory as createOwnedLeasingBooksHook
} from "./useOwnedLeasingBooks";
import {
  UseOwnedListedBooksHook,
  hookFactory as createOwnedListedBooksHook
} from "./useOwnedListedBooks";
import {
  UseOwnedNftsHook,
  hookFactory as createOwnedBooksHook
} from "./useOwnedNfts";
import {
  UseOwnedSharedBooksHook,
  hookFactory as createOwnedSharedBooksHook
} from "./useOwnedSharedBooks";
import {
  UseOwnedSharingBooksHook,
  hookFactory as createOwnedSharingBooksHook
} from "./useOwnedSharingBooks";

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
  useListedBooks: UseListedBooksHook;
  useAllLeasingBooks: UseAllLeasingBooksHook;
  useOwnedNfts: UseOwnedNftsHook;
  useCreatedBooks: UseCreatedBooksHook;
  useOwnedListedBooks: UseOwnedListedBooksHook;
  useOwnedBorrowedBooks: UseOwnedBorrowedBooksHook;
  useOwnedLeasingBooks: UseOwnedLeasingBooksHook;
  useOwnedLeasedOutBooks: UseOwnedLeasedOutBooksHook;
  useOwnedSharingBooks: UseOwnedSharingBooksHook;
  useOwnedSharedBooks: UseOwnedSharedBooksHook;
  useBookDetail: UseBookDetailHook;
};

export type SetupHooks = {
  (d: Web3Dependencies): Web3Hooks;
};

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps),
    useListedBooks: createListedBooksHook(deps),
    useAllLeasingBooks: createAllLeasingBooksHook(deps),
    useOwnedNfts: createOwnedBooksHook(deps),
    useCreatedBooks: createCreatedBooksHook(deps),
    useOwnedListedBooks: createOwnedListedBooksHook(deps),
    useOwnedLeasingBooks: createOwnedLeasingBooksHook(deps),
    useOwnedLeasedOutBooks: createOwnedLeasedOutBooksHook(deps),
    useOwnedBorrowedBooks: createOwnedBorrowedBooksHook(deps),
    useOwnedSharingBooks: createOwnedSharingBooksHook(deps),
    useOwnedSharedBooks: createOwnedSharedBooksHook(deps),
    useBookDetail: createBookDetailHook(deps)
  };
};
