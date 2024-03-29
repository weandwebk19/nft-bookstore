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
  Link,
  Stack,
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

import withAuth from "@/components/HOC/withAuth";
import { useAccount } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { ContentGroup } from "@/components/shared/ContentGroup";
import {
  AttachmentController,
  TextAreaController,
  TextFieldController
} from "@/components/shared/FormController";
import FileController from "@/components/shared/FormController/FileController";
import { FormGroup } from "@/components/shared/FormGroup";
import { uploadImage } from "@/lib/cloudinary";
import { StyledButton } from "@/styles/components/Button";
import formatBytes from "@/utils/formatBytes";
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
  pseudonym: "",
  about: "",
  email: "",
  phoneNumber: "",
  website: "",
  walletAddress: "",
  facebook: "",
  twitter: "",
  linkedIn: "",
  instagram: "",
  frontDocument: "",
  backDocument: "",
  picture: ""
};

const AuthorRequest = () => {
  const { t } = useTranslation("authorRequest");
  const { account } = useAccount();

  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    pseudonym: yup.string().required(t("textError1") as string),
    about: yup.string(),
    email: yup
      .string()
      .required(t("textError2") as string)
      .email(t("textError3") as string),
    phoneNumber: yup
      .string()
      .required(t("textError4") as string)
      .matches(
        /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/,
        t("textError5") as string
      ),
    website: yup.string(),
    walletAddress: yup.string(),
    facebook: yup.string(),
    twitter: yup.string(),
    linkedIn: yup.string(),
    instagram: yup.string(),
    frontDocument: yup
      .mixed()
      .required(t("textError6") as string)
      .test("required", t("textError7") as string, (file: any) => {
        if (file) return true;
        return false;
      })
      .test("fileSize", t("textError8") as string, (file: any) => {
        return file && file?.size <= MAXIMUM_ATTACHMENTS_SIZE;
      })
      .test("fileFormat", t("textError12") as string, (file: any) => {
        return file && SUPPORTED_FORMATS.includes(file.type);
      }),
    backDocument: yup
      .mixed()
      .required(t("textError6") as string)
      .test("required", t("textError7") as string, (file: any) => {
        if (file) return true;
        return false;
      })
      .test("fileSize", t("textError8") as string, (file: any) => {
        return file && file?.size <= MAXIMUM_ATTACHMENTS_SIZE;
      })
      .test("fileFormat", t("textError12") as string, (file: any) => {
        return file && SUPPORTED_FORMATS.includes(file.type);
      }),
    picture: yup
      .mixed()
      .required(t("textError9") as string)
      .test("required", t("textError10") as string, (file: any) => {
        if (file) return true;
        return false;
      })
      .test("fileSize", t("textError11") as string, (file: any) => {
        return file && file?.size <= MAXIMUM_ATTACHMENTS_SIZE;
      })
      .test("fileFormat", t("textError12") as string, (file: any) => {
        return file && SUPPORTED_FORMATS.includes(file.type);
      })
  });

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
    getValues,
    setValue,
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
    (async () => {
      try {
        setIsLoading(true);

        const { frontDocument, backDocument, picture, ...authorInfo } = data;

        const pictureLink = await uploadImage(picture);
        const frontDocumentLink = await uploadImage(frontDocument);
        const backDocumentLink = await uploadImage(backDocument);

        const promise = axios.post("/api/authors/request", {
          ...authorInfo,
          frontDocument: {
            secure_url: frontDocumentLink.secure_url,
            public_id: frontDocumentLink.public_id
          },
          backDocument: {
            secure_url: backDocumentLink.secure_url,
            public_id: backDocumentLink.public_id
          },
          picture: {
            secure_url: pictureLink.secure_url,
            public_id: pictureLink.public_id
          }
        });
        const res = await toast.promise(
          promise,
          {
            pending: t("pendingAuthorRequest") as string,
            success: t("messageSuccessCreated") as string,
            error: t("messageErrorCreated") as string
          },
          {
            position: toast.POSITION.TOP_CENTER
          }
        );
        handleCancel();
        setIsLoading(false);
      } catch (error: any) {
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
          <ContentContainer
            titles={[
              t("titleContent1") as string,
              t("titleContent2") as string
            ]}
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
                        <Grid item xs={12}>
                          <FormGroup label={t("pseudonym") as string} required>
                            <TextFieldController
                              name="pseudonym"
                              readOnly={isLoading}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={12}>
                          <FormGroup label={t("about") as string}>
                            <TextAreaController
                              name="about"
                              readOnly={isLoading}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormGroup label={t("email") as string} required>
                            <TextFieldController
                              name="email"
                              readOnly={isLoading}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormGroup
                            label={t("phoneNumber") as string}
                            required
                          >
                            <TextFieldController
                              name="phoneNumber"
                              onChange={(e) => {
                                e.target.value = e.target.value.trim();
                              }}
                              readOnly={isLoading}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={12}>
                          <FormGroup label={t("idDocument") as string} required>
                            <Stack
                              direction={{ xs: "column", md: "row" }}
                              spacing={{ xs: 3 }}
                              sx={{ width: "100%" }}
                            >
                              <AttachmentController
                                name="frontDocument"
                                desc={`${
                                  t("descAttachment1") as string
                                } ${formatBytes(MAXIMUM_ATTACHMENTS_SIZE)}`}
                                readOnly={isLoading}
                              />
                              <AttachmentController
                                name="backDocument"
                                desc={`${
                                  t("descAttachment1") as string
                                } ${formatBytes(MAXIMUM_ATTACHMENTS_SIZE)}`}
                                readOnly={isLoading}
                              />
                            </Stack>
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
                                  <IconButton
                                    edge="end"
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        `${getValues("walletAddress")}`
                                      );
                                    }}
                                  >
                                    <ContentCopyIcon />
                                  </IconButton>
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
                    <Stack spacing={3}>
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
                          {t("submit") as string}
                        </StyledButton>
                      </Stack>
                      <Typography
                        sx={{ fontStyle: "italic", mt: "32px !important" }}
                      >
                        {t("termsAndConditions1") as string}{" "}
                        <b>
                          <i>{t("termsAndConditions2") as string}</i>
                        </b>
                        , {t("termsAndConditions3") as string}{" "}
                        <Link href="/terms-of-service">
                          {t("termsAndConditions4") as string}
                        </Link>{" "}
                        {t("termsAndConditions5") as string}{" "}
                        <Link href="/term-of-service">
                          {t("termsAndConditions6") as string}
                        </Link>
                        {t("termsAndConditions7") as string}
                      </Typography>
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

export default withAuth(AuthorRequest);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "authorRequest"
      ]))
    }
  };
}
