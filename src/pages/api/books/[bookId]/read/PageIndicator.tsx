import { Box, Typography } from "@mui/material";

interface PageIndicatorProps {
  page: string;
}

const PageIndicator = ({ page }: PageIndicatorProps) => {
  return (
    <Box
      sx={{
        mt: 3,
        textAlign: "center",
        zIndex: 1
      }}
    >
      <Typography>{page}</Typography>
    </Box>
  );
};

export default PageIndicator;
