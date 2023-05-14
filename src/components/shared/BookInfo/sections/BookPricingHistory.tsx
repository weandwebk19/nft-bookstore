import { Divider, Stack, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { usePricingHistory } from "@/components/hooks/api";

const BookPricingHistory = () => {
  const { t } = useTranslation("bookDetail");
  const router = useRouter();
  const { bookId } = router.query;

  const sellPricingHistory = usePricingHistory(bookId as string, "SELL");
  const lendPricingHistory = usePricingHistory(bookId as string, "LEND");
  const sharePricingHistory = usePricingHistory(bookId as string, "SHARE");

  return (
    <Stack spacing={2}>
      <Typography variant="h5" mb={1}>
        {t("pricingHistory")}
      </Typography>
      <Stack divider={<Divider />} spacing={3}>
        {sellPricingHistory?.data?.lastest && (
          <Stack spacing={2}>
            <Typography variant="h6" mb={1}>
              {t("pricingHistory$listing")}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Typography variant="label">{t("average")}:</Typography>
              <Typography>{sellPricingHistory.data.average} ETH</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Typography variant="label">{t("highest")}:</Typography>
              <Typography>{sellPricingHistory.data.highest} ETH</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Typography variant="label">{t("lowest")}:</Typography>
              <Typography>{sellPricingHistory.data.lowest} ETH</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Typography variant="label">{t("lastest")}:</Typography>
              <Typography>{sellPricingHistory.data.lastest} ETH</Typography>
            </Stack>
          </Stack>
        )}

        {lendPricingHistory.data?.lastest && (
          <Stack spacing={2}>
            <Typography variant="h6" mb={1}>
              {t("pricingHistory$lend")}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Typography variant="label">{t("average")}:</Typography>
              <Typography>{lendPricingHistory.data.average} ETH</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Typography variant="label">{t("highest")}:</Typography>
              <Typography>{lendPricingHistory.data.highest} ETH</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Typography variant="label">{t("lowest")}:</Typography>
              <Typography>{lendPricingHistory.data.lowest} ETH</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Typography variant="label">{t("lastest")}:</Typography>
              <Typography>{lendPricingHistory.data.lastest} ETH</Typography>
            </Stack>
          </Stack>
        )}

        {sharePricingHistory.data?.lastest && (
          <Stack spacing={2}>
            <Typography variant="h6" mb={1}>
              {t("pricingHistory$share")}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Typography variant="label">{t("average")}:</Typography>
              <Typography>{sharePricingHistory.data.average} ETH</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Typography variant="label">{t("highest")}:</Typography>
              <Typography>{sharePricingHistory.data.highest} ETH</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Typography variant="label">{t("lowest")}:</Typography>
              <Typography>{sharePricingHistory.data.lowest} ETH</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Typography variant="label">{t("lastest")}:</Typography>
              <Typography>{sharePricingHistory.data.lastest} ETH</Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default BookPricingHistory;
