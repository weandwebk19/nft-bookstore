import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { useBookInfo } from "@/components/hooks/api";
import {
  BookBriefing,
  BookDetail,
  BookRating
} from "@/components/shared/BookInfo/sections";
import { BookList } from "@/components/shared/BookList";
import { ReadMore } from "@/components/shared/ReadMore";

import { FallbackNode } from "../FallbackNode";
import BookListing from "./sections/BookListing";

const BookInfo = () => {
  const { t } = useTranslation("bookDetail");
  const router = useRouter();
  const { bookId, seller } = router.query;
  const bookInfo = useBookInfo(bookId as string);
  // const { bookDetail } = useBookDetail(bookId as string, seller as string);
  const theme = useTheme();

  const isOpenForPurchase = false;
  // const [isPublishedState, setIsPublishedState] = useState(false);

  // useEffect(() => {
  //   setIsPublishedState(bookDetail?.listedCore ? true : false);
  // }, [bookDetail?.listedCore]);

  // const breadCrumbs: any[] = useMemo(() => {
  //   if (isPublishedState) {
  //     return [
  //       {
  //         content: "Publishing",
  //         href: "/publishing"
  //       },
  //       {
  //         content: bookDetail?.meta.title,
  //         href: `/books/${bookDetail?.bookId}`
  //       }
  //     ];
  //   }
  //   return [];
  // }, [bookDetail]);

  // const bookListActionable = [
  //   {
  //     id: "1",
  //     price: 0.75,
  //     owner: "Tho Le"
  //   },
  //   {
  //     id: "2",
  //     price: 3.54,
  //     owner: "Nhat Nguyen"
  //   },
  //   {
  //     id: "3",
  //     price: 2.84,
  //     owner: "Cao Le"
  //   },
  //   {
  //     id: "4",
  //     price: 1.58,
  //     owner: "Vinh Tran"
  //   },
  //   {
  //     id: "5",
  //     price: 2.33,
  //     owner: "Hoa Phan"
  //   }
  // ];

  // const sellPricingHistory = usePricingHistory(bookDetail?.bookId!, "SELL");
  // const lendPricingHistory = usePricingHistory(bookDetail?.bookId!, "LEND");
  // const sharePricingHistory = usePricingHistory(bookDetail?.bookId!, "SHARE");
  // console.log("sellPricingHistory", sellPricingHistory);
  // console.log("lendPricingHistory", lendPricingHistory);
  // console.log("sharePricingHistory", sharePricingHistory);

  return (
    <Box>
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
        <Grid item xs={4} sm={4} md={5}>
          <BookBriefing />
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

              {(() => {
                if (bookInfo.isLoading) {
                  return (
                    <Typography>{t("loadingMessage") as string}</Typography>
                  );
                } else if (bookInfo?.data?.length === 0 || bookInfo.error) {
                  return <FallbackNode />;
                }
                return (
                  <ReadMore>
                    {bookInfo.data?.description
                      ?.split("\n")
                      .map((paragraph: any, i: any) => (
                        <Typography key={i} gutterBottom>
                          {paragraph}
                        </Typography>
                      ))}
                  </ReadMore>
                );
              })()}
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
              <BookDetail />
            </Box>
          </Box>
          <BookListing />
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
            <BookRating />
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
            <BookList />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookInfo;
