import { Box, Grid, Typography } from "@mui/material";

import {
  FacebookRounded as FacebookRoundedIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon
} from "@mui/icons-material";

import { useTranslation } from "next-i18next";

import { ContentGroup } from "@/components/shared/ContentGroup";
import { TextFieldController } from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";

interface FinalStepProps {
  isLoading?: boolean;
}

const FinalStep = ({ isLoading }: FinalStepProps) => {
  const { t } = useTranslation("authorRequest");

  return (
    <ContentGroup title={t("titleStep4") as string}>
      <Box sx={{ my: 2 }}>
        <Typography variant="caption" className="form-label required">
          {t("required") as string}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormGroup
            label={
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <FacebookRoundedIcon />
                Facebook
              </Box>
            }
          >
            <TextFieldController name="facebook" readOnly={isLoading} />
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormGroup
            label={
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <TwitterIcon />
                Twitter
              </Box>
            }
          >
            <TextFieldController name="twitter" readOnly={isLoading} />
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormGroup
            label={
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <LinkedInIcon />
                LinkedIn
              </Box>
            }
          >
            <TextFieldController name="linkedIn" readOnly={isLoading} />
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormGroup
            label={
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <InstagramIcon />
                Instagram
              </Box>
            }
          >
            <TextFieldController name="instagram" readOnly={isLoading} />
          </FormGroup>
        </Grid>
      </Grid>
    </ContentGroup>
  );
};

export default FinalStep;
