import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import StarIcon from "@mui/icons-material/Star";

import { bookComments } from "@/mocks";
import { StyledLinearProgress } from "@/styles/components/LinearProgress";

import { Comment } from "../../Comment";
import { StaticRating } from "../../Rating";

interface BookRatingProp {
  bookId: string;
}
const BookRating = ({ bookId }: BookRatingProp) => {
  // search book by its id to get its comments and ratings

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
        {bookComments.map((comment) => (
          <Box key={comment.id}>
            <Comment
              avatar={comment.avatar}
              username={comment.username}
              date={comment.date}
              rating={comment.rating}
              comment={comment.comment}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default BookRating;
