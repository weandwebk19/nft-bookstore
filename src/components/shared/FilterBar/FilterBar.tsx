import { FormProvider, useForm } from "react-hook-form";

import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SelectAllOutlinedIcon from "@mui/icons-material/SelectAllOutlined";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/FilterBar.module.scss";
import pluralize from "@utils/pluralize";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import querystring from "query-string";
import * as yup from "yup";

import { useGenres, useLanguages } from "@/components/hooks/api";
import { FormGroup } from "@/components/shared/FormGroup";
import { UsersSelectController } from "@/components/ui/common/FormController";
import { StyledButton } from "@/styles/components/Button";
import { Language } from "@/types/languages";

import { ContentPaper } from "../ContentPaper";
import {
  RangeSliderController,
  RatingController,
  SelectController,
  TextFieldController,
  TreeViewController
} from "../FormController";

config.autoAddCss = false;

const schema = yup
  .object({
    genre: yup.array(yup.string()),
    title: yup.string(),
    author: yup.string(),
    rating: yup.number(),
    language: yup.string(),
    priceRange: yup.array(yup.number())
  })
  .required();

const languages: any[] = [];

for (const [propertyKey, propertyValue] of Object.entries(Language)) {
  if (!Number.isNaN(Number(propertyKey))) {
    continue;
  }
  languages.push({ name: propertyValue, value: propertyValue });
}

const MIN_PRICE = 0;
const MAX_PRICE = 10;

const defaultValues = {
  genre: [],
  title: "",
  author: "",
  rating: 0,
  language: "",
  priceRange: [MIN_PRICE, MAX_PRICE]
};

interface FilterBarProps {
  data?: any[];
  pathname: string;
}

const FilterBar = ({ data, pathname }: FilterBarProps) => {
  const { t } = useTranslation("filter");
  const router = useRouter();
  const currLang = router.locale;

  const genres = useGenres();
  const languages = useLanguages();

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });

  const { handleSubmit, setValue, reset, getValues } = methods;

  const onSubmit = (data: any) => {
    const newQueryString = { ...router.query, ...data };
    const queryString = querystring.stringify(newQueryString);
    const url = `?${queryString}`;
    router.push(url);
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  const handleResetGenres = () => {
    setValue("genre", [], { shouldValidate: true });
  };
  const handleSelectAllGenres = () => {
    const data: any[] = genres?.data || [];
    let valueGenres: any[] = data?.map((item: any) => item._id);
    setValue("genre", valueGenres as never[], { shouldValidate: true });
  };

  const labels: { [index: string | number]: string } = {
    0: t("rating0Star") as string,
    1: t("rating1Star") as string,
    2: t("rating2Star") as string,
    3: t("rating3Star") as string,
    4: t("rating4Star") as string,
    5: t("rating5Star") as string
  };

  function getLabelText(value: number) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }

  return (
    <ContentPaper title={t("filter") as string}>
      <FormProvider {...methods}>
        <Stack
          direction="column"
          divider={<Divider orientation="horizontal" />}
          spacing={3}
          sx={{ marginTop: 4 }}
          className={styles["filter-bar"]}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography>
                {pluralize(data?.length, t("result"), router.locale)}
              </Typography>
            </Box>
            {!(Object.keys(router.query).length === 0) && (
              <Tooltip title={t("clearAllFilter")}>
                <IconButton
                  onClick={() => {
                    router.push(pathname);
                  }}
                >
                  <CancelOutlinedIcon fontSize="small" color="inherit" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          <FormGroup
            label={
              <Stack
                direction={{ xs: "row" }}
                spacing={{ xs: 2 }}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                {t("genres")}
                <Stack direction={{ xs: "row" }}>
                  <Tooltip title={t("tooltip_reset") as string}>
                    <IconButton onClick={handleResetGenres}>
                      <RefreshOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("tooltip_selectAll") as string}>
                    <IconButton onClick={handleSelectAllGenres}>
                      <SelectAllOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            }
          >
            {genres.isLoading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 264
                }}
              >
                <CircularProgress />
              </Box>
            )}
            {genres.error &&
              "Oops! There was a problem loading genres \n Try refresh the page."}
            <TreeViewController
              name="genre"
              items={genres.data}
              itemName={currLang === "en" ? "name" : "vi_name"}
            />
          </FormGroup>
          <FormGroup label={t("searchBook") as string}>
            <TextFieldController name="title" />
          </FormGroup>
          <FormGroup label={t("rating") as string}>
            <RatingController
              name="rating"
              getLabelText={getLabelText}
              labels={labels}
            />
          </FormGroup>
          <FormGroup label={t("price") as string}>
            <RangeSliderController
              name="priceRange"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={0.5}
            />
          </FormGroup>
          <FormGroup label={t("searchByAuthor") as string}>
            {/* <TextFieldController name="author" /> */}
            <UsersSelectController
              name="author"
              itemValue="walletAddress"
              itemName="pseudonym"
            />
          </FormGroup>
          <FormGroup label={t("languagesSupport") as string}>
            <SelectController
              name="language"
              items={languages.data}
              itemValue="name"
            />
          </FormGroup>
          <Stack direction="column" spacing={2}>
            <StyledButton customVariant="secondary" onClick={handleReset}>
              {t("reset") as string}
            </StyledButton>
            <StyledButton
              customVariant="primary"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              {t("apply") as string}
            </StyledButton>
          </Stack>
        </Stack>
      </FormProvider>
    </ContentPaper>
  );
};

export default FilterBar;
