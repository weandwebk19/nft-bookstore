import axios from "axios";

export const createPricingHistory = async (
  tokenId: number,
  price: number,
  category: string,
  userAddress: string
) => {
  // get bookId
  const bookRes = await axios.get(`/api/books/token/${tokenId}/bookId`);
  if (bookRes.data.success === true) {
    const res = await axios.post("/api/pricingHistories/create", {
      bookId: bookRes.data.data,
      price,
      currency: "ETH",
      category,
      userAddress,
      createdAt: new Date()
    });
  }
};
