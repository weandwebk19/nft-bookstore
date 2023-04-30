import { Box, Grid, Typography } from "@mui/material";

import {
  TextAreaController,
  TextFieldController
} from "@shared/FormController";
import { useTranslation } from "next-i18next";

import { ContentGroup } from "@/components/shared/ContentGroup";
import { FormGroup } from "@/components/shared/FormGroup";

interface Step2Props {
  isLoading?: boolean;
}

const Step2 = ({ isLoading }: Step2Props) => {
  const { t } = useTranslation("profile");

  return (
    <ContentGroup title={t("titleStep2") as string}>
      <Box sx={{ my: 2 }}>
        <Typography variant="caption" className="form-label required">
          {t("required") as string}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormGroup label={t("username") as string} required>
            <TextFieldController name="userName" readOnly={isLoading} />
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormGroup label={t("email") as string} required>
            <TextFieldController name="email" />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup label={t("bio") as string}>
            <TextAreaController name="bio" readOnly={isLoading} />
          </FormGroup>
        </Grid>
      </Grid>
    </ContentGroup>
  );
};

export default Step2;
