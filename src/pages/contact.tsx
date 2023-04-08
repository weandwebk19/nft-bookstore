import { FormProvider, useForm } from "react-hook-form";

import { Box, Grid, TextField } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import * as yup from "yup";

import { ContentContainer } from "@/components/shared/ContentContainer";
import {
  InputController,
  TextAreaController
} from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { StyledButton } from "@/styles/components/Button";

const defaultValues = {
  name: "",
  email: "",
  message: ""
};

export default function Contact() {
  const { t } = useTranslation("contact");

  const schema = yup
    .object({
      name: yup.string().required(t("textError1") as string),
      email: yup
        .string()
        .email(t("textError2") as string)
        .max(255)
        .required(t("textError3") as string),
      message: yup.string().required(t("textError4") as string)
    })
    .required();

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: any) => {
    console.log(data);
    // handle form submission here
  };

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
      ...(await serverSideTranslations(locale, ["navbar", "footer", "contact"]))
    }
  };
}
