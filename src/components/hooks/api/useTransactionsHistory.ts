import { useEffect, useState } from "react";

import axios from "axios";

import { useAccount } from "../web3";
import { useFetchData } from "./useFetchData";

interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}
interface TransactionsResponse {
  status: string;
  message: string;
  result: Transaction[];
}

export const useTransactionsHistory = () => {
  const { account } = useAccount();
  let address = account.data as string;
  const apiKey = "4UE64A86DY6EBTGQMJ28R7HZPJJ83UJJ25";
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${apiKey}`;
  const [data, setData] = useState<TransactionsResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(url);
        if (response.data.status === "1") {
          setData(response.data.result);
        } else {
          setError(response.data.message);
        }
      } catch (error: any) {
        setError(error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  return { data, isLoading, error };
};
