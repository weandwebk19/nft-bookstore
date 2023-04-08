import { Box, Divider, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useTranslation } from "next-i18next";

import { Logo } from "../Logo";

interface FallbackNodeProps {
  children?: React.ReactNode;
}

const FallbackNode = ({ children }: FallbackNodeProps) => {
  const { t } = useTranslation("fallback");
  const theme = useTheme();
  return (
    <Stack justifyContent="center" alignItems="center">
      <Divider sx={{ my: 3, width: "100%" }}>
        <Box
          sx={{
            p: 2,
            mb: 2,
            width: "100px",
            height: "100px",
            borderRadius: "10em",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            border: `1px double ${theme.palette.grey[500]}`,
            outline: `1px double ${theme.palette.primary.dark}`,
            outlineOffset: "3px"
          }}
        >
          <Logo />
        </Box>
      </Divider>
      <Typography variant="h6">*</Typography>
      {children}
      {!children && <Typography>{t("emptyMessage")}</Typography>}
      <Divider sx={{ my: 3, width: "50%" }} />
    </Stack>
  );
};

export default FallbackNode;
