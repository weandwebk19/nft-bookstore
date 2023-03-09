import { Controller, useFormContext } from "react-hook-form";

import NumericStepper from "../NumericStepper/NumericStepper";

const NumericStepperController = ({ ...rest }) => {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      {...rest}
      render={({
        field: { onChange, value },
        fieldState: { invalid, error }
      }) => (
        <NumericStepper
          onChange={onChange}
          value={value}
          onIncrement={() => {
            setValue(`${rest.name}`, value + 1, { shouldValidate: true });
            onChange(value + 1);
          }}
          onDecrement={() => {
            setValue(`${rest.name}`, value - 1, { shouldValidate: true });
            onChange(Math.max(0, value - 1));
          }}
          helperText={invalid ? error?.message : ""}
        />
      )}
      name={rest.name}
      control={control}
      defaultValue={rest.defaultValue}
    />
  );
};

export default NumericStepperController;
