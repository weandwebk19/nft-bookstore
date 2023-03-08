import { useFetchData } from "./useFetchData";

export const useGenres = () => {
  const { data, isLoading, error } = useFetchData("/api/genres");

  return { data, isLoading, error };
};
