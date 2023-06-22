import * as React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { IconButton, Stack, Tooltip, Typography } from "@mui/material";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import {
  GridColDef,
  GridRenderCellParams,
  GridTreeNodeWithRender
} from "@mui/x-data-grid";
import styles from "@styles/Dashboard.module.scss";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { DataGrid } from "@/components/shared/DataGrid";
import { Dialog } from "@/components/shared/Dialog";
import { StyledButton } from "@/styles/components/Button";
import { DashboardRowData } from "@/types/nftBook";
import { secondsToDhms } from "@/utils/secondsToDays";
import { truncate } from "@/utils/truncate";

interface DashboardTableProps {
  data: DashboardRowData[];
}

export default function DashboardTable({ data }: DashboardTableProps) {
  const { t } = useTranslation("dashboard");

  const router = useRouter();

  const [targetItem, setTargetItem] = React.useState<any>([]);

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
    item: DashboardRowData
  ) => {
    e.preventDefault();
    // setAnchorAcceptButton(null);
    // acceptRequest(item.id, item.sender);
  };

  const handleCancelAcceptClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorAcceptButton(null);
  };

  const handleRefuseClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: DashboardRowData
  ) => {
    e.preventDefault();
    // setAnchorRefuseButton(null);
    // refuseRequest(item.id, item.sender);
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
      field: "title",
      headerName: t("title") as string,
      width: 100,
      renderCell: (params) => (
        <Typography className={styles.text__truncate}>
          {params.value}
        </Typography>
      )
    },
    {
      field: "bookSample",
      headerName: t("bookSample") as string,
      sortable: false,
      width: 180,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography className={styles.text__truncate}>
            {params.value}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: "bookCover",
      headerName: t("bookCover") as string,
      sortable: false,
      width: 180,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography className={styles.text__truncate}>
            {params.value}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: "nftUri",
      headerName: t("metadata") as string,
      sortable: false,
      width: 180,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography className={styles.text__truncate}>
            {params.value}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: "author",
      headerName: t("author") as string,
      flex: 1,
      minWidth: 180,
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
      field: "action",
      headerName: t("action") as string,
      sortable: false,
      width: 180,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title={t("tooltip_read")}>
              <IconButton
                onClick={() => {
                  // router.push("");
                }}
              >
                {params?.value?.read}
              </IconButton>
            </Tooltip>
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

  React.useEffect(() => {
    data.forEach((object) => {
      object.action = {
        read: <VisibilityOutlinedIcon />,
        accept: <CheckOutlinedIcon />,
        refuse: <CloseOutlinedIcon />
      };
    });
  }, [data]);

  return (
    <Stack spacing={3}>
      <DataGrid
        getRowId={(row: any) => row.tokenId}
        columns={columns}
        rows={data}
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
              <b>{t("title")}:</b> {targetItem?.title}
            </Typography>
            <Typography variant="body1" className={styles.text__truncate}>
              <b>{t("bookSample")}:</b>{" "}
              <Tooltip title={targetItem?.bookSample}>
                <Typography variant="body1" component="span">
                  {targetItem?.bookSample}
                </Typography>
              </Tooltip>
            </Typography>
            <Typography variant="body1" className={styles.text__truncate}>
              <b>{t("bookCover")}:</b>{" "}
              <Tooltip title={targetItem?.bookCover}>
                <Typography variant="body1" component="span">
                  {targetItem?.bookCover}
                </Typography>
              </Tooltip>
            </Typography>
            <Typography variant="body1" className={styles.text__truncate}>
              <b>{t("metadata")}:</b>{" "}
              <Tooltip title={targetItem?.nftUri}>
                <Typography variant="body1" component="span">
                  {targetItem?.nftUri}
                </Typography>
              </Tooltip>
            </Typography>
            <Typography variant="body1">
              <b>{t("author")}:</b>{" "}
              {targetItem?.author ? truncate(targetItem?.author, 12, -4) : ""}
            </Typography>
            <Typography variant="body1">
              <b>{t("time")}:</b>{" "}
              {targetItem.timestamp &&
                `${new Date(targetItem?.timestamp).toLocaleDateString(
                  "vi-VN"
                )}, ${new Date(targetItem?.timestamp).toLocaleTimeString(
                  "vi-VN"
                )}`}
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
              <b>{t("title")}:</b> {targetItem?.title}
            </Typography>
            <Typography variant="body1" className={styles.text__truncate}>
              <b>{t("bookSample")}:</b>{" "}
              <Tooltip title={targetItem?.bookSample}>
                <Typography variant="body1" component="span">
                  {targetItem?.bookSample}
                </Typography>
              </Tooltip>
            </Typography>
            <Typography variant="body1" className={styles.text__truncate}>
              <b>{t("bookCover")}:</b>{" "}
              <Tooltip title={targetItem?.bookCover}>
                <Typography variant="body1" component="span">
                  {targetItem?.bookCover}
                </Typography>
              </Tooltip>
            </Typography>
            <Typography variant="body1" className={styles.text__truncate}>
              <b>{t("metadata")}:</b>{" "}
              <Tooltip title={targetItem?.nftUri}>
                <Typography variant="body1" component="span">
                  {targetItem?.nftUri}
                </Typography>
              </Tooltip>
            </Typography>
            <Typography variant="body1">
              <b>{t("author")}:</b>{" "}
              {targetItem?.author ? truncate(targetItem?.author, 12, -4) : ""}
            </Typography>
            <Typography variant="body1">
              <b>{t("time")}:</b>{" "}
              {targetItem.timestamp &&
                `${new Date(targetItem?.timestamp).toLocaleDateString(
                  "vi-VN"
                )}, ${new Date(targetItem?.timestamp).toLocaleTimeString(
                  "vi-VN"
                )}`}
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
