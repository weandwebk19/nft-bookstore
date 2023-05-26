import axios from "axios";
import useSWR from "swr";

export const useBookHistories = (bookId: string) => {
  const { data, ...swr } = useSWR(
    [bookId ? `/api/books/${bookId}/book-histories` : null, bookId],
    async () => {
      const res = await axios.get(`/api/books/${bookId}/book-histories`);
      console.log("res", res);
      return res.data.data;
    }
  );

  return {
    ...swr,
    data: data
  };
};
