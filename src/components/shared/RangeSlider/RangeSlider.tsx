import { memo } from "react";

import { Box, Grid, Slider, Stack, TextField } from "@mui/material";

function valuetext(value: number) {
  return `${value}`;
}

interface RangeSliderProps {
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number[];
  onSliderChange?: (event: Event, newValue: number | number[]) => void;
  onMinInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

const RangeSlider = ({
  unit = "",
  min = 0,
  max = 100,
  step = 1,
  value,
  onSliderChange,
  onMinInputChange,
  onMaxInputChange,
  onBlur
}: RangeSliderProps) => {
  // const [value, setValue] = React.useState<number[]>([20, 37]);

  // const handleChange = (event: Event, newValue: number | number[]) => {
  //   setValue(newValue as number[]);
  // };

  return (
    <Stack>
      <Grid item xs>
        <Slider
          min={min}
          max={max}
          getAriaLabel={() => "Temperature range"}
          value={value}
          step={step}
          onChange={onSliderChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
        />
      </Grid>
      <Stack
        sx={{ justifyContent: "space-between", width: "100%" }}
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
      >
        <TextField
          value={value[0]}
          size="small"
          onChange={onMinInputChange}
          onBlur={onBlur}
          inputProps={{
            step: 1,
            min,
            max,
            type: "number",
            "aria-labelledby": "input-slider"
          }}
          sx={{ width: "50%" }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          -
        </Box>
        <TextField
          value={value[1]}
          size="small"
          onChange={onMaxInputChange}
          onBlur={onBlur}
          inputProps={{
            step: 1,
            min,
            max,
            type: "number",
            "aria-labelledby": "input-slider"
          }}
          sx={{ width: "50%" }}
        />
      </Stack>
    </Stack>
  );
};

export default memo(RangeSlider);
