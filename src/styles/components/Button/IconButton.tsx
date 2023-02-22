import { IconButton } from "@mui/material";

import { styled } from "@mui/system";

type customVariant = "primary" | "secondary";

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "width" && prop !== "customVariant"
})<{ width?: string | number; customVariant: customVariant }>(
  ({ theme, customVariant = "primary", width }) => ({
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
    })
  })
);

export default StyledIconButton;
