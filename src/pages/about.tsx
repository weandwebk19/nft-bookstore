import { FormProvider, useForm } from "react-hook-form";

import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import * as yup from "yup";

import { NestedComment } from "@/components/shared/Comment";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { InputController } from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

// const defaultValues = {
//   name: "",
//   email: "",
//   message: "",
//   keywords: [""]
// };

const About = () => {
  const { t } = useTranslation("about");

  const theme = useTheme();
  // const comments = [
  //   {
  //     id: 1,
  //     content: "This is the first comment!",
  //     author: "John Doe",
  //     date: "2022-03-01",
  //     replies: [
  //       {
  //         id: 2,
  //         content: "I totally agree with you!",
  //         author: "Jane Smith",
  //         date: "2022-03-02",
  //         replies: [
  //           {
  //             id: 3,
  //             content: "Thanks for the support!",
  //             author: "John Doe",
  //             date: "2022-03-03",
  //             replies: []
  //           }
  //         ]
  //       },
  //       {
  //         id: 4,
  //         content: "I have a different opinion...",
  //         author: "Bob Johnson",
  //         date: "2022-03-04",
  //         replies: []
  //       }
  //     ]
  //   },
  //   {
  //     id: 5,
  //     content: "This is the second comment!",
  //     author: "Alice Lee",
  //     date: "2022-03-05",
  //     replies: []
  //   }
  // ];

  // const flatComment = comments.flatMap((comment) => comment);

  // const schema = yup
  //   .object({
  //     name: yup.string(),
  //     // .required(t("textError1") as string),
  //     email: yup.string(),
  //     // .email(t("textError2") as string)
  //     // .max(255)
  //     // .required(t("textError3") as string),
  //     message: yup.string(),
  //     // .required(t("textError4") as string),
  //     keywords: yup.array().of(yup.string())
  //   })
  //   .required();

  // const methods = useForm({
  //   shouldUnregister: false,
  //   defaultValues,
  //   resolver: yupResolver(schema),
  //   mode: "all"
  // });

  // const { handleSubmit } = methods;

  return (
    <>
      <Head>
        <title>{t("titlePage") as string}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box sx={{ pt: 6 }}>
          <Stack>
            {/* <Stack>
              <FormProvider {...methods}>
                <FormGroup label={t("message")} required>
                  <InputController name="message" />
                </FormGroup>
              </FormProvider>
              <Paper>
                <NestedComment
                  author="John"
                  content="Author comment"
                  nestedComments={flatComment}
                />
              </Paper>
              <NestedComment
                author="John"
                content="Author comment"
                nestedComments={flatComment}
              />
            </Stack> */}
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
      </main>
    </>
  );
};

export default About;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "about"
      ]))
    }
  };
}
