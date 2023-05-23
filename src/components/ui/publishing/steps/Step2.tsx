import { Typography } from "@mui/material";
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
    <ContentGroup title={t("stepBuyTitle2") as string}>
      {/* Waiting for your signing... */}
      <FormGroup label={t("amount") as string} required>
        <NumericStepperController name="amount" />
      </FormGroup>
      <Typography sx={{ marginTop: "8px" }}>
        {supplyAmount} {t("left") as string}
      </Typography>
      {!isSuccess && (
        <>
          <Typography color={`${theme.palette.error.main}`}>
            {t("textBuyNow2") as string}
          </Typography>
        </>
      )}
    </ContentGroup>
  );
};

export default Step2;
