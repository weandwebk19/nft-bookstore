import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Box,
  Divider,
  MenuItem,
  Rating,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Label from "@mui/icons-material/Label";
import StarIcon from "@mui/icons-material/Star";

import { yupResolver } from "@hookform/resolvers/yup";
import TreeView from "@mui/lab/TreeView";
import styles from "@styles/FilterBar.module.scss";
import * as yup from "yup";

import { StyledButton } from "@/styles/components/Button";
import { StyledRating } from "@/styles/components/Rating";
import {
  StyledTreeItemProps,
  StyledTreeItemRoot
} from "@/styles/components/TreeView/StyledTreeView";
import { BookGenres } from "@/types/nftBook";

import { FilterItem } from "../FilterItem";
import { InputController } from "../FormController";
import { RangeSlider } from "../RangeSlider";

const schema = yup
  .object({
    genre: yup.string(),
    name: yup.string(),
    author: yup.string(),
    rating: yup.number(),
    language: yup.string(),
    priceRange: yup.array(yup.number())
  })
  .required();

type FormData = yup.InferType<typeof schema>;

function StyledTreeItem(props: StyledTreeItemProps) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0, pl: 0 }}
        >
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          {/* <Box
                        component="img"
                        src={images.artPhotography}
                        alt="NFT Bookstore"
                        sx={{
                        width: "18px",
                        mr: 1,
                        }}
                    /> */}

          <Typography
            variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
          >
            {labelText}
          </Typography>
        </Box>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor
      }}
      {...other}
    />
  );
}

const labels: { [index: string | number]: string } = {
  0: "all ratings",
  1: "from 1 star",
  2: "from 2 stars",
  3: "from 3 stars",
  4: "from 4 stars",
  5: "from 5 stars"
};

const MIN_PRICE = 0;
const MAX_PRICE = 10;

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const FilterBar2 = () => {
  const theme = useTheme();

  const [priceRange, setPriceRange] = useState<number[]>([
    MIN_PRICE,
    MAX_PRICE
  ]);

  const handleSliderChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      setPriceRange(newValue as number[]);
    },
    []
  );

  const handleMinInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let items = [...priceRange];
      let item = [
        event.target.value === "" ? "" : Number(event.target.value),
        items[1]
      ] as number[];
      setPriceRange(item);
    },
    [priceRange]
  );

  const handleMaxInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let items = [...priceRange];
      let item = [
        items[0],
        event.target.value === "" ? "" : Number(event.target.value)
      ] as number[];
      setPriceRange(item);
    },
    [priceRange]
  );

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues
  } = useForm<FormData>({
    defaultValues: {
      genre: "",
      name: "",
      author: "",
      rating: 3,
      language: "",
      priceRange: [MIN_PRICE, MAX_PRICE]
      // priceStarting: MIN_PRICE,
      // priceEnding: MAX_PRICE
    },
    resolver: yupResolver(schema)
  });

  const bookGenres = Object.keys(BookGenres).filter((item) => {
    return isNaN(Number(item));
  });

  const handleChangeSelect = useCallback(
    (event: React.SyntheticEvent, nodeIds: any) => {
      setValue("genre", nodeIds, { shouldValidate: true });
    },
    [setValue]
  );

  const onSubmit = (data: any) => {
    console.log("data:", data);
  };

  return (
    <Stack
      direction="column"
      divider={<Divider orientation="horizontal" />}
      spacing={3}
      sx={{ marginTop: 4 }}
      className={styles["filter-bar"]}
    >
      <FilterItem title="Genres">
        <Box>
          <TreeView
            aria-label="book-genres"
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={
              <div style={{ width: 24, backgroundColor: "red" }} />
            }
            onNodeSelect={handleChangeSelect}
            sx={{ height: 264, flexGrow: 1, width: "100", overflowY: "auto" }}
          >
            {bookGenres.map((genres) => (
              <StyledTreeItem
                key={genres}
                nodeId={genres}
                labelText={genres}
                labelIcon={Label}
                color={`${theme.palette.success.main}`}
                bgColor={`${theme.palette.background.default}`}
              />
            ))}
          </TreeView>
        </Box>
      </FilterItem>
      <FilterItem title="Search books">
        <Controller
          name="name"
          control={control}
          render={({ field }) => {
            return (
              <TextField
                id="name"
                fullWidth
                error={!!errors.name?.message}
                {...field}
              />
            );
          }}
        />
      </FilterItem>
      <FilterItem title="Rating">
        <Controller
          name="rating"
          control={control}
          render={({ field }) => {
            return (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center"
                }}
                className={styles["filter-rating"]}
              >
                <StyledRating
                  id="rating"
                  {...field}
                  precision={1}
                  getLabelText={getLabelText}
                  onChange={(_, newValue: any) => {
                    if (newValue === null) {
                      setValue("rating", 0, { shouldValidate: true });
                    } else {
                      setValue("rating", newValue, { shouldValidate: true });
                    }
                  }}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                  size="medium"
                />
                <Box>{labels[Number(getValues("rating"))]}</Box>
              </Box>
            );
          }}
        />
      </FilterItem>
      <FilterItem title="Price">
        {/* <Stack
          direction="row"
          spacing={3}
          sx={{ justifyContent: "space-between" }}
        >
          <Controller
            name="priceStarting"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  id="priceStarting"
                  type="number"
                  sx={{ width: "45%" }}
                  error={!!errors.priceStarting?.message}
                  {...field}
                  onChange={(e) => {
                    if (
                      !!e.target.value &&
                      !isNaN(parseFloat(e.target.value)) &&
                      parseFloat(e.target.value) >= 0
                    ) {
                      let newValue = parseFloat(e.target.value);
                      e.target.value = `${newValue}`;
                    } else {
                      e.target.value = "0";
                    }

                    field.onChange(e);
                    setValue("priceEnding", getValues("priceEnding"), {
                      shouldValidate: true
                    });
                  }}
                />
              );
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            -
          </Box>
          <Controller
            name="priceEnding"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  id="priceEnding"
                  type="number"
                  sx={{ width: "45%" }}
                  error={!!errors.priceEnding?.message}
                  {...field}
                  onChange={(e) => {
                    if (
                      !!e.target.value &&
                      !isNaN(parseFloat(e.target.value)) &&
                      parseFloat(e.target.value) > 0
                    ) {
                      let newValue = parseFloat(e.target.value);
                      e.target.value = `${newValue}`;
                    } else {
                      e.target.value = "0";
                    }

                    field.onChange(e);
                    setValue("priceStarting", getValues("priceStarting"), {
                      shouldValidate: true
                    });
                  }}
                />
              );
            }}
          />
        </Stack> */}
        <RangeSlider
          value={priceRange}
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={0.5}
          onMinInputChange={handleMinInputChange}
          onMaxInputChange={handleMaxInputChange}
          onSliderChange={handleSliderChange}
        />
      </FilterItem>
      <FilterItem title="Author">
        <InputController name="author" />
      </FilterItem>
      <FilterItem title="Language">
        <Controller
          name="language"
          control={control}
          render={({ field }) => {
            return (
              <Select
                id="language"
                fullWidth
                error={!!errors.language?.message}
                {...field}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="vi">Tiếng Việt</MenuItem>
              </Select>
            );
          }}
        />
      </FilterItem>
      <StyledButton
        customVariant="primary"
        type="submit"
        onClick={handleSubmit(onSubmit)}
      >
        Apply
      </StyledButton>
    </Stack>
  );
};

export default FilterBar2;