import { ChangeEvent, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Box,
  FormHelperText,
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
import styles from "@styles/ContentContainer.module.scss";
import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import * as yup from "yup";

import images from "@/assets/images";
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
import { StyledButton } from "@/styles/components/Button";

const MAXIMUM_ATTACHMENTS_SIZE = 100000000;
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/svg"
];

const schema = yup.object().shape({
  pseudonym: yup.string().required("Please enter your pseudonym"),
  about: yup.string(),
  email: yup
    .string()
    .required("Please enter your email address")
    .email("Please enter valid email address"),
  phoneNumber: yup
    .string()
    .required("Please enter your phone number")
    .matches(
      /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/,
      "Please enter valid phone number"
    ),
  website: yup.string(),
  walletAddress: yup.string(),
  facebook: yup.string(),
  twitter: yup.string(),
  linkedIn: yup.string(),
  instagram: yup.string(),
  frontDocument: yup
    .mixed()
    .required("File is required")
    .test("required", "You need to provide a file", (file: any) => {
      if (file) return true;
      return false;
    })
    .test("fileSize", "The file is too large", (file: any) => {
      return file && file?.size <= MAXIMUM_ATTACHMENTS_SIZE;
    })
    .test("fileFormat", "Unsupported Format", (file: any) => {
      return file && SUPPORTED_FORMATS.includes(file.type);
    }),
  backDocument: yup
    .mixed()
    .required("File is required")
    .test("required", "You need to provide a file", (file: any) => {
      if (file) return true;
      return false;
    })
    .test("fileSize", "The file is too large", (file: any) => {
      return file && file?.size <= MAXIMUM_ATTACHMENTS_SIZE;
    })
    .test("fileFormat", "Unsupported Format", (file: any) => {
      return file && SUPPORTED_FORMATS.includes(file.type);
    }),
  picture: yup
    .mixed()
    .required("Image is required")
    .test("required", "You need to provide a image", (file: any) => {
      if (file) return true;
      return false;
    })
    .test("fileSize", "The file is too large", (file: any) => {
      return file && file?.size <= MAXIMUM_ATTACHMENTS_SIZE;
    })
    .test("fileFormat", "Unsupported Format", (file: any) => {
      return file && SUPPORTED_FORMATS.includes(file.type);
    })
});

type FormData = yup.InferType<typeof schema>;

const defaultValues = {
  pseudonym: "",
  about: "",
  email: "",
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
  const { ethereum, contract } = useWeb3();
  const { account } = useAccount();

  useEffect(() => {
    setValue("walletAddress", account.data);
  }, [account.data]);

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
    watch
  } = methods;
  const watchPicture = watch("picture");

  const handleRemoveImage = async () => {
    setValue("picture", "");
  };

  const onSubmit = (data: any) => {
    console.log("data:", data);
    // (async () => {
    //   const res = await axios.post("/api/author/request", { authorInfo: data });
    //   console.log("res:", res);
    // })();
  };

  return (
    <>
      <Head>
        <title>Author request - NFT Bookstore</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ContentContainer titles={["Make an", "Author request"]}>
          <Box component="section" sx={{ width: "100%", maxWidth: "720px" }}>
            <Box sx={{ my: 2 }}>
              <Typography
                variant="caption"
                className="form-label required"
                sx={{ fontSize: "14px" }}
              >
                Required
              </Typography>
            </Box>
            <FormProvider {...methods}>
              <form>
                <Stack spacing={6}>
                  <ContentGroup
                    title="Upload your photo"
                    // desc="This field is optional, but we recommend that you upload your photo or logo to improve brand recognition and credibility with your readers."
                    classTitle="required"
                  >
                    <Stack
                      direction={{ xs: "column", sm: "column", md: "row" }}
                      spacing={{ xs: 4, sm: 4, md: 8, lg: 10 }}
                      className={styles["profile__avatar"]}
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
                          Upload your photo
                          <FileController name="picture" />
                        </StyledButton>

                        <StyledButton
                          customVariant="secondary"
                          onClick={handleRemoveImage}
                        >
                          Remove current
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
                  <ContentGroup title="Author information">
                    <Stack direction="column" spacing={3}>
                      <FormGroup label="Pseudonym" required>
                        <InputController name="pseudonym" />
                      </FormGroup>
                      <FormGroup label="More about you">
                        <TextAreaController name="about" />
                      </FormGroup>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: 2 }}
                      >
                        <FormGroup
                          label="Email"
                          required
                          className={styles["form__group-half"]}
                        >
                          <InputController name="email" />
                        </FormGroup>
                        <FormGroup
                          label="Phone number"
                          required
                          className={styles["form__group-half"]}
                        >
                          <InputController
                            name="phoneNumber"
                            onChange={(e) => {
                              e.target.value = e.target.value.trim();
                            }}
                          />
                        </FormGroup>
                      </Stack>
                      <FormGroup label="ID Document" required>
                        <Stack
                          direction={{ xs: "column", md: "row" }}
                          spacing={{ xs: 3 }}
                          sx={{ width: "100%" }}
                        >
                          <AttachmentController
                            name="frontDocument"
                            desc="File types recommended: JPG, JPEG, PNG, GIF, SVG. Max size: 100 MB"
                          />
                          <AttachmentController
                            name="backDocument"
                            desc="File types recommended: JPG, JPEG, PNG, GIF, SVG. Max size: 100 MB"
                          />
                        </Stack>
                      </FormGroup>
                    </Stack>
                  </ContentGroup>
                  <ContentGroup title="Social link">
                    <Stack direction="column" spacing={3}>
                      <FormGroup label="Website">
                        <InputController name="website" />
                      </FormGroup>
                      <FormGroup label="Wallet address">
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
                      <FormGroup label="Social media" />
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
                      type="submit"
                      onClick={() => {}}
                    >
                      Cancel
                    </StyledButton>
                    <StyledButton
                      customVariant="primary"
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                    >
                      Submit
                    </StyledButton>
                  </Stack>
                  <Typography
                    sx={{ fontStyle: "italic", mt: "32px !important" }}
                  >
                    By clicking{" "}
                    <b>
                      <i>Submit</i>
                    </b>
                    , you agree to our{" "}
                    <Link href="/terms-of-service">Terms of Service</Link> and
                    that you have read our{" "}
                    <Link href="/term-of-service">Privacy Policy</Link>.
                  </Typography>
                </Stack>
              </form>
            </FormProvider>
          </Box>
        </ContentContainer>
      </main>
    </>
  );
};

export default AuthorRequest;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["navbar", "footer"]))
    }
  };
}
