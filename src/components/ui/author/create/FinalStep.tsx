import { Box, FormGroup, Link, Stack, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";

import { ContentGroup } from "@/components/shared/ContentGroup";
import { CheckboxController } from "@/components/shared/FormController";

const FinalStep = () => {
  const { t } = useTranslation("createBook");

  return (
    <ContentGroup title={t("titleStep4") as string}>
      <Box sx={{ my: 2 }}>
        <Typography variant="caption" className="form-label required">
          {t("termsAndConditions1") as string}{" "}
          <i>{t("termsAndConditions2") as string}</i>{" "}
          {t("termsAndConditions3") as string}{" "}
          <i>{t("termsAndConditions4") as string}</i>
        </Typography>
      </Box>
      <Stack direction="column" spacing={3}>
        <FormGroup>
          <CheckboxController
            name="termsOfService"
            label={
              <>
                {t("termsOfService1") as string}{" "}
                <Link href="/term-and-conditions">
                  {t("termsOfService2") as string}
                </Link>
              </>
            }
          />
        </FormGroup>
        <FormGroup>
          <CheckboxController
            name="privacyPolicy"
            label={
              <>
                {t("privacyPolicy1") as string}{" "}
                <Link href="/privacy-policy">
                  {t("privacyPolicy2") as string}
                </Link>
              </>
            }
          />
        </FormGroup>
      </Stack>
    </ContentGroup>
  );
};

export default FinalStep;
