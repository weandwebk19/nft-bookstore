import { ChangeEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Box,
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
import Head from "next/head";
import * as yup from "yup";

import images from "@/assets/images";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { ContentGroup } from "@/components/shared/ContentGroup";
import {
  AttachmentController,
  InputController,
  TextAreaController
} from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { StyledButton } from "@/styles/components/Button";

const MAXIMUM_ATTACHMENTS_SIZE = 100000000;

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
    .test("required", "You need to provide a file", (file) => {
      if (file && (file as any).length !== 0) return true;
      return false;
    })
    .test("multipleFiles", "One file only can be provided.", (file) => {
      return (file as any).length <= 1;
    })
    .test("fileSize", "The file is too large", (file) => {
      let fileSize;
      if ((file as any).length > 0) {
        fileSize = (file as any).reduce((total: number, current: any) => {
          return total + current.size;
        }, 0);
      }

      console.log("file:", file);
      console.log("fileSize:", fileSize);
      console.log("MAXIMUM_ATTACHMENTS_SIZE:", MAXIMUM_ATTACHMENTS_SIZE);

      return file && fileSize <= MAXIMUM_ATTACHMENTS_SIZE;
    }),
  backDocument: yup
    .mixed()
    .required("File is required")
    .test("required", "You need to provide a file", (file) => {
      if (file && (file as any).length !== 0) return true;
      return false;
    })
    .test("multipleFiles", "One file only can be provided.", (file) => {
      return (file as any).length <= 1;
    })
    .test("fileSize", "The file is too large", (file) => {
      let fileSize;
      if ((file as any).length > 0) {
        fileSize = (file as any).reduce((total: number, current: any) => {
          return total + current.size;
        }, 0);
      }

      return file && fileSize <= MAXIMUM_ATTACHMENTS_SIZE;
    })
});

type FormData = yup.InferType<typeof schema>;

const defaultValues = {
  pseudonym: "",
  about: "",
  email: "",
  website: "",
  walletAddress: "0x6d5f4vrRafverHKJ561692842xderyb",
  facebook: "",
  twitter: "",
  linkedIn: "",
  instagram: "",
  frontDocument: "",
  backDocument: ""
};

const Profile = () => {
  const { ethereum, contract } = useWeb3();
  const methods = useForm<FormData>({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });
  const {
    handleSubmit,
    formState: { errors },
    getValues
  } = methods;

  console.log("errors:", errors);

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.files:", e.target.files);
    if (!e.target.files || e.target.files.length === 0) {
      console.error("Select a file");
      return;
    }

    // const file = e.target.files[0];
    // const buffer = await file.arrayBuffer();
    // const bytes = new Uint8Array(buffer);
    // console.log("click");
  };

  const getSignedData = async () => {
    const messageToSign = await axios.get("/api/verify");
    const accounts = (await ethereum?.request({
      method: "eth_requestAccounts"
    })) as string[];
    const account = accounts[0];

    const signedData = await ethereum?.request({
      method: "personal_sign",
      params: [
        JSON.stringify(messageToSign.data),
        account,
        messageToSign.data.id
      ]
    });

    return { signedData, account };
  };

  const onSubmit = (data: any) => {
    console.log("data:", data);
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
                    desc="This field is optional, but we recommend that you upload your photo or logo to improve brand recognition and credibility with your readers."
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
                          <input
                            type="file"
                            hidden
                            onChange={handleImage}
                            accept="image/*"
                            // accept="image/png, image/jpeg"
                          />
                        </StyledButton>

                        <StyledButton
                          customVariant="secondary"
                          onClick={() => {}}
                        >
                          Remove current
                        </StyledButton>
                      </Stack>
                    </Stack>
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
                            desc="File types recommended: JPG, PNG, GIF, SVG. Max size: 100 MB"
                          />
                          <AttachmentController
                            name="backDocument"
                            desc="File types recommended: JPG, PNG, GIF, SVG. Max size: 100 MB"
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

export default Profile;
