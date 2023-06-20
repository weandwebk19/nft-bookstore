import { useEffect } from "react";

import { Box, Stack } from "@mui/material";

import DisplayBox from "@ui/Home/DisplayBox";
import Hero from "@ui/Home/Hero";
import MainProduct from "@ui/Home/MainProduct";
import { CldImage } from "next-cloudinary";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import { useUserInfo } from "@/components/hooks/api";
import { StyledButton } from "@/styles/components/Button";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

export default function Home() {
  const { t } = useTranslation("home");

  const router = useRouter();

  const { data: userInfo } = useUserInfo();

  const imageCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  return (
    <>
      <Head>
        <title>NFT Bookstore</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Stack spacing={8}>
          <Box component="section" sx={{ height: "100vh" }}>
            <Hero />
          </Box>
          <Box component="section">
            <MainProduct />
          </Box>

          {/* Just for you */}
          {/* <Box component="section" sx={{ height: "30vh" }}>
            <Box
              className="thumbnail"
              sx={{
                height: "inherit",
                position: "absolute",
                left: 0,
                width: "100vw",
                overflow: "hidden"
              }}
            >
              <Box
                component="img"
                src={images.gradient1}
                alt=""
                className="portrait"
              />
            </Box>
          </Box> */}

          {/* <Box component="section">
            <DisplayBox />
          </Box> */}

          {/* Become an author */}
          <Box component="section" sx={{ height: "30vh" }}>
            <Box
              className="thumbnail"
              sx={{
                height: "inherit",
                position: "absolute",
                left: 0,
                width: "100vw",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {/* <Box
                component="img"
                src={images.gradient1}
                alt=""
                className="portrait"
              /> */}
              <CldImage
                src={`https://res.cloudinary.com/${imageCloud}/image/upload/v1678628696/nft_bookstore/img/gradient1_osuxrc.jpg`}
                alt="gradient"
                fill
                style={{
                  width: "100%",
                  left: "50%",
                  top: "50%",
                  objectFit: "cover"
                }}
                className="portrait"
              />
              {!userInfo?.isAuthor && (
                <StyledButton
                  onClick={() => {
                    router.push("/author/request");
                  }}
                >
                  {t("becomeAnAuthor") as string}
                </StyledButton>
              )}
            </Box>
          </Box>
        </Stack>
      </main>
    </>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "home"
      ]))
      // Will be passed to the page component as props
    }
  };
}
