/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { toast } from "react-toastify";

import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import { ethers } from "ethers";
import useSWR from "swr";

import { RequestExtendCore } from "@/types/nftBook";

import { useAccount } from "..";

type OwnedRequestsOnExtendingHookFactory = CryptoHookFactory<
  RequestExtendCore[]
>;

export type UseOwnedRequestsOnExtendingHook =
  ReturnType<OwnedRequestsOnExtendingHookFactory>;

export const hookFactory: OwnedRequestsOnExtendingHookFactory =
  ({ bookRentingContract }) =>
  () => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [
        bookRentingContract ? "web3/useOwnedRequestsOnExtending" : null,
        account.data
      ],
      async () => {
        try {
          const requests = [] as RequestExtendCore[];
          const coreRequests = await bookRentingContract!.getAllOwnedRequest();

          for (let i = 0; i < coreRequests.length; i++) {
            const item = coreRequests[i];

            requests.push({
              id: item?.id?.toNumber(),
              time: item?.time?.toNumber(),
              amount: item?.amount?.toNumber(),
              sender: item?.sender,
              isAccept: item?.isAccept
            });
          }
          return requests;
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
