import { Web3Dependencies } from "@_types/hooks";

import { UseAccountHook, hookFactory as createAccountHook } from "./useAccount";
import { UseNetworkHook, hookFactory as createNetworkHook } from "./useNetwork";

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
};

export type SetupHooks = {
  (d: Web3Dependencies): Web3Hooks;
};

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps)
  };
};
