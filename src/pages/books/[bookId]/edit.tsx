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
import { useRouter } from "next/router";
import * as yup from "yup";

import withAuth from "@/components/HOC/withAuth";
import withAuthor from "@/components/HOC/withAuthor";
import { useGenres, useLanguages } from "@/components/hooks/api";
import { useUserInfo } from "@/components/hooks/api/useUserInfo";
import { useAccount, useBookDetail, useNetwork } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { ContentGroup } from "@/components/shared/ContentGroup";
import {
  AutoCompleteController,
  MultipleSelectController,
  TextAreaController,
  TextFieldController
} from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { Image } from "@/components/shared/Image";
import { StyledButton } from "@/styles/components/Button";
import { BookInfoForUpdate } from "@/types/nftBook";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const EditBook = () => {
  const router = useRouter();

  const { bookId } = router.query;
  const { bookDetail } = useBookDetail(bookId as string);
  // console.log(bookDetail);

  const genres = useGenres();
  const languages = useLanguages();

  const { t } = useTranslation("editBook");

  const defaultValues = {
    description: bookDetail.data?.info.description,
    externalLink: bookDetail.data?.info.externalLink,
    totalPages: bookDetail.data?.info.totalPages,
    keywords: [""],
    genres: [],
    languages: [],
    termsOfService: false,
    privacyPolicy: false
  };

  const { ethereum, contract } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object({
    description: yup.string().required(t("textError2") as string),
    externalLink: yup.string(),
    totalPages: yup
      .number()
      .typeError(t("textError20") as string)
      .min(0, `${t("textError16") as string}`)
      .required(t("textError17") as string),
    keywords: yup.array().of(yup.string()),
    genres: yup
      .array()
      .of(yup.string())
      .test("required", t("textError1") as string, (arr) => {
        if (arr && (arr as any).length !== 0) return true;
        return false;
      }),
    languages: yup
      .array()
      .of(yup.string())
      .test("required", t("textError2") as string, (arr) => {
        if (arr && (arr as any).length !== 0) return true;
        return false;
      })
  });

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });

  const handleCancel = useCallback(async () => {
    reset((formValues) => ({
      ...defaultValues
    }));
  }, []);

  const handleError = async (err: any) => {
    toast.error(err.message, {
      position: toast.POSITION.TOP_CENTER
    });
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const uploadBookInfo = async (bookInfo: BookInfoForUpdate) => {
    try {
      const promise = axios.put("/api/books/update", { bookInfo });
      const res = await toast.promise(promise, {
        pending: t("pendingUploadBookDetails") as string,
        success: t("successUploadBookDetails") as string,
        error: t("errorUploadBookDetails") as string
      });
      return res;
    } catch (e: any) {
      handleError(e);
    }
  };

  const { handleSubmit, trigger, getValues, setValue, reset } = methods;
  const onSubmit = (data: any) => {
    try {
      setIsLoading(true);
      uploadBookInfo({
        id: bookId as string,
        description: data.description,
        externalLink: data.externalLink,
        genres: data.genres,
        languages: data.languages,
        totalPages: data.totalPages,
        keywords: data.keywords,
        tokenId: data.tokenId,
        oldLanguages: data.oldLanguages,
        oldGenres: data.oldGenres
      });
    } catch (err: any) {
      handleError(err);
    }
  };

  useEffect(() => {
    setValue("description", bookDetail.data?.info.description);
    setValue("externalLink", bookDetail.data?.info.externalLink);
    setValue("totalPages", bookDetail.data?.info.totalPages);
    setValue("keywords", bookDetail.data?.info.keywords);
    // setValue("tokenId", bookDetail.data?.nftBook.tokenId);
    // setValue("oldLanguages", bookDetail.data?.nftBook.languages);
    // setValue("oldGenres", bookDetail.data?.nftBook.genres);
  }, []);

  useEffect(() => {
    if (bookDetail?.info?.genres) {
      (async () => {
        console.log(bookDetail.info.genres);
        try {
          const res = await axios.get(
            `api/genres/${bookDetail?.info?.genres[0]}`
          );
          console.log("res", res);
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [bookDetail?.info?.genres]);

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
              <Stack justifyContent="center" alignItems="center">
                <Image
                  src={bookDetail?.meta?.bookCover}
                  alt={bookDetail?.meta?.title}
                  sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
                  className={styles["book-item__book-cover"]}
                />
                <Typography variant="h6">{bookDetail?.meta?.title}</Typography>
              </Stack>

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
                        <TextAreaController
                          name="description"
                          defaultValue={bookDetail?.info?.description}
                        />
                      </FormGroup>
                      <FormGroup
                        label={t("externalLink") as string}
                        desc={t("descExternalLink") as string}
                      >
                        <TextFieldController
                          name="externalLink"
                          defaultValue={bookDetail?.info?.externalLink}
                        />
                      </FormGroup>
                      <FormGroup label={t("genres") as string} required>
                        <MultipleSelectController
                          items={genres.data}
                          name="genres"
                        />
                      </FormGroup>
                      <FormGroup label={t("languages") as string} required>
                        <MultipleSelectController
                          items={languages.data}
                          name="languages"
                        />
                      </FormGroup>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: 2 }}
                      >
                        <FormGroup
                          label={t("numberOfPages") as string}
                          className={styles["form__formGroup-half"]}
                        >
                          <TextFieldController
                            name="totalPages"
                            defaultValue={bookDetail?.info?.totalPages}
                          />
                        </FormGroup>
                        <FormGroup
                          label={t("keywords") as string}
                          className={styles["form__formGroup-half"]}
                        >
                          <AutoCompleteController
                            name="keywords"
                            defaultValue={bookDetail?.info?.keywords}
                          />
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
