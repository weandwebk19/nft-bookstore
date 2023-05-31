import { ToastContainer } from "react-toastify";

import { Box, Paper, Stack, Typography } from "@mui/material";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "next-i18next";

import { truncate } from "@/utils/truncate";

const BookActivities = () => {
  const { t } = useTranslation("bookDetail");

  const mockData = [
    {
      id: 1,
      event: "Transfer",
      price: "",
      fromAddress: "0xs56fr16c2xfs6dcf2vds12c",
      toAddres: "0x56scf66d6g6d2xfd251gc2đx25cd2fcx",
      date: "20-05-2023"
    },
    {
      id: 2,
      event: "Sale",
      price: "3.95 ETH",
      fromAddress: "0xs56fr16c2xfs6dcf2vds12c",
      toAddress: "0x56scf66d6g6d2xfd251gc2đx25cd2fcx",
      date: "20-05-2023"
    }
  ];

  const columns: GridColDef[] = [
    {
      field: "event",
      headerName: t("event") as string,
      width: 120,
      renderCell: (params) => {
        console.log(params);

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
      field: "toAddress",
      headerName: t("to") as string,
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
      field: "date",
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
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            getRowId={(row: any) => row.id}
            columns={columns}
            rows={mockData!}
          />
        </Box>
        <ToastContainer />
      </Paper>
    </Stack>
  );
};

export default BookActivities;
