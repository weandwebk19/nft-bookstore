import { useFetchData } from "./useFetchData";

export const useLanguages = () => {
  const { data, isLoading, error } = useFetchData("/api/languages");

  return { data, isLoading, error };
};
