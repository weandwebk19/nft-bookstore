import { Typography } from "@mui/material";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Protected = () => {
  return <Typography variant="h1">Protected Page</Typography>;
};

export default Protected;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["navbar", "footer", "home"]))
      // Will be passed to the page component as props
    }
  };
}
