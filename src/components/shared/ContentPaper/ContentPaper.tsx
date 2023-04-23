import { SetStateAction, useEffect, useState } from "react";

import { Box, Grid, Pagination, Paper, Stack, Typography } from "@mui/material";

import { useRouter } from "next/router";
import querystring from "querystring";

interface ContentPaperProps {
  title: React.ReactNode | string;
  children: React.ReactNode;
  height?: number | string;
  isPaginate?: boolean;
  button?: JSX.Element;
  totalPages?: number;
}

const ContentPaper = ({
  title,
  children,
  height,
  isPaginate = false,
  totalPages = 1,
  button
}: ContentPaperProps) => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const pageDefalut = router.query.page ? router.query.page : 1;
    setPage(parseInt(pageDefalut.toString()));
  }, [router.query]);

  function handlePaginationChange(e: any, value: any) {
    setPage(value);
    const newQueryString = { ...router.query, page: value };
    const queryString = querystring.stringify(newQueryString);
    const url = `?${queryString}`;
    router.push(url);
  }

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
            count={totalPages}
            shape="rounded"
            page={page}
            onChange={handlePaginationChange}
          />
        </Stack>
      )}
    </Paper>
  );
};

export default ContentPaper;
