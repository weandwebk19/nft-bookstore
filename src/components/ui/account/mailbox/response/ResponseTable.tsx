import * as React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
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
import { secondsToDhms } from "@/utils/secondsToDays";
import { truncate } from "@/utils/truncate";

interface ResponseTableProps {
  data: ResponseExtendRowData[];
}

export default function ResponseTable({ data }: ResponseTableProps) {
  const matches = useMediaQuery("(min-width:700px)");

  const router = useRouter();
  const { t } = useTranslation("response");
  const { account } = useAccount();

  const [targetItem, setTargetItem] = React.useState<any>({});

  const [anchorAcceptButton, setAnchorAcceptButton] =
    React.useState<Element | null>(null);
  const [anchorRefuseButton, setAnchorRefuseButton] =
    React.useState<Element | null>(null);

  const openAcceptDialog = Boolean(anchorAcceptButton);
  const openRefuseDialog = Boolean(anchorRefuseButton);

  const handleOpenAcceptDialogClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
  ) => {
    e.preventDefault();
    setAnchorAcceptButton(e.currentTarget);
    setTargetItem(params.row);
  };

  const handleOpenRefuseDialogClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
  ) => {
    e.preventDefault();
    setAnchorRefuseButton(e.currentTarget);
    setTargetItem(params.row);
  };

  const handleAcceptClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: ResponseExtendRowData
  ) => {
    e.preventDefault();
    // setAnchorAcceptButton(null);

    console.log("Accept:", item.id);

    // handle logic here ...
  };

  const handleCancelAcceptClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorAcceptButton(null);
  };

  const handleRefuseClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: ResponseExtendRowData
  ) => {
    e.preventDefault();
    // setAnchorRefuseButton(null);

    console.log("Refuse:", item.id);

    // handle logic here ...
  };

  const handleCancelRefuseClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorRefuseButton(null);
  };

  const handleAcceptClose = () => {
    setAnchorAcceptButton(null);
  };

  const handleRefuseClose = () => {
    setAnchorRefuseButton(null);
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
      width: 150,
      renderCell: (params) => {
        return (
          <Typography>
            {secondsToDhms(params.value)}{" "}
            {secondsToDhms(params.value) > 1 ? t("days") : t("day")}
          </Typography>
        );
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
      renderCell: (params) => (
        <Typography>{truncate(params.value, 12, -4)}</Typography>
      )
    },
    {
      field: "action",
      headerName: t("action") as string,
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title={t("tooltip_accept")}>
              <IconButton
                onClick={(e) => handleOpenAcceptDialogClick(e, params)}
              >
                {params?.value?.accept}
              </IconButton>
            </Tooltip>
            <Tooltip title={t("tooltip_refuse")}>
              <IconButton
                onClick={(e) => handleOpenRefuseDialogClick(e, params)}
              >
                {params?.value?.refuse}
              </IconButton>
            </Tooltip>
          </Stack>
        );
      }
    }
  ];

  const mockData = [
    {
      id: 1,
      amount: 1,
      sender: "0xB2aa8d249c8addFDA77d8bD5813d5080A39D91BB",
      time: 7 * 24 * 60 * 60,
      action: {
        delete: <DeleteOutlineOutlinedIcon />,
        accept: <CheckOutlinedIcon />,
        refuse: <CloseOutlinedIcon />
      }
    },
    {
      id: 2,
      amount: 1,
      sender: "0xB2aa8d249c8addFDA77d8bD5813d5080A39D91BC",
      time: 1 * 24 * 60 * 60,
      action: {
        delete: <DeleteOutlineOutlinedIcon />,
        accept: <CheckOutlinedIcon />,
        refuse: <CloseOutlinedIcon />
      }
    },
    {
      id: 3,
      amount: 2,
      sender: "0xB2aa8d249c8addFDA77d8bD5813d5080A39D91BC",
      time: 2 * 24 * 60 * 60,
      action: {
        delete: <DeleteOutlineOutlinedIcon />,
        accept: <CheckOutlinedIcon />,
        refuse: <CloseOutlinedIcon />
      }
    },
    {
      id: 4,
      amount: 4,
      sender: "0xB2aa8d249c8addFDA77d8bD5813d5080A39D91BC",
      time: 4 * 24 * 60 * 60,
      action: {
        delete: <DeleteOutlineOutlinedIcon />,
        accept: <CheckOutlinedIcon />,
        refuse: <CloseOutlinedIcon />
      }
    },
    {
      id: 5,
      amount: 1,
      sender: "0xB2aa8d249c8addFDA77d8bD5813d5080A39D91BD",
      time: 5 * 24 * 60 * 60,
      action: {
        delete: <DeleteOutlineOutlinedIcon />,
        accept: <CheckOutlinedIcon />,
        refuse: <CloseOutlinedIcon />
      }
    }
  ];

  React.useEffect(() => {
    data.forEach((object) => {
      object.action = {
        delete: <DeleteOutlineOutlinedIcon />,
        accept: <CheckOutlinedIcon />,
        refuse: <CloseOutlinedIcon />
      };
    });
  }, [data]);

  return (
    <Stack spacing={3}>
      <DataGrid
        getRowId={(row: any) => row.id}
        columns={columns}
        rows={data}
        // rows={mockData}
      />
      <Dialog
        title={t("dialogTitleAccept") as string}
        open={openAcceptDialog}
        onClose={handleAcceptClose}
      >
        <Stack spacing={3}>
          <Typography>{t("message_accept")}</Typography>
          <Stack direction={{ xs: "column" }} spacing={{ xs: 1 }}>
            <Typography variant="body1">
              <b>{t("id")}:</b> {targetItem?.id}
            </Typography>
            <Typography variant="body1">
              <b>{t("sender")}:</b>{" "}
              {targetItem?.sender ? truncate(targetItem?.sender, 12, -4) : ""}
            </Typography>
            <Typography variant="body1">
              <b>{t("amount")}:</b> {targetItem?.amount}
            </Typography>
            <Typography variant="body1">
              <b>{t("time")}:</b> {secondsToDhms(targetItem?.time)}{" "}
              {targetItem.time && secondsToDhms(targetItem.time) > 1
                ? t("days")
                : t("day")}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={3} justifyContent="end">
            <StyledButton
              customVariant="secondary"
              onClick={(e) => handleCancelAcceptClick(e)}
            >
              {t("button_cancel")}
            </StyledButton>
            <StyledButton onClick={(e) => handleAcceptClick(e, targetItem)}>
              {t("button_accept")}
            </StyledButton>
          </Stack>
        </Stack>
      </Dialog>
      <Dialog
        title={t("dialogTitleRefuse") as string}
        open={openRefuseDialog}
        onClose={handleRefuseClose}
      >
        <Stack spacing={3}>
          <Typography>{t("message_refuse")}</Typography>
          <Stack direction={{ xs: "column" }} spacing={{ xs: 1 }}>
            <Typography variant="body1">
              <b>{t("id")}:</b> {targetItem?.id}
            </Typography>
            <Typography variant="body1">
              <b>{t("sender")}:</b>{" "}
              {targetItem?.sender ? truncate(targetItem?.sender, 12, -4) : ""}
            </Typography>
            <Typography variant="body1">
              <b>{t("amount")}:</b> {targetItem?.amount}
            </Typography>
            <Typography variant="body1">
              <b>{t("time")}:</b> {secondsToDhms(targetItem?.time)}{" "}
              {targetItem.time && secondsToDhms(targetItem.time) > 1
                ? t("days")
                : t("day")}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={3} justifyContent="end">
            <StyledButton
              customVariant="secondary"
              onClick={(e) => handleCancelRefuseClick(e)}
            >
              {t("button_cancel")}
            </StyledButton>
            <StyledButton onClick={(e) => handleRefuseClick(e, targetItem)}>
              {t("button_refuse")}
            </StyledButton>
          </Stack>
        </Stack>
      </Dialog>
      <ToastContainer />
    </Stack>
  );
}
