import { ChangeEvent, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
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
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import * as yup from "yup";

import images from "@/assets/images";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { ContentGroup } from "@/components/shared/ContentGroup";
import {
  InputController,
  TextAreaController
} from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
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

const defaultValues = {
  userName: "",
  email: "",
  bio: "",
  website: "",
  walletAddress: "0x6d5f4vrRafverHKJ561692842xderyb",
  facebook: "",
  twitter: "",
  linkedIn: "",
  instagram: ""
};

const Profile = () => {
  const methods = useForm<FormData>({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues
  } = methods;

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
        <ContentContainer titles={["My Profile"]}>
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
                  <ContentGroup title="Upload your photo">
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
                          Upload your photo
                          <input type="file" hidden onChange={handleImage} />
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
                  <ContentGroup title="User information">
                    <Stack direction="column" spacing={3}>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: 2 }}
                      >
                        <FormGroup
                          label="User name"
                          required
                          className={styles["form__group-half"]}
                        >
                          <InputController name="userName" />
                        </FormGroup>
                        <FormGroup
                          label="Email"
                          required
                          className={styles["form__group-half"]}
                        >
                          <InputController name="email" />
                        </FormGroup>
                      </Stack>
                      <FormGroup label="Bio">
                        <TextAreaController name="bio" />
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
                    Save changes
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
      ...(await serverSideTranslations(locale, ["navbar", "footer"]))
    }
  };
}
