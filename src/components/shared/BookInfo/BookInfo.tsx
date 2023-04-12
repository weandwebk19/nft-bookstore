import { useEffect, useMemo, useState } from "react";

import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import axios from "axios";
import { useTranslation } from "next-i18next";

import {
  BookBriefing,
  BookDetail,
  BookRating
} from "@/components/shared/BookInfo/sections";
import BookPricingHistory from "@/components/shared/BookInfo/sections/BookPricingHistory";
import { BookList } from "@/components/shared/BookList";
import { ReadMore } from "@/components/shared/ReadMore";
import { bookList } from "@/mocks";
import { NftBookDetails } from "@/types/nftBook";

import BookListActionable from "./sections/BookListActionable";

type BookInfoProps = {
  onClick?: () => void;
  bookDetail?: NftBookDetails;
};

const BookInfo = ({ bookDetail }: BookInfoProps) => {
  const { t } = useTranslation("bookDetail");

  const theme = useTheme();

  const isOpenForPurchase = false;
  const isOpenForBorrow = false;
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

  const bookListActionable = [
    {
      id: "1",
      price: 0.75,
      owner: "Tho Le"
    },
    {
      id: "2",
      price: 3.54,
      owner: "Nhat Nguyen"
    },
    {
      id: "3",
      price: 2.84,
      owner: "Cao Le"
    },
    {
      id: "4",
      price: 1.58,
      owner: "Vinh Tran"
    },
    {
      id: "5",
      price: 2.33,
      owner: "Hoa Phan"
    }
  ];

  return (
    <Box>
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
        <Grid item xs={4} sm={4} md={5}>
          <BookBriefing bookDetail={bookDetail} />
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
                {t("description")}:
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
            <Box
              sx={{
                borderRight: {
                  md: `1px solid ${theme.palette.primary.main}`,
                  sm: 0,
                  xs: `1px solid ${theme.palette.primary.main}`
                },
                borderBottom: {
                  md: `1px solid ${theme.palette.primary.main}`,
                  sm: 0,
                  xs: `1px solid ${theme.palette.primary.main}`
                },
                borderLeft: {
                  md: 0,
                  sm: 0,
                  xs: `1px solid ${theme.palette.primary.main}`
                }
              }}
              p={3}
            >
              <BookDetail
                bookId={bookDetail?.bookId!}
                fileType={bookDetail?.meta.fileType!}
                totalPages={bookDetail?.info.totalPages}
                languages={bookDetail?.info.languages!}
                genres={bookDetail?.info.genres!}
                version={bookDetail?.meta.version!}
                maxSupply={bookDetail?.meta.quantity!}
                publishingTime={new Date(bookDetail?.meta.createdAt!)}
                owners={
                  bookDetail?.listedCore !== null
                    ? bookDetail?.listedCore?.seller!
                    : bookDetail?.meta.author!
                }
              />
            </Box>
          </Box>
          {/* {(isOpenForTradeIn || isOpenForBorrow) && ( */}
          {(true || isOpenForBorrow) && (
            <Box
              sx={{
                p: 3,
                borderBottom: `1px solid ${theme.palette.primary.main}`,
                borderRight: `1px solid ${theme.palette.primary.main}`,
                borderLeft: {
                  xs: `1px solid ${theme.palette.primary.main}`,
                  sm: 0
                }
              }}
            >
              <BookListActionable
                isOpenForPurchase={true}
                // isOpenForTradeIn={isOpenForTradeIn}
                isOpenForBorrow={isOpenForBorrow}
                bookListActionable={bookListActionable}
              />
            </Box>
          )}
          <Box
            sx={{
              p: 3,
              borderBottom: `1px solid ${theme.palette.primary.main}`,
              borderRight: `1px solid ${theme.palette.primary.main}`,
              borderLeft: {
                xs: `1px solid ${theme.palette.primary.main}`,
                sm: 0
              }
            }}
          >
            <BookRating bookId={bookDetail?.bookId!} />
          </Box>
          <Box
            sx={{
              p: 3,
              borderBottom: `1px solid ${theme.palette.primary.main}`,
              borderRight: `1px solid ${theme.palette.primary.main}`,
              borderLeft: {
                xs: `1px solid ${theme.palette.primary.main}`,
                sm: 0
              }
            }}
          >
            <Typography variant="h5" gutterBottom>
              {t("recommended")}
            </Typography>
            <BookList bookList={bookList} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookInfo;
