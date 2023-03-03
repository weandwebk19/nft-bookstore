import { Box, Stack, Typography } from "@mui/material";

import {
  InputController,
  MultipleSelectController
} from "@shared/FormController";
import styles from "@styles/Form.module.scss";

import { ContentGroup } from "@/components/shared/ContentGroup";
import { FormGroup } from "@/components/shared/FormGroup";
import { Language } from "@/types/languages";
import { BookGenres } from "@/types/nftBook";

const Step3 = () => {
  const bookGenres = Object.keys(BookGenres).filter((item) => {
    return isNaN(Number(item));
  });
  const languages = Object.values(Language);
  return (
    <ContentGroup title="Book details">
      <Box sx={{ my: 2 }}>
        <Typography variant="caption" className="form-label required">
          Required
        </Typography>
      </Box>
      <Stack direction="column" spacing={3}>
        <Stack direction="column" spacing={3}>
          <FormGroup
            label="External link"
            desc="NFT Bookstore will include a link to this URL on this item's detail page, so that users can click to learn more about it. This may contain extra items for buyers."
          >
            <InputController name="externalLink" />
          </FormGroup>
          <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2 }}>
            <FormGroup
              label="Version"
              required
              className={styles["form__formGroup-half"]}
            >
              <InputController name="version" />
            </FormGroup>
            <FormGroup
              label="Max supply"
              required
              className={styles["form__formGroup-half"]}
            >
              <InputController name="maxSupply" />
            </FormGroup>
          </Stack>
          <FormGroup label="Genres" required>
            <MultipleSelectController items={bookGenres} name="genres" />
          </FormGroup>
          <FormGroup label="Languages" required>
            <MultipleSelectController items={languages} name="languages" />
          </FormGroup>
          <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2 }}>
            <FormGroup
              label="Number of pages"
              required
              className={styles["form__formGroup-half"]}
            >
              <InputController name="pages" />
            </FormGroup>
            <FormGroup
              label="Keywords"
              className={styles["form__formGroup-half"]}
            >
              <InputController name="keywords" />
            </FormGroup>
          </Stack>
        </Stack>
      </Stack>
    </ContentGroup>
  );
};

export default Step3;
