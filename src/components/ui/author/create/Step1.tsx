import { Box, Stack, Typography } from "@mui/material";

import { InputController, TextAreaController } from "@shared/FormController";
import { useTranslation } from "next-i18next";

import { ContentGroup } from "@/components/shared/ContentGroup";
import { FormGroup } from "@/components/shared/FormGroup";

const Step1 = () => {
  const { t } = useTranslation("createBook");

  return (
    <ContentGroup title={t("titleStep1") as string}>
      <Box sx={{ my: 2 }}>
        <Typography variant="caption" className="form-label required">
          {t("required") as string}
        </Typography>
      </Box>
      <Stack direction="column" spacing={3}>
        <FormGroup label={t("bookTitle") as string} required>
          <InputController name="title" />
        </FormGroup>
        <FormGroup label={t("bookDesc") as string} required>
          <TextAreaController name="description" />
        </FormGroup>
      </Stack>
    </ContentGroup>
  );
};

export default Step1;
