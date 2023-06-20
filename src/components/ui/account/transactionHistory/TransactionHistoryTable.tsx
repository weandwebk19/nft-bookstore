import * as React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { IconButton, Stack, Tooltip, Typography } from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import {
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridTreeNodeWithRender
} from "@mui/x-data-grid";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { DataGrid } from "@/components/shared/DataGrid";
import { ExportButton } from "@/components/shared/DataGrid/ExportButton";
import { Dialog } from "@/components/shared/Dialog";
import { TransactionHistories } from "@/types/transactionHistories";
import { truncate } from "@/utils/truncate";

interface TransactionHistoryTableProps {
  data: TransactionHistories[];
}

export default function TransactionHistoryTable({
  data
}: TransactionHistoryTableProps) {
  const { t } = useTranslation("transactionHistory");

  const { locale } = useRouter();

  const [targetItem, setTargetItem] = React.useState<any>([]);

  const [anchorInfoButton, setAnchorInfoButton] =
    React.useState<Element | null>(null);

  const openInfoDialog = Boolean(anchorInfoButton);

  const handleOpenInfoDialogClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
  ) => {
    e.preventDefault();
    setAnchorInfoButton(e.currentTarget);
    setTargetItem(params);
  };

  const handleInfoClose = () => {
    setAnchorInfoButton(null);
  };

  const columns: GridColDef[] = [
    {
      field: "transactionName",
      headerName: t("method") as string,
      width: 120,
      renderCell: (params) => {
        let value =
          locale === "en" ? params.value : params?.row?.transactionNameVi;

        return <Typography>{value}</Typography>;
      }
    },
    {
      field: "transactionHash",
      headerName: t("hash") as string,
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <Typography>{truncate(params.value, 12, -4)}</Typography>
      )
    },
    {
      field: "amount",
      headerName: t("amount") as string,
      width: 100,
      renderCell: (params) => <Typography>{params.value.toFixed(4)}</Typography>
    },
    {
      field: "currentBalance",
      headerName: t("balance") as string,
      width: 100,
      renderCell: (params) => (
        <Typography>{parseFloat(params.value).toFixed(4)}</Typography>
      )
    },
    {
      field: "fromAddress",
      headerName: t("from") as string,
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <Typography>{truncate(params.value, 12, -4)}</Typography>
      )
    },
    {
      field: "toAddress",
      headerName: t("to") as string,
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <Typography>{truncate(params.value, 12, -4)}</Typography>
      )
    },
    {
      field: "timestamp",
      headerName: t("time") as string,
      width: 180,
      renderCell: (params) => (
        <Typography>
          {`${new Date(params.value).toLocaleDateString("vi-VN")}, ${new Date(
            params.value
          ).toLocaleTimeString("vi-VN")}`}
        </Typography>
      )
    },
    {
      field: "detail",
      headerName: "",
      width: 60,
      sortable: false,
      renderCell: (params) => {
        let value = locale === "en" ? params.value : params?.row?.detailVi;
        let detail = value.split(", ");

        detail = detail.map((item: string) => {
          const value = item.split(" = ");
          value[0] = value[0].charAt(0).toUpperCase() + value[0].slice(1);
          return value;
        });

        return (
          <Tooltip title={t("tooltip_additionalInfo")}>
            <IconButton onClick={(e) => handleOpenInfoDialogClick(e, detail)}>
              <VisibilityOutlinedIcon />
            </IconButton>
          </Tooltip>
        );
      }
    }
  ];

  function CustomToolbar(props: any) {
    return (
      <GridToolbarContainer {...props}>
        <ExportButton />
      </GridToolbarContainer>
    );
  }

  return (
    <Stack spacing={3}>
      <DataGrid
        getRowId={(row: any) => row.id}
        columns={columns}
        rows={data}
        components={{ Toolbar: CustomToolbar }}
        // slots={{ toolbar: GridToolbar }}
      />
      <Dialog
        title={t("dialogTitleInfo") as string}
        open={openInfoDialog}
        onClose={handleInfoClose}
      >
        <Stack spacing={3}>
          <Stack direction={{ xs: "column" }} spacing={{ xs: 1 }}>
            {targetItem.length > 0 &&
              targetItem.map((item: any, i: number) => (
                <Typography variant="body1" key={i}>
                  <b>{item[0]}:</b> {item[1]}
                </Typography>
              ))}
          </Stack>
        </Stack>
      </Dialog>
      <ToastContainer />
    </Stack>
  );
}
