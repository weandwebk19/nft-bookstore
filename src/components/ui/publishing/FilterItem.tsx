import { Box, Typography } from "@mui/material";

interface FilterItemProps {
  title: React.ReactNode | string;
  children: React.ReactNode;
}

const FilterItem = ({ title, children }: FilterItemProps) => {
  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 400, lineHeight: 1.3, fontSize: 18 }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default FilterItem;
