import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { StyledCard, StyledCardMedia } from "@styles/components/Card";
import { useRouter } from "next/router";

import images from "@/assets/images";
import cssFilter from "@/utils/cssFilter";

const MainProduct = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ textAlign: "center", position: "relative", mb: 8 }}>
        <Typography variant="h2">Our products</Typography>
        <Box
          component="img"
          src={images.decoLine}
          sx={{
            position: "absolute",
            maxWidth: "385px",
            transform: "translateX(-50%) translateY(-40%)",
            filter: cssFilter(`${theme.palette.primary.main}`)
          }}
        />
      </Box>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <StyledCard customVariant="dome" sx={{ m: 2, height: "100%" }}>
          <CardActionArea
            onClick={() => {
              router.push("publish");
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
          <CardActionArea>
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
          <CardActionArea>
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
    </Box>
  );
};

export default MainProduct;
