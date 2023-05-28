export type BookHistoriesNoId = {
  tokenId: number;
  event: string;
  eventVi: string;
  buyer: string;
  price: number;
  amount: number;
  timestamp: Date;
};

export type BookHistories = {
  id: string;
} & BookHistoriesNoId;
