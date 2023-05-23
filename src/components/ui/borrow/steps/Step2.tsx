import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { NumericStepperController } from "@shared/FormController";
import { useTranslation } from "next-i18next";

import { ContentGroup } from "@/components/shared/ContentGroup";
import { FormGroup } from "@/components/shared/FormGroup";

type Step2Props = {
  supplyAmount: number | undefined;
};
const Step2 = ({ supplyAmount }: Step2Props) => {
  const { t } = useTranslation("bookButtons");

  const isSuccess = true;
  const theme = useTheme();

  return (
    <ContentGroup title={t("stepRentTitle2") as string}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Box sx={{ width: "100%" }}>
          <FormGroup label={t("amount") as string} required>
            <NumericStepperController name="amount" />
          </FormGroup>
          <Typography>
            {supplyAmount} {t("left") as string}
          </Typography>
        </Box>
        <FormGroup label={t("rentalDays") as string} required>
          <NumericStepperController name="rentalDays" />
        </FormGroup>
      </Stack>

      {!isSuccess && (
        <>
          <Typography color={`${theme.palette.error.main}`}>
            {t("textRentNow2") as string}
          </Typography>
        </>
      )}
    </ContentGroup>
  );
};

export default Step2;
