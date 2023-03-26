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
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Box sx={{ width: "100%" }}>
          <FormGroup label="Amount" required>
            <NumericStepperController name="amount" />
          </FormGroup>
          <Typography>198 left</Typography>
        </Box>
        <FormGroup label="Number of rental days" required>
          <NumericStepperController name="rentalDays" />
        </FormGroup>
      </Stack>

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
