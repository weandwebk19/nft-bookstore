import * as React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import {
  GridColDef,
  GridRenderCellParams,
  GridTreeNodeWithRender
} from "@mui/x-data-grid";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { useAccount } from "@/components/hooks/web3";
import { DataGrid } from "@/components/shared/DataGrid";
import { Dialog } from "@/components/shared/Dialog";
import { Image } from "@/components/shared/Image";
import { StyledButton } from "@/styles/components/Button";
import { WatchlistRowData } from "@/types/watchlist";

interface ResponseTableProps {
  data: WatchlistRowData[];
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
    item: WatchlistRowData
  ) => {
    e.preventDefault();
    setAnchorDeleteButton(null);

    console.log(item.tokenId);
    console.log(account.data);
    (async () => {
      try {
        if (account.data) {
          const res = await axios.delete(
            `/api/watchlists/${account.data}/${item.tokenId}/delete`
          );
          if (res.data.success) {
            toast.success("Remove book from inboxes successfully !", {
              position: toast.POSITION.TOP_RIGHT
            });
          } else {
            toast.error("Remove book from inboxes error !", {
              position: toast.POSITION.TOP_RIGHT
            });
          }
        }
      } catch (err: any) {
        toast.error(err.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    })();
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
      field: "event",
      headerName: t("event") as string,
      renderCell: (params) => {
        return <Typography>{params.value}</Typography>;
      },
      flex: 1,
      minWidth: 200
    },
    {
      field: "price",
      headerName: t("price") as string,
      renderCell: (params) => <Typography>{params.value}</Typography>,
      width: 150
    },
    {
      field: "from",
      headerName: t("from") as string,
      width: 200,
      renderCell: (params) => <Typography>{params.value}</Typography>
    },
    {
      field: "to",
      headerName: t("to") as string,
      width: 200,
      renderCell: (params) => <Typography>{params.value}</Typography>
    },
    {
      field: "date",
      headerName: t("date") as string,
      width: 200,
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
            <Tooltip title={t("tooltip_delete")}>
              <IconButton
                onClick={(e) => handleOpenDeleteDialogClick(e, params)}
              >
                {params?.value?.delete}
              </IconButton>
            </Tooltip>
          </Stack>
        );
      }
    }
  ];

  React.useEffect(() => {
    data.forEach((object) => {
      object.action = <DeleteOutlineOutlinedIcon />;
    });
  }, [data]);

  const mockData = [
    {
      tokenId: 1,
      event: "Sell listing",
      price: "0.5 ETH",
      from: "0xEg25....f2F2",
      to: "",
      date: "2 months ago",
      action: {
        delete: <DeleteOutlineOutlinedIcon />
      }
    },
    {
      tokenId: 2,
      event: "Purchased",
      price: "0.4 ETH",
      from: "0xEg25....f2F3",
      to: "0xEg25....f2F2",
      date: "3 months ago",
      action: {
        delete: <DeleteOutlineOutlinedIcon />
      }
    },
    {
      tokenId: 3,
      event: "Sell listing",
      price: "0.4 ETH",
      from: "0xEg25....f2F3",
      to: "",
      date: "4 months ago",
      action: {
        delete: <DeleteOutlineOutlinedIcon />
      }
    },
    {
      tokenId: 4,
      event: "Cancel trade",
      price: "",
      from: "0xEg25....f2F3",
      to: "",
      date: "4 months ago",
      action: {
        delete: <DeleteOutlineOutlinedIcon />
      }
    },
    {
      tokenId: 5,
      event: "Sell listing",
      price: "0.4 ETH",
      from: "0xEg25....f2F4",
      to: "0xEg25....f2F2",
      date: "5 months ago",
      action: {
        delete: <DeleteOutlineOutlinedIcon />
      }
    },
    {
      tokenId: 6,
      event: "Claimed",
      price: "",
      from: "0xEg25....f2F4",
      to: "",
      date: "6 months ago",
      action: {
        delete: <DeleteOutlineOutlinedIcon />
      }
    }
  ];

  return (
    <Stack spacing={3}>
      <DataGrid
        getRowId={(row: any) => row.tokenId}
        columns={columns}
        // rows={data}
        rows={mockData}
      />
      <Dialog
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
      </Dialog>
      <ToastContainer />
    </Stack>
  );
}
