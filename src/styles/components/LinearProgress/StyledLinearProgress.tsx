import { Box, Typography } from "@mui/material";
import LinearProgress, {
  LinearProgressProps,
  linearProgressClasses
} from "@mui/material/LinearProgress";

import { styled } from "@mui/system";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.background.paper
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: `${theme.palette.primary.main}`
  }
}));

const StyledLinearProgress = (
  props: LinearProgressProps & { value: number; icon?: JSX.Element }
) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center"
      }}
    >
      <Box sx={{ mr: 1 }}>{props.icon ? props.icon : <></>}</Box>
      <Box
        sx={{
          width: "100%",
          mr: 1
        }}
      >
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "end" }}
        >{`${Math.round(props.value)}`}</Typography>
      </Box>
    </Box>
  );
};

export default StyledLinearProgress;
