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
  UseOwnedListedBooksHook,
  hookFactory as createOwnedListedBooksHook
} from "./useOwnedListedBooks";
import {
  UseOwnedNftsHook,
  hookFactory as createOwnedBooksHook
} from "./useOwnedNfts";
import {
  UseOwnedRentedBooksHook,
  hookFactory as createOwnedRentedBooksHook
} from "./useOwnedRentedBooks";
import {
  UseOwnedSharedBooksHook,
  hookFactory as createOwnedSharedBooksHook
} from "./useOwnedSharedBooks";

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
  useListedBooks: UseListedBooksHook;
  useAllLeasingBooks: UseAllLeasingBooksHook;
  useOwnedNfts: UseOwnedNftsHook;
  useCreatedBooks: UseCreatedBooksHook;
  useOwnedListedBooks: UseOwnedListedBooksHook;
  useOwnedBorrowedBooks: UseOwnedBorrowedBooksHook;
  useOwnedRentedBooks: UseOwnedRentedBooksHook;
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
    useOwnedRentedBooks: createOwnedRentedBooksHook(deps),
    useOwnedBorrowedBooks: createOwnedBorrowedBooksHook(deps),
    useOwnedSharedBooks: createOwnedSharedBooksHook(deps),
    useBookDetail: createBookDetailHook(deps)
  };
};
