import {
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { StyledCard } from "@styles/components/Card";
import { useRouter } from "next/router";

import images from "@/assets/images";
import { ContentContainer } from "@/components/shared/ContentContainer";

const MainProduct = () => {
  const router = useRouter();

  return (
    <ContentContainer titles={["Our products"]}>
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
            <CardContent sx={{ height: 215 }}>
              <Typography gutterBottom variant="h5" component="div">
                Publishing
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Millions of readers are eagerly anticipating your books right
                now. What exactly are you waiting for? Join NFT Bookstore today
                and start connecting with readers all over the world. Let&apos;s
                get your books published.
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
            <CardContent sx={{ height: 215 }}>
              <Typography gutterBottom variant="h5" component="div">
                Trade-in
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Increase your knowledge by reading books and earn money by
                participating in the NFT Bookstore market. Do you want to learn
                more? Join NFT Bookstore right now!
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
            <CardContent sx={{ height: 215 }}>
              <Typography gutterBottom variant="h5" component="div">
                Borrow
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Do you want to read your favorite books for just one cent? Join
                us and take advantage of this fantastic opportunity available
                only through NFT Bookstore!
              </Typography>
            </CardContent>
          </CardActionArea>
        </StyledCard>
      </Grid>
    </ContentContainer>
  );
};

export default MainProduct;
