import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { FormHelperText } from "@mui/material";

import { StyledTextArea } from "@/styles/components/TextField";

const MAXIMUM_NUMBER_OF_CHARACTERS = 2000;

interface TextAreaControllerProps {
  name: string;
  defaultValue?: string;
  readOnly?: boolean;
}

const TextAreaController = ({
  name,
  defaultValue,
  readOnly = false,
  ...rest
}: TextAreaControllerProps) => {
  const { control } = useFormContext();
  const [numberOfCharacters, setNumberOfCharacters] = useState<Number>(0);

  return (
    <Controller
      {...rest}
      render={({ field, fieldState: { invalid, error } }) => (
        <>
          <StyledTextArea
            id="description"
            minRows={3}
            multiline={true}
            label={`${numberOfCharacters}/${MAXIMUM_NUMBER_OF_CHARACTERS}`}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{ readOnly }}
            error={invalid}
            {...field}
            onChange={(e) => {
              let lengthOfCharacters = e.target.value.length;
              if (lengthOfCharacters <= MAXIMUM_NUMBER_OF_CHARACTERS) {
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
