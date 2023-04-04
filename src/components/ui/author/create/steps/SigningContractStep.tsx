import { Box, Stack, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { useTranslation } from "next-i18next";

interface SigningContractStepProps {
  message?: string;
}

const SigningContractStep = ({ message = "" }: SigningContractStepProps) => {
  const { t } = useTranslation("createBook");
  message = t("waitingForSigning");

  return (
    <Box
      sx={{
        mt: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
      }}
    >
      <CircularProgress sx={{ mb: 3 }} />
      <Typography>{message}</Typography>
    </Box>
  );
};

export default SigningContractStep;
