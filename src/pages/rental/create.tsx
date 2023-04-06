import { ChangeEvent, useRef, useState } from "react";
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

import { useBookDetail, useNetwork } from "@/components/hooks/web3";
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

import { deleteFile } from "../api/pinata/utils";

const Book = () => {
  const formRef = useRef<any>();
  const { ethereum, contract } = useWeb3();
  const { network } = useNetwork();

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

  const handleSubmit = () => {
    // try {
    (async () => {
      try {
        // const { signedData, account } = await getSignedData();

        const promise = axios.get(
          "/api/pinata/metadata/QmZVdqdj5Z4u1f5BT6RDqkufz8FRSERuEyYYt3wY4q9baY/delete"
        );

        const res = await toast.promise(promise, {
          pending: "Uploading metadata",
          success: "Metadata uploaded",
          error: "Metadata upload error"
        });

        const data = res.data as PinataRes;
        const link = `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`;
        console.log("data", data);
      } catch (err) {
        console.error(err);
      }
    })();
    // } catch (e: any) {
    //   console.error(e);
    // }
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
      ...(await serverSideTranslations(locale, ["navbar", "footer"]))
    }
  };
}
