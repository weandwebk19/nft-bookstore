import { useRouter } from "next/router";

function switchLocale(locale) {
  const router = useRouter();

  const pathname = router.pathname;
  const query = router.query;

  // Remove the current locale from the pathname
  const newPathname = pathname.replace(`/${router.locale}`, "");

  // Generate a new URL with the selected locale
  return `/${locale}${newPathname}${query ? `?${query}` : ""}`;
}

export default switchLocale;
