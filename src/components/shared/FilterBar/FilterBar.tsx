import { FormProvider, useForm } from "react-hook-form";

import { Divider, Stack } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/FilterBar.module.scss";
import * as yup from "yup";

import { useGenres, useLanguages } from "@/components/hooks/api";
import { FormGroup } from "@/components/shared/FormGroup";
import { StyledButton } from "@/styles/components/Button";
import { Language } from "@/types/languages";

import {
  InputController,
  RangeSliderController,
  RatingController,
  SelectController,
  TreeViewController
} from "../FormController";

const schema = yup
  .object({
    genre: yup.string(),
    title: yup.string(),
    author: yup.string(),
    rating: yup.number(),
    language: yup.string(),
    priceRange: yup.array(yup.number())
  })
  .required();

const labels: { [index: string | number]: string } = {
  0: "all ratings",
  1: "from 1 star",
  2: "from 2 stars",
  3: "from 3 stars",
  4: "from 4 stars",
  5: "from 5 stars"
};

const languages: any[] = [];

for (const [propertyKey, propertyValue] of Object.entries(Language)) {
  if (!Number.isNaN(Number(propertyKey))) {
    continue;
  }
  languages.push({ name: propertyValue, value: propertyValue });
}

const MIN_PRICE = 0;
const MAX_PRICE = 10;

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const defaultValues = {
  genre: "",
  title: "",
  author: "",
  rating: 3,
  language: "",
  priceRange: [MIN_PRICE, MAX_PRICE]
};

const FilterBar = () => {
  const genres = useGenres();
  const languages = useLanguages();

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: any) => {
    console.log("data:", data);
  };

  return (
    <FormProvider {...methods}>
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal" />}
        spacing={3}
        sx={{ marginTop: 4 }}
        className={styles["filter-bar"]}
      >
        <FormGroup label="Genres">
          {genres.isLoading && "Loading..."}
          {genres.error &&
            "Oops! There was a problem loading genres \n Try refresh the page."}
          <TreeViewController name="genre" items={genres.data} />
        </FormGroup>
        <FormGroup label="Search book">
          <InputController name="title" />
        </FormGroup>
        <FormGroup label="Rating">
          <RatingController
            name="rating"
            getLabelText={getLabelText}
            labels={labels}
          />
        </FormGroup>
        <FormGroup label="Price">
          <RangeSliderController
            name="priceRange"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={0.5}
          />
        </FormGroup>
        <FormGroup label="Search by author">
          <InputController name="author" />
        </FormGroup>
        <FormGroup label="Languages support">
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
          Apply
        </StyledButton>
      </Stack>
    </FormProvider>
  );
};

export default FilterBar;
