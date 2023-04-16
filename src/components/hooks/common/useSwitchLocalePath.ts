import { useRouter } from "next/router";

const useSwitchLocalePath = () => {
  const router = useRouter();

  const switchLocalePath = (locale: string) => {
    router.push(router.asPath, router.asPath, { locale });
  };

  return switchLocalePath;
};

export default useSwitchLocalePath;
