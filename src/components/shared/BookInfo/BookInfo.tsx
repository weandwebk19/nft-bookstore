import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import {
  useBookHistories,
  useBookInfo,
  usePricingHistory
} from "@/components/hooks/api";
import {
  BookBriefing,
  BookDetail,
  BookRating
} from "@/components/shared/BookInfo/sections";
import { BookList } from "@/components/shared/BookList";
import { ReadMore } from "@/components/shared/ReadMore";

import { FallbackNode } from "../FallbackNode";
import BookActivities from "./sections/BookActivities";
import BookListing from "./sections/BookListing";
import BookPricingHistory from "./sections/BookPricingHistory";

const BookInfo = () => {
  const { t } = useTranslation("bookDetail");
  const router = useRouter();
  const { bookId } = router.query;
  const bookInfo = useBookInfo(bookId as string);
  const theme = useTheme();
  // const bookHistories = useBookHistories(bookId as string);
  // console.log("bookHistories", bookHistories);

  // const isOpenForPurchase = false;
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
          <Grid container columns={{ xm: 1, md: 9 }}>
            <Grid
              item
              xs={1}
              md={9}
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
                },
                width: "100%"
              }}
              p={3}
            >
              <BookDetail />
            </Grid>
            <Grid
              item
              xs={1}
              md={9}
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
                },
                width: "100%"
              }}
              p={3}
            >
              <BookPricingHistory />
            </Grid>
            <Grid
              item
              xs={1}
              md={9}
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
                },
                width: "100%"
              }}
              p={3}
            >
              <BookActivities />
            </Grid>
          </Grid>
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
