import { Controller, useFormContext } from "react-hook-form";

import { FormHelperText, TextField } from "@mui/material";

interface InputControllerProps {
  type?: string;
  label?: string;
  name: string;
  defaultValue?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  InputProps?: object;
  readOnly?: boolean;
  endAdornment?: React.ReactNode;
}

const InputController = ({
  type,
  label,
  name,
  defaultValue,
  onChange,
  InputProps,
  readOnly = false,
  endAdornment,
  ...rest
}: InputControllerProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...rest}
      render={({ field, fieldState: { invalid, error } }) => (
        <>
          <TextField
            type={type}
            label={label}
            error={invalid}
            InputProps={{ readOnly, endAdornment }}
            {...field}
            onChange={(e) => {
              if (onChange) {
                onChange(e);
              }
              field.onChange(e);
            }}
          />
          {invalid && (
            <FormHelperText error sx={{ marginTop: "8px" }}>
              {error?.message}
            </FormHelperText>
          )}
        </>
      )}
      name={name}
      control={control}
      defaultValue={defaultValue}
    />
  );
};

export default InputController;
