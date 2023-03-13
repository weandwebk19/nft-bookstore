import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { ContentContainer } from "@/components/shared/ContentContainer";

const About = () => {
  const { t } = useTranslation("about");

  const theme = useTheme();

  return (
    <Box sx={{ pt: 6 }}>
      <Stack>
        <ContentContainer titles={[t("titleStory")]}>
          <Typography>{t("descStory")}</Typography>
        </ContentContainer>
        <ContentContainer titles={[t("titleMission")]}>
          <Typography>{t("descMission")}</Typography>
        </ContentContainer>
        <ContentContainer titles={[t("titleMeet") as string]}>
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
                <Typography>{t("roles")}</Typography>
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
                <Typography>{t("roles")}</Typography>
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
                <Typography>{t("roles")}</Typography>
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
                <Typography>{t("roles")}</Typography>
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

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["about", "navbar", "footer"]))
    }
  };
}
