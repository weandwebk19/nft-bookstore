import { Card, CardMedia } from "@mui/material";

import { styled } from "@mui/system";

type customVariant = "dome" | "invertedDome";

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "customVariant"
})<{ customVariant: customVariant }>(({ theme, customVariant = "dome" }) => ({
  ...(customVariant === "dome" && {
    maxWidth: "260px",
    backgroundColor: `${theme.palette.background.paper}`,
    color: `${theme.palette.text.primary}`,
    borderRadius: "10em 10em 5px 5px",
    outline: `1px solid ${theme.palette.background.paper}`,
    outlineOffset: 3,
    ".MuiCardMedia-root": {
      borderRadius: "10em 10em 5px 5px"
    },
    "&:hover": {
      backgroundColor: `${theme.palette.background.default}`,
      boxShadow: `0 0 50px 20px ${theme.palette.background.paper}`,
      ".MuiCardMedia-root": {
        outline: `1px solid ${theme.palette.background.paper}`
      }
    }
  }),
  ...(customVariant === "invertedDome" && {
    maxWidth: "260px",
    backgroundColor: `${theme.palette.background.paper}`,
    color: `${theme.palette.text.primary}`,
    borderRadius: "5px 5px 10em 10em",
    outline: `1px solid ${theme.palette.background.paper}`,
    outlineOffset: 3,
    ".MuiCardMedia-root": {
      borderRadius: "5px 5px 10em 10em"
    },
    "&:hover": {
      backgroundColor: `${theme.palette.background.default}`,
      boxShadow: `0 0 50px 20px ${theme.palette.background.paper}`,
      ".MuiCardMedia-root": {
        outline: `1px solid ${theme.palette.background.paper}`
      }
    }
  })
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  padding: "16px",
  outline: `1px solid ${theme.palette.background.default}`,
  outlineOffset: -12
}));

export { StyledCard, StyledCardMedia };
