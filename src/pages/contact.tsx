import { Typography } from "@mui/material";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["navbar"]))
    }
  };
}

const Contact = () => {
  return <Typography variant="h1">CONTACT PAGE NÈ</Typography>;
};

export default Contact;
