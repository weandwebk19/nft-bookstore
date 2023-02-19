import { Box, Grid, Stack, Typography } from "@mui/material";

import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import styles from "@styles/BookBanner.module.scss";

import {
  NftBook,
  NftBookAttribute,
  NftBookCore,
  NftBookDetails,
  NftBookMeta
} from "@/types/nftBook";

// type NftBookDetailsForBanner = {
//   desc: NftBookDetails["desc"];
//   genres: NftBookDetails["genres"];
//   openDate: NftBookDetails["openDate"];
//   endDate: NftBookDetails["endDate"];
// };

// type BookBannerProps = {
//   onClick: () => void;
// } & NftBookMeta &
//   NftBookDetailsForBanner &
//   NftBookCore;

type BookBannerProps = {
  onClick: () => void;
} & NftBook;

const BookBanner = ({
  // bookCover,
  // title,
  // file,
  // attributes,
  // desc,
  // genres,
  // openDate,
  // endDate,
  meta,
  details,
  author,
  isListed,
  onClick
}: BookBannerProps) => {
  const countDown = "7D:06:25:45";

  return (
    <Box sx={{ cursor: "pointer" }} onClick={onClick}>
      <Grid
        className={styles["book-banner"]}
        sx={{
          backgroundSize: "cover",
          backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${meta.bookCover})`,
          backgroundRepeat: "no-repeat"
        }}
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={4} sm={4} md={7}>
          <Box sx={{ display: "inline-block", mb: 3 }}>
            <Typography variant="h2" className={styles["book-banner__title"]}>
              {meta.title}
            </Typography>
          </Box>
          <Typography variant="h5">{author}</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} my={2}>
            <Stack direction="row" spacing={1}>
              <InsertDriveFileOutlinedIcon />
              <Typography>{meta.file}</Typography>
            </Stack>
            {meta.attributes?.map((stat, i) => (
              <Stack key={i} direction="row" spacing={1}>
                {(() => {
                  switch (stat.statType) {
                    case "views":
                      return <VisibilityOutlinedIcon />;
                    case "registered":
                      return <PeopleAltOutlinedIcon />;
                    default:
                      return "";
                  }
                })()}
                <Typography>{stat.value}</Typography>
                <Typography>{stat.statType}</Typography>
              </Stack>
            ))}
          </Stack>
          <Typography paragraph className="text-limit text-limit--5">
            {details?.desc}
          </Typography>
          <Typography>
            <b>
              <u>Genres:</u>
            </b>
          </Typography>
          <Stack>
            {details?.genres.slice(0, 3).map((genre) => (
              <Typography key={genre}>{genre}</Typography>
            ))}
          </Stack>
        </Grid>
        <Grid
          item
          xs={4}
          sm={4}
          md={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <Stack spacing={3} alignItems="end">
            <Typography variant="h2" sx={{ pt: 1 }}>
              {countDown}
            </Typography>
            {countDown && <Typography>Register closing soon</Typography>}
          </Stack>
          <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
            <Typography
              sx={{ textAlign: "end" }}
              className={styles["book-banner__open"]}
            >
              {isListed ? "Openning" : "Closed"}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookBanner;
