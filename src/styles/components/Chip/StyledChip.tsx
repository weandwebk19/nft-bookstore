import { Chip } from "@mui/material";

import { styled } from "@mui/system";

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "background"
})<{
  background?: string;
}>(({ theme, background }) => ({
  color: `${theme.palette.common.white}`,
  backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url(${background}) !important`
}));

export default StyledChip;
