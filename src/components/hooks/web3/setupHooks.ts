/* eslint-disable prettier/prettier */
import { Web3Dependencies } from "@_types/hooks";

import { UseAccountHook, hookFactory as createAccountHook } from "./useAccount";
import { UseListedBooksHook, hookFactory as createListedBooksHook } from "./useListedBooks";
import { UseNetworkHook, hookFactory as createNetworkHook } from "./useNetwork";
import { hookFactory as createOwnedBooksHook, UseOwnedNftsHook } from "./useOwnedNfts";

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
  useListedBooks: UseListedBooksHook;
  useOwnedNfts: UseOwnedNftsHook;
};

export type SetupHooks = {
  (d: Web3Dependencies): Web3Hooks;
};

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps),
    useListedBooks: createListedBooksHook(deps),
    useOwnedNfts: createOwnedBooksHook(deps)
  };
};
