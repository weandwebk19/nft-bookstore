import { Button, Tooltip } from "@mui/material";

import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

const BookmarkButton = () => {
  return (
    <Tooltip title="Add to favorite">
      <Button
        size="small"
        sx={{
          transition: "all 0.25s ease",
          "&:hover": {
            flexGrow: 3
          }
        }}
      >
        <BookmarkBorderOutlinedIcon fontSize="small" />
      </Button>
    </Tooltip>
  );
};

export default BookmarkButton;
