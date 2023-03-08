import { Controller, useFormContext } from "react-hook-form";

import { MenuItem, Select } from "@mui/material";

interface SelectControllerProps {
  name: string;
  items: any[] | null;
  itemName?: string;
  itemValue?: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const SelectController = ({
  items,
  itemName = "name",
  itemValue = "value",
  ...rest
}: SelectControllerProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      {...rest}
      render={({ field, fieldState: { invalid, error } }) => (
        <Select
          {...field}
          MenuProps={{
            disableScrollLock: true,
            PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250
              }
            }
          }}
        >
          {items?.map((item) => (
            <MenuItem key={item._id} value={item[itemValue]}>
              {item[itemName]}
            </MenuItem>
          ))}
        </Select>
      )}
      name={rest.name}
      control={control}
    />
  );
};

export default SelectController;
