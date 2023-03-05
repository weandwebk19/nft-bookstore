import { Controller, useFormContext } from "react-hook-form";

import { MultipleSelectChip } from "@/components/shared/MultipleSelectChip";

interface MultipleSelectControllerProps {
  name: string;
  items: string[];
}

const MultipleSelectController = ({
  items,
  ...rest
}: MultipleSelectControllerProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...rest}
      render={({
        field: { onChange, value },
        fieldState: { invalid, error }
      }) => (
        <MultipleSelectChip
          items={items}
          value={value}
          onChange={onChange}
          helperText={invalid ? error?.message : ""}
          error={invalid}
        />
      )}
      name={rest.name}
      control={control}
    />
  );
};

export default MultipleSelectController;
