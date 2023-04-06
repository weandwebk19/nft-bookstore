import { Box, Grid, Pagination, Paper, Stack, Typography } from "@mui/material";

interface ContentPaperProps {
  title: React.ReactNode | string;
  children: React.ReactNode;
  height?: number | string;
  isPaginate?: boolean;
  button?: JSX.Element;
}

const ContentPaper = ({
  title,
  children,
  height,
  isPaginate = false,
  button
}: ContentPaperProps) => {
  return (
    <Paper sx={{ p: 3, height: `${height}` }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {button}
      </Stack>
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
