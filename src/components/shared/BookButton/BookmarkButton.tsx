import { Button, Tooltip } from "@mui/material";

import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

interface BookmarkButtonProps {
  isFirstInButtonGroup?: boolean;
  isLastInButtonGroup?: boolean;
}

const BookmarkButton = ({
  isFirstInButtonGroup = false,
  isLastInButtonGroup = false
}: BookmarkButtonProps) => {
  return (
    <Tooltip title="Add to favorite">
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
        <BookmarkBorderOutlinedIcon fontSize="small" />
      </Button>
    </Tooltip>
  );
};

export default BookmarkButton;
