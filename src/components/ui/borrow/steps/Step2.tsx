import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import {
  InputController,
  NumericStepperController,
  TextAreaController
} from "@shared/FormController";
import { useTranslation } from "next-i18next";

import { ContentGroup } from "@/components/shared/ContentGroup";
import { FormGroup } from "@/components/shared/FormGroup";
import { StyledButton } from "@/styles/components/Button";

const Step2 = () => {
  const isSuccess = true;
  const theme = useTheme();
  return (
    <ContentGroup title="Confirm purchase">
      {/* Waiting for your signing... */}
      <FormGroup label="Amount" required>
        <NumericStepperController name="amount" />
      </FormGroup>
      <FormGroup label="Number of rental days" required>
        <NumericStepperController name="rentalDays" />
      </FormGroup>
      <Typography>198 left</Typography>
      {!isSuccess && (
        <>
          <Typography color={`${theme.palette.error.main}`}>
            Failed, please make sure your balance is enough to make a transfer!
          </Typography>
        </>
      )}
    </ContentGroup>
  );
};

export default Step2;
