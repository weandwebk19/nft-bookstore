import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Avatar, Box, Stack, Typography } from "@mui/material";

import SendRoundedIcon from "@mui/icons-material/SendRounded";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { InputController } from "../FormController";
import { StaticRating } from "../Rating";

interface InputCommentProps {
  avatar?: string;
  username: string;
  date?: string | Date;
  rating?: number;
  comment?: string;
  canComment?: boolean;
  hasChildren?: boolean;
  showNestedComments?: boolean;
  onShowNestedComment?: () => void;
  showReplyInput?: boolean;
  onShowReplyInput?: () => void;
  replyTo: string;
}
const defaultValues = {
  reviewContent: ""
};
const schema = yup.object({
  reviewContent: yup.string()
});
const InputComment = ({
  avatar,
  username,
  rating,
  replyTo
}: InputCommentProps) => {
  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });
  const { handleSubmit } = methods;
  const onSubmit = async (data: any) => {};
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
          <Box sx={{ width: "100%" }}>
            <Typography variant="label">{username}</Typography>
            <Typography variant="inherit">
              {rating ? StaticRating(rating) : "_"}
            </Typography>
            <Box mt={2}>
              <FormProvider {...methods}>
                <InputController
                  name="reviewContent"
                  icon={
                    <SendRoundedIcon
                      color="secondary"
                      fontSize="inherit"
                      onClick={handleSubmit(onSubmit)}
                    />
                  }
                  tagName={replyTo}
                />
              </FormProvider>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};
export default InputComment;
