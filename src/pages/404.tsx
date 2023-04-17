import React from "react";

import { Box, Grid, Link, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import styles from "@/styles/NotFound.module.scss";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const NotFoundPage = () => {
  const theme = useTheme();
  const { t } = useTranslation("notFound");

  const router = useRouter();

  return (
    <Grid container columns={{ sm: 1, md: 2, lg: 2 }} sx={{ mt: 6 }}>
      <Grid
        item
        sm={1}
        md={1}
        lg={1}
        sx={{
          width: "100%",
          height: "100vh",
          display: { xs: "none", sm: "none", md: "block", lg: "block" }
        }}
      >
        <Stack alignItems="center">
          <Typography variant="h5" sx={{ textDecoration: "underline" }}>
            {t("page")}
          </Typography>
          <Typography variant="h1">400</Typography>
        </Stack>
        <Stack alignItems="center">
          <Stack m={3}>
            <Typography variant="h4">{t("epilogue")}</Typography>
            <Typography variant="h6">------ III ------</Typography>
          </Stack>
          <Typography variant="h6">
            {t("story1")}
            <br /> {t("story2")} <br />
            {t("story3")}
            <br /> {t("story4")} <br /> {t("story5")}
            <br />
            {t("story6")}
            <br />
            {t("story7")}
            <br />
            {t("story8")}
            <br />
            {t("story9")}
            <br />
            {t("story10")}
            <br />
            {t("story11")}
            <br />
            {t("story12")}
            <br /> {t("story13")}
          </Typography>
          <Typography variant="h6" sx={{ fontStyle: "italic", m: 1 }}>
            {t("story14")}
          </Typography>
        </Stack>
      </Grid>
      <Grid
        item
        sm={1}
        md={1}
        lg={1}
        sx={{ width: "100%", height: "90vh", position: "relative" }}
      >
        <Stack justifyContent="center" alignItems="center">
          <Typography variant="h5" sx={{ textDecoration: "underline" }}>
            {t("page")}
          </Typography>
          <Typography variant="h1">404</Typography>
        </Stack>
        <article
          className={styles["teared-paper"]}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translateX(-50%) rotate(10deg)",
            boxShadow:
              "rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px"
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: `${theme.palette.common.black} !important`
            }}
          >
            {t("story15")}
          </Typography>
          <Typography
            sx={{
              color: `${theme.palette.common.black} !important`
            }}
          >
            {t("story16")}{" "}
            <Link
              sx={{
                cursor: "pointer",
                color: `${theme.palette.common.black} !important`
              }}
              onClick={() => {
                router.push("/");
              }}
            >
              {t("homepage")}
            </Link>
            .
          </Typography>
        </article>
      </Grid>
    </Grid>
  );
};
export default NotFoundPage;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "notFound"
      ]))
    }
  };
}
