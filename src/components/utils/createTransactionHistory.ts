import axios from "axios";

export const createTransactionHistory = async (
  tokenId: number,
  amount: number,
  currentBalance: string,
  transactionName: string,
  transactionNameVi: string,
  transactionHash: string,
  fromAddress: string,
  toAddress: string,
  detail: string,
  detailVi: string
) => {
  const res = await axios.post("/api/transactionHistories/create", {
    tokenId,
    amount,
    currentBalance,
    transactionName,
    transactionNameVi,
    transactionHash,
    fromAddress,
    toAddress,
    detail,
    detailVi,
    timestamp: new Date()
  });

  return res;
};
