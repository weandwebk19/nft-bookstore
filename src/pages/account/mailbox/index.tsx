import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography
} from "@mui/material";

import { CldImage } from "next-cloudinary";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import images from "@/assets/images";
import withAuth from "@/components/HOC/withAuth";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { Ticket } from "@/components/shared/Ticket";
import { Wrapper } from "@/components/shared/Wrapper";
import { StyledCard } from "@/styles/components/Card";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const preUrl = "/account/mailbox";

type customVariant = "dome" | "invertedDome";

const MailBox = () => {
  const { t } = useTranslation("mailbox");
  const imageCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const router = useRouter();

  const categories = [
    {
      to: `${preUrl}/request`,
      header: t("request") as string,
      info: t("requestDesc") as string,
      image: `https://res.cloudinary.com/${imageCloud}/image/upload/v1678628696/nft_bookstore/img/product3_e05rs7.jpg`,
      variant: "dome"
    },
    {
      to: `${preUrl}/response`,
      header: t("response") as string,
      info: t("responseDesc") as string,
      image: `https://res.cloudinary.com/${imageCloud}/image/upload/v1678628695/nft_bookstore/img/product1_ixtr9a.jpg`,
      variant: "invertedDome"
    }
  ];

  return (
    <>
      <Head>
        <title>{t("titlePage") as string}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack spacing={6}>
        <ContentContainer titles={[t("containerTitle") as string]}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            {categories.map((item) => (
              <StyledCard
                key={item.to}
                customVariant={item.variant as customVariant}
                sx={{ m: 2, width: "260px", height: "100%" }}
                id={item.to}
              >
                <CardActionArea
                  onClick={() => {
                    router.push(item.to);
                  }}
                >
                  <CardMedia
                    sx={{
                      height: "300px"
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: "100%",
                        position: "relative"
                      }}
                    >
                      <CldImage
                        src={item.image}
                        alt={item.to}
                        fill
                        style={{
                          objectFit: "cover"
                        }}
                      />
                    </Box>
                  </CardMedia>
                  <CardContent sx={{ minHeight: 215 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.header}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.info}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </StyledCard>
            ))}
          </Grid>
        </ContentContainer>
      </Stack>
    </>
  );
};

export default withAuth(MailBox);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "mailbox"
      ]))
    }
  };
}
