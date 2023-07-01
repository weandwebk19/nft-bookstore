import { Box, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
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

import BookActivities from "./sections/BookActivities";
import BookDescription from "./sections/BookDescription";
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
        <Grid
          item
          xs={4}
          sm={4}
          md={4}
          className="hide-scrollbar"
          sx={{
            position: "sticky",
            top: 64,
            overflowY: { sm: "scroll" },
            height: "100%"
          }}
        >
          <Paper sx={{ p: 3 }}>
            <BookBriefing />
          </Paper>
        </Grid>
        <Grid item xs={4} sm={4} md={8} sx={{ mt: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Stack divider={<Divider />} spacing={3}>
              <BookDescription />

              <BookDetail />

              <BookPricingHistory />

              <BookActivities />

              <BookListing />

              <BookRating />

              <Box>
                <Typography variant="h5" gutterBottom>
                  {t("recommended")}
                </Typography>
                <BookList />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookInfo;
