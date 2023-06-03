import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import Avatar from "@mui/material/Avatar";

import {
  ContentCopy as ContentCopyIcon,
  FacebookRounded as FacebookRoundedIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon
} from "@mui/icons-material";

import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import * as yup from "yup";

import withAuth from "@/components/HOC/withAuth";
import { useUserInfo } from "@/components/hooks/api/useUserInfo";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { ContentGroup } from "@/components/shared/ContentGroup";
import {
  TextAreaController,
  TextFieldController
} from "@/components/shared/FormController";
import FileController from "@/components/shared/FormController/FileController";
import { FormGroup } from "@/components/shared/FormGroup";
import { uploadImage } from "@/lib/cloudinary";
import { StyledButton } from "@/styles/components/Button";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const MAXIMUM_ATTACHMENTS_SIZE = 100000000;
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/svg"
];

const defaultValues = {
  fullname: "",
  email: "",
  bio: "",
  website: "",
  walletAddress: "",
  facebook: "",
  twitter: "",
  linkedIn: "",
  instagram: "",
  avatar: ""
};

const Profile = () => {
  const { t } = useTranslation("profile");
  const userInfo = useUserInfo();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isAddressCopied, setIsAddressCopied] = useState(false);

  const schema = yup
    .object({
      fullname: yup.string().required(t("textError1") as string),
      email: yup.string().email(t("textError3") as string),
      bio: yup.string(),
      website: yup.string(),
      walletAddress: yup.string(),
      facebook: yup.string(),
      twitter: yup.string(),
      linkedIn: yup.string(),
      instagram: yup.string(),
      avatar: yup
        .mixed()
        .test("required", t("textError5") as string, (file: any) => {
          if (file) return true;

          if (userInfo.data?.avatar) return true;

          return false;
        })
        .test("fileSize", t("textError6") as string, (file: any) => {
          if (file && file?.size <= MAXIMUM_ATTACHMENTS_SIZE) return true;

          if (userInfo.data?.avatar) return true;

          return false;
        })
        .test("fileFormat", t("textError7") as string, (file: any) => {
          if (file && SUPPORTED_FORMATS.includes(file.type)) return true;

          if (userInfo.data?.avatar) return true;

          return false;
        })
    })
    .required();

  type FormData = yup.InferType<typeof schema>;

  const methods = useForm<FormData>({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset
  } = methods;
  const watchPicture = watch("avatar");

  const handleRemoveImage = useCallback(async () => {
    setValue("avatar", "");
  }, [setValue]);

  const handleCancel = useCallback(async () => {
    reset((formValues) => ({
      ...defaultValues,
      walletAddress: formValues.walletAddress
    }));
  }, [reset]);

  const onSubmit = useCallback(
    (data: any) => {
      (async () => {
        try {
          setIsLoading(true);

          const { avatar, ...authorInfo } = data;
          let avatarLink = null;

          if (avatar) {
            avatarLink = await uploadImage(avatar);
          }

          const promise = axios.post(`/api/users/${userInfo.data?.id}/update`, {
            ...authorInfo,
            avatar:
              avatarLink && avatarLink?.secure_url ? avatarLink.secure_url : "",
            avatarPublicId:
              avatarLink && avatarLink?.public_id ? avatarLink.public_id : ""
          });

          const res = await toast.promise(
            promise,
            {
              pending: t("pendingProfile") as string,
              success: t("successProfile") as string,
              error: t("errorProfile") as string
            },
            {
              position: toast.POSITION.TOP_CENTER
            }
          );

          setIsLoading(false);
        } catch (error: any) {
          console.log("error:", error);
          setIsLoading(false);
        }
      })();
    },
    [userInfo.data, t]
  );

  useEffect(() => {
    setValue("fullname", userInfo.data?.fullname);
    setValue("email", userInfo.data?.email);
    setValue("walletAddress", userInfo.data?.walletAddress);
    setValue("bio", userInfo.data?.bio ? userInfo.data?.bio : "");
    setValue("website", userInfo.data?.website ? userInfo.data?.website : "");
    setValue(
      "facebook",
      userInfo.data?.facebook ? userInfo.data?.facebook : ""
    );
    setValue("twitter", userInfo.data?.twitter ? userInfo.data?.twitter : "");
    setValue(
      "linkedIn",
      userInfo.data?.linkedIn ? userInfo.data?.linkedIn : ""
    );
    setValue(
      "instagram",
      userInfo.data?.instagram ? userInfo.data?.instagram : ""
    );
  }, [userInfo.data, setValue]);

  return (
    <>
      <Head>
        <title>{t("titlePage") as string}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box sx={{ pt: 6 }}>
          <ContentContainer
            titles={[t("titleContent1") as string]}
            width={720}
            button={
              userInfo.data?.isAuthor && (
                <StyledButton
                  customVariant="secondary"
                  onClick={() => {
                    router.push("/author/profile");
                  }}
                  disabled={isLoading}
                >
                  {t("authorProfileBtn") as string}
                </StyledButton>
              )
            }
          >
            <Box sx={{ flexGrow: 1, width: "100%", maxWidth: "720px" }}>
              <Box sx={{ my: 2 }}>
                <Typography
                  variant="caption"
                  className="form-label required"
                  sx={{ fontSize: "14px" }}
                >
                  {t("required") as string}
                </Typography>
              </Box>
              <FormProvider {...methods}>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <ContentGroup
                      title={t("titleUpload") as string}
                      classTitle="required"
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Grid
                            container
                            spacing={{ xs: 4, sm: 4, md: 8, lg: 10 }}
                          >
                            <Grid item xs={12} md={8}>
                              {errors.avatar ? (
                                <Avatar
                                  alt="avatar"
                                  src=""
                                  sx={{
                                    display: "flex",
                                    maxWidth: "400px",
                                    width: "100%",
                                    height: "100%",
                                    aspectRatio: "1 / 1",
                                    borderRadius: "100rem",
                                    margin: "auto"
                                  }}
                                />
                              ) : watchPicture ? (
                                <Box
                                  component="img"
                                  src={URL.createObjectURL(watchPicture as any)}
                                  sx={{
                                    width: "100%",
                                    maxWidth: "400px",
                                    aspectRatio: "1 / 1",
                                    borderRadius: "100rem",
                                    objectFit: "cover",
                                    margin: "auto"
                                  }}
                                />
                              ) : userInfo.data?.avatar ? (
                                <Box
                                  component="img"
                                  src={userInfo.data?.avatar}
                                  sx={{
                                    width: "100%",
                                    maxWidth: "400px",
                                    aspectRatio: "1 / 1",
                                    borderRadius: "100rem",
                                    objectFit: "cover",
                                    margin: "auto"
                                  }}
                                />
                              ) : (
                                <Avatar
                                  alt="avatar"
                                  src=""
                                  sx={{
                                    display: "flex",
                                    maxWidth: "400px",
                                    width: "100%",
                                    height: "100%",
                                    aspectRatio: "1 / 1",
                                    borderRadius: "100rem",
                                    margin: "auto"
                                  }}
                                />
                              )}
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              sx={{
                                margin: "auto"
                              }}
                            >
                              <Stack spacing={3}>
                                <StyledButton
                                  customVariant="primary"
                                  component={isLoading ? "button" : "label"}
                                  disabled={isLoading}
                                >
                                  {t("uploadPhotoBtn") as string}
                                  <FileController
                                    name="avatar"
                                    readOnly={isLoading}
                                  />
                                </StyledButton>
                                {userInfo.data?.avatar ? (
                                  <StyledButton
                                    customVariant="secondary"
                                    onClick={handleRemoveImage}
                                    disabled={isLoading}
                                  >
                                    {t("originalPhotoBtn") as string}
                                  </StyledButton>
                                ) : (
                                  <StyledButton
                                    customVariant="secondary"
                                    onClick={handleRemoveImage}
                                    disabled={isLoading}
                                  >
                                    {t("removeBtn") as string}
                                  </StyledButton>
                                )}
                              </Stack>
                            </Grid>
                          </Grid>
                        </Grid>
                        {errors && errors.avatar && (
                          <Grid item xs={12}>
                            <FormHelperText
                              error
                              sx={{ marginTop: "24px", fontSize: "14px" }}
                            >
                              {errors?.avatar?.message}
                            </FormHelperText>
                          </Grid>
                        )}
                      </Grid>
                    </ContentGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <ContentGroup title={t("titleInfo") as string}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormGroup label={t("username") as string} required>
                            <TextFieldController
                              name="fullname"
                              readOnly={isLoading}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormGroup label={t("email") as string}>
                            <TextFieldController
                              name="email"
                              readOnly={isLoading}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={12}>
                          <FormGroup label={t("bio") as string}>
                            <TextAreaController
                              name="bio"
                              readOnly={isLoading}
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>
                    </ContentGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <ContentGroup title={t("titleSocial") as string}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormGroup label={t("website") as string}>
                            <TextFieldController
                              name="website"
                              readOnly={isLoading}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={12}>
                          <FormGroup label={t("walletAddress") as string}>
                            <TextFieldController
                              name="walletAddress"
                              readOnly={true}
                              endAdornment={
                                <InputAdornment position="end">
                                  <Tooltip
                                    title={
                                      isAddressCopied
                                        ? "Copied"
                                        : "Copy address"
                                    }
                                  >
                                    <IconButton
                                      edge="end"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          `${getValues("walletAddress")}`
                                        );
                                        setIsAddressCopied(true);
                                      }}
                                    >
                                      <ContentCopyIcon />
                                    </IconButton>
                                  </Tooltip>
                                </InputAdornment>
                              }
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>
                    </ContentGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <ContentGroup title={t("socialMedia") as string}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormGroup
                            label={
                              <Box
                                component="span"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px"
                                }}
                              >
                                <FacebookRoundedIcon />
                                Facebook
                              </Box>
                            }
                          >
                            <TextFieldController
                              name="facebook"
                              readOnly={isLoading}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormGroup
                            label={
                              <Box
                                component="span"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px"
                                }}
                              >
                                <TwitterIcon />
                                Twitter
                              </Box>
                            }
                          >
                            <TextFieldController
                              name="twitter"
                              readOnly={isLoading}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormGroup
                            label={
                              <Box
                                component="span"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px"
                                }}
                              >
                                <LinkedInIcon />
                                LinkedIn
                              </Box>
                            }
                          >
                            <TextFieldController
                              name="linkedIn"
                              readOnly={isLoading}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormGroup
                            label={
                              <Box
                                component="span"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px"
                                }}
                              >
                                <InstagramIcon />
                                Instagram
                              </Box>
                            }
                          >
                            <TextFieldController
                              name="instagram"
                              readOnly={isLoading}
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>
                    </ContentGroup>
                  </Grid>
                  <Grid item xs={12} justifyContent="flex-end">
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: "center",
                        justifyContent: "flex-end"
                      }}
                    >
                      <StyledButton
                        customVariant="secondary"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        {t("cancel") as string}
                      </StyledButton>
                      <StyledButton
                        customVariant="primary"
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                      >
                        {t("saveChanges") as string}
                      </StyledButton>
                    </Stack>
                  </Grid>
                </Grid>
              </FormProvider>
            </Box>
          </ContentContainer>
        </Box>
        <ToastContainer />
      </main>
    </>
  );
};

export default withAuth(Profile);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "profile"
      ]))
    }
  };
}
