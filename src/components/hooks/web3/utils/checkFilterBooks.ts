import axios from "axios";
import { BigNumber, ethers } from "ethers";

import { BookRentingContract } from "@/types/BookRentingContract";
import { BookSellingContract } from "@/types/BookSellingContract";
import { BookSharingContract } from "@/types/BookSharingContract";
import { BookStoreContract } from "@/types/BookStoreContract";
import { FilterField } from "@/types/filter";
import { BookInfo } from "@/types/nftBook";

export const checkFilterBooks = async (
  tokenId: BigNumber,
  price: BigNumber | undefined,
  contract: BookStoreContract,
  queryString: FilterField
) => {
  let isGenrePass = true,
    isTitlesPass = true,
    isRatingPass = true,
    isPricePass = true,
    isLanguagesPass = true,
    isAuthorPass = true;
  const bookInfoRes = await (
    await axios.get(`/api/books/token/${tokenId}`)
  ).data;

  const tokenURI = await contract!.getUri(tokenId);
  const metaRes = await (
    await axios.get(`/api/pinata/metadata?nftUri=${tokenURI}`)
  ).data;

  // genre check
  if (queryString.genre && queryString.genre.length > 0) {
    const bookGenresRes = await (
      await axios.get(`/api/books/token/${tokenId}/genres`)
    ).data;

    if (bookGenresRes?.success === true) {
      const bookGenres = bookGenresRes.data;
      if (
        !bookGenres.some((item: any) =>
          queryString.genre.includes(item.genre_id)
        )
      ) {
        isGenrePass = false;
      }
    }
  }
  // title check
  if (
    queryString.title !== "" &&
    !metaRes.data?.title.includes(queryString.title)
  ) {
    isTitlesPass = false;
  }
  // TODO: rating check
  if (queryString.rating !== "") {
    if (bookInfoRes?.success === true) {
      const bookInfo = bookInfoRes.data as BookInfo;
      const reviewRes = await axios.get(`/api/reviews/book/${bookInfo.id}`);
      if (
        reviewRes.data.success === true &&
        parseInt(reviewRes.data.data.rating) < parseInt(queryString.rating)
      ) {
        isRatingPass = false;
      }
    }
  }

  // price check
  if (price) {
    const priceCheck = parseFloat(ethers.utils.formatEther(price));
    if (
      priceCheck <
        parseFloat(queryString.priceRange ? queryString.priceRange[0] : "") ||
      priceCheck >
        parseFloat(queryString.priceRange ? queryString.priceRange[1] : "")
    ) {
      isPricePass = false;
    }
  }

  // language check
  if (queryString.language !== "") {
    if (bookInfoRes?.success === true) {
      const bookInfo = bookInfoRes.data as BookInfo;
      if (!bookInfo.languages.includes(queryString.language as string)) {
        isLanguagesPass = false;
      }
    }
  }

  // TODO: author check
  if (queryString.author !== "") {
    const author = queryString.author;
    if (!metaRes?.data.author.includes(author)) {
      isAuthorPass = false;
    }
  }

  if (
    isGenrePass &&
    isTitlesPass &&
    isRatingPass &&
    isPricePass &&
    isLanguagesPass &&
    isAuthorPass
  ) {
    return true;
  } else {
    return false;
  }
};
