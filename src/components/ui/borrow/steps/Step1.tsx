import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useTranslation } from "next-i18next";

import { ContentGroup } from "@/components/shared/ContentGroup";
import { StyledButton } from "@/styles/components/Button";

const Step1 = () => {
  const { t } = useTranslation("bookButtons");

  const isSuccess = true;
  const theme = useTheme();

  return (
    <ContentGroup title={t("stepRentTitle1") as string}>
      <Typography>{t("textRentNow4") as string}</Typography>
      {!isSuccess && (
        <>
          <Typography color={`${theme.palette.error.main}`}>
            {t("textRentNow2") as string}
          </Typography>
          <StyledButton>{t("textRentNow3") as string}</StyledButton>
        </>
      )}
    </ContentGroup>
  );
};

export default Step1;
