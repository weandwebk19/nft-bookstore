import { useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useDebounce } from "@hooks/common";

import UsersSelect from "@/components/ui/common/UsersSelect";
import { users } from "@/mocks";

interface UsersSelectControllerProps {
  name: string;
  itemName?: string;
  itemValue?: string;
}

const UsersSelectController = ({
  itemName = "name",
  itemValue = "value",
  ...rest
}: UsersSelectControllerProps) => {
  const { control, setValue } = useFormContext();

  const [selectedItem, setSelectedItem] = useState<any>();
  const [inputValue, setInputValue] = useState("");
  const [listItems, setListItems] = useState<any[]>([]);

  const debounced = useDebounce(inputValue, 500);

  const handleListItemClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, item: any) => {
      event.preventDefault();
      setSelectedItem(item);
      setInputValue(item?.[itemValue]);
    },
    [inputValue]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
    },
    [inputValue]
  );

  const handleResetClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setSelectedItem(null);
    setInputValue("");
    setValue(rest.name, "");
  };

  useEffect(() => {
    setValue(rest.name, inputValue);
  }, [inputValue]);

  useEffect(() => {
    if (!debounced.trim()) {
      setInputValue("");
      return;
    }

    // fetching API here (replace 'inputValue' to 'debounced')
    console.log("API CALLED!!!");

    const authors = users;

    setListItems(authors);
  }, [debounced]);

  return (
    <Controller
      {...rest}
      render={({ field, fieldState: { invalid, error } }) => (
        <UsersSelect
          {...field}
          data={listItems}
          inputValue={inputValue}
          selectedItem={selectedItem}
          onSelectClick={handleListItemClick}
          onInputChange={handleInputChange}
          onResetClick={handleResetClick}
          itemValue="fullname"
          itemName="fullname"
          itemSubname="walletAddress"
        />
      )}
      name={rest.name}
      control={control}
    />
  );
};

export default UsersSelectController;
