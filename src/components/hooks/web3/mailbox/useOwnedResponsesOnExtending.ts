/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { ResponseExtendCore } from "@/types/nftBook";

type OwnedResponsesOnExtendingHookFactory = CryptoHookFactory<
  ResponseExtendCore[]
>;

export type UseOwnedResponsesOnExtendingHook =
  ReturnType<OwnedResponsesOnExtendingHookFactory>;

export const hookFactory: OwnedResponsesOnExtendingHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedResponsesOnExtending" : null,
      async () => {
        try {
          const responses = [] as ResponseExtendCore[];
          const coreResponses =
            await contract!.getAllOwnedResponsesOnExtending();

          for (let i = 0; i < coreResponses.length; i++) {
            const item = coreResponses[i];

            responses.push({
              id: item?.id?.toNumber(),
              time: item?.time?.toNumber(),
              amount: item?.amount?.toNumber(),
              sender: item?.sender
            });
          }
          return responses;
        } catch (err) {
          console.log(err);
          return [];
        }
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };
