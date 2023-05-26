import axios from "axios";

export const createBookHistory = async (
  tokenId: number,
  event: string,
  eventVi: string,
  buyer: string,
  price: number,
  amount: number
) => {
  const res = await axios.post("/api/bookHistories/create", {
    tokenId,
    event,
    eventVi,
    buyer,
    price,
    amount,
    timestamp: new Date()
  });

  return res;
};
