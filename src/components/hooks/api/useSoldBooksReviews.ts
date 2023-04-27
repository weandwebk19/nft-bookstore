import { useEffect, useState } from "react";

import axios from "axios";

import { useWeb3 } from "@/components/providers/web3";
import { FilterField } from "@/types/filter";
import { BookSellingCore } from "@/types/nftBook";
import { ReviewRowData } from "@/types/reviews";

import { useOwnedSoldBooks } from "../web3";

export const useSoldBooksReviews = () => {
  const { contract } = useWeb3();
  const { nfts } = useOwnedSoldBooks({} as FilterField);
  const listTokens = nfts.data?.map((book: BookSellingCore) => book.tokenId);
  const [data, setData] = useState<ReviewRowData[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // console.log("nfts", nfts);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const allReviews = await Promise.all(
          listTokens.map(async (tokenId: number) => {
            // get metadata
            const tokenURI = await contract!.getUri(tokenId);
            const metaRes = await (
              await axios.get(`/api/pinata/metadata?nftUri=${tokenURI}`)
            ).data;

            // get bookId
            const bookRes = await axios.get(
              `/api/books/token/${tokenId}/bookId`
            );

            console.log("bookRes", bookRes);
            if (bookRes.data.success === true) {
              const reviewRes = await axios.get(
                `/api/reviews/${bookRes.data.data}`
              );
              if (reviewRes.data.success == true && metaRes.success === true) {
                reviewRes.data.data?.map((review: ReviewRowData) => {
                  setData((oldReviews) => [
                    ...oldReviews!,
                    {
                      ...review,
                      metadata: metaRes.data
                    }
                  ]);
                });
              } else {
                setError(reviewRes.data.message || metaRes.data.message);
              }
            } else {
              setError(bookRes.data.message);
            }
          })
        );
      } catch (error: any) {
        setError(error);
      }
      setIsLoading(false);
    })();
  }, []);

  return { data, isLoading, error };
};
