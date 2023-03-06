import { useFetchData } from "./useFetchData";

export const useGenres = () => {
  const { data, isLoading, error } = useFetchData("/api/genres");
  const genres: any = data;

  return { data, isLoading, error };
};
