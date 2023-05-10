import { useFetchData } from "./useFetchData";

export const useBookInfo = (bookId: string) => {
  const { data, isLoading, error } = useFetchData(`/api/books/${bookId}`);

  return { data, isLoading, error };
};
