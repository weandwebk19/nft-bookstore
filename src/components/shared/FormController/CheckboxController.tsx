import { Controller, useFormContext } from "react-hook-form";

import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import styles from "@styles/Form.module.scss";

interface CheckboxControllerProps {
  name: string;
  label: React.ReactNode;
}

const CheckboxController = ({ label, ...rest }: CheckboxControllerProps) => {
  const theme = useTheme();
  const { control } = useFormContext();

  return (
    <Controller
      {...rest}
      render={({ field, fieldState: { invalid, error } }) => (
        <>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => field.onChange(e.target.checked)}
                checked={field.value}
                color={invalid ? "error" : "default"}
              />
            }
            label={label}
          />
          <Typography
            className={styles["form__helper-text"]}
            variant="caption"
            sx={{
              color: `${theme.palette.error.main}`
            }}
          >
            {invalid ? error?.message : ""}
          </Typography>
        </>
      )}
      name={rest.name}
      control={control}
    />
  );
};

export default CheckboxController;
