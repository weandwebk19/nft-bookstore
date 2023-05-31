import { Bar } from "react-chartjs-2";

import { PricingHistories } from "@/types/pricingHistories";

import { useFetchData } from "./useFetchData";

export const usePricingHistory = (bookId: string, category: string) => {
  const { data, isLoading, error } = useFetchData(
    `/api/books/${bookId}/pricing-histories/${category}`
  );

  const pricingHistories = data as PricingHistories[];
  let pricingHistory = data;
  let calculatedPricingHistory;
  if (pricingHistories) {
    let highest = 0;
    let lowest = 0;
    const lastest = pricingHistories
      ? pricingHistories[pricingHistories.length - 1]?.price
      : 0;
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

    calculatedPricingHistory = {
      highest,
      lowest,
      lastest,
      average: (sum / pricingHistories.length).toFixed(2),
      pricingHistory: []
    };

    calculatedPricingHistory.pricingHistory = pricingHistory;
  }

  return { data: calculatedPricingHistory, isLoading, error };
};
