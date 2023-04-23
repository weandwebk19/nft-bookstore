import axios from "axios";
import { BigNumber, ethers } from "ethers";

import { BookStoreContract } from "@/types/BookStoreContract";
import { FilterField } from "@/types/filter";
import { BookInfo } from "@/types/nftBook";

export const checkFilterBooks = async (
  tokenId: BigNumber,
  price: BigNumber,
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
    if (bookInfoRes?.success === true) {
      const bookInfo = bookInfoRes.data as BookInfo;
      if (!bookInfo.genres.some((item) => queryString.genre?.includes(item))) {
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

  // price check
  const priceCheck = parseFloat(ethers.utils.formatEther(price));
  if (
    priceCheck <
      parseFloat(queryString.priceRange ? queryString.priceRange[0] : "") ||
    priceCheck >
      parseFloat(queryString.priceRange ? queryString.priceRange[1] : "")
  ) {
    isPricePass = false;
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
