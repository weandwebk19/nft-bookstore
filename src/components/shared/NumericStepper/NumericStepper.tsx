import { IconButton, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface NumericStepperProps {
  onIncrement: () => void;
  onDecrement: () => void;
  onChange: () => void;
  value: number;
  helperText?: string;
}

const NumericStepper = ({
  onIncrement,
  onDecrement,
  onChange,
  value,
  helperText
}: NumericStepperProps) => {
  const theme = useTheme();

  return (
    <>
      <TextField
        sx={{ maxWidth: 160 }}
        type="number"
        value={value}
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <IconButton onClick={onDecrement}>
              <RemoveIcon />
            </IconButton>
          ),
          endAdornment: (
            <IconButton onClick={onIncrement}>
              <AddIcon />
            </IconButton>
          )
        }}
      />
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          bottom: 0,
          color: `${theme.palette.error.main}`
        }}
      >
        {helperText}
      </Typography>
    </>
  );
};

export default NumericStepper;
