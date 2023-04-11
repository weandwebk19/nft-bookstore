import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Alert,
  AlertColor,
  Box,
  FormHelperText,
  IconButton,
  InputAdornment,
  Link,
  Snackbar,
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
import styles from "@styles/ContentContainer.module.scss";
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
  InputController,
  TextAreaController
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
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

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

  const handleRemoveImage = async () => {
    setValue("picture", "");
  };

  const handleCancel = async () => {
    reset((formValues) => ({
      ...defaultValues,
      walletAddress: formValues.walletAddress
    }));
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setMessage("");
  };

  const onSubmit = (data: any) => {
    (async () => {
      try {
        setIsLoading(true);

        const { frontDocument, backDocument, picture, ...authorInfo } = data;

        const pictureLink = await uploadImage(picture);
        const frontDocumentLink = await uploadImage(frontDocument);
        const backDocumentLink = await uploadImage(backDocument);

        const res = await axios.post("/api/authors/request", {
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

        if (res.data.success) {
          setMessage(t("messageSuccessCreated") as string);
          setSeverity("success");
          handleCancel();
        } else {
          setMessage(t("messageErrorCreated") as string);
          setSeverity("error");
        }
        setIsLoading(false);
        setOpen(true);
      } catch (error) {
        setMessage(t("messageErrorCreated") as string);
        setSeverity("error");
        setIsLoading(false);
        setOpen(true);
      }
    })();
  };

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
        <ContentContainer
          titles={[t("titleContent1") as string, t("titleContent2") as string]}
        >
          <Box component="section" sx={{ width: "100%", maxWidth: "720px" }}>
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
              <form>
                <Stack spacing={6}>
                  <ContentGroup
                    title={t("titleUpload") as string}
                    classTitle="required"
                  >
                    <Stack
                      direction={{ xs: "column", sm: "column", md: "row" }}
                      spacing={{ xs: 4, sm: 4, md: 8, lg: 10 }}
                      className={styles["profile__avatar"]}
                    >
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
                          alt="Remy Sharp"
                          src={""}
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

                      <Stack spacing={3} sx={{ justifyContent: "center" }}>
                        <StyledButton
                          customVariant="primary"
                          component={isLoading ? "button" : "label"}
                          disabled={isLoading}
                        >
                          {t("uploadPhotoBtn") as string}
                          <FileController name="picture" readOnly={isLoading} />
                        </StyledButton>

                        <StyledButton
                          customVariant="secondary"
                          onClick={handleRemoveImage}
                          disabled={isLoading}
                        >
                          {t("removeBtn") as string}
                        </StyledButton>
                      </Stack>
                    </Stack>
                    {errors && errors.picture && (
                      <FormHelperText
                        error
                        sx={{ marginTop: "24px", fontSize: "16px" }}
                      >
                        {errors?.picture?.message}
                      </FormHelperText>
                    )}
                  </ContentGroup>
                  <ContentGroup title={t("titleInfo") as string}>
                    <Stack direction="column" spacing={3}>
                      <FormGroup label={t("pseudonym") as string} required>
                        <InputController
                          name="pseudonym"
                          readOnly={isLoading}
                        />
                      </FormGroup>
                      <FormGroup label="More about you">
                        <TextAreaController name="about" readOnly={isLoading} />
                      </FormGroup>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: 2 }}
                      >
                        <FormGroup
                          label={t("email") as string}
                          required
                          className={styles["form__group-half"]}
                        >
                          <InputController name="email" readOnly={isLoading} />
                        </FormGroup>
                        <FormGroup
                          label={t("phoneNumber") as string}
                          required
                          className={styles["form__group-half"]}
                        >
                          <InputController
                            name="phoneNumber"
                            onChange={(e) => {
                              e.target.value = e.target.value.trim();
                            }}
                            readOnly={isLoading}
                          />
                        </FormGroup>
                      </Stack>
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
                    </Stack>
                  </ContentGroup>
                  <ContentGroup title={t("titleSocial") as string}>
                    <Stack direction="column" spacing={3}>
                      <FormGroup label={t("website") as string}>
                        <InputController name="website" readOnly={isLoading} />
                      </FormGroup>
                      <FormGroup label={t("walletAddress") as string}>
                        <InputController
                          name="walletAddress"
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
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
                            )
                          }}
                        />
                      </FormGroup>
                      <FormGroup label={t("socialMedia") as string} />
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: 2 }}
                      >
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
                          className={styles["form__group-half"]}
                        >
                          <InputController
                            name="facebook"
                            readOnly={isLoading}
                          />
                        </FormGroup>
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
                          className={styles["form__group-half"]}
                        >
                          <InputController
                            name="twitter"
                            readOnly={isLoading}
                          />
                        </FormGroup>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: 2 }}
                      >
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
                          className={styles["form__group-half"]}
                        >
                          <InputController
                            name="linkedIn"
                            readOnly={isLoading}
                          />
                        </FormGroup>
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
                          className={styles["form__group-half"]}
                        >
                          <InputController
                            name="instagram"
                            readOnly={isLoading}
                          />
                        </FormGroup>
                      </Stack>
                    </Stack>
                  </ContentGroup>
                </Stack>
                <Stack spacing={3}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: "center",
                      justifyContent: "flex-end",
                      mt: 6
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
              </form>
            </FormProvider>
            <ToastContainer />
          </Box>
        </ContentContainer>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={severity as AlertColor}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
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
