import { useFetchData } from "./useFetchData";

export const useGenres = () => {
  const { data, isLoading, error } = useFetchData("/api/genres");
  const genres: any = data;

  if (!isLoading) {
    return genres?.map((item: { genre: any }) => item.genre);
  }

  return data;
};
