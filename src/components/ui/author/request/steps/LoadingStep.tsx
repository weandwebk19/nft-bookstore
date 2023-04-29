import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingStep = () => {
  return (
    <Box
      sx={{
        mt: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
      }}
    >
      <CircularProgress sx={{ mb: 3 }} />
    </Box>
  );
};

export default LoadingStep;
