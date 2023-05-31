import { useEffect, useState } from "react";

import { Box, Divider, Grid, Stack, Typography } from "@mui/material";

import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import styles from "@styles/BookBanner.module.scss";
import axios from "axios";

import { useBookInfo } from "@/components/hooks/api";
import { useMetadata } from "@/components/hooks/web3";
import { truncate } from "@/utils/truncate";

type BookBannerProps = {
  tokenId: number;
  author: string;
  authorName?: string;
  description?: string;
  price?: number;
  onClick: () => void;
  genres?: string[];
  languages?: string[];
};

const BookBanner = ({
  tokenId,
  author,
  authorName,
  description,
  price,
  genres,
  languages,
  onClick
}: BookBannerProps) => {
  // const countDown = "7D:06:25:45";
  const { metadata } = useMetadata(tokenId);
  const [bookId, setBookId] = useState<string>();
  const bookInfo = useBookInfo(bookId as string)?.data;

  useEffect(() => {
    (async () => {
      const res = await axios.get(`/api/books/token/${tokenId}/bookId`);
      if (res.data.success === true) {
        const bookId = res.data.data;
        setBookId(bookId);
      }
    })();
  }, [tokenId]);

  return (
    <Box sx={{ cursor: "pointer" }} onClick={onClick}>
      <Grid
        className={styles["book-banner"]}
        sx={{
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${metadata?.data?.bookCover})`
        }}
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={4} sm={4} md={7}>
          <Box
            sx={{
              display: "inline-block",
              mb: 3
            }}
          >
            <Typography variant="h2" className={styles["book-banner__title"]}>
              {metadata?.data?.title}
            </Typography>
          </Box>
          <Typography variant="h5">{truncate(author, 6, -4)}</Typography>
          <Stack
            direction="row"
            spacing={2}
            my={2}
            className={styles["book-banner__meta"]}
          >
            <Stack direction="row" spacing={1}>
              <InsertDriveFileOutlinedIcon />
              <Typography>{metadata?.data?.fileType}</Typography>
            </Stack>
            {/* {meta.attributes?.map((stat, i) => (
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
            ))} */}
          </Stack>
          <Typography paragraph className="text-limit text-limit--5">
            {bookInfo?.description}
          </Typography>
          <Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <b>
                <u>Genres:</u>
              </b>
              <Stack
                direction="row"
                spacing={1}
                divider={
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      borderColor: "wheat"
                    }}
                  />
                }
              >
                {bookInfo?.genres.map((genre: string) => (
                  <Typography key={genre}>{genre}</Typography>
                ))}
              </Stack>
            </Stack>
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
          {/* <Stack spacing={3} alignItems="end">
            <Typography
              variant="h2"
              sx={{ pt: 1 }}
              className={styles["book-banner__countdown"]}
            >
              {countDown}
            </Typography>
            {countDown && <Typography>Register closing soon</Typography>}
          </Stack> */}

          {/* <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
            <Typography
              sx={{ textAlign: "end" }}
              className={styles["book-banner__open"]}
            >
              {isListing ? "Openning" : "Closed"}
            </Typography>
          </Box> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookBanner;
