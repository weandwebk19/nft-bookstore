/* eslint-disable prettier/prettier */
import { Web3Dependencies } from "@_types/hooks";

import { useBookDetail } from ".";
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
  UseOwnedListedBooksHook,
  hookFactory as createOwnedListedBooksHook
} from "./useOwnedListedBooks";
import {
  UseOwnedNftsHook,
  hookFactory as createOwnedBooksHook
} from "./useOwnedNfts";

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
  useListedBooks: UseListedBooksHook;
  useAllLeasingBooks: UseAllLeasingBooksHook;
  useOwnedNfts: UseOwnedNftsHook;
  useCreatedBooks: UseCreatedBooksHook;
  useOwnedListedBooks: UseOwnedListedBooksHook;
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
    useBookDetail: createBookDetailHook(deps)
  };
};
