import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Box, Grid, TextField } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import getFileExtension from "@utils/getFileExtension";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import * as yup from "yup";

import { ContentContainer } from "@/components/shared/ContentContainer";
import {
  AttachmentController,
  AutoCompleteController,
  InputController,
  TextAreaController
} from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { StyledButton } from "@/styles/components/Button";
import formatBytes from "@/utils/formatBytes";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const defaultValues = {
  name: "",
  email: "",
  message: "",
  fileType: "",
  bookFile: ""
};

const SUPPORTED_BOOKFILE_FORMATS = ["application/pdf", "application/epub+zip"];

export default function Contact() {
  const { t } = useTranslation("contact");

  const schema = yup
    .object({
      name: yup.string(),
      // .required(t("textError1") as string),
      email: yup.string(),
      // .email(t("textError2") as string)
      // .max(255)
      // .required(t("textError3") as string),
      message: yup.string(),
      // .required(t("textError4") as string),
      fileType: yup
        .string()
        // .required(t("textError3") as string)
        .oneOf(["epub", "pdf"], t("textError4") as string),
      bookFile: yup
        .mixed()
        .required(t("textError5") as string)
        .test("required", t("textError6") as string, (file: any) => {
          if (file) return true;
          return false;
        })
        .test("fileSize", t("textError8") as string, (file: any) => {
          return file && file?.size <= 100000000;
        })
        .test("fileFormat", "Unsupported Format", (file: any) => {
          return file && SUPPORTED_BOOKFILE_FORMATS.includes(file.type);
        })
    })
    .required();

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });

  const { handleSubmit, setValue } = methods;

  const [currentFile, setCurrentFile] = useState("");

  const onSubmit = (data: any) => {
    setCurrentFile(data.bookFile.path);
    console.log(data);
    // handle form submission here
  };

  useEffect(() => {
    if (currentFile !== "") {
      setValue("fileType", getFileExtension(currentFile));
    }
  }, [currentFile]);

  return (
    <>
      <Head>
        <title>{t("titlePage") as string}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box sx={{ pt: 6 }}>
          <ContentContainer titles={[t("titleContent1"), t("titleContent2")]}>
            <Box sx={{ flexGrow: 1 }}>
              <FormProvider {...methods}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormGroup label={t("name")} required>
                      <InputController name="name" />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormGroup label={t("email")} required>
                      <InputController name="email" />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <FormGroup label={t("message")} required>
                      <TextAreaController name="message" />
                    </FormGroup>
                    <FormGroup label={t("bookFile") as string} required>
                      <AttachmentController
                        name="bookFile"
                        desc={`${t("descAttachment1") as string} ${formatBytes(
                          process.env.NEXT_PUBLIC_MAX_BOOKFILE_SIZE
                        )}`}
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} container justifyContent="flex-end">
                    <StyledButton
                      variant="contained"
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                    >
                      {t("send")}
                    </StyledButton>
                  </Grid>
                </Grid>
              </FormProvider>
            </Box>
          </ContentContainer>
        </Box>
      </main>
    </>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "contact"
      ]))
    }
  };
}
