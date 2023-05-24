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
  const [ratings, setRatings] = useState(new Array<number>(5).fill(0));
  const [ratingAvg, setRatingAvg] = useState<string>();

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

  useEffect(() => {
    let ratings = new Array<number>(5).fill(0);
    reviews?.forEach((review: any) => {
      ratings[review.rating - 1] += 1;
    });
    setRatings(ratings);
    let sum: number = 0;
    ratings.forEach((rating: number) => {
      sum += rating;
    });
    setRatingAvg((sum / 5).toFixed(2));
  }, [reviews]);

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
                  value={ratings[0]}
                  icon={StaticRating(1)}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <StyledLinearProgress
                  variant="determinate"
                  value={ratings[1]}
                  icon={StaticRating(2)}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <StyledLinearProgress
                  variant="determinate"
                  value={ratings[2]}
                  icon={StaticRating(3)}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <StyledLinearProgress
                  variant="determinate"
                  value={ratings[3]}
                  icon={StaticRating(4)}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <StyledLinearProgress
                  variant="determinate"
                  value={ratings[4]}
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
            <Typography variant="h2">{ratingAvg}</Typography>
          </Box>
        </Stack>
        {/* <Stack alignItems="center" spacing={2}>
          <Typography variant="h5">What do you think?</Typography>
          <StyledButton
            onClick={() => {
              router.push(`/books/${bookId}/review`);
            }}
          >
            Write a review
          </StyledButton>
        </Stack> */}
        <Divider />
        <Typography variant="h6">Community Reviews</Typography>

        <Paper>
          {reviews.length > 0 ? (
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
                  date={review.createdAt}
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
