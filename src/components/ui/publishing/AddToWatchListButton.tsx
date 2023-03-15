import { Button, Tooltip } from "@mui/material";

import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

const AddToWatchListButton = () => {
  return (
    <Tooltip title="Add to watchlist">
      <Button
        size="small"
        sx={{
          transition: "all 0.25s ease",
          borderTopRightRadius: 0,
          "&:hover": {
            flexGrow: 3
          }
        }}
      >
        <PlaylistAddIcon fontSize="small" />
      </Button>
    </Tooltip>
  );
};

export default AddToWatchListButton;
