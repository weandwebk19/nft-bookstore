import * as React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import {
  GridColDef,
  GridRenderCellParams,
  GridTreeNodeWithRender
} from "@mui/x-data-grid";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { useTranslation } from "next-i18next";

import { useAccount } from "@/components/hooks/web3";
import { DataGrid } from "@/components/shared/DataGrid";
import { Dialog } from "@/components/shared/Dialog";
import { Image } from "@/components/shared/Image";
import { StyledButton } from "@/styles/components/Button";
import { TransactionHistories } from "@/types/transactionHistories";
import { WatchlistRowData } from "@/types/watchlist";
import { truncate } from "@/utils/truncate";

interface TransactionHistoryTableProps {
  data: TransactionHistories[];
}

export default function TransactionHistoryTable({
  data
}: TransactionHistoryTableProps) {
  const { t } = useTranslation("transactionHistory");
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
      field: "transactionName",
      headerName: t("name") as string,
      width: 100,
      renderCell: (params) => <Typography>{params.value}</Typography>
    },
    {
      field: "transactionHash",
      headerName: t("hash") as string,
      sortable: false,
      width: 170,
      renderCell: (params) => (
        <Typography>{truncate(params.value, 12, -4)}</Typography>
      )
    },
    {
      field: "amount",
      headerName: t("amount") as string,
      width: 90,
      renderCell: (params) => <Typography>{params.value.toFixed(4)}</Typography>
    },
    {
      field: "currentBalance",
      headerName: t("balance") as string,
      width: 90,
      renderCell: (params) => (
        <Typography>{parseFloat(params.value).toFixed(4)}</Typography>
      )
    },
    {
      field: "fromAddress",
      headerName: t("from") as string,
      width: 170,
      sortable: false,
      renderCell: (params) => (
        <Typography>{truncate(params.value, 12, -4)}</Typography>
      )
    },
    {
      field: "toAddress",
      headerName: t("to") as string,
      width: 170,
      sortable: false,
      renderCell: (params) => (
        <Typography>{truncate(params.value, 12, -4)}</Typography>
      )
    },
    {
      field: "detail",
      headerName: t("detail") as string,
      width: 200,
      sortable: false,
      renderCell: (params) => {
        let detail = params.value.split(", ");
        // console.log("detail:", detail);

        detail = detail.map((item: string) => {
          const value = item.split(" = ");
          return value;
        });

        // console.log("detail2:", detail);

        return <Typography>{params.value}</Typography>;
      }
    },
    {
      field: "timestamp",
      headerName: t("time") as string,
      width: 170,
      renderCell: (params) => (
        <Typography>
          {`${new Date(params.value).toLocaleDateString("vi-VN")}, ${new Date(
            params.value
          ).toLocaleTimeString("vi-VN")}`}
        </Typography>
      )
    }
  ];

  // React.useEffect(() => {
  //   data.forEach((object) => {
  //     object.action = <DeleteOutlineOutlinedIcon />;
  //   });
  // }, [data]);

  const mockData = [
    {
      id: "64610f00e3635f5a64a036f4",
      tokenId: 1,
      amount: -0.025725916004355497,
      currentBalance: "104.323474521973448154",
      transactionName: "Mint book",
      transactionHash:
        "0x40a9f99eef09934a097c6e31c94f785b28d589b39f58c04abdbec82c24518980",
      fromAddress: "0xB2aa8d249c8addFDA77d8bD5813d5080A39D91BB",
      toAddress: "0xFF0A6D0E0d5d32A685d963b907f95AD954f6adb7",
      detail:
        "Gas fee = 0.000725916004355496, listing fee = 0.025, total fee = 0.025725916004355497 ETH",
      timestamp: "2023-05-14T16:40:31.715Z"
    },
    {
      id: "64610fade3635f5a64a036f9",
      tokenId: 2,
      amount: -0.05617701128473944,
      currentBalance: "104.297799905969400458",
      transactionName: "Mint book",
      transactionHash:
        "0x536941fee6598ad296e8172cd59a7a9f6a75852152fb0d259f9ee89aa88f16fb",
      fromAddress: "0xB2aa8d249c8addFDA77d8bD5813d5080A39D91BB",
      toAddress: "0xFF0A6D0E0d5d32A685d963b907f95AD954f6adb7",
      detail:
        "Gas fee = 0.03117701128473944, listing fee = 0.025, total fee = 0.05617701128473944 ETH",
      timestamp: "2023-05-14T16:43:24.988Z"
    },
    {
      id: "64611021e3635f5a64a036fe",
      tokenId: 1,
      amount: -0.02533321150199927,
      currentBalance: "104.272466694467401189",
      transactionName: "Sell book",
      transactionHash:
        "0xd4ef7653ec7a1f5f6b0aa6761446432411e709498ab946fa4a74237b23221106",
      fromAddress: "0xB2aa8d249c8addFDA77d8bD5813d5080A39D91BB",
      toAddress: "0xFF0A6D0E0d5d32A685d963b907f95AD954f6adb7",
      detail:
        "Gas fee = 0.000333211501999269, listing fee =  0.025, total fee = 0.02533321150199927 ETH",
      timestamp: "2023-05-14T16:45:21.264Z"
    }
  ];

  return (
    <Stack spacing={3}>
      <DataGrid getRowId={(row: any) => row.id} columns={columns} rows={data} />
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
