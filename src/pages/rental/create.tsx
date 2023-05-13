import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Box,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

import { yupResolver } from "@hookform/resolvers/yup";
import { Alert } from "@mui/lab";
import axios from "axios";
import { ethers } from "ethers";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import * as yup from "yup";

import { useTransactionHistories } from "@/components/hooks/api";
import { useAccount, useBookDetail, useNetwork } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import {
  FinalStep,
  Step1,
  Step2,
  Step3
} from "@/components/ui/books/create/steps";
import { StyledButton } from "@/styles/components/Button";
import { BookInfo, NftBookMeta, PinataRes } from "@/types/nftBook";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

import { deleteFile } from "../api/utils";

const Book = () => {
  const formRef = useRef<any>();
  const { provider, ethereum, bookStoreContract } = useWeb3();
  const { network } = useNetwork();
  const { account } = useAccount();
  const transactions = useTransactionHistories(account.data!);
  console.log(transactions);

  const getSignedData = async () => {
    const messageToSign = await axios.get("/api/metadata/verify");
    const accounts = (await ethereum?.request({
      method: "eth_requestAccounts"
    })) as string[];
    const account = accounts[0];

    const signedData = await ethereum?.request({
      method: "personal_sign",
      params: [
        JSON.stringify(messageToSign.data),
        account,
        messageToSign.data.id
      ]
    });

    return { signedData, account };
  };

  useEffect(() => {
    const getTransactionHistory = async () => {
      try {
        // Get latest block number
        // const latestBlockNumber = (await provider?.getBlockNumber()) as number;
        // const transactions: any[] = [];
        // for (let i = 0; i <= latestBlockNumber; i++) {
        //   const block = await provider?.getBlock(i);
        //   console.log("block", block);
        //   if (block && block.transactions.length > 0) {
        //     block.transactions.forEach((tx) => {
        //       // if (tx.from === account.data || tx.to === account.data) {
        //       //   transactions.push(tx);
        //       // }
        //       // console.log("tx", tx);
        //       transactions.push(tx);
        //     });
        //   }
        // }
      } catch (error) {
        console.log(error);
      }
    };

    getTransactionHistory();
  }, [account.data, provider]);

  const handleSubmit = () => {
    (async () => {
      try {
        interface Transaction {
          blockNumber: string;
          timeStamp: string;
          hash: string;
          from: string;
          to: string;
          value: string;
          gas: string;
          gasPrice: string;
          isError: string;
          txreceipt_status: string;
          input: string;
          bookStoreContractAddress: string;
          cumulativeGasUsed: string;
          gasUsed: string;
          confirmations: string;
        }
        interface TransactionsResponse {
          status: string;
          message: string;
          result: Transaction[];
        }
        let address = account.data as string;
        const apiKey = "4UE64A86DY6EBTGQMJ28R7HZPJJ83UJJ25";
        const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${"0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5"}&sort=desc&apikey=${apiKey}`;
        const response = await axios.get<TransactionsResponse>(url);

        if (response.data.status === "1") {
          console.log("transactions", response.data.result);
          // return response.data.result;
        } else {
          throw new Error(
            `Failed to fetch transactions: ${response.data.message}`
          );
        }
        // let etherscanProvider = new ethers.providers.EtherscanProvider();

        // etherscanProvider.getHistory(address).then((history) => {
        //   history.forEach((tx) => {
        //     console.log(tx);
        //   });
        // });

        // Set the history state
        // console.log("transactions", transactions);

        // console.log("ethereum", ethereum);
        // const res = await deleteFile(
        //   "QmUZHW5U4a5a5qyGvB6fXLpzK3ADYQh7MpGmV99njPaNT7"
        // );
        // console.log("bookCoverLink res", res);
        // const { signedData, account } = await getSignedData();
        // const promise = axios.get(
        //   "/api/pinata/metadata/QmUZHW5U4a5a5qyGvB6fXLpzK3ADYQh7MpGmV99njPaNT7/delete"
        // );
        // const res = await toast.promise(promise, {
        //   pending: "Uploading metadata",
        //   success: "Metadata uploaded",
        //   error: "Metadata upload error"
        // });
        // const data = res.data as PinataRes;
        // const link = `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`;
        // console.log("data", data);
      } catch (err) {
        console.error(err);
      }
    })();
    return "";
  };
  return (
    <>
      <Head>
        <title>Create rental - NFT Bookstore</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>sadasd</div>
        <div>sadasd</div>
        <div>sadasd</div>
        <div>sadasd</div>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            handleSubmit();
          }}
        >
          Create
        </Button>
      </main>
    </>
  );
};

export default Book;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...namespaceDefaultLanguage()]))
    }
  };
}
