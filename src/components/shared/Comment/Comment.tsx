import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";

import { StyledPaper } from "@/styles/components/Paper";

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
  return (
    <Card>
      <CardHeader
        avatar={<Avatar alt={username} src={avatar} />}
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={username}
        subheader={date}
      />
      <CardContent>
        <ReadMore>{comment}</ReadMore>
      </CardContent>
    </Card>
  );
};

export default Comment;
