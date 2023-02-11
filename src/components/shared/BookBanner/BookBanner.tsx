import { Box, Grid, Stack, Typography } from "@mui/material";

import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { BookGenres, BookItemProps } from "@_types/bookItem";
import styles from "@styles/BookBanner.module.scss";

type BookStatistics = {
  view: number;
  register?: number | 0;
  owners?: number | 0;
};

type BookBannerProps = {
  statistics: any[] | [];
  desc: string;
  price?: string | number;
  countdown?: string;
  isOpen?: boolean;
  genres: string[];
} & BookItemProps;

const BookBanner = ({
  bookCover,
  title,
  author,
  type,
  statistics,
  desc,
  genres,
  countdown,
  isOpen,
  onClick
}: BookBannerProps) => {
  return (
    <Box sx={{ cursor: "pointer" }} onClick={onClick}>
      <Grid
        className={styles["book-banner"]}
        sx={{
          backgroundSize: "cover",
          backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${bookCover})`,
          backgroundRepeat: "no-repeat"
        }}
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={4} sm={4} md={7}>
          <Box sx={{ display: "inline-block", mb: 3 }}>
            <Typography variant="h2" className={styles["book-banner__title"]}>
              {title}
            </Typography>
          </Box>
          <Typography variant="h5">{author}</Typography>
          <Stack direction="row" spacing={2} my={2}>
            <Stack direction="row" spacing={1}>
              <InsertDriveFileOutlinedIcon />
              <Typography>{type}</Typography>
            </Stack>
            {statistics?.map((stat, i) => (
              <Stack key={i} direction="row" spacing={1}>
                {(() => {
                  switch (stat.content) {
                    case "views":
                      return <VisibilityOutlinedIcon />;
                    case "registered":
                      return <PeopleAltOutlinedIcon />;
                    default:
                      return "";
                  }
                })()}
                <Typography>{stat.value}</Typography>
                <Typography>{stat.content}</Typography>
              </Stack>
            ))}
          </Stack>
          <Typography paragraph className="text-limit text-limit--5">
            {desc}
          </Typography>
          <Typography>
            <b>
              <u>Genres:</u>
            </b>
          </Typography>
          <Stack>
            {genres?.slice(0, 3).map((genre) => (
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
              {countdown}
            </Typography>
            {countdown && <Typography>Register closing soon</Typography>}
          </Stack>
          <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
            <Typography
              sx={{ textAlign: "end" }}
              className={styles["book-banner__open"]}
            >
              {isOpen ? "Openning" : "Closed"}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookBanner;
