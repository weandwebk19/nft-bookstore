import { Typography } from "@mui/material";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["navbar"]))
    }
  };
}

const About = () => {
  return <Typography variant="h1">ABOUT PAGE NÈ</Typography>;
};

export default About;
