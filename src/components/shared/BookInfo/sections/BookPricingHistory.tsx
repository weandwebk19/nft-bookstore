import { Stack, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";

const BookPricingHistory = () => {
  const { t } = useTranslation("bookDetail");

  return (
    <Stack spacing={2}>
      <Typography variant="h5" mb={1}>
        {t("pricingHistory")}
      </Typography>

      <Stack direction="row" spacing={1}>
        <Typography variant="label">{t("average")}:</Typography>
        <Typography>0.5 ETH</Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Typography variant="label">{t("highest")}:</Typography>
        <Typography>0.5 ETH</Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Typography variant="label">{t("lowest")}:</Typography>
        <Typography>0.5 ETH</Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Typography variant="label">{t("lasted")}:</Typography>
        <Typography>0.5 ETH</Typography>
      </Stack>
    </Stack>
  );
};

export default BookPricingHistory;
