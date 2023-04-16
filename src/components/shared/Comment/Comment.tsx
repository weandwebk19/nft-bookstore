import React from "react";

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography
} from "@mui/material";

import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";

import { StyledPaper } from "@/styles/components/Paper";

import { StaticRating } from "../Rating";
import { ReadMore } from "../ReadMore";

interface CommentProps {
  avatar?: string;
  username: string;
  date: string;
  rating: number;
  comment?: string;
}

const Comment = ({
  avatar,
  username,
  date,
  rating,
  comment = ""
}: CommentProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card>
      <Stack direction="row">
        {/* <Stack sx={{ p: 2 }}>
          <Avatar alt={username} src={avatar} />
          <Typography>{username}</Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "0.875rem",
              lineHeight: 1.43,
              color: "rgba(31,27,22,0.54)"
            }}
          >
            {date}
          </Typography>
        </Stack> */}

        <Stack>
          <CardHeader
            avatar={<Avatar alt={username} src={avatar} />}
            action={
              <>
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
                    <Typography variant="inherit">
                      Report this review
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            }
            title={username}
            subheader={date}
          />
          <CardContent>
            {StaticRating(rating)}
            <ReadMore>{comment}</ReadMore>
          </CardContent>
        </Stack>
      </Stack>
    </Card>
  );
};

export default Comment;
