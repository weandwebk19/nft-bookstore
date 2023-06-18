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

interface WatchlistTableProps {
  data: WatchlistRowData[];
}

export default function WatchlistTable({ data }: WatchlistTableProps) {
  const matches = useMediaQuery("(min-width:700px)");

  const router = useRouter();
  const { t } = useTranslation("watchlist");
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
    (async () => {
      try {
        if (account.data) {
          const res = await axios.delete(
            `/api/watchlists/${account.data}/${item.tokenId}/delete`
          );
          if (res.data.success) {
            toast.success("Remove book from watchlists successfully !", {
              position: toast.POSITION.TOP_RIGHT
            });
          } else {
            toast.error("Remove book from watchlists error !", {
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

  const handleCancelClick = (
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
      flex: 0.1
    },
    {
      field: "bookCover",
      headerName: t("bookCover") as string,
      width: 150,
      renderCell: (params) => (
        <Box sx={{ p: 1, ml: -1 }}>
          <Image
            src={params.value}
            alt={params.value}
            sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
            className={styles["book-item__book-cover"]}
          />
        </Box>
      )
    },
    {
      field: "title",
      headerName: t("title") as string,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="h6">{params.value}</Typography>
      ),
      minWidth: 250
    },
    {
      field: "author",
      headerName: t("author") as string,
      renderCell: (params) => <Typography>{params.value}</Typography>,
      width: 110
    },
    {
      field: "status",
      headerName: t("status") as string,
      width: 200,
      renderCell: (params) => (
        // <Chip label={params.value[1]} color={params.value[0]} />
        <Chip label={params.value} />
      )
    },
    {
      field: "action",
      headerName: t("action") as string,
      sortable: false,
      width: 160,
      renderCell: (params) => (
        <Tooltip title={t("tooltip_delete")}>
          <IconButton onClick={(e) => handleOpenDeleteDialogClick(e, params)}>
            {params.value}
          </IconButton>
        </Tooltip>
      )
    }
  ];

  React.useEffect(() => {
    data.forEach((object) => {
      object.action = <DeleteOutlineOutlinedIcon />;
    });
  }, [data]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={3}>
        <Typography>{t("filter")}:</Typography>
        <ButtonGroup orientation={`${matches ? `horizontal` : `vertical`}`}>
          <Button
            variant={
              router.query.filter === undefined ? "contained" : "outlined"
            }
            onClick={() => {
              router.push("/account/watchlist");
            }}
          >
            {t("all")}
          </Button>
          <Button
            variant={
              router.query.filter === "just-published"
                ? "contained"
                : "outlined"
            }
            onClick={() => {
              router.push("/account/watchlist?filter=just-published");
            }}
          >
            {t("justPublished")}
          </Button>
          <Button
            variant={
              router.query.filter === "waiting-for-open"
                ? "contained"
                : "outlined"
            }
            onClick={() => {
              router.push("/account/watchlist?filter=waiting-for-open");
            }}
          >
            {t("waitingForOpen")}
          </Button>
          <Button
            variant={
              router.query.filter === "lendings" ? "contained" : "outlined"
            }
            onClick={() => {
              router.push("/account/watchlist?filter=lendings");
            }}
          >
            {t("lendings")}
          </Button>
          <Button
            variant={
              router.query.filter === "listings" ? "contained" : "outlined"
            }
            onClick={() => {
              router.push("/account/watchlist?filter=listings");
            }}
          >
            {t("listings")}
          </Button>
          <Button
            variant={
              router.query.filter === "frozen" ? "contained" : "outlined"
            }
            onClick={() => {
              router.push("/account/watchlist?filter=frozen");
            }}
          >
            {t("frozen")}
          </Button>
        </ButtonGroup>
      </Stack>
      <DataGrid
        getRowId={(row: any) => row.tokenId}
        columns={columns}
        rows={data}
      />
      <Dialog
        title={t("dialogTitle") as string}
        open={openDeleteDialog}
        onClose={handleDeleteClose}
      >
        <Stack spacing={3}>
          <Typography>{t("message")}</Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Image
              src={targetItem?.bookCover}
              alt={targetItem?.title}
              sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
              className={styles["book-item__book-cover"]}
            />
            <Box>
              <Typography variant="h5">{targetItem?.title}</Typography>
              <Typography variant="h4">{targetItem?.author}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={3} justifyContent="end">
            <StyledButton
              customVariant="secondary"
              onClick={(e) => handleCancelClick(e)}
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
