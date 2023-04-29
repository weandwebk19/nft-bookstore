import { Box, Grid, Stack, Typography } from "@mui/material";

import {
  AttachmentController,
  TextAreaController,
  TextFieldController
} from "@shared/FormController";
import { useTranslation } from "next-i18next";

import { ContentGroup } from "@/components/shared/ContentGroup";
import { FormGroup } from "@/components/shared/FormGroup";
import formatBytes from "@/utils/formatBytes";

interface Step2Props {
  isLoading?: boolean;
}

const MAXIMUM_ATTACHMENTS_SIZE = 100000000;

const Step2 = ({ isLoading }: Step2Props) => {
  const { t } = useTranslation("authorRequest");

  return (
    <ContentGroup title={t("titleStep2") as string}>
      <Box sx={{ my: 2 }}>
        <Typography variant="caption" className="form-label required">
          {t("required") as string}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormGroup label={t("pseudonym") as string} required>
            <TextFieldController name="pseudonym" readOnly={isLoading} />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup label={t("about") as string}>
            <TextAreaController name="about" readOnly={isLoading} />
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormGroup label={t("email") as string} required>
            <TextFieldController name="email" />
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormGroup label={t("phoneNumber") as string} required>
            <TextFieldController
              name="phoneNumber"
              onChange={(e) => {
                e.target.value = e.target.value.trim();
              }}
              readOnly={isLoading}
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup label={t("idDocument") as string} required>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 3 }}
              sx={{ width: "100%" }}
            >
              <AttachmentController
                name="frontDocument"
                desc={`${t("descAttachment1") as string} ${formatBytes(
                  MAXIMUM_ATTACHMENTS_SIZE
                )}`}
                readOnly={isLoading}
              />
              <AttachmentController
                name="backDocument"
                desc={`${t("descAttachment1") as string} ${formatBytes(
                  MAXIMUM_ATTACHMENTS_SIZE
                )}`}
                readOnly={isLoading}
              />
            </Stack>
          </FormGroup>
        </Grid>
      </Grid>
    </ContentGroup>
  );
};

export default Step2;
