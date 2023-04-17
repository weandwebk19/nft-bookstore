import { Box, Stack, Typography } from "@mui/material";

import {
  AutoCompleteController,
  InputController,
  MultipleSelectController
} from "@shared/FormController";
import styles from "@styles/Form.module.scss";
import { useTranslation } from "next-i18next";

import { useGenres, useLanguages } from "@/components/hooks/api";
import { ContentGroup } from "@/components/shared/ContentGroup";
import { FormGroup } from "@/components/shared/FormGroup";

const Step3 = () => {
  const { t } = useTranslation("createBook");

  const genres = useGenres();
  const languages = useLanguages();

  return (
    <ContentGroup title={t("titleStep3") as string}>
      <Box sx={{ my: 2 }}>
        <Typography variant="caption" className="form-label required">
          {t("required") as string}
        </Typography>
      </Box>
      <Stack direction="column" spacing={3}>
        <Stack direction="column" spacing={3}>
          <FormGroup
            label={t("externalLink") as string}
            desc={t("descExternalLink") as string}
          >
            <InputController name="externalLink" />
          </FormGroup>
          <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2 }}>
            <FormGroup
              label={t("version") as string}
              required
              className={styles["form__formGroup-half"]}
            >
              <InputController name="version" />
            </FormGroup>
            <FormGroup
              label={t("quantity") as string}
              required
              className={styles["form__formGroup-half"]}
            >
              <InputController name="quantity" />
            </FormGroup>
          </Stack>
          <FormGroup label={t("genres") as string} required>
            <MultipleSelectController items={genres.data} name="genres" />
          </FormGroup>
          <FormGroup label={t("languages") as string} required>
            <MultipleSelectController items={languages.data} name="languages" />
          </FormGroup>
          <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2 }}>
            <FormGroup
              label={t("numberOfPages") as string}
              required
              className={styles["form__formGroup-half"]}
            >
              <InputController name="totalPages" />
            </FormGroup>
            <FormGroup
              label={t("keywords") as string}
              className={styles["form__formGroup-half"]}
            >
              <AutoCompleteController name="keywords" />
            </FormGroup>
          </Stack>
        </Stack>
      </Stack>
    </ContentGroup>
  );
};

export default Step3;
