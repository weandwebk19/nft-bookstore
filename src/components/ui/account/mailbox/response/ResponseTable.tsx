import * as React from "react";
import { useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { IconButton, Stack, Tooltip, Typography } from "@mui/material";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import {
  GridColDef,
  GridRenderCellParams,
  GridTreeNodeWithRender
} from "@mui/x-data-grid";
import { ethers } from "ethers";
import { useTranslation } from "next-i18next";

import { useAccount } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { DataGrid } from "@/components/shared/DataGrid";
import { Dialog } from "@/components/shared/Dialog";
import { createTransactionHistory, getGasFee } from "@/components/utils";
import { StyledButton } from "@/styles/components/Button";
import { ResponseExtendRowData } from "@/types/nftBook";
import { secondsToDhms } from "@/utils/secondsToDays";
import { truncate } from "@/utils/truncate";

interface ResponseTableProps {
  data: ResponseExtendRowData[];
}

export default function ResponseTable({ data }: ResponseTableProps) {
  const { t } = useTranslation("response");
  const { account } = useAccount();
  const { provider, bookStoreContract, bookRentingContract } = useWeb3();

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

  const acceptResponse = useCallback(
    async (
      idBorrowedBook: number,
      renter: string,
      amount: number,
      time: number
    ) => {
      try {
        const borrowedBook = await bookRentingContract?.getBorrowedBookFromId(
          idBorrowedBook
        );
        const totalPrice = (
          (parseFloat(ethers.utils.formatEther(borrowedBook?.price!)) *
            amount *
            time) /
          604800
        ).toFixed(3);

        const tx = await bookStoreContract?.transferForSendedRequest(
          idBorrowedBook,
          renter,
          true,
          {
            value: ethers.utils.parseEther(totalPrice)
          }
        );

        const receipt: any = await toast.promise(tx!.wait(), {
          pending: "Pending.",
          success: "Accept response successfully",
          error: "Oops! There's a problem with accept process!"
        });

        if (receipt) {
          const gasFee = await getGasFee(provider, receipt);

          const createTransactionHistoryForBorrower = async (
            borrowerAddress: string,
            renterAddress: string,
            totalPrice: string,
            gasFee: string,
            transactionHash: string
          ) => {
            // Caculate total fee
            const totalFee = 0 - parseFloat(totalPrice) - parseFloat(gasFee);
            // Get current balance of account
            const balance = await provider?.getBalance(borrowerAddress);
            const balanceInEther = ethers.utils.formatEther(balance!);
            await createTransactionHistory(
              NaN,
              totalFee,
              balanceInEther,
              "Extend borrow book",
              transactionHash,
              borrowerAddress,
              renterAddress,
              `Gas fee = ${gasFee} ETH, Extend fee = ${parseFloat(
                totalPrice
              )} ETH, total price = ${-totalFee} ETH`
            );
          };

          const createTransactionHistoryForRenter = async (
            borrowerAddress: string,
            renterAddress: string,
            totalPrice: string,
            transactionHash: string
          ) => {
            // Get current balance of account
            const balance = await provider?.getBalance(renterAddress);
            const balanceInEther = ethers.utils.formatEther(balance!);
            await createTransactionHistory(
              NaN,
              parseFloat(totalPrice),
              balanceInEther,
              "From extend borrow book",
              transactionHash,
              renterAddress,
              borrowerAddress,
              `Total price received = ${parseFloat(totalPrice)} ETH`
            );
          };

          await createTransactionHistoryForBorrower(
            account.data!,
            renter,
            totalPrice,
            gasFee,
            receipt.transactionHash
          );
          await createTransactionHistoryForRenter(
            account.data!,
            renter,
            totalPrice,
            receipt.transactionHash
          );
        }
      } catch (err: any) {
        toast.error(`${err.message.substr(0, 65)}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      }
    },
    [bookRentingContract, bookStoreContract, provider, account.data]
  );

  const refuseResponse = useCallback(
    async (
      idBorrowedBook: number,
      renter: string,
      amount: number,
      time: number
    ) => {
      try {
        const borrowedBook = await bookRentingContract?.getBorrowedBookFromId(
          idBorrowedBook
        );
        const totalPrice = (
          (parseFloat(ethers.utils.formatEther(borrowedBook?.price!)) *
            amount *
            time) /
          604800
        ).toFixed(3);

        const tx = await bookStoreContract?.transferForSendedRequest(
          idBorrowedBook,
          renter,
          false,
          {
            value: ethers.utils.parseEther(totalPrice)
          }
        );

        const receipt: any = await toast.promise(tx!.wait(), {
          pending: "Pending.",
          success: "Refuse response successfully",
          error: "Oops! There's a problem with refuse process!"
        });
      } catch (err: any) {
        toast.error(`${err.message.substr(0, 65)}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      }
    },
    [bookStoreContract, bookRentingContract]
  );

  const handleAcceptClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: ResponseExtendRowData
  ) => {
    e.preventDefault();
    // setAnchorAcceptButton(null);
    acceptResponse(item.id, item.sender, item.amount, item.time);
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

    refuseResponse(item.id, item.sender, item.amount, item.time);
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
      <DataGrid getRowId={(row: any) => row.id} columns={columns} rows={data} />
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
