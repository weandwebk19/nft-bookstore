import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ProfileDetail from "@/components/ui/author/profile/ProfileDetail";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

export default ProfileDetail;

export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "authorProfile",
        "bookButtons"
      ]))
    }
  };
}
