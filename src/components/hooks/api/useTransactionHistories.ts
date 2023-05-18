import axios from "axios";
import useSWR from "swr";

export const useTransactionHistories = (userAddress: string) => {
  const { data, ...swr } = useSWR(
    [
      userAddress
        ? `/api/users/wallet/${userAddress}/transaction-histories`
        : null,
      userAddress
    ],
    async () => {
      const res = await axios.get(
        `/api/users/wallet/${userAddress}/transaction-histories`
      );
      return res.data.data;
    }
  );

  return {
    ...swr,
    data: data
  };
};
