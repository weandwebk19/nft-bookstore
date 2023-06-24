/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { ResponseExtendCore } from "@/types/nftBook";

import { useAccount } from "..";

type OwnedResponsesOnExtendingHookFactory = CryptoHookFactory<
  ResponseExtendCore[]
>;

export type UseOwnedResponsesOnExtendingHook =
  ReturnType<OwnedResponsesOnExtendingHookFactory>;

export const hookFactory: OwnedResponsesOnExtendingHookFactory =
  ({ bookRentingContract }) =>
  () => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        bookRentingContract ? "web3/useOwnedResponsesOnExtending" : null,
        account.data
      ],
      async () => {
        try {
          const responses = [] as ResponseExtendCore[];
          const coreResponses =
            await bookRentingContract!.getAllOwnedResponse();

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
          console.log("Something went wrong, please try again later!");
          return [];
        }
      }
    );

    return {
      ...swr,
      data: data || []
    };
  };
