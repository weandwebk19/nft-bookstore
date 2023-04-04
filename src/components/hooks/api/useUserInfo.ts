import { useAccount } from "@hooks/web3";

import { useFetchData } from "./useFetchData";

export const useUserInfo = () => {
  const { account } = useAccount();
  const { data, isLoading, error } = useFetchData(
    `/api/users/wallet/${account.data}`
  );

  return { data, isLoading, error };
};
