import { Controller, useFormContext } from "react-hook-form";

import { FormHelperText, TextField } from "@mui/material";

interface InputControllerProps {
  label?: string;
  name: string;
  defaultValue?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  InputProps?: object;
}

const InputController = ({
  label,
  name,
  defaultValue,
  onChange,
  InputProps,
  ...rest
}: InputControllerProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...rest}
      render={({ field, fieldState: { invalid, error } }) => (
        <>
          <TextField
            label={label}
            error={invalid}
            InputProps={InputProps}
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
