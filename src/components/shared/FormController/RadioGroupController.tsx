import { Controller, useFormContext } from "react-hook-form";

import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import styles from "@styles/Form.module.scss";

interface RadioGroupControllerProps {
  name: string;
  items: any[];
}

const RadioGroupController = ({
  items,
  ...rest
}: RadioGroupControllerProps) => {
  const theme = useTheme();
  const { control } = useFormContext();

  return (
    <Controller
      {...rest}
      render={({ field, fieldState: { invalid, error } }) => (
        <>
          <RadioGroup {...field}>
            {items.map((item) => (
              <FormControlLabel
                key={item.value}
                value={item.value}
                control={<Radio />}
                label={item.label}
                defaultValue={item.value}
              />
            ))}
          </RadioGroup>
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

export default RadioGroupController;
