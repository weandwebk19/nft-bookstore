import { AppBar } from "@mui/material";

import { styled } from "@mui/system";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  color: `${theme.palette.primary.main}`,
  backgroundColor: `${theme.palette.background.appbar}`,
  padding: `0 ${theme.spacing(2)}`,
  position: "fixed",
  boxShadow: `0 0 3px ${theme.palette.background.paper}`,
  backdropFilter: "blur(8px)"
}));

export default StyledAppBar;
