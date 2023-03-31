import { Button } from "@mui/material";

import { styled } from "@mui/system";

type customVariant = "primary" | "secondary";

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== "width" && prop !== "customVariant" && prop !== "customColor"
})<{
  width?: string | number;
  customVariant?: customVariant;
  component?: string;
  customColor?: string;
}>(({ theme, customVariant = "primary", width, customColor }) => ({
  ...(customVariant === "primary" && {
    "&:hover": {
      backgroundColor: `${theme.palette.primary.light}`
    },
    backgroundColor: `${theme.palette.primary.main}`,
    color: `${theme.palette.primary.contrastText}`,
    outline: ` 1px solid ${theme.palette.primary.main}`,
    outlineOffset: 3
  }),
  ...(customVariant === "secondary" && {
    "&:hover": {
      border: `1px solid ${theme.palette.primary.light}`,
      color: `${theme.palette.primary.light}`
    },
    backgroundColor: "none",
    color: `${theme.palette.primary.main}`,
    border: `1px solid ${theme.palette.primary.main}`
  }),
  ...(width == 100 && {
    width: "100%"
  }),
  ...(customColor === "light" && {
    "&:hover": {
      border: `1px solid ${theme.palette.common.white}`,
      color: `${theme.palette.common.white}`
    },
    backgroundColor: `${theme.palette.common.white}`,
    color: `${theme.palette.common.black}`,
    outline: ` 1px solid ${theme.palette.common.white}`
  }),
  ...(customVariant === "secondary" &&
    customColor === "light" && {
      "&:hover": {
        border: `1px solid ${theme.palette.common.white}`,
        color: `${theme.palette.common.white}`
      },
      backgroundColor: "none",
      color: `${theme.palette.common.white}`,
      border: `1px solid ${theme.palette.common.white}`
    })
}));

export default StyledButton;
