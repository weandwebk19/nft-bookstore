import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { ContentContainer } from "@/components/shared/ContentContainer";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["navbar"]))
    }
  };
}

const About = () => {
  const theme = useTheme();

  return (
    <Box sx={{ pt: 6 }}>
      <Stack>
        <ContentContainer titles={["Our story"]}>
          <Typography>
            The NFT Bookstore is a project that started in 2022 and will be
            completed in 2023 by a group of friends who are about to graduate.
            Mrs. Tuyen was the one who came up with this idea and they signed up
            to try their hand at this new project. They researched and built it
            a month before the Lunar New Year. Hopefully it will be completed
            and appreciated by July 2023. This was probably the last project
            they did in university.
          </Typography>
        </ContentContainer>
        <ContentContainer titles={["Our mission"]}>
          <Typography>
            The NFT market is currently booming, and this is only the beginning.
            There is a very lengthy history of books. The book trade was crucial
            to preserving information and making it available to people even in
            ancient times. But at that time, books were not written on paper but
            rather on papyrus rolls, palm leaves, or burned clay tablets. One of
            the main pillars of our cultural identity is the book. We at NFT
            Bookstore are confident that the book will continue to play its
            essential part in the history of humanity even if it is at a turning
            point in the current electronic era. That&apos;s why we&apos;ve
            developed NFT Books, a platform that introduces the next major
            development in publishing.
          </Typography>
        </ContentContainer>
        <ContentContainer titles={["Meet the team"]}>
          <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={4} sm={4} md={3}>
              <Box
                sx={{
                  p: 2,
                  position: "relative",
                  height: "250px",
                  backgroundColor: `${theme.palette.background.paper}`
                }}
              >
                <Typography variant="h4">Huynh Van Long</Typography>
                <Box component="img" src="" alt="" />
                <Typography>Roles</Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sm={4} md={3}>
              <Box
                sx={{
                  p: 2,
                  position: "relative",
                  height: "250px",
                  backgroundColor: `${theme.palette.background.paper}`
                }}
              >
                <Typography variant="h4">Nguyen Duc Manh</Typography>
                <Box component="img" src="" alt="" />
                <Typography>Roles</Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sm={4} md={3}>
              <Box
                sx={{
                  p: 2,
                  position: "relative",
                  height: "250px",
                  backgroundColor: `${theme.palette.background.paper}`
                }}
              >
                <Typography variant="h4">Nguyen Van Thinh</Typography>
                <Box component="img" src="" alt="" />
                <Typography>Roles</Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sm={4} md={3}>
              <Box
                sx={{
                  p: 2,
                  position: "relative",
                  height: "250px",
                  backgroundColor: `${theme.palette.background.paper}`
                }}
              >
                <Typography variant="h4">Le Nguyen Nhat Tho</Typography>
                <Box component="img" src="" alt="" />
                <Typography>Roles</Typography>
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{ backgroundColor: `${theme.palette.background.paper}` }}
          ></Box>
        </ContentContainer>
      </Stack>
    </Box>
  );
};

export default About;
