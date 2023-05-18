export type PricingHistoriesNoId = {
  bookId: string;
  price: number;
  currency: string;
  userAddress: string;
  category: string;
  createdAt: Date;
};

export type PricingHistories = {
  id: string;
} & PricingHistoriesNoId;
