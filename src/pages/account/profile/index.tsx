import { ChangeEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
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
import styles from "@styles/Profile.module.scss";
import Head from "next/head";
import * as yup from "yup";

import images from "@/assets/images";
import { FormGroup } from "@/components/shared/FormGroup";
import ProfileGroup from "@/components/ui/profile/ProfileGroup";
import { StyledButton } from "@/styles/components/Button";
import { StyledTextArea } from "@/styles/components/TextField";

const schema = yup
  .object({
    userName: yup.string().required("Please enter your username"),
    email: yup
      .string()
      .required("Please enter your email address")
      .email("Please enter valid email address"),
    bio: yup.string(),
    website: yup.string(),
    walletAddress: yup.string(),
    facebook: yup.string(),
    twitter: yup.string(),
    linkedIn: yup.string(),
    instagram: yup.string()
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const Profile = () => {
  const theme = useTheme();
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues
  } = useForm<FormData>({
    defaultValues: {
      userName: "",
      email: "",
      bio: "",
      website: "",
      walletAddress: "0x6d5f4vrRafverHKJ561692842xderyb",
      facebook: "",
      twitter: "",
      linkedIn: "",
      instagram: ""
    },
    resolver: yupResolver(schema)
  });
  const MAXIMUM_NUMBER_OF_CHARACTERS = 1000;
  const [numberOfCharacters, setNumberOfCharacters] = useState<Number>(0);

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    // const file = document.getElementById("profileImage").files[0];
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onloadend = () => {
    //   setValue("profileImage", reader.result);
    // };
    console.log("e.target.value:", e.target.value);
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

  const onSubmit = (data: any) => {
    console.log("data:", data);
  };

  return (
    <>
      <Head>
        <title>Profile - NFT Bookstore</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Stack
          spacing={8}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto"
          }}
          className={styles["profile__container"]}
        >
          <Box component="section" sx={{ marginTop: "100px" }}>
            <Box sx={{ textAlign: "center", position: "relative", mb: 8 }}>
              <Typography variant="h2">My Profile</Typography>
              <Box
                component="img"
                src={images.decoLine}
                sx={{
                  position: "absolute",
                  maxWidth: "385px",
                  transform: "translateX(-50%) translateY(-40%)"
                }}
              />
            </Box>
          </Box>
          <Box component="section" sx={{ width: "100%", maxWidth: "720px" }}>
            <Stack spacing={6}>
              <ProfileGroup title="Upload your photo">
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
              </ProfileGroup>
              <ProfileGroup title="User information">
                <Stack direction="column" spacing={3}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={{ xs: 2 }}
                  >
                    <FormGroup
                      label="User name"
                      required
                      className={styles["profile__formGroup-half"]}
                    >
                      <Controller
                        name="userName"
                        control={control}
                        render={({ field }) => {
                          return (
                            <TextField
                              id="userName"
                              fullWidth
                              error={!!errors.userName?.message}
                              {...field}
                            />
                          );
                        }}
                      />
                    </FormGroup>
                    <FormGroup
                      label="Email"
                      required
                      className={styles["profile__formGroup-half"]}
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
                  </Stack>
                  <FormGroup label="Bio">
                    <Controller
                      name="bio"
                      control={control}
                      render={({ field }) => {
                        return (
                          <StyledTextArea
                            id="bio"
                            minRows={3}
                            multiline={true}
                            label={`${numberOfCharacters}/${MAXIMUM_NUMBER_OF_CHARACTERS}`}
                            fullWidth
                            InputLabelProps={{
                              shrink: true
                            }}
                            error={!!errors.bio?.message}
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
                </Stack>
              </ProfileGroup>
              <ProfileGroup title="Social link">
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
                      className={styles["profile__formGroup-half"]}
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
                      className={styles["profile__formGroup-half"]}
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
                          <InstagramIcon />
                          Instagram
                        </Box>
                      }
                      className={styles["profile__formGroup-half"]}
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
                          linkedIn
                        </Box>
                      }
                      className={styles["profile__formGroup-half"]}
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
                  </Stack>
                </Stack>
              </ProfileGroup>
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: "center", justifyContent: "flex-end" }}
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
                  Save changes
                </StyledButton>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </main>
    </>
  );
};

export default Profile;
