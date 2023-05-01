import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Box, Typography } from "@mui/material";

import { StyledRating } from "@/styles/components/Rating";

interface RatingControllerProps {
  name: string;
  getLabelText?: any;
  labels?: any;
  defaultValue?: number;
}

const RatingController = ({
  getLabelText,
  labels,
  defaultValue,
  ...rest
}: RatingControllerProps) => {
  const { control, setValue, getValues } = useFormContext();

  useEffect(() => {
    setValue(rest.name, defaultValue);
  }, [defaultValue]);

  return (
    <Controller
      {...rest}
      render={({ field }) => (
        <>
          <StyledRating
            getLabelText={getLabelText}
            {...field}
            onChange={(_, newValue) => {
              if (newValue === null) {
                setValue(`${rest.name}`, 0, { shouldValidate: true });
              } else {
                setValue(`${rest.name}`, newValue, { shouldValidate: true });
              }
            }}
          />
          {labels && (
            <Typography sx={{ mt: 1 }}>
              {labels[Number(getValues(`${rest.name}`))]}
            </Typography>
          )}
        </>
      )}
      name={rest.name}
      control={control}
    />
  );
};

export default RatingController;
