import React, { useEffect } from "react";

import {
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography
} from "@mui/material";

import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SubdirectoryArrowRightOutlinedIcon from "@mui/icons-material/SubdirectoryArrowRightOutlined";
import TryOutlinedIcon from "@mui/icons-material/TryOutlined";

import { StaticRating } from "../Rating";
import { ReadMore } from "../ReadMore";

interface CommentProps {
  avatar?: string;
  username: string;
  date: string | Date;
  rating?: number;
  comment?: string;
  canComment?: boolean;
  hasChildren?: boolean;
  showNestedComments?: boolean;
  onShowNestedComment?: () => void;
  onShowReplyInput?: () => void;
}

const Comment = ({
  avatar,
  username,
  date,
  rating,
  comment = "",
  hasChildren = false,
  showNestedComments = false,
  onShowNestedComment,
  onShowReplyInput
}: CommentProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [reviewDate, setReviewDate] = React.useState<string>("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const d = new Date(date);
    setReviewDate(d.toDateString());
  }, []);

  return (
    <Stack direction="row" p={2} spacing={2}>
      <Avatar alt={username} src={avatar} />
      <Stack
        sx={{
          width: "100%"
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Box>
            <Typography variant="label">{username}</Typography>
            <Typography variant="inherit">
              {rating ? StaticRating(rating) : "_"}
            </Typography>
            <Box mt={2}>
              <ReadMore>{comment}</ReadMore>
            </Box>
            <Stack direction="row" spacing={3} alignItems="center">
              <Typography variant="body2">{reviewDate}</Typography>
              {/* <Button
                size="small"
                variant="text"
                startIcon={<TryOutlinedIcon />}
                onClick={onShowReplyInput}
              >
                Reply
              </Button> */}
              {hasChildren && (
                <Button
                  size="small"
                  variant="text"
                  startIcon={<SubdirectoryArrowRightOutlinedIcon />}
                  onClick={onShowNestedComment}
                >
                  {showNestedComments ? "Hide reply" : "View reply"}
                </Button>
              )}
            </Stack>
          </Box>
          <Box>
            <IconButton
              id="more-button"
              aria-controls={open ? "more button" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="more-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <EmojiFlagsIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Report this review</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Comment;
