import { Controller, useFormContext } from "react-hook-form";

import { FormHelperText, TextField } from "@mui/material";

const InputController = ({ ...rest }) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...rest}
      render={({ field, fieldState: { invalid, error } }) => (
        <>
          <TextField label={rest.label} error={invalid} {...field} />
          {invalid && (
            <FormHelperText error sx={{ marginTop: "8px" }}>
              {error?.message}
            </FormHelperText>
          )}
        </>
      )}
      name={rest.name}
      control={control}
      defaultValue={rest.defaultValue}
    />
  );
};

export default InputController;
