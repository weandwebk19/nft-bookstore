import { Controller, useFormContext } from "react-hook-form";

import { MultipleSelectChip } from "@/components/shared/MultipleSelectChip";

interface MultipleSelectControllerProps {
  name: string;
  items: any[] | null;
  itemName?: string;
  itemValue?: string;
}

const MultipleSelectController = ({
  items,
  itemName,
  itemValue,
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
          itemsName={rest.name}
          value={value}
          onChange={onChange}
          helperText={invalid ? error?.message : ""}
          error={invalid}
          itemName={itemName}
          itemValue={itemValue}
        />
      )}
      name={rest.name}
      control={control}
    />
  );
};

export default MultipleSelectController;
