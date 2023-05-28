export type TransactionHistoriesNoId = {
  tokenId: number;
  amount: number;
  currentBalance: number;
  transactionName: string;
  transactionNameVi: string;
  transactionHash: string;
  fromAddress: string;
  toAddress: string;
  detail: string;
  detailVi: string;
  timestamp: Date;
};

export type TransactionHistories = {
  id: string;
} & TransactionHistoriesNoId;
