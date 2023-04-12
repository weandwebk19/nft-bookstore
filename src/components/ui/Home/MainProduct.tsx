import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { StyledCard } from "@styles/components/Card";
import { CldImage } from "next-cloudinary";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import images from "@/assets/images";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { Image } from "@/components/shared/Image";

const MainProduct = () => {
  const { t } = useTranslation("home");
  const imageCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const router = useRouter();

  return (
    <ContentContainer titles={[t("titleProducts") as string]}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <StyledCard customVariant="dome" sx={{ m: 2, height: "100%" }}>
          <CardActionArea
            onClick={() => {
              router.push("/publishing");
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
                  src={`https://res.cloudinary.com/${imageCloud}/image/upload/v1678628695/nft_bookstore/img/product1_ixtr9a.jpg`}
                  alt="publishing"
                  fill
                  style={{
                    objectFit: "cover"
                  }}
                />
              </Box>
            </CardMedia>
            <CardContent sx={{ minHeight: 215 }}>
              <Typography gutterBottom variant="h5" component="div">
                {t("publishing") as string}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("infoPublishing") as string}
              </Typography>
            </CardContent>
          </CardActionArea>
        </StyledCard>
        <StyledCard customVariant="invertedDome" sx={{ m: 2 }}>
          <CardActionArea
            onClick={() => {
              router.push("/share");
            }}
          >
            <CardContent sx={{ minHeight: 215 }}>
              <Typography gutterBottom variant="h5" component="div">
                {t("share") as string}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("infoShare") as string}
              </Typography>
            </CardContent>
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
                  src={`https://res.cloudinary.com/${imageCloud}/image/upload/v1678628696/nft_bookstore/img/product2_yfv14w.jpg`}
                  alt="share"
                  fill
                  style={{
                    objectFit: "cover"
                  }}
                />
              </Box>
            </CardMedia>
          </CardActionArea>
        </StyledCard>
        <StyledCard customVariant="dome" sx={{ m: 2 }}>
          <CardActionArea
            onClick={() => {
              router.push("/borrow");
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
                  src={`https://res.cloudinary.com/${imageCloud}/image/upload/v1678628696/nft_bookstore/img/product3_e05rs7.jpg`}
                  alt="borrow"
                  fill
                  style={{
                    objectFit: "cover"
                  }}
                />
              </Box>
            </CardMedia>
            <CardContent sx={{ height: 215 }}>
              <Typography gutterBottom variant="h5" component="div">
                {t("borrow") as string}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("infoBorrow") as string}
              </Typography>
            </CardContent>
          </CardActionArea>
        </StyledCard>
      </Grid>
    </ContentContainer>
  );
};

export default MainProduct;
