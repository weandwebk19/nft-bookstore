import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Box,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

import { yupResolver } from "@hookform/resolvers/yup";
import { Alert } from "@mui/lab";
import axios from "axios";
import { ethers } from "ethers";
import Head from "next/head";
import { useRouter } from "next/router";
import * as yup from "yup";

import { useBookDetail, useNetwork } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import {
  FinalStep,
  Step1,
  Step2,
  Step3
} from "@/components/ui/author/create/steps";
import { StyledButton } from "@/styles/components/Button";
import { BookInfo, NftBookMeta, PinataRes } from "@/types/nftBook";

const MAXIMUM_ATTACHMENTS_SIZE = 100000000;

const MINIMUM_SUPPLY = 1;
const MAXIMUM_SUPPLY = 500;

const steps = [
  "Book title",
  "Upload your book",
  "Book details",
  "Terms and Conditions"
];

const ALLOWED_FIELDS = [
  "title",
  "bookFile",
  "bookCover",
  "bookSample",
  "fileType"
];

const BookDetailEdit = () => {
  const router = useRouter();
  const { bookId } = router.query;

  const { bookDetail } = useBookDetail(bookId as string);
  const defaultData = bookDetail?.data;

  const [activeStep, setActiveStep] = useState(0);
  const formRef = useRef<any>();
  const { ethereum, contract } = useWeb3();
  const { network } = useNetwork();
  const [nftURI, setNftURI] = useState("");
  const [hasURI, setHasURI] = useState(false);

  const defaultValues = useMemo(() => {
    if (defaultData) {
      return {
        // Step 1
        title: defaultData?.meta.title,
        description: defaultData?.info.description,

        // Step 2
        fileType: "",
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
    }
  }, [defaultData]);

  const validationSchema = [
    // validation for step1 (Fill in book name and description)
    yup.object({
      title: yup.string().required("Please enter your book title"),
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
        .test("required", "Please enter your book genres", (arr) => {
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

  const uploadBookSample = async (file: File) => {
    if (file !== undefined) {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      try {
        const { signedData, account } = await getSignedData();
        const promise = axios.post("/api/verify-file", {
          address: account,
          signature: signedData,
          bytes,
          contentType: file.type,
          fileName: file.name.replace(/\.[^/.]+$/, "")
        });

        const res = await toast.promise(promise, {
          pending: "Uploading Book Sample",
          success: "Book Sample uploaded",
          error: "Book Sample upload error"
        });

        const data = res.data as PinataRes;

        const link = `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`;
        return link;
      } catch (e: any) {
        console.error(e.message);
      }
    }
    return "";
  };

  const uploadBookFile = async (file: File) => {
    if (file !== undefined) {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      try {
        const { signedData, account } = await getSignedData();

        const promise = axios.post("/api/verify-file", {
          address: account,
          signature: signedData,
          bytes,
          contentType: file.type,
          fileName: file.name.replace(/\.[^/.]+$/, "")
        });

        const res = await toast.promise(promise, {
          pending: "Uploading Book File",
          success: "Book file uploaded",
          error: "Book file upload error"
        });

        const data = res.data as PinataRes;

        const link = `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`;
        return link;
      } catch (e: any) {
        console.error(e.message);
      }
    }
    return "";
  };

  const uploadBookCover = async (file: File) => {
    if (file !== undefined) {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

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
          pending: "Uploading image",
          success: "Image uploaded",
          error: "Image upload error"
        });

        const data = res.data as PinataRes;

        const link = `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`;
        return link;
      } catch (e: any) {
        console.error(e.message);
      }
    }
    return "";
  };

  const uploadMetadata = async (nftBookMeta: NftBookMeta) => {
    try {
      const { signedData, account } = await getSignedData();

      const promise = axios.post("/api/verify", {
        address: account,
        signature: signedData,
        nftBook: nftBookMeta
      });

      const res = await toast.promise(promise, {
        pending: "Uploading metadata",
        success: "Metadata uploaded",
        error: "Metadata upload error"
      });

      const data = res.data as PinataRes;
      const link = `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`;
      setNftURI(link);
      return link;
    } catch (e: any) {
      console.error(e.message);
    }
    return "";
  };

  const createNFTBook = async (nftUri: string, amount: number) => {
    try {
      // console.log("nftUri", nftUri);
      const nftRes = await axios.get(`/api/pinata/metadata?uri=${nftUri}`);
      // const nftRes = await axios.get(nftURI);
      console.log("nftRes", nftRes);
      if (nftRes.data.success === true) {
        const content = nftRes.data.data;

        Object.keys(content).forEach((key) => {
          if (!ALLOWED_FIELDS.includes(key)) {
            throw new Error("Invalid Json structure");
          }
        });

        const tx = await contract?.mintBook(nftUri, amount, {
          value: ethers.utils.parseEther((0.025).toString())
        });

        const receipt: any = await toast.promise(tx!.wait(), {
          pending: "Minting NftBook Token",
          success: "NftBook has ben created",
          error: "Minting error"
        });
        const tokenId = receipt.events
          .find((x: any) => x.event == "NFTBookCreated")
          .args.tokenId.toNumber();
        // const contractAddress = receipt.contractAdress;
        return tokenId;
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const uploadBookDetails = async (bookInfo: BookInfo) => {
    try {
      const promise = axios.post("/api/books/create", bookInfo);

      const res = await toast.promise(promise, {
        pending: "Uploading book details...",
        success: "Book details uploaded",
        error: "Book details upload error"
      });

      console.log(res);
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const { handleSubmit, trigger, setValue } = methods;

  useEffect(() => {
    console.log(defaultData);
    setValue("title", defaultData?.meta.title);
    setValue("description", defaultData?.info.description);

    setValue("fileType", defaultData?.meta.fileType);
  }, [defaultData]);

  const onSubmit = (data: any) => {
    console.log(data);
    if (activeStep === 1) {
      (async () => {
        const bookCoverLink = await uploadBookCover(data.bookCover[0]);
        const bookFileLink = await uploadBookFile(data.bookFile[0]);
        const bookSampleLink = await uploadBookSample(data.bookSample[0]);
        // Upload metadata to pinata
        const metadataLink = await uploadMetadata({
          title: data.title,
          bookCover: bookCoverLink,
          bookFile: bookFileLink,
          bookSample: bookSampleLink,
          fileType: data.fileType
        });
      })();
    } else if (activeStep === 3) {
      (async () => {
        // Mint book
        const tokenId = await createNFTBook(nftURI, data.maxSupply);
        console.log("Creating book", tokenId);

        // Upload data to database
        if (tokenId) {
          uploadBookDetails({
            token_id: tokenId,
            description: data.description,
            languages: data.languages,
            genres: data.genres,
            version: data.version,
            max_supply: data.maxSupply,
            external_link: data.externalLink,
            total_pages: data.totalPages,
            keywords: data.keywords,
            publishing_time: data.publishingTime
          });
        }
      })();
    }
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
        <ContentContainer titles={["Edit", "this book"]}>
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
                              onClick={handleSubmit(onSubmit)}
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
        </ContentContainer>
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

export default BookDetailEdit;
