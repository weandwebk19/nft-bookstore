import { Controller, useFormContext } from "react-hook-form";

import {
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField
} from "@mui/material";

import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";

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
  const { control, getValues } = useFormContext();

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
            // InputProps={{ readOnly, endAdornment, ...InputProps }}
            // InputProps={{
            //   readOnly: true,
            //   endAdornment: (
            //     <InputAdornment position="end">
            //       <IconButton
            //         edge="end"
            //         onClick={() => {
            //           navigator.clipboard.writeText(
            //             `${getValues("walletAddress")}`
            //           );
            //         }}
            //       >
            //         <ContentCopyIcon />
            //       </IconButton>
            //     </InputAdornment>
            //   )
            // }}
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
