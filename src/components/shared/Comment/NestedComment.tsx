import React, { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  OutlinedInput,
  Paper,
  Stack,
  Typography
} from "@mui/material";

import SubdirectoryArrowRightOutlinedIcon from "@mui/icons-material/SubdirectoryArrowRightOutlined";
import TryOutlinedIcon from "@mui/icons-material/TryOutlined";

import Comment from "./Comment";

// import { makeStyles } from "@mui/styles";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//     flexDirection: "column",
//     marginBottom: theme.spacing(2)
//   },
//   comment: {
//     marginBottom: theme.spacing(1)
//   },
//   nestedComments: {
//     marginLeft: theme.spacing(2)
//   },
//   button: {
//     marginTop: theme.spacing(1)
//   }
// }));

interface CommentProps {
  username: string; // this is you
  avatar: string; // this is your avatar
  author: string; // this is comment author
  authorAvatar: string; // this is author avatar
  content: string;
  nestedComments?: CommentProps[];
}

const NestedComments = ({
  username,
  author,
  content,
  nestedComments
}: CommentProps) => {
  // const classes = useStyles();
  const [showNestedComments, setShowNestedComments] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleReplyCommentClick = () => {
    setShowReplyInput(true);
    setShowNestedComments(true);
  };

  const handleNestedCommentsToggle = () => {
    setShowNestedComments(!showNestedComments);
  };

  return (
    <div>
      <Box sx={{ mb: 3 }}>
        {/* <Card>
          <CardContent>
            <Typography variant="h6">{author}</Typography>
            <Typography>{content}</Typography>
            {nestedComments && (
              <Button
                size="small"
                variant="text"
                startIcon={<TryOutlinedIcon />}
                onClick={handleNestedCommentsToggle}
              >
                {showNestedComments ? "Hide replies" : "View replies"}
              </Button>
            )}
          </CardContent>
        </Card> */}
        <Box sx={{ width: "100%" }}>
          <Comment username={author} comment={content} rating={5} />
        </Box>
        {nestedComments && (
          <Stack direction="row" spacing={3}>
            <Button
              size="small"
              variant="text"
              startIcon={<TryOutlinedIcon />}
              onClick={handleReplyCommentClick}
            >
              Reply
            </Button>
            <Button
              size="small"
              variant="text"
              startIcon={<SubdirectoryArrowRightOutlinedIcon />}
              onClick={handleNestedCommentsToggle}
            >
              {showNestedComments ? "Hide replies" : "View replies"}
            </Button>
          </Stack>
        )}
        {nestedComments && (
          <Box sx={{ ml: 2 }}>
            <Collapse
              in={showNestedComments}
              timeout="auto"
              unmountOnExit
              sx={{ borderLeft: "1px solid black" }}
            >
              <div>
                {nestedComments.map((comment) => (
                  <>
                    <NestedComments key={comment.content} {...comment} />
                    <Divider />
                  </>
                ))}
              </div>
              {showReplyInput && (
                <Comment username={username} canComment={showReplyInput} />
              )}
            </Collapse>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default NestedComments;
