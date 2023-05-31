import { useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { isFloat } from "@/utils/isFloat";

import { RangeSlider } from "../RangeSlider";

interface RangeSliderControllerProps {
  name: string;
  min?: number;
  max?: number;
  step?: number;
}

const RangeSliderController = ({
  min = 0,
  max = 100,
  step = 1,
  ...rest
}: RangeSliderControllerProps) => {
  const { control, setValue, watch } = useFormContext();

  const watchPriceRange = watch(rest.name);

  const [priceRange, setPriceRange] = useState<number[]>([min, max]);

  const handleMinInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value = Number(event.target.value).toString();
      let items = [...priceRange];

      if (Number(event.target.value) < min) event.target.value = min.toString();

      if (Number(event.target.value) > max) event.target.value = max.toString();

      let item = [Number(event.target.value), items[1]] as number[];
      item = item.sort((a, b) => a - b);

      setPriceRange(item);
      setValue(`${rest.name}`, item);
    },
    [priceRange]
  );

  const handleMaxInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value = Number(event.target.value).toString();
      let items = [...priceRange];

      if (Number(event.target.value) < min) event.target.value = min.toString();
      if (Number(event.target.value) > max) event.target.value = max.toString();

      let item = [items[0], Number(event.target.value)] as number[];
      item = item.sort((a, b) => a - b);

      setPriceRange(item);
      setValue(`${rest.name}`, item);
    },
    [priceRange]
  );

  useEffect(() => {
    setPriceRange([...watchPriceRange]);
  }, [watchPriceRange]);

  return (
    <Controller
      {...rest}
      render={({ field, fieldState: { invalid, error } }) => (
        <RangeSlider
          // {...field}
          value={priceRange}
          min={min}
          max={max}
          step={step}
          onMinInputChange={handleMinInputChange}
          onMaxInputChange={handleMaxInputChange}
          onSliderChange={(event: Event, newValue: number | number[]) => {
            setPriceRange(newValue as number[]);
            field.onChange(newValue);
          }}
        />
      )}
      name={rest.name}
      control={control}
    />
  );
};

export default RangeSliderController;
