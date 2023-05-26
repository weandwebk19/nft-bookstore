import * as React from "react";

import {
  Box,
  Chip,
  FormControl,
  MenuItem,
  OutlinedInput,
  Stack,
  Typography
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";

import styles from "@styles/Form.module.scss";
import { useRouter } from "next/router";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  disableScrollLock: true,
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

interface MultipleSelectChipProps {
  items: any[] | null;
  itemsName: string;
  value: any;
  error?: boolean;
  helperText?: string;
  onChange: (event: SelectChangeEvent<string[]>) => void;
  itemName?: string;
  itemValue?: string;
}

export default function MultipleSelectChip({
  items,
  itemsName,
  value,
  error,
  helperText,
  onChange,
  itemName = "name",
  itemValue = "_id"
}: MultipleSelectChipProps) {
  const { locale } = useRouter();

  const theme = useTheme();

  const labelName =
    itemsName === "genres" && locale === "vi" ? "vi_name" : itemName;

  return (
    <FormControl sx={{ width: "100%" }}>
      <Stack>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={value}
          onChange={onChange}
          input={<OutlinedInput id="select-multiple-chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={
                    items?.filter((item) => item[itemValue] === value)?.[0][
                      labelName
                    ]
                  }
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {items?.map((item) => (
            <MenuItem key={item[itemValue]} value={item[itemValue]}>
              {item[labelName]}
            </MenuItem>
          ))}
        </Select>
        <Typography
          className={styles["form__helper-text"]}
          variant="caption"
          sx={{
            color: `${theme.palette.error.main}`
          }}
        >
          {helperText}
        </Typography>
      </Stack>
    </FormControl>
  );
}
