import { useEffect, useState } from "react";

import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import StarIcon from "@mui/icons-material/Star";

import axios from "axios";
import { useRouter } from "next/router";

import { bookComments, comments } from "@/mocks";
import { StyledButton } from "@/styles/components/Button";
import { StyledLinearProgress } from "@/styles/components/LinearProgress";
import { ReviewInfo } from "@/types/reviews";

import { Comment, NestedComment } from "../../Comment";
import { FallbackNode } from "../../FallbackNode";
import { StaticRating } from "../../Rating";

const BookRating = () => {
  // search book by its id to get its comments and ratings

  const theme = useTheme();
  const router = useRouter();
  const { bookId } = router.query;
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    (async () => {
      if (bookId) {
        const reviewsRes = await axios.get(`/api/books/${bookId}/reviews`);
        if (reviewsRes.data.success === true) {
          setReviews(reviewsRes.data.data);
        }
      }
    })();
  }, [bookId]);

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
                <StyledLinearProgress
                  variant="determinate"
                  value={10}
                  icon={StaticRating(1)}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <StyledLinearProgress
                  variant="determinate"
                  value={20}
                  icon={StaticRating(2)}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <StyledLinearProgress
                  variant="determinate"
                  value={60}
                  icon={StaticRating(3)}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <StyledLinearProgress
                  variant="determinate"
                  value={50}
                  icon={StaticRating(4)}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <StyledLinearProgress
                  variant="determinate"
                  value={90}
                  icon={StaticRating(5)}
                />
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
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h5">What do you think?</Typography>
          <StyledButton
            onClick={() => {
              router.push(`/books/${bookId}/review`);
            }}
          >
            Write a review
          </StyledButton>
        </Stack>
        <Divider />
        <Typography variant="h6">Community Reviews</Typography>

        <Paper>
          {reviews ? (
            reviews.map((review: ReviewInfo) => {
              return (
                <NestedComment
                  key={review.id}
                  id={review.id}
                  user={review.userId}
                  // authorAvatar={review?.authorAvatar}
                  rating={review?.rating}
                  content={review.review}
                  avatar={""}
                  reply={review.reply}
                />
              );
            })
          ) : (
            <FallbackNode>No reviews yet</FallbackNode>
          )}
        </Paper>
      </Stack>
    </Box>
  );
};

export default BookRating;
