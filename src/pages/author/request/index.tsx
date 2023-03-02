import { ChangeEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Box,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";

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
import { FormGroup } from "@/components/shared/FormGroup";
import { UploadField } from "@/components/shared/UploadField";
import { StyledButton } from "@/styles/components/Button";
import { StyledTextArea } from "@/styles/components/TextField";

const schema = yup
  .object({
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
        // /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
        /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/,
        "Please enter valid phone number"
      ),
    website: yup.string(),
    walletAddress: yup.string(),
    facebook: yup.string(),
    twitter: yup.string(),
    linkedIn: yup.string(),
    instagram: yup.string()
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const fileSchema = yup.object().shape({
  frontDocument: yup
    .mixed()
    .test("required", "You need to provide a file", (file) => {
      // return file && file.size <-- u can use this if you don't want to allow empty files to be uploaded;
      if (file) return true;
      return false;
    })
    .test("fileSize", "The file is too large", (file) => {
      //if u want to allow only certain file sizes
      return file && file.size <= MAXIMUM_ATTACHMENTS_SIZE;
    }),
  backDocument: yup
    .mixed()
    .test("required", "You need to provide a file", (file) => {
      // return file && file.size <-- u can use this if you don't want to allow empty files to be uploaded;
      if (file) return true;
      return false;
    })
    .test("fileSize", "The file is too large", (file) => {
      //if u want to allow only certain file sizes
      return file && file.size <= MAXIMUM_ATTACHMENTS_SIZE;
    })
});

type FileFormData = yup.InferType<typeof fileSchema>;

const Profile = () => {
  const theme = useTheme();
  const { ethereum, contract } = useWeb3();
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues
  } = useForm<FormData & FileFormData>({
    defaultValues: {
      pseudonym: "",
      about: "",
      email: "",
      website: "",
      walletAddress: "0x6d5f4vrRafverHKJ561692842xderyb",
      facebook: "",
      twitter: "",
      linkedIn: "",
      instagram: "",
      frontDocument: [],
      backDocument: []
    },
    resolver: yupResolver(schema)
  });

  const MAXIMUM_NUMBER_OF_CHARACTERS = 1000;
  const [numberOfCharacters, setNumberOfCharacters] = useState<Number>(0);

  // Front document
  const [uploadedFrontDocument, setUploadedFrontDocument] = useState<File>();

  // Back document
  const [uploadedBackDocument, setUploadedBackDocument] = useState<File>();

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

  const uploadFrontDocument = async (file: File) => {
    if (file !== undefined) {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      console.log(bytes);

      try {
        const { signedData, account } = await getSignedData();
        const promise = axios.post("/api/verify-image", {
          address: account,
          signature: signedData,
          bytes,
          contentType: file.type,
          fileName: file.name.replace(/\.[^/.]+$/, "")
        });

        const res = await toast.promise(promise, {
          pending: "Uploading Front Document",
          success: "Front Document uploaded",
          error: "Front Document upload error"
        });

        // const data = res.data as PinataRes;
        // console.log(data);

        // setNftBookMeta({
        //   ...nftBookMeta,
        //   bookSample: `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`
        // });
      } catch (e: any) {
        console.error(e.message);
      }
    }
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
                      <input type="file" hidden onChange={handleImage} />
                    </StyledButton>

                    <StyledButton customVariant="secondary" onClick={() => {}}>
                      Remove current
                    </StyledButton>
                  </Stack>
                </Stack>
              </ContentGroup>
              <ContentGroup title="Author information">
                <Stack direction="column" spacing={3}>
                  <FormGroup label="Pseudonym" required>
                    <Controller
                      name="pseudonym"
                      control={control}
                      render={({ field }) => {
                        return (
                          <TextField
                            id="pseudonym"
                            fullWidth
                            error={!!errors.pseudonym?.message}
                            {...field}
                          />
                        );
                      }}
                    />
                  </FormGroup>
                  <FormGroup label="More about you">
                    <Controller
                      name="about"
                      control={control}
                      render={({ field }) => {
                        return (
                          <StyledTextArea
                            id="about"
                            minRows={3}
                            multiline={true}
                            label={`${numberOfCharacters}/${MAXIMUM_NUMBER_OF_CHARACTERS}`}
                            fullWidth
                            InputLabelProps={{
                              shrink: true
                            }}
                            error={!!errors.about?.message}
                            {...field}
                            onChange={(e) => {
                              let lengthOfCharacters = e.target.value.length;
                              if (
                                lengthOfCharacters <=
                                MAXIMUM_NUMBER_OF_CHARACTERS
                              ) {
                                setNumberOfCharacters(lengthOfCharacters);
                                field.onChange(e);
                              }
                            }}
                          />
                        );
                      }}
                    />
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
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => {
                          return (
                            <TextField
                              id="email"
                              fullWidth
                              sx={{
                                "& input.MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill":
                                  {
                                    backgroundColor: "transparent !important"
                                  }
                              }}
                              error={!!errors.email?.message}
                              {...field}
                            />
                          );
                        }}
                      />
                    </FormGroup>
                    <FormGroup
                      label="Phone number"
                      required
                      className={styles["form__group-half"]}
                    >
                      <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => {
                          return (
                            <TextField
                              id="phoneNumber"
                              fullWidth
                              error={!!errors.phoneNumber?.message}
                              {...field}
                              onChange={(e) => {
                                e.target.value = e.target.value.trim();
                                field.onChange(e);
                              }}
                            />
                          );
                        }}
                      />
                    </FormGroup>
                  </Stack>
                  <FormGroup label="ID Document" required>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={{ xs: 3 }}
                    >
                      <UploadField
                        content="Front"
                        required
                        onChange={(e) => {
                          (async () => {
                            if (!e.target.files) {
                              console.error("Select a file");
                              return;
                            }

                            const file = e.target.files[0];

                            setValue("frontDocument", file, {
                              shouldValidate: true
                            });
                            setUploadedFrontDocument(file);
                          })();
                        }}
                        uploaded={uploadedFrontDocument}
                      />
                      <UploadField
                        content="Back"
                        required
                        onChange={(e) => {
                          if (!e.target.files) {
                            console.error("Select a file");
                            return;
                          }

                          const file = e.target.files[0];
                          setValue("backDocument", file, {
                            shouldValidate: true
                          });
                          setUploadedBackDocument(file);
                        }}
                        uploaded={uploadedBackDocument}
                      />
                    </Stack>
                  </FormGroup>
                </Stack>
              </ContentGroup>
              <ContentGroup title="Social link">
                <Stack direction="column" spacing={3}>
                  <FormGroup label="Website">
                    <Controller
                      name="website"
                      control={control}
                      render={({ field }) => {
                        return (
                          <TextField
                            id="website"
                            fullWidth
                            error={!!errors.website?.message}
                            {...field}
                          />
                        );
                      }}
                    />
                  </FormGroup>
                  <FormGroup label="Wallet address">
                    <Controller
                      name="walletAddress"
                      control={control}
                      render={({ field }) => {
                        return (
                          <TextField
                            id="walletAddress"
                            fullWidth
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
                            error={!!errors.walletAddress?.message}
                            {...field}
                          />
                        );
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
                      <Controller
                        name="facebook"
                        control={control}
                        render={({ field }) => {
                          return (
                            <TextField
                              id="facebook"
                              fullWidth
                              error={!!errors.facebook?.message}
                              {...field}
                            />
                          );
                        }}
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
                      <Controller
                        name="twitter"
                        control={control}
                        render={({ field }) => {
                          return (
                            <TextField
                              id="twitter"
                              fullWidth
                              error={!!errors.twitter?.message}
                              {...field}
                            />
                          );
                        }}
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
                      <Controller
                        name="linkedIn"
                        control={control}
                        render={({ field }) => {
                          return (
                            <TextField
                              id="linkedIn"
                              fullWidth
                              error={!!errors.linkedIn?.message}
                              {...field}
                            />
                          );
                        }}
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
                      <Controller
                        name="instagram"
                        control={control}
                        render={({ field }) => {
                          return (
                            <TextField
                              id="instagram"
                              fullWidth
                              error={!!errors.instagram?.message}
                              {...field}
                            />
                          );
                        }}
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
              <Typography sx={{ fontStyle: "italic", mt: "32px !important" }}>
                By clicking{" "}
                <b>
                  <i>Submit</i>
                </b>
                , you agree to our{" "}
                <Link href="/terms-of-service">Terms of Service</Link> and that
                you have read our{" "}
                <Link href="/term-of-service">Privacy Policy</Link>.
              </Typography>
            </Stack>
          </Box>
        </ContentContainer>
      </main>
    </>
  );
};

export default Profile;
