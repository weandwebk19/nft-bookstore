import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Autocomplete, Chip, MenuItem, Select, TextField } from "@mui/material";

import { AutoComplete } from "../AutoComplete";

interface AutoCompleteProps {
  name: string;
  label?: string;
}

const AutoCompleteController = ({ label, ...rest }: AutoCompleteProps) => {
  const { control } = useFormContext();
  const [chips, setChips] = useState<any>([]);

  return (
    <Controller
      {...rest}
      render={({ field }) => (
        <Autocomplete
          multiple
          freeSolo
          id="tags-filled"
          options={chips}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              // eslint-disable-next-line react/jsx-key
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => {
            return <TextField {...params} variant="outlined" label={label} />;
          }}
          onChange={(_, newValue) => {
            field.onChange(newValue);
          }}
        />
      )}
      name={rest.name}
      control={control}
    />
  );
};

export default AutoCompleteController;
