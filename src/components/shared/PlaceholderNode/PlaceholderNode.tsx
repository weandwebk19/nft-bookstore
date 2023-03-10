import { Box, Divider, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Logo } from "../Logo";

const PlaceholderNode = () => {
  const theme = useTheme();
  return (
    <Stack justifyContent="center" alignItems="center">
      <Divider sx={{ my: 3, width: "100%" }}>
        <Box
          sx={{
            p: 2,
            mb: 2,
            width: "100px",
            height: "100px",
            borderRadius: "10em",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            border: `1px double ${theme.palette.grey[500]}`,
            outline: `1px double ${theme.palette.primary.dark}`,
            outlineOffset: "3px"
          }}
        >
          <Logo />
        </Box>
      </Divider>
      <Typography variant="h6">*</Typography>
      <Typography>There&apos;s nothing here.</Typography>
      <Divider sx={{ my: 3, width: "50%" }} />
    </Stack>
  );
};

export default PlaceholderNode;
