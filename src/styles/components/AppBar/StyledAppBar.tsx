import { AppBar } from "@mui/material";

import { styled } from "@mui/system";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  color: `${theme.palette.primary.main}`,
  backgroundColor: "transparent",
  padding: `0 ${theme.spacing(2)}`,
  position: "fixed",
  boxShadow: "none",
  backdropFilter: "blur(8px)",
}));

export default StyledAppBar;
