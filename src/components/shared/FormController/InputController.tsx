import { Controller, useFormContext } from "react-hook-form";

import { TextField } from "@mui/material";

const InputController = ({ ...rest }) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...rest}
      render={({ field, fieldState: { invalid, error } }) => (
        <TextField
          label={rest.label}
          helperText={invalid ? error?.message : ""}
          error={invalid}
          {...field}
        />
      )}
      name={rest.name}
      control={control}
      defaultValue={rest.defaultValue}
    />
  );
};

export default InputController;
