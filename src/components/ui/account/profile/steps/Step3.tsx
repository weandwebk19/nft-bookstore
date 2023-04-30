import { useFormContext } from "react-hook-form";

import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Typography
} from "@mui/material";

import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";

import { TextFieldController } from "@shared/FormController";
import { useTranslation } from "next-i18next";

import { ContentGroup } from "@/components/shared/ContentGroup";
import { FormGroup } from "@/components/shared/FormGroup";

interface Step3Props {
  isLoading?: boolean;
}

const Step3 = ({ isLoading }: Step3Props) => {
  const { t } = useTranslation("profile");
  const { getValues } = useFormContext();

  return (
    <ContentGroup title={t("titleStep3") as string}>
      <Box sx={{ my: 2 }}>
        <Typography variant="caption" className="form-label required">
          {t("required") as string}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormGroup label={t("website") as string}>
            <TextFieldController name="website" readOnly={isLoading} />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup label={t("walletAddress") as string}>
            <TextFieldController
              name="walletAddress"
              readOnly={true}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${getValues("walletAddress")}`
                      );
                    }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormGroup>
        </Grid>
      </Grid>
    </ContentGroup>
  );
};

export default Step3;
