import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import {
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField
} from "@mui/material";

interface InputControllerProps {
  type?: string;
  label?: string;
  name: string;
  defaultValue?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit?: (data: any) => void;
  icon?: JSX.Element;
  InputProps?: object;
  readOnly?: boolean;
  userHandle?: string;
  tagName?: string;
}

const InputController = ({
  type,
  label,
  name,
  defaultValue,
  onSubmit,
  icon,
  onChange,
  InputProps,
  readOnly = false,
  userHandle,
  tagName,
  ...rest
}: InputControllerProps) => {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    if (tagName) {
      setValue(name, `@${tagName}, `);
    }
  }, [tagName]);

  return (
    <Controller
      {...rest}
      render={({ field, fieldState: { invalid, error } }) => {
        return (
          <>
            <OutlinedInput
              id="outlined-adornment-password"
              type={type}
              minRows={3}
              multiline={true}
              fullWidth
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onSubmit}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {icon}
                  </IconButton>
                </InputAdornment>
              }
              {...field}
              label={label}
              sx={{ alignItems: "end", pb: 3 }}
            />
            {invalid && (
              <FormHelperText error sx={{ marginTop: "8px" }}>
                {error?.message}
              </FormHelperText>
            )}
          </>
        );
      }}
      name={name}
      control={control}
      defaultValue={defaultValue}
    />
  );
};

export default InputController;
