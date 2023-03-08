import { useCallback, useState } from "react";
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
  const { control, setValue } = useFormContext();

  const [priceRange, setPriceRange] = useState<number[]>([min, max]);

  const handleMinInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let items = [...priceRange];
      let item = [
        event.target.value === "" ? "" : Number(event.target.value),
        items[1]
      ] as number[];
      setPriceRange(item);
    },
    [priceRange]
  );

  const handleMaxInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let items = [...priceRange];
      let item = [
        items[0],
        event.target.value === "" ? "" : Number(event.target.value)
      ] as number[];
      setPriceRange(item);
    },
    [priceRange]
  );

  return (
    <Controller
      {...rest}
      render={({ field, fieldState: { invalid, error } }) => (
        <RangeSlider
          {...field}
          value={priceRange}
          min={min}
          max={max}
          step={step}
          onMinInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            let items = [...priceRange];
            let input = event.target.value;
            let item = [Number(input), items[1]] as number[];
            // if (isFloat(input)) {
            if (Number(input) < min) input = min.toString();
            if (Number(input) > max) input = max.toString();
            //   item = [input === "" ? "" : Number(input), items[1]] as number[];
            // }
            item = item.sort((a, b) => a - b);
            setPriceRange(item);
            setValue(`${rest.name}`, item);
          }}
          onMaxInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            let items = [...priceRange];
            let input = event.target.value;
            let item = [items[0], Number(input)] as number[];
            console.log(input);
            if (Number(input) < min) input = min.toString();
            if (Number(input) > max) input = max.toString();
            //   item = [items[0], input === "" ? "" : Number(input)] as number[];
            // }

            item = item.sort((a, b) => a - b);
            setPriceRange(item);
            setValue(`${rest.name}`, item);
          }}
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
