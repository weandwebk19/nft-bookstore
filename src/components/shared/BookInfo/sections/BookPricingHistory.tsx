import { Stack, Typography } from "@mui/material";

const BookPricingHistory = () => {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" mb={1}>
        Pricing history
      </Typography>

      <Stack direction="row" spacing={1}>
        <Typography variant="label">Average:</Typography>
        <Typography>0.5 ETH</Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Typography variant="label">Highest:</Typography>
        <Typography>0.5 ETH</Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Typography variant="label">Lowest:</Typography>
        <Typography>0.5 ETH</Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Typography variant="label">Lastest:</Typography>
        <Typography>0.5 ETH</Typography>
      </Stack>
    </Stack>
  );
};

export default BookPricingHistory;
