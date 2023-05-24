import { ethers } from "ethers";

import { createTransactionHistory } from "./createTransactionHistory";
import { getGasFee } from "./getGasFee";

export const createTransactionHistoryOnlyGasFee = async (
  provider: any,
  receipt: any,
  tokenId: number,
  transactionName: string,
  transactionNameVi: string
) => {
  // Create Transaction History
  const gasFee = await getGasFee(provider, receipt);

  // Get current balance of account
  const balance = await provider?.getBalance(receipt.from);
  const balanceInEther = ethers.utils.formatEther(balance!);
  await createTransactionHistory(
    tokenId,
    0 - parseFloat(gasFee),
    balanceInEther,
    transactionName,
    transactionNameVi,
    receipt.transactionHash,
    receipt.from,
    receipt.to,
    `Gas fee = ${gasFee} ETH`,
    `Phí gas = ${gasFee} ETH`
  );
};
