import { useEffect } from "react";

import { Box, Stack } from "@mui/material";

import DisplayBox from "@ui/Home/DisplayBox";
import Hero from "@ui/Home/Hero";
import MainProduct from "@ui/Home/MainProduct";
import { CldImage } from "next-cloudinary";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import { StyledButton } from "@/styles/components/Button";

export default function Home() {
  const router = useRouter();

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
              <StyledButton
                onClick={() => {
                  router.push("/author/request");
                }}
              >
                Become an author
              </StyledButton>
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
      ...(await serverSideTranslations(locale, ["navbar", "footer", "home"]))
      // Will be passed to the page component as props
    }
  };
}
