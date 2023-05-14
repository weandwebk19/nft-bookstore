import { CryptoHookFactory } from "@_types/hooks";
import axios from "axios";
import useSWR from "swr";

import { BookInfoInDB } from "@/types/nftBook";
import { ReviewInfo, ReviewRowData } from "@/types/reviews";

import { useAccount } from ".";

type ReviewsManagementHookFactory = CryptoHookFactory<ReviewRowData[]>;

export type UseReviewsManagementHook = ReturnType<ReviewsManagementHookFactory>;

export const hookFactory: ReviewsManagementHookFactory =
  ({ bookStoreContract }) =>
  () => {
    const { account } = useAccount();
    const { data, ...swr } = useSWR(
      [bookStoreContract ? "web3/useReviewsManagement" : null, account.data],
      async () => {
        const booksRes = await axios.get(
          `/api/users/wallet/${account.data}/created-books`
        );

        if (booksRes.data.success === true) {
          const reviews = [] as ReviewRowData[];

          const createdBooks: BookInfoInDB[] = booksRes.data.data;
          for (let i = 0; i < createdBooks.length; i++) {
            const item: BookInfoInDB = createdBooks[i];
            // get metadata
            const tokenURI = await bookStoreContract!.getUri(item.tokenId);
            const metaRes = await (
              await axios.get(`/api/pinata/metadata?nftUri=${tokenURI}`)
            ).data;
            // get user Info
            const userRes = await (
              await axios.get(`/api/users/wallet/${account.data}`)
            ).data;
            const reviewRes = await axios.get(`/api/books/${item.id}/reviews`);

            if (
              reviewRes.data.success == true &&
              metaRes.success === true &&
              userRes.success === true
            ) {
              reviewRes.data.data?.map((review: ReviewInfo) => {
                reviews.push({
                  id: review.id,
                  avatar: userRes?.data?.avatar,
                  username: userRes?.data?.fullname,
                  date: review.createdAt,
                  rating: review.rating,
                  title: metaRes?.data?.title,
                  bookCover: metaRes?.data?.bookCover,
                  comment: review.review,
                  reply: review.reply
                });
              });
            }
          }

          return reviews;
        } else {
          return [];
        }
      }
    );

    return {
      ...swr,
      data: data
    };
  };
