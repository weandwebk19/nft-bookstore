import React, { useEffect, useState } from "react";

import { Box, Collapse } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import axios from "axios";

import { useAccount } from "@/components/hooks/web3";

import Comment from "./Comment";
import InputComment from "./InputComment";

interface CommentProps {
  id: string | number;
  author: string;
  authorAvatar: string;
  content: string;
  rating?: number;
  // replies: CommentProps[];
}

const NestedComments = ({
  id,
  author,
  authorAvatar,
  content,
  rating
}: // replies
CommentProps) => {
  const theme = useTheme();

  const [showNestedComments, setShowNestedComments] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [userName, setUserName] = useState("");
  const { account } = useAccount();
  const [targetReply, setTargetReply] = useState("");

  const handleReplyCommentClick = (replyTo: string) => {
    setShowReplyInput(true);
    setShowNestedComments(true);
    setTargetReply(replyTo);
  };

  const handleNestedCommentsToggle = () => {
    setShowNestedComments(!showNestedComments);
  };

  useEffect(() => {
    (async () => {
      try {
        if (account) {
          const userRes = await axios.get(`/api/users/wallet/${account.data}`);

          if (userRes.data.success === true) {
            setUserName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [account]);

  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ width: "100%" }}>
          <Comment
            username={author}
            avatar={authorAvatar}
            comment={content}
            rating={rating}
            onShowReplyInput={() => handleReplyCommentClick(author)}
            showNestedComments={showNestedComments}
            onShowNestedComment={handleNestedCommentsToggle}
            // hasChildren={replies && replies?.length > 0}
          />
        </Box>
        {/* {replies && (
          <Box sx={{ ml: 2 }}>
            <Collapse in={showNestedComments} timeout="auto" unmountOnExit>
              <Box>
                {replies.map((comment) => (
                  <Box
                    key={comment.id}
                    sx={{
                      borderLeft: `1px solid ${theme.palette.background.default}`,
                      borderBottom: `1px solid ${theme.palette.background.default}`,
                      borderBottomLeftRadius: "1em"
                    }}
                  >
                    <Comment
                      username={comment.author}
                      comment={comment.content}
                      rating={comment.rating}
                      onShowReplyInput={() =>
                        handleReplyCommentClick(comment.author)
                      }
                      onShowNestedComment={handleNestedCommentsToggle}
                    />
                  </Box>
                ))}
              </Box>
              {showReplyInput && (
                <InputComment username={userName} replyTo={targetReply} />
              )}
            </Collapse>
          </Box>
        )} */}
      </Box>
    </div>
  );
};

export default NestedComments;
