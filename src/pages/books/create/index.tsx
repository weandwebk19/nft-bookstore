/* eslint-disable prettier/prettier */
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import { render } from "@react-email/render";
import {
  convertArrayToHexString,
  convertHexStringToUint8Array
} from "@utils/convert";
import getFileExtension from "@utils/getFileExtension";
import axios from "axios";
import cryptoRandomString from "crypto-random-string";
import { ethers } from "ethers";
import { sign } from "jsonwebtoken";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import * as yup from "yup";

import withAuth from "@/components/HOC/withAuth";
import withAuthor from "@/components/HOC/withAuthor";
import { useUserInfo } from "@/components/hooks/api/useUserInfo";
import { useAccount, useNetwork } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import {
  FinalStep,
  SigningContractStep,
  Step1,
  Step2,
  Step3
} from "@/components/ui/books/create/steps";
import { createTransactionHistory } from "@/components/utils";
import { getGasFee } from "@/components/utils/getGasFee";
import { deleteFile } from "@/pages/api/utils";
import { StyledButton } from "@/styles/components/Button";
import { BookBrief, BookInfo, NftBookMeta, PinataRes } from "@/types/nftBook";
import { Crypto } from "@/utils/crypto";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const MAX_BOOKFILE_SIZE = process.env.NEXT_PUBLIC_MAX_BOOKFILE_SIZE;
const MAX_BOOKCOVER_SIZE = process.env.NEXT_PUBLIC_MAX_BOOKCOVER_SIZE;
const MAX_BOOKSAMPLE_SIZE = process.env.NEXT_PUBLIC_MAX_BOOKSAMPLE_SIZE;

const SUPPORTED_BOOKFILE_FORMATS = ["application/pdf", "application/epub+zip"];
const SUPPORTED_BOOKCOVER_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/svg"
];
const SUPPORTED_BOOKSAMPLE_FORMATS = [
  "application/pdf",
  "application/epub+zip"
];

const MINIMUM_SUPPLY = 1;
const MAXIMUM_SUPPLY = 500;

const defaultValues = {
  // Step 1
  title: "",
  description: "",

  // Step 2
  fileType: "",
  bookFile: "",
  bookCover: "",
  bookSample: "",

  // Signing bookStoreContract

  // Step 3
  externalLink: "",
  version: "",
  quantity: MINIMUM_SUPPLY,
  genres: [],
  languages: [],
  totalPages: 1,
  keywords: [],

  // Final step
  termsOfService: false,
  privacyPolicy: false
};

const CreateBook = () => {
  const { t } = useTranslation("createBook");

  const [activeStep, setActiveStep] = useState(0);
  const [isSigning, setIsSigning] = useState(false);
  const formRef = useRef<any>();
  const { provider, ethereum, bookStoreContract } = useWeb3();
  const { account } = useAccount();
  const [nftURI, setNftURI] = useState("");
  const [bookFileLink, setBookFileLink] = useState("");
  const [bookCoverLink, setBookCoverLink] = useState("");
  const [bookSampleLink, setBookSampleLink] = useState("");
  const [currentFile, setCurrentFile] = useState("");
  const [ivStr, setIvStr] = useState<string>();
  const [key, setKey] = useState<string>();

  const steps = [
    t("titleStep1") as string,
    t("titleStep2") as string,
    t("titleStep3") as string,
    t("titleStep4") as string
  ];

  const validationSchema = [
    // validation for step1 (Fill in book name and description)
    yup.object({
      title: yup.string().required(t("textError1") as string),
      description: yup.string().required(t("textError2") as string)
    }),

    // validation for step2 (Upload your book)
    yup.object().shape({
      fileType: yup.string(),
      // .required(t("textError3") as string)
      // .oneOf(["epub", "pdf"], t("textError4") as string),
      bookFile: yup
        .mixed()
        .required(t("textError5") as string)
        .test("required", t("textError6") as string, (file: any) => {
          if (file) return true;
          return false;
        })
        .test("fileSize", t("textError8") as string, (file: any) => {
          return file && file?.size <= MAX_BOOKFILE_SIZE!;
        })
        .test("fileFormat", "Unsupported Format", (file: any) => {
          return file && SUPPORTED_BOOKFILE_FORMATS.includes(file.type);
        }),
      bookCover: yup
        .mixed()
        .required(t("textError5") as string)
        .test("required", t("textError6") as string, (file: any) => {
          if (file) return true;
          return false;
        })
        .test("fileSize", t("textError8") as string, (file: any) => {
          return file && file?.size <= MAX_BOOKCOVER_SIZE!;
        })
        .test("fileFormat", t("textError21") as string, (file: any) => {
          return file && SUPPORTED_BOOKCOVER_FORMATS.includes(file.type);
        }),
      bookSample: yup
        .mixed()
        .test("fileSize", t("textError8") as string, (file: any) => {
          if (!file) return true;
          return file && file?.size <= MAX_BOOKSAMPLE_SIZE!;
        })
        .test("fileFormat", t("textError21") as string, (file: any) => {
          if (!file) return true;
          return file && SUPPORTED_BOOKSAMPLE_FORMATS.includes(file.type);
        })
    }),

    // validate for step3 (Book details)
    yup.object({
      externalLink: yup.string(),
      version: yup.string().required(t("textError9") as string),
      quantity: yup
        .number()
        .typeError(t("textError10") as string)
        .required(t("textError11") as string)
        .min(MINIMUM_SUPPLY, `${t("textError12") as string} ${MINIMUM_SUPPLY}`)
        .max(MAXIMUM_SUPPLY, `${t("textError13") as string} ${MAXIMUM_SUPPLY}`),
      genres: yup
        .array()
        .of(yup.string())
        .test("required", t("textError14") as string, (arr) => {
          if (arr && (arr as any).length !== 0) return true;
          return false;
        }),
      languages: yup
        .array()
        .of(yup.string())
        .test("required", t("textError15") as string, (arr) => {
          if (arr && (arr as any).length !== 0) return true;
          return false;
        }),
      totalPages: yup
        .number()
        .typeError(t("textError20") as string)
        .min(0, `${t("textError16") as string}`)
        .required(t("textError17") as string),
      keywords: yup.array().of(yup.string())
    }),

    // validate for final step (Accept the terms and conditions)
    yup.object().shape({
      termsOfService: yup.boolean().oneOf([true], t("textError18") as string),
      privacyPolicy: yup.boolean().oneOf([true], t("textError19") as string)
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

  const getSignedData = async () => {
    const messageToSign = await axios.get("/api/pinata/verify");
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

  const deleteFileOnCloud = async () => {
    try {
      // Remove all data from pinata
      if (bookCoverLink !== "") {
        await deleteFile(
          bookCoverLink.replace(
            `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/`,
            ""
          )
        );
      }
      if (bookFileLink !== "") {
        await deleteFile(
          bookFileLink.replace(
            `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/`,
            ""
          )
        );
      }
      if (bookSampleLink !== "") {
        await deleteFile(
          bookSampleLink.replace(
            `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/`,
            ""
          )
        );
      }
      if (nftURI !== "") {
        await deleteFile(
          nftURI.replace(`${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/`, "")
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleError = async (err: any) => {
    console.error(err);
    await deleteFileOnCloud();
    toast.error("An error occured while deleting file on cloud", {
      position: toast.POSITION.TOP_CENTER
    });
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const uploadBookSample = async (file: File) => {
    if (!!file && file !== undefined) {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      try {
        const { signedData, account } = await getSignedData();
        const promise = axios.post("/api/pinata/verify-file", {
          address: account,
          signature: signedData,
          bytes,
          contentType: file.type,
          fileName: file.name.replace(/\.[^/.]+$/, "")
        });

        const res = await toast.promise(promise, {
          pending: t("pendingUploadBookSample") as string,
          success: t("successUploadBookSample") as string,
          error: t("errorUploadBookSample") as string
        });

        const data = res.data as PinataRes;

        const link = `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`;
        setBookSampleLink(link);
        return link;
      } catch (e: any) {
        await handleError(e);
      }
    }
    return "";
  };
  88;
  const uploadBookFile = async (file: File) => {
    let cipherText;
    if (!!file && file !== undefined) {
      const key = cryptoRandomString({ length: 32, type: "alphanumeric" });
      const privateKey = await Crypto.generateKey(key);
      setKey(key);
      const iv = Crypto.generateIVValue();
      const ivStr = convertArrayToHexString(Array.from(iv!));
      setIvStr(ivStr);

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        const pdfData = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(pdfData);
        cipherText = await Crypto.encryption(bytes, privateKey!, iv!);
      };

      try {
        const { signedData, account } = await getSignedData();

        const promise = axios.post("/api/pinata/verify-file", {
          address: account,
          signature: signedData,
          bytes: cipherText,
          contentType: file.type,
          fileName: file.name.replace(/\.[^/.]+$/, "")
        });

        const res = await toast.promise(promise, {
          pending: t("pendingUploadBookFile") as string,
          success: t("successUploadBookFile") as string,
          error: t("errorUploadBookFile") as string
        });

        const data = res.data as PinataRes;

        const link = `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`;
        setBookFileLink(link);
        return link;
      } catch (e: any) {
        console.log("error: ", e);
        // await handleError(e);
      }
    }
    return "";
  };

  const uploadBookCover = async (file: File) => {
    if (!!file && file !== undefined) {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      try {
        const { signedData, account } = await getSignedData();
        const promise = axios.post("/api/pinata/verify-image", {
          address: account,
          signature: signedData,
          bytes,
          contentType: file.type,
          fileName: file.name.replace(/\.[^/.]+$/, "")
        });

        const res = await toast.promise(promise, {
          pending: t("pendingUploadBookCover") as string,
          success: t("successUploadBookCover") as string,
          error: t("errorUploadBookCover") as string
        });

        const data = res.data as PinataRes;

        const link = `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`;
        setBookCoverLink(link);
        return link;
      } catch (e: any) {
        await handleError(e);
      }
    }
    return "";
  };

  const uploadMetadata = async (nftBookMeta: NftBookMeta) => {
    try {
      const { signedData, account } = await getSignedData();
      const promise = axios.post("/api/pinata/verify", {
        address: account,
        signature: signedData,
        nftBook: nftBookMeta
      });

      const res = await toast.promise(promise, {
        pending: t("pendingUploadMetadata") as string,
        success: t("successUploadMetadata") as string,
        error: t("errorUploadMetadata") as string
      });

      const data = res.data as PinataRes;
      const link = `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`;
      setNftURI(link);
      return link;
    } catch (e: any) {
      await handleError(e);
    }
    return "";
  };

  const createNFTBook = async (
    nftUri: string,
    quantity: number,
    key: string,
    iv: string
  ) => {
    try {
      if (nftUri !== "") {
        const listingPrice = await bookStoreContract!.listingPrice();
        const tx = await bookStoreContract?.mintBook(
          nftUri,
          quantity,
          key,
          iv,
          {
            value: listingPrice
          }
        );

        const receipt: any = await toast.promise(tx!.wait(), {
          pending: t("pendingMintingToken") as string,
          success: t("successMintingToken") as string,
          error: t("errorMintingToken") as string
        });
        const tokenId = receipt.events
          .find((x: any) => x.event == "NFTBookCreated")
          .args.tokenId.toNumber();
        // const bookStoreContractAddress = receipt.bookStoreContractAdress;
        createTransactionHistoryCallback(
          provider,
          receipt,
          listingPrice,
          account.data!,
          tokenId
        );
        return tokenId;
      }
    } catch (e: any) {
      console.log("error: ", e);
      await handleError(e);
    }
  };

  const uploadBookDetails = async (bookInfo: BookInfo) => {
    try {
      const promise = axios.post("/api/books/create", { bookInfo });

      const res = await toast.promise(promise, {
        pending: t("pendingUploadBookDetails") as string,
        success: t("successUploadBookDetails") as string,
        error: t("errorUploadBookDetails") as string
      });
      return res;
    } catch (e: any) {
      await handleError(e);
    }
  };

  const createRequestPublish = async (data: {
    tokenId: number;
    bookFile: File;
    title: string;
  }) => {
    try {
      const buffer = await data.bookFile.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      const promise = axios.post("/api/books/request/create", {
        tokenId: data.tokenId,
        nftUri: nftURI,
        bookFile: bytes,
        bookFileName: data.bookFile.name,
        bookSample: bookSampleLink,
        bookCover: bookCoverLink,
        title: data.title,
        author: account.data,
        timestamp: new Date()
      });
    } catch (e: any) {
      toast.error("Oops! Something went wrong!", {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  const createTransactionHistoryCallback = async (
    provider: any,
    receipt: any,
    listingPrice: any,
    userAddress: string,
    tokenId: number
  ) => {
    // create Transaction History For Seller
    const gasFee = await getGasFee(provider, receipt);
    // Caculate total fee
    const listingPriceNumber = parseFloat(
      ethers.utils.formatEther(listingPrice)
    );
    const totalFee = 0 - listingPriceNumber - parseFloat(gasFee);
    // Get current balance of account
    const balance = await provider?.getBalance(userAddress);
    const balanceInEther = ethers.utils.formatEther(balance);
    await createTransactionHistory(
      tokenId,
      totalFee,
      balanceInEther,
      "Mint book",
      "Tạo sách",
      receipt.transactionHash,
      receipt.from,
      receipt.to,
      `Gas fee = ${gasFee} ETH, Listing fee = ${listingPriceNumber} ETH, Total fee = ${-totalFee} ETH`,
      `Phí gas = ${gasFee} ETH, Phí liệt kê = ${listingPriceNumber} ETH, Tổng cộng = ${-totalFee} ETH`
    );
  };

  const { handleSubmit, trigger, getValues, setValue } = methods;
  const onSubmit = async (data: any) => {
    setCurrentFile(data.bookFile.path);
    try {
      if (activeStep === 1) {
        (async () => {
          setIsSigning(true);
          let bookCoverRes, bookFileRes, bookSampleRes;
          bookCoverRes = await uploadBookCover(data.bookCover);
          if (bookCoverRes) {
            bookFileRes = await uploadBookFile(data.bookFile);
          }
          if (bookFileRes) {
            bookSampleRes = await uploadBookSample(data.bookSample);
          }

          if (
            bookCoverRes &&
            bookFileRes &&
            (!data.bookSample[0] || bookSampleRes)
          ) {
            setIsSigning(false);
            handleNext();
          }
        })();
      } else if (activeStep === 2) {
        (async () => {
          // Upload metadata to pinata
          if (bookCoverLink !== "" && bookFileLink !== "" && account.data) {
            setIsSigning(true);
            const nftUriRes = await uploadMetadata({
              title: data.title,
              bookCover: bookCoverLink,
              bookFile: bookFileLink,
              bookSample: bookSampleLink,
              fileType: data.fileType,
              version: data.version,
              author: account.data,
              quantity: data.quantity,
              createdAt: new Date().toString()
            });
            if (nftUriRes) {
              setIsSigning(false);
              handleNext();
            }
          }
        })();
      } else if (activeStep === 3) {
        (async () => {
          if (nftURI !== "") {
            setIsSigning(true);
            // Mint book
            const tokenId = await createNFTBook(
              nftURI,
              data.quantity,
              key!,
              ivStr!
            );

            if (tokenId) {
              // Upload data to database
              const detailRes = await uploadBookDetails({
                tokenId: tokenId,
                description: data.description,
                languages: data.languages,
                genres: data.genres,
                externalLink: data.externalLink,
                totalPages: data.totalPages,
                keywords: data.keywords,
                publishingTime: data.publishingTime,
                userCreated: account.data,
                isApproved: false
              } as BookInfo);
              //
              await createRequestPublish({
                tokenId: tokenId,
                bookFile: data.bookFile,
                title: data.title
              });
              if (detailRes) {
                setIsSigning(false);
                setOpen(true);
                handleNext();
              }
            }
          }
        })();
      } else {
        handleNext();
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  useEffect(() => {
    if (currentFile !== "" && currentFile) {
      setValue("fileType", getFileExtension(currentFile));
    }
  }, [currentFile]);

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
        <title>{t("titlePage")}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ContentContainer titles={[t("titleContent1"), t("titleContent2")]}>
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
                {(() => {
                  if (isSigning === true) {
                    return <SigningContractStep />;
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
                        <Stack direction="row" spacing={3}>
                          <StyledButton
                            onClick={() => {
                              router.push("/account/bookshelf/created-books");
                            }}
                          >
                            {t("messageFinish2") as string}
                          </StyledButton>
                        </Stack>
                      </Box>
                    );
                  } else {
                    return (
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
                                {t("back") as string}
                              </Button>
                              {activeStep === steps.length - 1 ? (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={handleSubmit(onSubmit)}
                                >
                                  {t("create") as string}
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
                          </form>
                        </FormProvider>
                      </>
                    );
                  }
                })()}
              </div>
            </Paper>
          </Box>
        </ContentContainer>
        <ToastContainer />
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {t("messageSuccessCreated") as string}
          </Alert>
        </Snackbar>
      </main>
    </>
  );
};

export default withAuth(withAuthor(CreateBook));

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "createBook"
      ]))
    }
  };
}
