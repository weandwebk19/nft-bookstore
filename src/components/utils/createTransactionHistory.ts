import axios from "axios";

export const createTransactionHistory = async (
  tokenId: number,
  amount: number,
  currentBalance: string,
  transactionName: string,
  transactionHash: string,
  fromAddress: string,
  toAddress: string,
  detail: string
) => {
  const res = await axios.post("/api/transactionHistories/create", {
    tokenId,
    amount,
    currentBalance,
    transactionName,
    transactionHash,
    fromAddress,
    toAddress,
    detail,
    timestamp: new Date()
  });

  return res;
};
