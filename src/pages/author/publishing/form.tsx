import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  Box,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

import { yupResolver } from "@hookform/resolvers/yup";
import { Alert } from "@mui/lab";
import styles from "@styles/Form.module.scss";
import Head from "next/head";
import { useRouter } from "next/router";
import * as yup from "yup";

import { BigTitle } from "@/components/shared/BigTitle";
import {
  FinalStep,
  Step1,
  Step2,
  Step3
} from "@/components/ui/author/publishing/steps";
import { StyledButton } from "@/styles/components/Button";

const MAXIMUM_ATTACHMENTS_SIZE = 100000000;

const MINIMUM_SUPPLY = 1;
const MAXIMUM_SUPPLY = 500;

const steps = [
  "Book title",
  "Upload your book",
  "Book details",
  "Terms and Conditions"
];
const defaultValues = {
  // Step 1
  bookTitle: "",
  description: "",

  // Step 2
  bookFile: "",
  bookCover: "",
  bookSample: "",

  // Step 3
  externalLink: "",
  version: "",
  maxSupply: MINIMUM_SUPPLY,
  genres: [],
  languages: [],
  pages: 1,
  keywords: "",

  // Final step
  termsOfService: false,
  privacyPolicy: false
};

const Form = () => {
  const [activeStep, setActiveStep] = useState(0);
  const formRef = useRef<any>();

  const validationSchema = [
    // validation for step1 (Fill in book name and description)
    yup.object({
      bookTitle: yup.string().required("Please enter your book title"),
      description: yup.string().required("Please enter your book description")
    }),

    // validation for step2 (Upload your book)
    yup.object().shape({
      fileType: yup
        .string()
        .required("Please choose your book's file type")
        .oneOf(["epub", "pdf"], "Choose your book's reading format"),
      bookFile: yup
        .mixed()
        .required("File is required")
        .test("required", "You need to provide a file", (file) => {
          // return file && file.size <-- u can use this if you don't want to allow empty files to be uploaded;

          if (file && (file as any).length !== 0) return true;
          return false;
        })
        .test("multipleFiles", "One file only can be provided.", (file) => {
          return (file as any).length <= 1;
        })
        .test("fileSize", "The file is too large", (file) => {
          //if u want to allow only certain file sizes

          let fileSize;
          if ((file as any).length > 0) {
            fileSize = (file as any).reduce((total: number, current: any) => {
              return total + current.size;
            }, 0);
          }

          return file && fileSize <= MAXIMUM_ATTACHMENTS_SIZE;
        }),
      bookCover: yup
        .mixed()
        .required("File is required")
        .test("required", "You need to provide a file", (file) => {
          // return file && file.size <-- u can use this if you don't want to allow empty files to be uploaded;

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
        }),

      bookSample: yup
        .mixed()
        .test("fileSize", "The file is too large", (file) => {
          // if no file is provided, then pass
          if (!file) return true;
          // if file is provided, then check for its size
          let fileSize;
          if ((file as any).length > 0) {
            fileSize = (file as any).reduce((total: number, current: any) => {
              return total + current.size;
            }, 0);
          }

          return file && fileSize <= MAXIMUM_ATTACHMENTS_SIZE;
        })
    }),

    // validate for step3 (Book details)
    yup.object({
      externalLink: yup.string(),
      version: yup.string().required("Please enter your book version"),
      maxSupply: yup
        .number()
        .typeError("Please enter the max supply of your book as numeric value")
        .required("Please enter the max supply of your book")
        .min(
          MINIMUM_SUPPLY,
          `The max supply must be greater than or equal ${MINIMUM_SUPPLY}`
        )
        .max(
          MAXIMUM_SUPPLY,
          `The max supply must be less than or equal ${MAXIMUM_SUPPLY}`
        ),
      genres: yup
        .array()
        .of(yup.string())
        .test("required", "Please enter your book languages", (arr) => {
          if (arr && (arr as any).length !== 0) return true;
          return false;
        }),
      languages: yup
        .array()
        .of(yup.string())
        .test("required", "Please enter your book languages", (arr) => {
          if (arr && (arr as any).length !== 0) return true;
          return false;
        }),
      pages: yup
        .number()
        .min(0, `The pages must be greater than or equal 0`)
        .required("Please enter the page number of your book"),
      keywords: yup.string()
    }),

    // validate for final step (Accept the terms and conditions)
    yup.object().shape({
      termsOfService: yup
        .boolean()
        .oneOf([true], "You must accept the terms and conditions"),
      privacyPolicy: yup
        .boolean()
        .oneOf([true], "You must accept the privacy policy")
    })
  ];

  const router = useRouter();
  const [open, setOpen] = useState(false);

  const currentValidationSchema = validationSchema[activeStep];
  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(currentValidationSchema),
    mode: "all"
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const { handleSubmit, trigger } = methods;
  const onSubmit = (data: any) => {
    console.log(data);
    setOpen(true);
    handleNext();
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
        return <Step1 />;
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
      case 3:
        return <FinalStep />;
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Create book by author - NFT Bookstore</title>
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
          className={styles["form__container"]}
        >
          <BigTitle title1="Create" title2="your book" />
          <Box
            component="section"
            sx={{ width: "100%", maxWidth: "720px" }}
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
                {activeStep === steps.length ? (
                  <>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <StyledButton
                      onClick={() => {
                        router.push("/account/bookshelf/created-book");
                      }}
                    >
                      my created book
                    </StyledButton>
                  </>
                ) : (
                  <>
                    <FormProvider {...methods}>
                      <form>
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
                            Back
                          </Button>
                          {activeStep === steps.length - 1 ? (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleSubmit(onSubmit)}
                            >
                              Create
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleNext}
                            >
                              Next
                            </Button>
                          )}
                        </Box>
                      </form>
                    </FormProvider>
                  </>
                )}
              </div>
            </Paper>
          </Box>
        </Stack>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Your book is successfully created!
          </Alert>
        </Snackbar>
      </main>
    </>
  );
};

export default Form;
