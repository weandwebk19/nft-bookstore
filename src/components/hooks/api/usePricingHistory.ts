import { PricingHistories } from "@/types/pricingHistories";

import { useFetchData } from "./useFetchData";

export const usePricingHistory = (bookId: string, category: string) => {
  const { data, isLoading, error } = useFetchData(
    `/api/books/${bookId}/pricing-histories/${category}`
  );

  const pricingHistories = data as PricingHistories[];
  if (pricingHistories && pricingHistories.length > 0) {
    let highest = pricingHistories[0].price;
    let lowest = pricingHistories[0].price;
    const lastest = pricingHistories[pricingHistories.length - 1]?.price;
    let sum = 0;

    pricingHistories?.forEach((pricing: PricingHistories) => {
      if (pricing.price > highest) {
        highest = pricing.price;
      }
      if (pricing.price < lowest) {
        lowest = pricing.price;
      }
      sum += pricing.price;
    });

    const pricingHistory = {
      highest,
      lowest,
      lastest,
      average: (sum / pricingHistories.length).toFixed(2)
    };

    return { data: pricingHistory, isLoading, error };
  }

  return { data: null, isLoading, error };
};
