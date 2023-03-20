import { useEffect, useMemo, useState } from "react";

import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import {
  BookBriefing,
  BookDetail
} from "@/components/shared/BookInfo/sections";
import BookPricingHistory from "@/components/shared/BookInfo/sections/BookPricingHistory";
import { BookList } from "@/components/shared/BookList";
import { ReadMore } from "@/components/shared/ReadMore";
import { bookList } from "@/mocks";
import { NftBookDetails } from "@/types/nftBook";

type BookInfoProps = {
  onClick?: () => void;
  bookDetail: NftBookDetails;
};

const BookInfo = ({ bookDetail }: BookInfoProps) => {
  const theme = useTheme();

  const [authorName, setAuthorName] = useState<string>("");
  const isOpenForSale = bookDetail?.listedCore ? true : false;
  const isOpenForTradeIn = false;
  const isOpenForBorrow = false;
  const isSold = bookDetail?.nftCore?.quantity > 0 ? false : true;
  console.log(bookDetail);
  const [isPublishedState, setIsPublishedState] = useState(false);

  useEffect(() => {
    setIsPublishedState(bookDetail?.listedCore ? true : false);
  }, [bookDetail?.listedCore]);

  const breadCrumbs: any[] = useMemo(() => {
    if (isPublishedState) {
      return [
        {
          content: "Publishing",
          href: "/publishing"
        },
        {
          content: bookDetail?.meta.title,
          href: `/books/${bookDetail?.bookId}`
        }
      ];
    }
    return [];
  }, [bookDetail]);

  useEffect(() => {
    (async () => {
      try {
        if (bookDetail && bookDetail?.nftCore) {
          const userRes = await axios.get(
            `/api/users/wallet/${bookDetail.nftCore?.author}`
          );

          if (userRes.data.success === true) {
            setAuthorName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [bookDetail]);

  return (
    <Box>
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
        <Grid item xs={4} sm={4} md={5}>
          <BookBriefing
            bookCover={bookDetail?.meta.bookCover}
            tokenId={bookDetail?.nftCore.tokenId}
            isOpenForSale={isOpenForSale}
            isOpenForTradeIn={isOpenForTradeIn}
            isOpenForBorrow={isOpenForBorrow}
            isSold={isSold}
            title={bookDetail?.meta.title}
            author={bookDetail?.nftCore.author}
            authorName={authorName}
            contractAddress={bookDetail?.info.contractAddress}
            bookSample={bookDetail?.meta.bookSample}
            price={bookDetail?.listedCore?.price}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={7} sx={{ pl: { sm: "0 !important" } }}>
          <Box
            sx={{
              p: 3,
              borderBottom: `1px solid ${theme.palette.primary.main}`,
              borderTop: `1px solid ${theme.palette.primary.main}`,
              borderRight: `1px solid ${theme.palette.primary.main}`,
              borderLeft: {
                xs: `1px solid ${theme.palette.primary.main}`,
                sm: 0
              }
            }}
          >
            {/* Description */}
            <Stack sx={{ maxWidth: "500px" }}>
              <Typography variant="label" mb={1}>
                Description:
              </Typography>
              {/* <>
              {details?.desc.split("\n").map((paragraph, i) => (
                <Typography key={i} gutterBottom>
                  {paragraph}
                </Typography>
              ))}
            </> */}
              {/* <ReadMore>{details!.desc}</ReadMore> */}

              <ReadMore>
                {bookDetail?.info.description
                  ?.split("\n")
                  .map((paragraph, i) => (
                    <Typography key={i} gutterBottom>
                      {paragraph}
                    </Typography>
                  ))}
              </ReadMore>
            </Stack>
          </Box>
          <Box>
            <Grid
              container
              columns={{ xs: 4, sm: 7, md: 7 }}
              sx={{
                borderBottom: `1px solid ${theme.palette.primary.main}`,
                borderRight: { sm: `1px solid ${theme.palette.primary.main}` },
                borderLeft: {
                  xs: `1px solid ${theme.palette.primary.main}`,
                  sm: 0
                }
              }}
            >
              <Grid
                item
                xs={4}
                sm={7}
                md={4}
                sx={{
                  borderRight: {
                    md: `1px solid ${theme.palette.primary.main}`,
                    sm: 0,
                    xs: `1px solid ${theme.palette.primary.main}`
                  },
                  borderBottom: {
                    xs: `1px solid ${theme.palette.primary.main}`,
                    sm: 0
                  }
                }}
                p={3}
              >
                <BookDetail
                  bookId={bookDetail?.bookId}
                  fileType={bookDetail?.meta.fileType}
                  totalPages={bookDetail?.info.totalPages}
                  languages={bookDetail?.info.languages}
                  genres={bookDetail?.info.genres}
                  version={bookDetail?.meta.version}
                  maxSupply={bookDetail?.meta.quantity}
                  publishingTime={bookDetail?.info.publishingTime}
                  owners={
                    bookDetail?.listedCore !== null
                      ? bookDetail?.listedCore?.seller
                      : bookDetail?.meta.author
                  }
                />
              </Grid>
              <Grid
                item
                xs={4}
                sm={8}
                md={3}
                p={3}
                sx={{
                  borderRight: {
                    xs: `1px solid ${theme.palette.primary.main}`,
                    sm: 0
                  }
                }}
              >
                <BookPricingHistory />
              </Grid>
            </Grid>
          </Box>
          <Box p={3}>
            <Typography variant="h5" gutterBottom>
              You may love
            </Typography>
            <BookList bookList={bookList} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookInfo;
