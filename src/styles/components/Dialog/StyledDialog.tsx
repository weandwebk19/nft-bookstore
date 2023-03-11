import { Dialog, DialogTitle } from "@mui/material";

import { styled } from "@mui/system";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  backdropFilter: "blur(5px)",
  "& .MuiPaper-root": {
    outline: `3px double ${theme.palette.background.paper}`,
    outlineOffset: 5
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: `${theme.palette.background.default}`,
  pd: 3
}));

export { StyledDialog, StyledDialogTitle };
