import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
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
import {
  FinalStep,
  LoadingStep,
  Step1,
  Step2,
  Step3
} from "@/components/ui/author/request/steps";
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
  const [activeStep, setActiveStep] = useState(0);
  const formRef = useRef<any>();

  const steps = [
    t("titleStep1") as string,
    t("titleStep2") as string,
    t("titleStep3") as string,
    t("titleStep4") as string
  ];

  const validationSchema = [
    // validation for step1
    yup.object({
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
    }),

    // validation for step2
    yup.object({
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
        })
    }),

    // validate for step3
    yup.object({
      website: yup.string(),
      walletAddress: yup.string()
    }),

    // validate for final step
    yup.object({
      facebook: yup.string(),
      twitter: yup.string(),
      linkedIn: yup.string(),
      instagram: yup.string()
    })
  ];

  const currentValidationSchema = validationSchema[activeStep];

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(currentValidationSchema),
    mode: "all"
  });
  const { handleSubmit, setValue, reset, trigger } = methods;

  const onSubmit = (data: any) => {
    (async () => {
      try {
        if (activeStep === 3) {
          (async () => {
            setIsLoading(true);

            const { frontDocument, backDocument, picture, ...authorInfo } =
              data;

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
            handleNext();
            setIsLoading(false);
          })();
        } else {
          handleNext();
        }
      } catch (error: any) {
        console.log("error:", error);
        setIsLoading(false);
      }
    })();
  };

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    formRef.current.scrollTo(0, 0);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    formRef.current.scrollTo(0, 0);
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Step1 isLoading={isLoading} />;
      case 1:
        return <Step2 isLoading={isLoading} />;
      case 2:
        return <Step3 isLoading={isLoading} />;
      case 3:
        return <FinalStep isLoading={isLoading} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    setValue("walletAddress", account.data as string);
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
            <Box
              sx={{ flexGrow: 1, width: "100%", maxWidth: "720px" }}
              ref={formRef}
            >
              <Paper elevation={1} sx={{ mx: "auto", mt: 4, p: 3 }}>
                <Stepper activeStep={activeStep}>
                  {steps.map((label) => {
                    return (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>

                <div style={{ minHeight: "50%" }}>
                  {(() => {
                    if (isLoading === true) {
                      return <LoadingStep />;
                    } else if (activeStep === steps.length) {
                      return (
                        <Box
                          sx={{
                            mt: 3,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%"
                          }}
                        >
                          <Typography sx={{ mt: 2, mb: 3 }}>
                            {t("messageFinish1") as string}
                          </Typography>
                        </Box>
                      );
                    } else {
                      return (
                        <FormProvider {...methods}>
                          <Box my={2} sx={{ minHeight: "25vh" }}>
                            {getStepContent()}
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="center"
                            style={{ paddingTop: "5vh" }}
                          >
                            <Button
                              color="inherit"
                              disabled={activeStep === 0}
                              onClick={handleBack}
                              sx={{ mr: 1 }}
                            >
                              {t("back") as string}
                            </Button>
                            {activeStep === steps.length - 1 ? (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit(onSubmit)}
                              >
                                {t("submit") as string}
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit(onSubmit)}
                              >
                                {t("next") as string}
                              </Button>
                            )}
                          </Box>
                        </FormProvider>
                      );
                    }
                  })()}
                </div>
              </Paper>
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
