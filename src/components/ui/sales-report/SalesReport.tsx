import * as React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Avatar, Stack, Typography } from "@mui/material";

import { GridColDef } from "@mui/x-data-grid";
import styles from "@styles/BookItem.module.scss";
import { useTranslation } from "next-i18next";

import { DataGrid } from "@/components/shared/DataGrid";
import { Image } from "@/components/shared/Image";
import { SalesReportColumns, SalesReportRowData } from "@/types/salesReport";

interface SalesReportTableProps {
  data: SalesReportRowData[];
}

export default function SalesReportTable({ data }: SalesReportTableProps) {
  const { t } = useTranslation("salesReport");

  const [reformattedData, setReformattedData] = React.useState<
    SalesReportColumns[]
  >([]);

  React.useEffect(() => {
    if (data) {
      const reformattedData = data.map((item) => {
        const {
          id,
          avatar,
          username,
          title,
          bookCover,
          date,
          method,
          amount,
          price
        } = item;
        return {
          id,
          date,
          buyer: {
            avatar,
            username
          },
          book: {
            title,
            bookCover
          },
          method,
          amount,
          price
        } as SalesReportColumns;
      });
      setReformattedData(reformattedData);
    }
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: t("id") as string,
      width: 10
    },
    {
      field: "date",
      headerName: t("date") as string,
      width: 150
    },
    {
      field: "book",
      headerName: t("bookInfo") as string,
      width: 150,
      renderCell: (params) => {
        return (
          <Stack py={3}>
            <Image
              src={params?.value?.bookCover}
              alt={params?.value?.title} // should be replace to bookId
              sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
              className={styles["book-item__book-cover"]}
            />
            <Typography>{params?.value?.title}</Typography>
          </Stack>
        );
      }
    },
    {
      field: "buyer",
      headerName: t("buyer") as string,
      width: 150,
      flex: 1,
      renderCell: (params) => (
        <Stack>
          <Avatar src={params?.value?.avatar} />
          <Typography>{params?.value?.username}</Typography>
        </Stack>
      )
    },
    {
      field: "method",
      headerName: t("method") as string,
      width: 150
    },
    {
      field: "amount",
      headerName: t("amount") as string,
      width: 150,
      renderCell: (params) => <Typography>{params.value.toFixed(4)}</Typography>
    },
    {
      field: "price",
      headerName: t("price") as string,
      width: 150,
      renderCell: (params) => <Typography>{params.value.toFixed(4)}</Typography>
    }
  ];

  return (
    <Stack spacing={3}>
      <DataGrid
        getRowId={(row: any) => row.id}
        columns={columns}
        rows={reformattedData}
      />
      <ToastContainer />
    </Stack>
  );
}
