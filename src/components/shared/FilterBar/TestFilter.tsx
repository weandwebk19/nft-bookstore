import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  Divider,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SelectAllOutlinedIcon from "@mui/icons-material/SelectAllOutlined";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faBorderAll, faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/FilterBar.module.scss";
import nestify from "@utils/nestify";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import * as yup from "yup";

import { useGenres, useLanguages } from "@/components/hooks/api";
import { FormGroup } from "@/components/shared/FormGroup";
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
import TreeView from "../TreeView/TreeView";
import RecursiveTreeView from "./TestFilter";

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
  rating: 3,
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
  const [query, setQuery] = useState("");

  const genres = useGenres();
  const languages = useLanguages();

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });

  const { handleSubmit, setValue } = methods;

  const onSubmit = (data: any) => {
    console.log("data:", data);
  };

  const handleResetGenres = () => {
    setValue("genre", [], { shouldValidate: true });
    query.genre = "";
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

  const [nestedItems, setNestedItems] = useState<any[]>([]);

  useEffect(() => {
    if (genres.data !== null) {
      setNestedItems(nestify(genres.data));
    }
  }, [genres.data]);

  const { genre = "all", title = "all", rating = "all" } = router.query;

  const filterSearch = ({
    genre,
    title,
    rating
  }: {
    genre?: string;
    title?: string;
  }) => {
    const { query } = router;
    if (genre) query.genre = genre;
    if (title) query.title = title;
    if (rating) query.rating = rating;

    router.push({
      pathname: router.pathname,
      query: query
    });
  };

  const genreHandler = (nodeId: string) => {
    filterSearch({ genre: nodeId });
  };

  const titleHandler = (e) => {
    e.preventDefault();
    // router.push(`${router.pathname}?title=${query}`);
    filterSearch({ title: query });
  };

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
          <Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="body2">
                {data?.length === 0 ? "No" : data?.length} Results
              </Typography>
              {(query !== "all" &&
                query !== "" &&
                Object.keys(query).length === 0) ||
              genre !== "all" ||
              title !== "all" ? (
                <Tooltip title="Clear all filters">
                  <IconButton
                    onClick={() => {
                      router.push(pathname);
                      console.log(router.query);
                    }}
                  >
                    <CancelOutlinedIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              ) : null}
            </Stack>
            {genre !== "all" && genre !== "" && " | " + genre}
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
            {genres.isLoading && "Loading..."}
            {genres.error &&
              "Oops! There was a problem loading genres \n Try refresh the page."}
            <TreeView items={nestedItems} name="genre" onClick={genreHandler} />
          </FormGroup>
          <FormGroup label={t("searchBook") as string}>
            <OutlinedInput
              id="outlined-adornment-title-search"
              fullWidth
              onBlur={(e) => setQuery(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={titleHandler} edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
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
            <TextFieldController name="author" />
          </FormGroup>
          <FormGroup label={t("languagesSupport") as string}>
            <SelectController
              name="language"
              items={languages.data}
              itemValue="_id"
            />
          </FormGroup>
          <StyledButton
            customVariant="primary"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            {t("apply") as string}
          </StyledButton>
        </Stack>
      </FormProvider>
    </ContentPaper>
  );
};

export async function getServerSideProps({ query }) {
  const genre = query.genre || "";
  const title = query.title || "";

  const genreFilter = genre && genre !== "all";
  const titleFilter = title && title !== "all";
}

export default FilterBar;
