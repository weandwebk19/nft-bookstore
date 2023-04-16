import { useState } from "react";

import {
  Chip,
  Autocomplete as MUIAutoComplete,
  TextField
} from "@mui/material";

interface AutoCompleteInterface {
  isFreeSolo?: boolean;
  data?: any[];
  value?: string;
  label?: string;
  placeholder?: string;
  onChange: (_: any, newValue: any) => void;
}

const AutoComplete = ({
  isFreeSolo = true,
  data = [],
  value,
  label,
  placeholder = "",
  onChange
}: AutoCompleteInterface) => {
  return (
    <MUIAutoComplete
      multiple
      freeSolo={isFreeSolo}
      id="tags-filled"
      options={data.map((option) => option?.[`${value}`])}
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => (
          // eslint-disable-next-line react/jsx-key
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          placeholder={placeholder}
          // onKeyDown={(e) => onKeyDown(e)}
        />
      )}
    />
  );
};

export default AutoComplete;
