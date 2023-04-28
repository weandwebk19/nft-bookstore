import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box, Stack, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/Form.module.scss";
import axios from "axios";
import { ethers } from "ethers";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import * as yup from "yup";

import withAuth from "@/components/HOC/withAuth";
import withAuthor from "@/components/HOC/withAuthor";
import { useUserInfo } from "@/components/hooks/api/useUserInfo";
import { useAccount, useNetwork } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { ContentGroup } from "@/components/shared/ContentGroup";
import {
  AutoCompleteController,
  TextAreaController,
  TextFieldController
} from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { StyledButton } from "@/styles/components/Button";
import { BookInfo } from "@/types/nftBook";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const defaultValues = {
  description: "",
  externalLink: "",
  totalPages: 1,
  keywords: [""],

  termsOfService: false,
  privacyPolicy: false
};

const EditBook = () => {
  const { t } = useTranslation("editBook");

  const { ethereum, contract } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = [
    yup.object({
      description: yup.string().required(t("textError2") as string),
      externalLink: yup.string(),
      totalPages: yup
        .number()
        .typeError(t("textError20") as string)
        .min(0, `${t("textError16") as string}`)
        .required(t("textError17") as string),
      keywords: yup.array().of(yup.string())
    }),

    // validate for final step (Accept the terms and conditions)
    yup.object().shape({
      termsOfService: yup.boolean().oneOf([true], t("textError18") as string),
      privacyPolicy: yup.boolean().oneOf([true], t("textError19") as string)
    })
  ];

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all"
  });

  const handleCancel = useCallback(async () => {
    reset((formValues) => ({
      ...defaultValues
    }));
  }, []);

  const getSignedData = async () => {
    const messageToSign = await axios.get("/api/pinata/verify");
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

  const handleError = async (err: any) => {
    toast.error(err.message, {
      position: toast.POSITION.TOP_CENTER
    });
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const uploadBookDetails = async (bookInfo: BookInfo) => {
    try {
      // const promise = axios.post("/api/books/create", { bookInfo });
      // const res = await toast.promise(promise, {
      //   pending: t("pendingUploadBookDetails") as string,
      //   success: t("successUploadBookDetails") as string,
      //   error: t("errorUploadBookDetails") as string
      // });
      // return res;
    } catch (e: any) {
      handleError(e);
    }
  };

  const { handleSubmit, trigger, getValues, setValue, reset } = methods;
  const onSubmit = (data: any) => {
    try {
      setIsLoading(true);

      console.log(data);
    } catch (err: any) {
      handleError(err);
    }
  };

  return (
    <>
      <Head>
        <title>{t("titlePage")}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ContentContainer titles={[t("titleContent1"), t("titleContent2")]}>
          <Box component="section" sx={{ width: "100%", maxWidth: "720px" }}>
            <Paper elevation={1} sx={{ mx: "auto", mt: 4, p: 3 }}>
              <FormProvider {...methods}>
                <ContentGroup title={t("titleContentPaper") as string}>
                  <Box sx={{ my: 2 }}>
                    <Typography
                      variant="caption"
                      className="form-label required"
                    >
                      {t("required") as string}
                    </Typography>
                  </Box>
                  <Stack direction="column" spacing={3}>
                    <Stack direction="column" spacing={3}>
                      <FormGroup label={t("bookDesc") as string}>
                        <TextAreaController name="description" />
                      </FormGroup>
                      <FormGroup
                        label={t("externalLink") as string}
                        desc={t("descExternalLink") as string}
                      >
                        <TextFieldController name="externalLink" />
                      </FormGroup>

                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: 2 }}
                      >
                        <FormGroup
                          label={t("numberOfPages") as string}
                          className={styles["form__formGroup-half"]}
                        >
                          <TextFieldController name="totalPages" />
                        </FormGroup>
                        <FormGroup
                          label={t("keywords") as string}
                          className={styles["form__formGroup-half"]}
                        >
                          <AutoCompleteController name="keywords" />
                        </FormGroup>
                      </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: "center",
                        justifyContent: "flex-end"
                      }}
                    >
                      <StyledButton
                        customVariant="secondary"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        {t("reset") as string}
                      </StyledButton>
                      <StyledButton
                        customVariant="primary"
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                      >
                        {t("saveChanges") as string}
                      </StyledButton>
                    </Stack>
                  </Stack>
                </ContentGroup>
              </FormProvider>
            </Paper>
          </Box>
        </ContentContainer>
        <ToastContainer />
      </main>
    </>
  );
};

export default withAuth(withAuthor(EditBook));

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "editBook"
      ]))
    }
  };
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: true
  };
};
