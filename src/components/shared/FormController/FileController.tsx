import { Controller, useFormContext } from "react-hook-form";

import { TextField } from "@mui/material";

interface FileControllerProps {
  type?: string;
  label?: string;
  name: string;
  defaultValue?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  InputProps?: object;
  readOnly?: boolean;
}

const FileController = ({
  type,
  label,
  name,
  defaultValue,
  onChange,
  InputProps,
  readOnly = false,
  ...rest
}: FileControllerProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...rest}
      render={({ field: { value, ...field } }) => (
        <>
          <TextField
            type="file"
            label={label}
            // error={invalid}
            InputProps={{ readOnly, ...InputProps }}
            inputProps={{
              accept: "image/jpg, image/jpeg, image/gif, image/png"
            }}
            sx={{ display: "none" }}
            {...field}
            onChange={(e) => {
              field.onChange((e.target as any)?.files[0]);
            }}
          />
        </>
      )}
      name={name}
      control={control}
      defaultValue={defaultValue}
    />
  );
};

export default FileController;
