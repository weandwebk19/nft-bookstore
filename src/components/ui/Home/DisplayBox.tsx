import {
  Box,
  CardActionArea,
  CardContent,
  Grid,
  Paper,
  Stack,
  Typography
} from "@mui/material";

import { StyledPaper } from "@styles/components/Paper";

const DisplayBox = () => {
  return (
    <Box>
      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={4} sm={8} md={9}>
          <Stack spacing={3}>
            <Paper sx={{ height: "50vh", backgroundColor: "aquamarine" }} />
            <Paper sx={{ height: "50vh", backgroundColor: "turquoise" }} />
            <Paper sx={{ height: "50vh", backgroundColor: "olive" }} />
          </Stack>
        </Grid>
        <Grid item xs={4} sm={8} md={3}>
          <Stack spacing={3}>
            <Paper sx={{ height: "10vh", backgroundColor: "green" }} />
            <Paper sx={{ height: "30vh", backgroundColor: "cyan" }} />
            <Paper sx={{ height: "110vh", backgroundColor: "teal" }} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DisplayBox;
