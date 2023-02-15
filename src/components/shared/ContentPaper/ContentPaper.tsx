import { Box, Grid, Pagination, Paper, Stack, Typography } from "@mui/material";

interface ContentPaperProps {
  title: React.ReactNode | string;
  children: React.ReactNode;
  height?: number | string;
  isPaginate?: boolean;
}

const ContentPaper = ({
  title,
  children,
  height,
  isPaginate = false
}: ContentPaperProps) => {
  return (
    <Paper sx={{ p: 3, height: `${height}` }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      {children}
      {isPaginate && (
        <Stack sx={{ mt: 3 }}>
          <Pagination
            sx={{ display: "flex", justifyContent: "center" }}
            count={10}
            shape="rounded"
          />
        </Stack>
      )}
    </Paper>
  );
};

export default ContentPaper;
