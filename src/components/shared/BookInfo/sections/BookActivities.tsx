import { ToastContainer } from "react-toastify";

import { Box, Paper, Stack, Typography } from "@mui/material";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { useBookHistories } from "@/components/hooks/api";
import { truncate } from "@/utils/truncate";

import { FallbackNode } from "../../FallbackNode";

const BookActivities = () => {
  const { t } = useTranslation("bookDetail");
  const router = useRouter();
  const query = router.query;
  const bookHistories = useBookHistories(query.bookId as string);

  const columns: GridColDef[] = [
    {
      field: "event",
      headerName: t("event") as string,
      width: 120,
      renderCell: (params) => {
        return <Typography>{params.value}</Typography>;
      }
    },
    {
      field: "price",
      headerName: t("price") as string,
      width: 100,
      renderCell: (params) => {
        return <Typography>{params.value}</Typography>;
      }
    },
    {
      field: "amount",
      headerName: t("Amount") as string,
      width: 100,
      renderCell: (params) => {
        return <Typography>{params.value}</Typography>;
      }
    },
    {
      field: "fromAddress",
      headerName: t("from") as string,
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => {
        if (params?.value) {
          return <Typography>{truncate(params.value, 12, -4)}</Typography>;
        }
      }
    },
    {
      field: "timestamp",
      headerName: t("date") as string,
      width: 180,
      renderCell: (params) => (
        <Typography>
          {`${new Date(params.value).toLocaleDateString("vi-VN")}, ${new Date(
            params.value
          ).toLocaleTimeString("vi-VN")}`}
        </Typography>
      )
    }
  ];

  return (
    <Stack>
      <Typography variant="h5" mb={1}>
        {t("bookActivities")}
      </Typography>
      <Paper>
        {(() => {
          if (bookHistories.isLoading) {
            return <Typography>{t("loadingMessage") as string}</Typography>;
          } else if (bookHistories?.data?.length === 0 || bookHistories.error) {
            return <FallbackNode />;
          }
          return (
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                getRowId={(row: any) => row.id}
                columns={columns}
                rows={bookHistories.data}
              />
            </Box>
          );
        })()}
        <ToastContainer />
      </Paper>
    </Stack>
  );
};

export default BookActivities;
