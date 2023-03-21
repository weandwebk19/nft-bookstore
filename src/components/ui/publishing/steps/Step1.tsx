import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { InputController, TextAreaController } from "@shared/FormController";
import { useTranslation } from "next-i18next";

import { ContentGroup } from "@/components/shared/ContentGroup";
import { StyledButton } from "@/styles/components/Button";

const Step1 = () => {
  const isSuccess = true;
  const theme = useTheme();
  return (
    <ContentGroup title="Checking your balance">
      <Typography>Not implement yet. Click Next</Typography>
      {!isSuccess && (
        <>
          <Typography color={`${theme.palette.error.main}`}>
            Failed, please make sure your balance is enough to make a transfer!
          </Typography>
          <StyledButton>Try again</StyledButton>
        </>
      )}
    </ContentGroup>
  );
};

export default Step1;
