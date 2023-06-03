import axios from "axios";

export const createBookHistory = async (
  tokenId: number,
  event: string,
  eventVi: string,
  fromAddress: string,
  price: number,
  amount: number
) => {
  const res = await axios.post("/api/bookHistories/create", {
    tokenId,
    event,
    eventVi,
    fromAddress,
    price,
    amount,
    timestamp: new Date()
  });

  return res;
};
