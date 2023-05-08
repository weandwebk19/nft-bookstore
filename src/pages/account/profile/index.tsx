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
import * as yup from "yup";

import { useAccount } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
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
  userName: "",
  email: "",
  bio: "",
  website: "",
  walletAddress: "",
  facebook: "",
  twitter: "",
  linkedIn: "",
  instagram: "",
  picture: ""
};

const Profile = () => {
  const { t } = useTranslation("profile");
  const { ethereum, bookStoreContract } = useWeb3();
  const { account } = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [isAddressCopied, setIsAddressCopied] = useState(false);

  const schema = yup
    .object({
      userName: yup.string().required(t("textError1") as string),
      email: yup
        .string()
        .required(t("textError2") as string)
        .email(t("textError3") as string),
      bio: yup.string(),
      website: yup.string(),
      walletAddress: yup.string(),
      facebook: yup.string(),
      twitter: yup.string(),
      linkedIn: yup.string(),
      instagram: yup.string(),
      picture: yup
        .mixed()
        .required(t("textError4") as string)
        .test("required", t("textError5") as string, (file: any) => {
          if (file) return true;
          return false;
        })
        .test("fileSize", t("textError6") as string, (file: any) => {
          return file && file?.size <= MAXIMUM_ATTACHMENTS_SIZE;
        })
        .test("fileFormat", t("textError7") as string, (file: any) => {
          return file && SUPPORTED_FORMATS.includes(file.type);
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
  const watchPicture = watch("picture");

  const handleRemoveImage = useCallback(async () => {
    setValue("picture", "");
  }, []);

  const handleCancel = useCallback(async () => {
    reset((formValues) => ({
      ...defaultValues,
      walletAddress: formValues.walletAddress
    }));
  }, []);

  const onSubmit = useCallback((data: any) => {
    console.log("data:", data);
    (async () => {
      try {
        setIsLoading(true);

        const { picture, ...authorInfo } = data;

        // handleCancel();
        setIsLoading(false);
      } catch (error: any) {
        console.log("error:", error);
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setValue("walletAddress", account.data);
  }, [account.data]);

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
          <ContentContainer titles={[t("titleContent1") as string]}>
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
                              {!errors.picture && watchPicture ? (
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
                                    name="picture"
                                    readOnly={isLoading}
                                  />
                                </StyledButton>
                                <StyledButton
                                  customVariant="secondary"
                                  onClick={handleRemoveImage}
                                  disabled={isLoading}
                                >
                                  {t("removeBtn") as string}
                                </StyledButton>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Grid>
                        {errors && errors.picture && (
                          <Grid item xs={12}>
                            <FormHelperText
                              error
                              sx={{ marginTop: "24px", fontSize: "14px" }}
                            >
                              {errors?.picture?.message}
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
                              name="userName"
                              readOnly={isLoading}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormGroup label={t("email") as string} required>
                            <TextFieldController name="email" />
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

export default Profile;

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
