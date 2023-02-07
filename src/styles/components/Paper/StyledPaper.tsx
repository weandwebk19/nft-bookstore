import { Paper } from "@mui/material";

import { styled } from "@mui/system";

const StyledPaper = styled(Paper)(({ theme }) => ({
  outline: `10px solid ${theme.palette.common.white}`,
}));

export default StyledPaper;
