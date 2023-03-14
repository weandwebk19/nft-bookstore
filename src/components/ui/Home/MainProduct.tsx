import {
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { StyledCard } from "@styles/components/Card";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import images from "@/assets/images";
import { ContentContainer } from "@/components/shared/ContentContainer";

const MainProduct = () => {
  const { t } = useTranslation("home");

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
              component="img"
              height="300"
              image={images.product1}
              alt="green iguana"
            />
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
              router.push("/trade-in");
            }}
          >
            <CardContent sx={{ minHeight: 215 }}>
              <Typography gutterBottom variant="h5" component="div">
                {t("tradeIn") as string}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("infoTradeIn") as string}
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              height="300"
              image={images.product2}
              alt="green iguana"
            />
          </CardActionArea>
        </StyledCard>
        <StyledCard customVariant="dome" sx={{ m: 2 }}>
          <CardActionArea
            onClick={() => {
              router.push("/borrow");
            }}
          >
            <CardMedia
              component="img"
              height="300"
              image={images.product3}
              alt="green iguana"
            />
            <CardContent sx={{ minHeight: 215 }}>
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
