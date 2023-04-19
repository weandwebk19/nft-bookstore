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

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import {
  GridColDef,
  GridRenderCellParams,
  GridTreeNodeWithRender
} from "@mui/x-data-grid";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { ParamType } from "ethers/lib/utils.js";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { useLocalStorage } from "@/components/hooks/common";
import { useAccount } from "@/components/hooks/web3";
import { DataGrid } from "@/components/shared/DataGrid";
import { Dialog } from "@/components/shared/Dialog";
import { Image } from "@/components/shared/Image";
import { StyledButton } from "@/styles/components/Button";
import { WatchlistRowData } from "@/types/watchlist";

interface RequestTableProps {
  data: WatchlistRowData[];
}

export default function RequestTable({ data }: RequestTableProps) {
  const matches = useMediaQuery("(min-width:700px)");

  const router = useRouter();
  const { t } = useTranslation("request");
  const { account } = useAccount();

  const [targetItem, setTargetItem] = React.useState<any>({});

  const [anchorDeleteButton, setAnchorDeleteButton] =
    React.useState<Element | null>(null);
  const [anchorAcceptButton, setAnchorAcceptButton] =
    React.useState<Element | null>(null);

  const openDeleteDialog = Boolean(anchorDeleteButton);
  const openAcceptDialog = Boolean(anchorAcceptButton);

  const handleOpenDeleteDialogClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
  ) => {
    e.preventDefault();
    setAnchorDeleteButton(e.currentTarget);
    setTargetItem(params.row);
  };

  const handleOpenAcceptDialogClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
  ) => {
    e.preventDefault();
    setAnchorAcceptButton(e.currentTarget);
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
          console.log("Res:", res);
          if (res.data.success) {
            toast.success("Delete this request successfully!", {
              position: toast.POSITION.TOP_RIGHT
            });
          } else {
            toast.error("Delete this request failed!", {
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

  const handleAcceptClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: WatchlistRowData
  ) => {
    e.preventDefault();
    setAnchorAcceptButton(null);

    console.log(item.tokenId);
    // console.log(account.data);
    (async () => {
      try {
        if (account.data) {
        }
      } catch (err: any) {
        toast.error(err.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    })();
  };

  const handleRefuseAcceptClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: WatchlistRowData
  ) => {
    e.preventDefault();
    setAnchorAcceptButton(null);
    console.log("Refusing to accept:", item.tokenId);
  };

  const handleDeleteClose = () => {
    setAnchorDeleteButton(null);
  };

  const handleAcceptClose = () => {
    setAnchorAcceptButton(null);
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
            <Tooltip title={t("tooltip_accept")}>
              <IconButton
                onClick={(e) => handleOpenAcceptDialogClick(e, params)}
              >
                {params?.value?.accept}
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
        delete: <DeleteOutlineOutlinedIcon />,
        accept: <CheckOutlinedIcon />
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
        delete: <DeleteOutlineOutlinedIcon />,
        accept: <CheckOutlinedIcon />
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
        delete: <DeleteOutlineOutlinedIcon />,
        accept: <CheckOutlinedIcon />
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
        delete: <DeleteOutlineOutlinedIcon />,
        accept: <CheckOutlinedIcon />
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
        delete: <DeleteOutlineOutlinedIcon />,
        accept: <CheckOutlinedIcon />
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
        delete: <DeleteOutlineOutlinedIcon />,
        accept: <CheckOutlinedIcon />
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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Box>
              <Typography variant="body1">
                Event: {targetItem?.event}
              </Typography>
              <Typography variant="body1">
                Price: {targetItem?.price}
              </Typography>
              {targetItem?.from && (
                <Typography variant="body1">
                  From: {targetItem?.from}
                </Typography>
              )}
              {targetItem?.to && (
                <Typography variant="body1">To: {targetItem?.to}</Typography>
              )}
              <Typography variant="body1">Date: {targetItem?.date}</Typography>
            </Box>
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
      <Dialog
        title={t("dialogTitleAccept") as string}
        open={openAcceptDialog}
        onClose={handleAcceptClose}
      >
        <Stack spacing={3}>
          <Typography>{t("message_accept")}</Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Box>
              <Typography variant="body1">
                Event: {targetItem?.event}
              </Typography>
              <Typography variant="body1">
                Price: {targetItem?.price}
              </Typography>
              {targetItem?.from && (
                <Typography variant="body1">
                  From: {targetItem?.from}
                </Typography>
              )}
              {targetItem?.to && (
                <Typography variant="body1">To: {targetItem?.to}</Typography>
              )}
              <Typography variant="body1">Date: {targetItem?.date}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={3} justifyContent="end">
            <StyledButton
              customVariant="secondary"
              onClick={(e) => handleRefuseAcceptClick(e, targetItem)}
            >
              {t("button_refuse")}
            </StyledButton>
            <StyledButton onClick={(e) => handleAcceptClick(e, targetItem)}>
              {t("button_accept")}
            </StyledButton>
          </Stack>
        </Stack>
      </Dialog>
      <ToastContainer />
    </Stack>
  );
}
