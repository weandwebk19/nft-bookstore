import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  Box,
  FormHelperText,
  IconButton,
  InputAdornment,
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
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import * as yup from "yup";

import images from "@/assets/images";
import { useAccount } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { ContentGroup } from "@/components/shared/ContentGroup";
import {
  InputController,
  TextAreaController
} from "@/components/shared/FormController";
import FileController from "@/components/shared/FormController/FileController";
import { FormGroup } from "@/components/shared/FormGroup";
import { StyledButton } from "@/styles/components/Button";

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
  const { ethereum, contract } = useWeb3();
  const { account } = useAccount();

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

  const handleRemoveImage = async () => {
    setValue("picture", "");
  };

  const handleCancel = async () => {
    reset((formValues) => ({
      ...defaultValues,
      walletAddress: formValues.walletAddress
    }));
  };

  const onSubmit = (data: any) => {
    console.log("data:", data);
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
        <ContentContainer titles={[t("titleContent1") as string]}>
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
                      className={styles["content__avatar"]}
                    >
                      {!true ? (
                        <Box
                          component="img"
                          src={images.product1}
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
                      <Stack spacing={3} sx={{ justifyContent: "center" }}>
                        <StyledButton customVariant="primary" component="label">
                          {t("uploadPhotoBtn") as string}
                          <FileController name="picture" />
                        </StyledButton>

                        <StyledButton
                          customVariant="secondary"
                          onClick={handleRemoveImage}
                        >
                          {t("removeBtn") as string}
                        </StyledButton>
                      </Stack>
                    </Stack>
                    {!errors.picture && watchPicture && (
                      <FormHelperText
                        sx={{ marginTop: "24px", fontSize: "16px" }}
                      >
                        {(watchPicture as any)?.name}
                      </FormHelperText>
                    )}
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
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: 2 }}
                      >
                        <FormGroup
                          label={t("username") as string}
                          required
                          className={styles["form__group-half"]}
                        >
                          <InputController name="userName" />
                        </FormGroup>
                        <FormGroup
                          label={t("email") as string}
                          required
                          className={styles["form__group-half"]}
                        >
                          <InputController name="email" />
                        </FormGroup>
                      </Stack>
                      <FormGroup label={t("bio") as string}>
                        <TextAreaController name="bio" />
                      </FormGroup>
                    </Stack>
                  </ContentGroup>
                  <ContentGroup title={t("titleSocial") as string}>
                    <Stack direction="column" spacing={3}>
                      <FormGroup label={t("website") as string}>
                        <InputController name="website" />
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
                          <InputController name="facebook" />
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
                          <InputController name="twitter" />
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
                          <InputController name="linkedIn" />
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
                          <InputController name="instagram" />
                        </FormGroup>
                      </Stack>
                    </Stack>
                  </ContentGroup>
                </Stack>
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
                  >
                    {t("cancel") as string}
                  </StyledButton>
                  <StyledButton
                    customVariant="primary"
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                  >
                    {t("saveChanges") as string}
                  </StyledButton>
                </Stack>
              </form>
            </FormProvider>
          </Box>
        </ContentContainer>
      </main>
    </>
  );
};

export default Profile;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["navbar", "footer", "profile"]))
    }
  };
}
