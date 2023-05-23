import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

import { Divider, Stack, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

import { CategoryScale, Chart } from "chart.js/auto";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { usePricingHistory } from "@/components/hooks/api";
import { PricingHistoriesNoId } from "@/types/pricingHistories";

Chart.register(CategoryScale);
Chart.defaults.font.family = "Raleway";
Chart.defaults.font.size = 16;

const BookPricingHistory = () => {
  const { t } = useTranslation("bookDetail");
  const router = useRouter();
  const { bookId } = router.query;

  const sellPricingHistory = usePricingHistory(bookId as string, "SELL");
  const sellPricingHistories = sellPricingHistory?.data?.pricingHistory;
  const lendPricingHistory = usePricingHistory(bookId as string, "LEND");
  const lendPricingHistories = lendPricingHistory?.data?.pricingHistory;
  const sharePricingHistory = usePricingHistory(bookId as string, "SHARE");
  const sharePricingHistories = sharePricingHistory?.data?.pricingHistory;

  const [listingDate, setListingDate] = useState<string[]>([]);
  const [sellChartData, setSellChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: `${t("pricingHistory$listing")}`,
        data: sellPricingHistories?.map(
          (data: PricingHistoriesNoId) => data.price
        ),
        fill: true,
        backgroundColor: "#a39c8350",
        borderColor: "#a39c83",
        borderWidth: 2,
        lineTension: 0.2
      }
    ]
  });

  useEffect(() => {
    setSellChartData({
      labels: listingDate,
      datasets: [
        {
          label: `${t("pricingHistory$listing")}`,
          data: sellPricingHistories?.map(
            (data: PricingHistoriesNoId) => data.price
          ),
          fill: true,
          backgroundColor: "#a39c8350",
          borderColor: "#a39c83",
          borderWidth: 2,
          lineTension: 0.2
        }
      ]
    });
  }, [sellPricingHistories, listingDate]);

  useEffect(() => {
    if (sellPricingHistory.data) {
      let priceHistoryDates: string[] = [];
      sellPricingHistories?.map((node: PricingHistoriesNoId) => {
        const d = new Date(node.createdAt);
        priceHistoryDates.push(d.toLocaleDateString("en-US"));
      });
      setListingDate(priceHistoryDates);
    }
  }, [sellPricingHistories]);

  // LEND CHART
  const [lendDates, setLendDates] = useState<string[]>([]);
  const [lendChartData, setLendChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: `${t("pricingHistory$lend")}`,
        data: sellPricingHistories?.map(
          (data: PricingHistoriesNoId) => data.price
        ),
        fill: true,
        backgroundColor: "#707faf50",
        borderColor: "#707faf",
        borderWidth: 2,
        lineTension: 0.2
      }
    ]
  });

  useEffect(() => {
    setLendChartData({
      labels: lendDates,
      datasets: [
        {
          label: `${t("pricingHistory$listing")}`,
          data: lendPricingHistories?.map(
            (data: PricingHistoriesNoId) => data.price
          ),
          fill: true,
          backgroundColor: "#707faf50",
          borderColor: "#707faf",
          borderWidth: 2,
          lineTension: 0.2
        }
      ]
    });
  }, [lendPricingHistories, listingDate]);

  useEffect(() => {
    if (lendPricingHistory.data) {
      let priceHistoryDates: string[] = [];
      lendPricingHistories?.map((node: PricingHistoriesNoId) => {
        const d = new Date(node.createdAt);
        priceHistoryDates.push(d.toLocaleDateString("en-US"));
      });
      setLendDates(priceHistoryDates);
    }
  }, [lendPricingHistories]);

  // SHARE CHART
  const [shareDates, setShareDates] = useState<string[]>([]);
  const [shareChartData, setShareChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: `${t("pricingHistory$share")}`,
        data: sellPricingHistories?.map(
          (data: PricingHistoriesNoId) => data.price
        ),
        fill: true,
        backgroundColor: "#707faf50",
        borderColor: "#707faf",
        borderWidth: 2,
        lineTension: 0.2
      }
    ]
  });

  useEffect(() => {
    setShareChartData({
      labels: shareDates,
      datasets: [
        {
          label: `${t("pricingHistory$listing")}`,
          data: sharePricingHistories?.map(
            (data: PricingHistoriesNoId) => data.price
          ),
          fill: true,
          backgroundColor: "#af797050",
          borderColor: "#af7970",
          borderWidth: 2,
          lineTension: 0.2
        }
      ]
    });
  }, [sharePricingHistories, listingDate]);

  useEffect(() => {
    if (sharePricingHistory.data) {
      let priceHistoryDates: string[] = [];
      sharePricingHistories?.map((node: PricingHistoriesNoId) => {
        const d = new Date(node.createdAt);
        priceHistoryDates.push(d.toLocaleDateString("en-US"));
      });
      setShareDates(priceHistoryDates);
    }
  }, [sharePricingHistories]);

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
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
            >
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
            <Stack sx={{ width: "100%" }}>
              <Line
                data={sellChartData}
                options={{
                  plugins: {
                    title: {
                      display: true
                      // text: "Users Gained between 2016-2020"
                    },
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      grid: { color: "#a39c8350" },
                      ticks: { color: "#a39c83" }
                    },
                    y: {
                      grid: { color: "#a39c8350" },
                      title: {
                        display: true,
                        text: `Price (ETH)`
                      }
                    }
                  }
                }}
              />
            </Stack>
          </Stack>
        )}

        {lendPricingHistory.data?.lastest && (
          <Stack spacing={2}>
            <Typography variant="h6" mb={1}>
              {t("pricingHistory$lend")}
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
            >
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
            <Stack sx={{ width: "100%" }}>
              <Line
                data={lendChartData}
                options={{
                  plugins: {
                    title: {
                      display: true
                      // text: "Users Gained between 2016-2020"
                    },
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      grid: { color: "#707faf50" },
                      ticks: { color: "#707faf" }
                    },
                    y: {
                      grid: { color: "#707faf50" },
                      title: {
                        display: true,
                        text: `Price (ETH)`
                      }
                    }
                  }
                }}
              />
            </Stack>
          </Stack>
        )}

        {sharePricingHistory.data?.lastest && (
          <Stack spacing={2}>
            <Typography variant="h6" mb={1}>
              {t("pricingHistory$share")}
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
            >
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
            <Stack sx={{ width: "100%" }}>
              <Line
                data={shareChartData}
                options={{
                  plugins: {
                    title: {
                      display: true
                      // text: "Users Gained between 2016-2020"
                    },
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      grid: { color: "#af797050" },
                      ticks: { color: "#af7970" }
                    },
                    y: {
                      grid: { color: "#af797050" },
                      title: {
                        display: true,
                        text: `Price (ETH)`
                      }
                    }
                  }
                }}
              />
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default BookPricingHistory;
