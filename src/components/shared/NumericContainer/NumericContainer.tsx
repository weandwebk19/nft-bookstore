import { Chip, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import FaceIcon from "@mui/icons-material/Face";

type NumericVariant = "contained" | "outlined";

interface NumericContainerProps {
  icon?: JSX.Element;
  label: string;
  amount?: number | string;
  variant?: NumericVariant;
}

const NumericContainer = ({
  icon,
  label,
  amount,
  variant = "contained"
}: NumericContainerProps) => {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        background: `${
          variant === "contained" ? theme.palette.background.paper : ""
        }`,
        border: "1px solid rgba(0, 0, 0, 0.2)",
        borderRadius: 5,
        px: 1
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        {icon}
        <Typography variant="subtitle2">{label}</Typography>
      </Stack>
      <Typography variant="label">{amount}</Typography>
    </Stack>
  );
};

export default NumericContainer;
