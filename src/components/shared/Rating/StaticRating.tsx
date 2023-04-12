import { Stack, Typography } from "@mui/material";

import StarIcon from "@mui/icons-material/Star";

const StaticRating = (num: number, maxStars: number = 5) => {
  if (num <= 0 || num > maxStars)
    return <Typography>No ratings yet</Typography>;

  const activeStars = new Array(num);
  activeStars.fill(<StarIcon fontSize="inherit" />);

  const disableStars = new Array(maxStars - num);
  disableStars.fill(<StarIcon fontSize="inherit" color="disabled" />);

  const ratingStars = activeStars.concat(disableStars);

  return <Stack direction="row">{ratingStars.map((star) => star)}</Stack>;
};

export default StaticRating;
