import { Box, Typography } from "@mui/material";

interface ContentGroupProps {
  title: React.ReactNode | string;
  children: React.ReactNode;
}

const ContentGroup = ({ title, children }: ContentGroupProps) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default ContentGroup;
