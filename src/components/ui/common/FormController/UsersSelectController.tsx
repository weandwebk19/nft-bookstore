import { useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useDebounce } from "@hooks/common";
import axios from "axios";

import UsersSelect from "@/components/ui/common/UsersSelect";

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
      setInputValue(item?.[itemName]);
      setValue(rest.name, item?.[itemValue]);
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

  // useEffect(() => {
  //   setValue(rest.name, inputValue);
  // }, [inputValue]);

  useEffect(() => {
    if (!debounced.trim()) {
      setInputValue("");
      return;
    }
    (async () => {
      const authorsRes = await axios.get(`/api/authors?pseudonym=${debounced}`);

      if (authorsRes.data.success === true) {
        setListItems(authorsRes.data.data);
      }
    })();
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
          itemValue={itemValue}
          itemName={itemName}
          itemSubname="walletAddress"
        />
      )}
      name={rest.name}
      control={control}
    />
  );
};

export default UsersSelectController;
