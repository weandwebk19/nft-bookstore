import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Divider,
  Grid,
  LinearProgress,
  Link as MUILink,
  Stack,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StarIcon from "@mui/icons-material/Star";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { borderRadius } from "@mui/system";
import Link from "next/link";

import { useCountdown } from "@/components/hooks/common";
import { StyledButton } from "@/styles/components/Button";
import { StyledLinearProgress } from "@/styles/components/LinearProgress";

interface BookRatingProp {
  bookId: string;
}
const BookRating = ({ bookId }: BookRatingProp) => {
  // search book by its id to get its comments and ratings

  const bookComments = [
    {
      id: 1,
      avatar: "",
      username: "eye_deer",
      date: "6/20/2023",
      rating: 5,
      comment: `I found a lot of this book incredibly tedious. I tend to avoid the winners of the Man / Booker – they make me a little depressed. The only Carey I haven’t liked won the Booker (Oscar and Lucinda), I really didn’t like the little bit of Vernon God Little I read and I never finished The Sea despite really liking Banville’s writing. So, being told a book is a winner of the Booker tends to be a mark against it from the start, unfortunately.`
    },
    {
      id: 2,
      avatar: "",
      username: "owwwwwl",
      date: "6/20/2023",
      rating: 4,
      comment: `I found a lot of this book incredibly tedious. I tend to avoid the winners of the Man / Booker – they make me a little depressed. The only Carey I haven’t liked won the Booker (Oscar and Lucinda), I really didn’t like the little bit of Vernon God Little I read and I never finished The Sea despite really liking Banville’s writing. So, being told a book is a winner of the Booker tends to be a mark against it from the start, unfortunately.`
    },
    {
      id: 3,
      avatar: "",
      username: "froggy",
      date: "6/20/2023",
      rating: 4,
      comment: `I found a lot of this book incredibly tedious. I tend to avoid the winners of the Man / Booker – they make me a little depressed. The only Carey I haven’t liked won the Booker (Oscar and Lucinda), I really didn’t like the little bit of Vernon God Little I read and I never finished The Sea despite really liking Banville’s writing. So, being told a book is a winner of the Booker tends to be a mark against it from the start, unfortunately.`
    }
  ];

  const theme = useTheme();

  return (
    <Box component="section">
      <Stack spacing={3}>
        <Typography variant="h5" mb={1}>
          Reviews & Ratings
        </Typography>
        <Typography variant="label">Overview:</Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          <Box sx={{ width: "100%" }}>
            <Stack spacing={1}>
              <Box sx={{ width: "100%" }}>
                <StyledLinearProgress variant="determinate" value={10} />
              </Box>
              <Box sx={{ width: "100%" }}>
                <StyledLinearProgress variant="determinate" value={20} />
              </Box>
              <Box sx={{ width: "100%" }}>
                <StyledLinearProgress variant="determinate" value={60} />
              </Box>
              <Box sx={{ width: "100%" }}>
                <StyledLinearProgress variant="determinate" value={50} />
              </Box>
              <Box sx={{ width: "100%" }}>
                <StyledLinearProgress variant="determinate" value={90} />
              </Box>
            </Stack>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              borderRadius: "5px",
              border: `1px solid ${theme.palette.primary.main}`
            }}
          >
            <Typography variant="h2">4.9</Typography>
          </Box>
        </Stack>
        {/* {bookComments.map((comment) => (
          <Box key={comment.id}>
            <Comment
              avatar={comment.avatar}
              username={comment.username}
              date={comment.date}
              rating={comment.rating}
              comment={comment.comment}
            />
          </Box>
        ))} */}
      </Stack>
    </Box>
  );
};

export default BookRating;
