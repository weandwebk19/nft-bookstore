import { useEffect, useState } from "react";

import axios from "axios";

export const useFetchData = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(url);
        const responseData = await response.data;
        if (responseData.success == true) {
          setData(responseData.data);
        } else {
          setError(responseData.message);
        }
      } catch (error: any) {
        setError(error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  return { data, isLoading, error };
};
