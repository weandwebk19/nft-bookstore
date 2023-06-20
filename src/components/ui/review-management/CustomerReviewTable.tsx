import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import AssistantOutlinedIcon from "@mui/icons-material/AssistantOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  GridColDef,
  GridRenderCellParams,
  GridTreeNodeWithRender
} from "@mui/x-data-grid";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import * as yup from "yup";

import { useAccount } from "@/components/hooks/web3";
import { Comment } from "@/components/shared/Comment";
import { DataGrid } from "@/components/shared/DataGrid";
import { Dialog } from "@/components/shared/Dialog";
import { TextAreaController } from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { Image } from "@/components/shared/Image";
import { StaticRating } from "@/components/shared/Rating";
import { ReadMore } from "@/components/shared/ReadMore";
import { StyledButton } from "@/styles/components/Button";
import { ReviewColumns, ReviewInfo, ReviewRowData } from "@/types/reviews";

interface CustomerReviewTableProps {
  data: ReviewRowData[];
}

const schema = yup
  .object({
    reply: yup.string()
  })
  .required();

const defaultValues = {
  reply: ""
};

export default function CustomerReviewTable({
  data
}: CustomerReviewTableProps) {
  const matches = useMediaQuery("(min-width:700px)");

  const router = useRouter();
  const { t } = useTranslation("reviewManagement");
  const { account } = useAccount();

  const [targetItem, setTargetItem] = React.useState<any>({});
  const [reviewDate, setReviewDate] = React.useState<string>("");
  const [reformattedData, setReformattedData] = React.useState<ReviewColumns[]>(
    []
  );

  const [anchorDeleteButton, setAnchorDeleteButton] =
    React.useState<Element | null>(null);

  const openDeleteDialog = Boolean(anchorDeleteButton);

  React.useEffect(() => {
    if (data) {
      const reformattedData = data.map((item) => {
        const {
          id,
          avatar,
          username,
          title,
          bookCover,
          date,
          rating,
          comment,
          reply
        } = item;
        return {
          id,
          buyer: {
            avatar,
            username
          },
          book: {
            title,
            bookCover
          },
          review: {
            date,
            rating,
            comment,
            reply
          },
          action: {
            id,
            avatar,
            username,
            title,
            bookCover,
            date,
            rating,
            comment,
            reply
          }
        } as ReviewColumns;
      });
      setReformattedData(reformattedData);
    }
  }, [data]);

  const handleOpenDeleteDialogClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
  ) => {
    e.preventDefault();
    const d = new Date(params.row?.review.date);
    setAnchorDeleteButton(e.currentTarget);
    setTargetItem(params.row);
    setReviewDate(d.toDateString());
  };

  const handleReplyClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: ReviewRowData
  ) => {
    e.preventDefault();
    setAnchorDeleteButton(null);

    (async () => {
      try {
        if (account.data) {
          const res = await axios.delete(
            `/api/review-managements/${account.data}/${item.id}/delete`
          );
          if (res.data.success) {
            toast.success("Reply sent!", {
              position: toast.POSITION.TOP_RIGHT
            });
          } else {
            toast.error("Oops! Something went wrong!", {
              position: toast.POSITION.TOP_RIGHT
            });
          }
        }
      } catch (err: any) {
        toast.error("An error occured while replying", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    })();
  };

  const handleCancelClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorDeleteButton(null);
  };

  const handleDeleteClose = () => {
    setAnchorDeleteButton(null);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: t("id") as string,
      width: 10
    },
    {
      field: "book",
      headerName: t("bookInfo") as string,
      width: 150,
      renderCell: (params) => {
        return (
          <Stack py={3}>
            <Image
              src={params?.value?.bookCover}
              alt={params?.value?.title} // should be replace to bookId
              sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
              className={styles["book-item__book-cover"]}
            />
            <Typography>{params?.value?.title}</Typography>
          </Stack>
        );
      }
    },
    {
      field: "buyer",
      headerName: t("buyer") as string,
      width: 150,
      renderCell: (params) => (
        <Stack>
          <Avatar src={params?.value?.avatar} />
          <Typography>{params?.value?.username}</Typography>
        </Stack>
      )
    },
    {
      field: "review",
      headerName: t("review") as string,
      width: 200,
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params?.value?.date);
        return (
          <Stack my={3}>
            <Typography variant="inherit">
              {params?.value?.rating
                ? StaticRating(params?.value?.rating)
                : "_"}
            </Typography>
            <ReadMore>{params?.value?.comment}</ReadMore>
            <Typography variant="caption">{date.toDateString()}</Typography>
          </Stack>
        );
      }
    },
    {
      field: "action",
      headerName: t("action") as string,
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <Tooltip
              title={
                params?.value?.reply
                  ? t("tooltip_editReply")
                  : t("tooltip_reply")
              }
            >
              <IconButton
                onClick={(e) => handleOpenDeleteDialogClick(e, params)}
                color={params?.value?.reply ? "default" : "secondary"}
              >
                {params?.value?.reply ? (
                  params?.value.action
                ) : (
                  <Badge color="secondary" variant="dot">
                    {params?.value.action}
                  </Badge>
                )}
              </IconButton>
            </Tooltip>

            <Dialog
              title={t("dialogTitle") as string}
              open={openDeleteDialog}
              onClose={handleDeleteClose}
            >
              <FormProvider {...methods}>
                <Stack spacing={3}>
                  <Typography variant="caption">
                    Review ID: {targetItem?.id}
                  </Typography>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                  >
                    <Image
                      src={targetItem?.book?.bookCover}
                      alt={targetItem?.book?.title}
                      sx={{
                        flexShrink: 0,
                        aspectRatio: "2 / 3",
                        width: "100px"
                      }}
                      className={styles["book-item__book-cover"]}
                    />
                    <Stack
                      justifyContent="space-between"
                      sx={{
                        width: "100%"
                      }}
                    >
                      <Typography variant="h5">
                        {targetItem?.book?.title}
                      </Typography>
                      <Stack>
                        <Comment
                          avatar={targetItem?.buyer?.avatar}
                          username={targetItem?.buyer?.username}
                          rating={targetItem?.review?.rating}
                          comment={targetItem?.review?.comment}
                          date={reviewDate}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                  <Divider />
                  <FormGroup label="Reply">
                    <TextAreaController
                      name="reply"
                      defaultValue={
                        targetItem?.review?.reply
                          ? targetItem?.review?.reply
                          : ""
                      }
                      maxCharacters={8000}
                    />
                  </FormGroup>
                  <Divider />
                  <Stack direction="row" spacing={3} justifyContent="end">
                    <StyledButton
                      customVariant="secondary"
                      onClick={(e) => handleCancelClick(e)}
                    >
                      {t("button_cancel")}
                    </StyledButton>
                    {targetItem?.review?.reply ? (
                      <StyledButton
                        onClick={handleSubmit(async (data: any) => {
                          await handleSendReplpy({
                            id: targetItem?.id,
                            reply: data.reply
                          });
                        })}
                      >
                        {t("button_editReply")}
                      </StyledButton>
                    ) : (
                      <StyledButton
                        onClick={handleSubmit(async (data: any) => {
                          await handleSendReplpy({
                            id: targetItem?.id,
                            reply: data.reply
                          });
                        })}
                      >
                        {t("button_reply")}
                      </StyledButton>
                    )}
                  </Stack>
                </Stack>
              </FormProvider>
              <ToastContainer />
            </Dialog>
          </>
        );
      }
    }
  ];

  React.useEffect(() => {
    reformattedData.forEach((object) => {
      if (object.action) {
        object.action.action = <AssistantOutlinedIcon />;
      }
    });
  }, [reformattedData]);

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });

  const { handleSubmit } = methods;

  // const onSubmit = async (data: any) => {
  //   console.log(data);
  // };

  const updateReview = React.useCallback(async (review: ReviewInfo) => {
    const res = await axios.put(`/api/reviews/${review.id}/update`, {
      reviewInfo: review
    });
    if (res.data.success === true) {
      toast.success("Update review successfully.");
    } else {
      toast.error("Oops! Something went wrong!", {
        position: toast.POSITION.TOP_CENTER
      });
    }
    return res.data.data;
  }, []);

  const handleSendReplpy = async (review: any) => {
    try {
      const newReview = await updateReview(review);
    } catch (e: any) {
      toast.error("An error occured while updating review", {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={3}>
        <Typography>{t("filter")}:</Typography>
        <ButtonGroup orientation={`${matches ? `horizontal` : `vertical`}`}>
          <Button
            variant={
              router.query.filter === undefined ? "contained" : "outlined"
            }
            onClick={() => {
              router.push("/review-management");
            }}
          >
            {t("all")}
          </Button>
          <Button
            variant={
              router.query.filter === "replied" ? "contained" : "outlined"
            }
            onClick={() => {
              router.push("/review-management?filter=replied");
            }}
          >
            {t("replied")}
          </Button>
          <Button
            variant={
              router.query.filter === "not-replied" ? "contained" : "outlined"
            }
            onClick={() => {
              router.push("/review-management?filter=not-replied");
            }}
          >
            {t("notReplied")}
          </Button>
        </ButtonGroup>
      </Stack>
      <DataGrid
        getRowId={(row: any) => row.id}
        columns={columns}
        rows={reformattedData}
      />
    </Stack>
  );
}
