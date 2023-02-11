import {
  Box,
  CardActionArea,
  CardContent,
  Grid,
  Typography
} from "@mui/material";

import { StyledCard, StyledCardMedia } from "@styles/components/Card";

import images from "@/assets/images";

const MainProduct = () => {
  return (
    <Box>
      <Box sx={{ textAlign: "center", position: "relative", mb: 8 }}>
        <Typography variant="h2">Our product</Typography>
        <Box
          component="img"
          src={images.decoLine}
          sx={{
            position: "absolute",
            transform: "translateX(-50%) translateY(-40%)"
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
          <CardActionArea>
            <StyledCardMedia
              component="img"
              height="300"
              image={images.product1}
              alt="green iguana"
            />
            <CardContent sx={{ height: 215 }}>
              <Typography gutterBottom variant="h5" component="div">
                Publish
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Millions of readers are eagerly anticipating your books right
                now. What exactly are you waiting for? Join NFT Bookstore today
                and start connecting with readers all over the world. Let's get
                your books published.
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
                more? Join NFTBooks right now!
              </Typography>
            </CardContent>
            <StyledCardMedia
              component="img"
              height="300"
              image={images.product2}
              alt="green iguana"
            />
          </CardActionArea>
        </StyledCard>
        <StyledCard customVariant="dome" sx={{ m: 2 }}>
          <CardActionArea>
            <StyledCardMedia
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
