import * as React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import {
  GridColDef,
  GridRenderCellParams,
  GridTreeNodeWithRender
} from "@mui/x-data-grid";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { useAccount } from "@/components/hooks/web3";
import { DataGrid } from "@/components/shared/DataGrid";
import { Dialog } from "@/components/shared/Dialog";
import { StyledButton } from "@/styles/components/Button";
import { ResponseExtendRowData } from "@/types/nftBook";

interface ResponseTableProps {
  data: ResponseExtendRowData[];
}

export default function ResponseTable({ data }: ResponseTableProps) {
  const matches = useMediaQuery("(min-width:700px)");

  const router = useRouter();
  const { t } = useTranslation("response");
  const { account } = useAccount();

  const [targetItem, setTargetItem] = React.useState<any>({});

  const [anchorDeleteButton, setAnchorDeleteButton] =
    React.useState<Element | null>(null);

  const openDeleteDialog = Boolean(anchorDeleteButton);

  const handleOpenDeleteDialogClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
  ) => {
    e.preventDefault();
    setAnchorDeleteButton(e.currentTarget);
    setTargetItem(params.row);
  };

  const handleDeleteClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: ResponseExtendRowData
  ) => {
    e.preventDefault();
    setAnchorDeleteButton(null);

    console.log(item.id);
  };

  const handleCancelDeleteClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorDeleteButton(null);
  };

  const handleDeleteClose = () => {
    setAnchorDeleteButton(null);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: t("id") as string,
      width: 100
    },
    {
      field: "time",
      headerName: t("time") as string,
      width: 200,
      renderCell: (params) => {
        return <Typography>{params.value} days</Typography>;
      }
    },
    {
      field: "amount",
      headerName: t("amount") as string,
      width: 150,
      renderCell: (params) => <Typography>{params.value}</Typography>
    },
    {
      field: "sender",
      headerName: t("sender") as string,
      flex: 1,
      minWidth: 250,
      renderCell: (params) => <Typography>{params.value}</Typography>
    },
    {
      field: "action",
      headerName: t("action") as string,
      sortable: false,
      width: 160,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            {/* <Tooltip title={t("tooltip_delete")}>
              <IconButton
                onClick={(e) => handleOpenDeleteDialogClick(e, params)}
              >
                {params?.value?.delete}
              </IconButton>
            </Tooltip> */}
          </Stack>
        );
      }
    }
  ];

  const mockData = [
    {
      id: 1,
      amount: 1,
      sender: "0xEg25....f2F2",
      time: 7,
      action: {
        delete: <DeleteOutlineOutlinedIcon />
      }
    },
    {
      id: 2,
      amount: 1,
      sender: "0xEg25....f2F3",
      time: 7,
      action: {
        delete: <DeleteOutlineOutlinedIcon />
      }
    },
    {
      id: 3,
      amount: 2,
      sender: "0xEg25....f2F3",
      time: 2,
      action: {
        delete: <DeleteOutlineOutlinedIcon />
      }
    },
    {
      id: 4,
      amount: 4,
      sender: "0xEg25....f2F3",
      time: 4,
      action: {
        delete: <DeleteOutlineOutlinedIcon />
      }
    },
    {
      id: 5,
      amount: 1,
      sender: "0xEg25....f2F4",
      time: 5,
      action: {
        delete: <DeleteOutlineOutlinedIcon />
      }
    }
  ];

  return (
    <Stack spacing={3}>
      <DataGrid
        getRowId={(row: any) => row.id}
        columns={columns}
        rows={data}
        // rows={mockData}
      />
      {/* <Dialog
        title={t("dialogTitleDelete") as string}
        open={openDeleteDialog}
        onClose={handleDeleteClose}
      >
        <Stack spacing={3}>
          <Typography>{t("message_delete")}</Typography>
          <Stack direction={{ xs: "column" }} spacing={{ xs: 1 }}>
            <Typography variant="body1">
              <b>Event:</b> {targetItem?.event}
            </Typography>
            <Typography variant="body1">
              <b>Price:</b> {targetItem?.price}
            </Typography>
            {targetItem?.from && (
              <Typography variant="body1">
                <b>From:</b> {targetItem?.from}
              </Typography>
            )}
            {targetItem?.to && (
              <Typography variant="body1">
                <b>To:</b> {targetItem?.to}
              </Typography>
            )}
            <Typography variant="body1">
              <b>Date:</b> {targetItem?.date}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={3} justifyContent="end">
            <StyledButton
              customVariant="secondary"
              onClick={(e) => handleCancelDeleteClick(e)}
            >
              {t("button_cancel")}
            </StyledButton>
            <StyledButton onClick={(e) => handleDeleteClick(e, targetItem)}>
              {t("button_delete")}
            </StyledButton>
          </Stack>
        </Stack>
      </Dialog> */}
      <ToastContainer />
    </Stack>
  );
}
