import { useCallback } from "react";
import { useFormContext } from "react-hook-form";

import {
  Avatar,
  Box,
  FormHelperText,
  Grid,
  Stack,
  Typography
} from "@mui/material";

import { useTranslation } from "next-i18next";

import { ContentGroup } from "@/components/shared/ContentGroup";
import FileController from "@/components/shared/FormController/FileController";
import { StyledButton } from "@/styles/components/Button";

interface Step1Props {
  isLoading?: boolean;
}

const Step1 = ({ isLoading }: Step1Props) => {
  const { t } = useTranslation("profile");
  const {
    formState: { errors },
    setValue,
    watch
  } = useFormContext();

  const watchPicture = watch("picture");

  const handleRemoveImage = useCallback(async () => {
    setValue("picture", "");
  }, []);

  return (
    <ContentGroup title={t("titleStep1") as string}>
      <Box sx={{ my: 2 }}>
        <Typography variant="caption" className="form-label required">
          {t("required") as string}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={{ xs: 4, sm: 4, md: 8, lg: 10 }}>
            <Grid item xs={12} md={8}>
              {!errors.picture && watchPicture ? (
                <Box
                  component="img"
                  src={URL.createObjectURL(watchPicture as any)}
                  sx={{
                    width: "100%",
                    maxWidth: "400px",
                    aspectRatio: "1 / 1",
                    borderRadius: "100rem",
                    objectFit: "cover",
                    margin: "auto"
                  }}
                />
              ) : (
                <Avatar
                  alt="avatar"
                  src=""
                  sx={{
                    display: "flex",
                    maxWidth: "400px",
                    width: "100%",
                    height: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: "100rem",
                    margin: "auto"
                  }}
                />
              )}
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                margin: "auto"
              }}
            >
              <Stack spacing={3}>
                <StyledButton
                  customVariant="primary"
                  component={isLoading ? "button" : "label"}
                  disabled={isLoading}
                >
                  {t("uploadPhotoBtn") as string}
                  <FileController name="picture" readOnly={isLoading} />
                </StyledButton>
                <StyledButton
                  customVariant="secondary"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                >
                  {t("removeBtn") as string}
                </StyledButton>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        {errors && errors.picture && (
          <Grid item xs={12}>
            <FormHelperText error sx={{ marginTop: "24px", fontSize: "13px" }}>
              {errors?.picture?.message as string}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </ContentGroup>
  );
};

export default Step1;
