import { useRouter } from "next/router";
import { en, vi } from "public/locales/";

const useTrans = () => {
  const { locale } = useRouter();

  const trans = locale === "vi" ? vi : en;

  return trans;
};

export default useTrans;
