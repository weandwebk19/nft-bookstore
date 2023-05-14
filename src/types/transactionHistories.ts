export type TransactionHistoriesNoId = {
  amount: number;
  balance: number;
  transactionName: string;
  transactionHash: string;
  fromAddress: string;
  toAddress: string;
  detail: string;
  timestamp: Date;
};

export type TransactionHistories = {
  id: string;
} & TransactionHistoriesNoId;
