import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { FormHelperText } from "@mui/material";

import { StyledTextArea } from "@/styles/components/TextField";

const MAXIMUM_NUMBER_OF_CHARACTERS = 2000;

interface TextAreaControllerProps {
  name: string;
  defaultValue?: string;
  maxCharacters?: number;
  readOnly?: boolean;
}

const TextAreaController = ({
  name,
  defaultValue,
  maxCharacters = MAXIMUM_NUMBER_OF_CHARACTERS,
  readOnly = false,
  ...rest
}: TextAreaControllerProps) => {
  const { control, setValue } = useFormContext();
  const [numberOfCharacters, setNumberOfCharacters] = useState<Number>(0);

  useEffect(() => {
    if (defaultValue) {
      setValue(name, defaultValue);
    }
  }, [defaultValue]);

  return (
    <Controller
      {...rest}
      render={({ field, fieldState: { invalid, error } }) => (
        <>
          <StyledTextArea
            id="description"
            minRows={3}
            multiline={true}
            label={`${numberOfCharacters}/${maxCharacters}`}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{ readOnly }}
            error={invalid}
            {...field}
            onChange={(e) => {
              let lengthOfCharacters = e.target.value.length;
              if (lengthOfCharacters <= maxCharacters) {
                setNumberOfCharacters(lengthOfCharacters);
                field.onChange(e);
              }
            }}
          />
          {invalid && (
            <FormHelperText error sx={{ marginTop: "8px" }}>
              {error?.message}
            </FormHelperText>
          )}
        </>
      )}
      name={name}
      control={control}
      defaultValue={defaultValue}
    />
  );
};

export default TextAreaController;
