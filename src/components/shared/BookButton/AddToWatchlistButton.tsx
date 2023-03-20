import { Button, Tooltip } from "@mui/material";

import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

interface AddToWatchlistButtonProps {
  isFirstInButtonGroup?: boolean;
  isLastInButtonGroup?: boolean;
}

const AddToWatchlistButton = ({
  isFirstInButtonGroup = false,
  isLastInButtonGroup = false
}: AddToWatchlistButtonProps) => {
  return (
    <Tooltip title="Add to watchlist">
      <Button
        size="small"
        sx={{
          transition: "all 0.25s ease",
          "&:hover": {
            flexGrow: 3
          },
          ...(isFirstInButtonGroup && {
            borderTopLeftRadius: 0
          }),
          ...(isLastInButtonGroup && {
            borderTopRightRadius: 0
          })
        }}
      >
        <PlaylistAddIcon fontSize="small" />
      </Button>
    </Tooltip>
  );
};

export default AddToWatchlistButton;
