import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: `${theme.palette.primary.main}`
  },
  "& .MuiRating-iconHover": {
    color: `${theme.palette.primary.light}`
  }
}));

export default StyledRating;
