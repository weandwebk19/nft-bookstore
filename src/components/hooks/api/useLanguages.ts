import { useFetchData } from "./useFetchData";

export const useLanguages = () => {
  const { data, isLoading, error } = useFetchData("/api/languages");
  const languages: any = data;

  if (!isLoading) {
    return languages?.map((item: { language: any }) => item.language);
  }

  return data;
};
