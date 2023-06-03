import { useAccount } from "@hooks/web3";

import { useFetchData } from "./useFetchData";

export const useAuthorInfo = () => {
  const { account } = useAccount();
  const { data, isLoading, error } = useFetchData(
    `/api/authors/wallet/${account.data}`
  );

  return { data, isLoading, error };
};
