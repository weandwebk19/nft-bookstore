import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Box, Link, Stack, TextField, Typography } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/ContentContainer.module.scss";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { ethers } from "ethers";
import Head from "next/head";
import * as yup from "yup";

import images from "@/assets/images";
import { useFetchData, useGenres, useLanguages } from "@/components/hooks/api";
import { useNetwork } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { ContentGroup } from "@/components/shared/ContentGroup";
import { DatePicker } from "@/components/shared/DatePicker";
import { FormGroup } from "@/components/shared/FormGroup";
import { MultipleSelectChip } from "@/components/shared/MultipleSelectChip";
import { TimePicker } from "@/components/shared/TimePicker";
import { UploadField } from "@/components/shared/UploadField";
import { StyledButton } from "@/styles/components/Button";
import { StyledTextArea } from "@/styles/components/TextField";
import { HookFetchResponse } from "@/types/api";
import { Language } from "@/types/languages";
import {
  BookGenres,
  BookInfo,
  NftBookDetails,
  NftBookMeta,
  PinataRes
} from "@/types/nftBook";
import { isFloat } from "@/utils/isFloat";

const MAXIMUM_ATTACHMENTS_SIZE = 2000000;

const MINIMUM_SUPPLY = 1;
const MAXIMUM_SUPPLY = 500;

const MAXIMUM_PRICE = 1000;

const ALLOWED_FIELDS = ["title", "bookFile", "bookCover"];

const schema = yup
  .object({
    title: yup.string().required("Please enter your book title"),
    description: yup.string().required("Please enter your book description"),
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
      .required("Please enter your book genres"),
    languages: yup
      .array()
      .of(yup.string())
      .required("Please enter your book languages"),
    totalPages: yup
      .number()
      .min(0, `The total page must be greater than or equal 0`)
      .required("Please enter the page number of your book"),
    keywords: yup.string(),
    minPrice: yup
      .number()
      .min(0, `The min price must be greater than or equal 0`)
      .max(yup.ref("maxPrice"), `The min price must be less than max price`),
    maxPrice: yup
      .number()
      .min(yup.ref("minPrice"), `The max price must be greater than min price`)
      .max(MAXIMUM_PRICE, `The max price must be less than ${MAXIMUM_PRICE}`),
    listingPrice: yup
      .number()
      .min(
        yup.ref("minPrice"),
        `The listing price value needs to fall between the min and max price`
      )
      .max(
        yup.ref("maxPrice"),
        `The listing price value needs to fall between the min and max price`
      )
      .required("Please enter the listing price"),
    publishingDate: yup.date(),
    publishingTime: yup.date()
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const fileSchema = yup.object().shape({
  bookFile: yup
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
  bookCover: yup
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
  bookSample: yup
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

const AuthorPublishing = () => {
  const { ethereum, contract } = useWeb3();
  const { network } = useNetwork();
  const [nftURI, setNftURI] = useState("");
  const [hasURI, setHasURI] = useState(false);
  const [nftBookMeta, setNftBookMeta] = useState<NftBookMeta>({
    title: "",
    bookFile: "",
    bookCover: "",
    bookSample: ""
  });
  // Book genres
  // const bookGenres = Object.keys(BookGenres).filter((item) => {
  //   return isNaN(Number(item));
  // });
  const bookGenres = useGenres();
  const [chosenGenres, setChosenGenres] = useState<typeof bookGenres>([]);

  // const handleGenresChange = (event: SelectChangeEvent<typeof bookGenres>) => {
  //   const {
  //     target: { value }
  //   } = event;
  //   setChosenGenres(
  //     // On autofill we get a stringified value.
  //     typeof value === "string" ? value.split(",") : value
  //   );
  // };

  // Languages
  const languages = useLanguages();
  const [chosenLanguages, setChosenLanguages] = useState<string[]>([]);

  // const handleLanguagesChange = (event: SelectChangeEvent<string[]>) => {
  //   const {
  //     target: { value }
  //   } = event;
  //   setChosenLanguages(typeof value === "string" ? value.split(",") : value);
  // };

  // Publishing date
  const [chosenDate, setChosenDate] = useState<Dayjs | null>(dayjs());

  const handlePublishingDateChange = (newValue: Dayjs | null) => {
    setChosenDate(newValue);
  };

  // Publishing time
  const [chosenTime, setChosenTime] = useState<Dayjs | null>(dayjs());

  // Book file
  const [uploadedBookFile, setUploadedBookFile] = useState<File>();

  // Book cover
  const [uploadedBookCover, setUploadedBookCover] = useState<File>();

  // Book sample
  const [uploadedBookSample, setUploadedBookSample] = useState<File>();

  const handlePublishingTimeChange = (newValue: Dayjs | null) => {
    setChosenTime(newValue);
    console.log(chosenTime);
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues
  } = useForm<FormData & FileFormData>({
    defaultValues: {
      bookFile: undefined,
      bookCover: undefined,
      bookSample: undefined,
      title: "",
      description: "",
      externalLink: "",
      version: "",
      maxSupply: MINIMUM_SUPPLY,
      genres: [],
      languages: [],
      totalPages: 1,
      keywords: "",
      minPrice: 0,
      maxPrice: MAXIMUM_PRICE,
      listingPrice: 0,
      publishingTime: new Date()
    },
    resolver: yupResolver(schema)
  });
  const MAXIMUM_NUMBER_OF_CHARACTERS = 1000;
  const [numberOfCharacters, setNumberOfCharacters] = useState<Number>(0);

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
        setNftBookMeta({
          ...nftBookMeta,
          bookSample: link
        });

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
        setNftBookMeta({
          ...nftBookMeta,
          bookFile: link
        });
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

        setNftBookMeta({
          ...nftBookMeta,
          bookCover: link
        });
        return link;
      } catch (e: any) {
        console.error(e.message);
      }
    }
    return "";
  };

  const uploadMetadata = async (nftBookMeta: NftBookMeta) => {
    try {
      console.log("nftBookMeta", nftBookMeta);
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
      const nftRes = await axios.post("/api/pinata/metadata", {
        nftUri
      });
      console.log("nftRes", nftRes);
      if (nftRes.data.success === true) {
        const content = nftRes.data.data;

        Object.keys(content).forEach((key) => {
          if (!ALLOWED_FIELDS.includes(key)) {
            console.log("key", key);
            // throw new Error("Invalid Json structure");
          }
        });

        const tx = await contract?.mintBook(nftUri, amount, {
          value: ethers.utils.parseEther((0.025).toString())
        });

        console.log("tx", tx);

        const res: any = await toast.promise(tx!.wait(), {
          pending: "Minting NftBook Token",
          success: "NftBook has ben created",
          error: "Minting error"
        });

        console.log("res", res);
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

  const onSubmit = (data: any) => {
    (async () => {
      const bookCoverLink = await uploadBookCover(data.bookCover);
      const bookFileLink = await uploadBookFile(data.bookFile);
      const bookSampleLink = await uploadBookSample(data.bookSample);
      // Upload metadata to pinata
      const metadataLink = await uploadMetadata({
        title: data.title,
        bookCover: bookCoverLink,
        bookFile: bookFileLink,
        bookSample: bookSampleLink
      });
      // Mint book
      createNFTBook(metadataLink, data.maxSupply);
    })();
    // Mint book
    // createNFTBook(data.maxSupply);
    // Upload data to database
    // uploadBookDetails({
    //   description: data.description,
    //   languages: data.languages,
    //   genres: data.genres,
    //   version: data.version,
    //   max_supply: data.maxSupply,
    //   external_link: data.externalLink,
    //   total_pages: data.totalPages,
    //   keywords: data.keywords,
    //   publishing_time: data.publishingTime
    // });
  };

  return (
    <>
      <Head>
        <title>Publishing by author - NFT Bookstore</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ContentContainer titles={["Publish", "your book"]}>
          <Box component="section" sx={{ width: "100%", maxWidth: "720px" }}>
            <Stack spacing={6}>
              <ContentGroup title="Upload your book">
                <Stack spacing={{ xs: 3 }}>
                  <UploadField
                    content="Upload your book"
                    required
                    onChange={(e) => {
                      if (!e.target.files) {
                        console.error("Select a file");
                        return;
                      }

                      const file = e.target.files[0];
                      setValue("bookFile", file, { shouldValidate: true });
                      setUploadedBookFile(file);
                    }}
                    uploaded={uploadedBookFile}
                  />
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={{ xs: 3 }}
                  >
                    <UploadField
                      content="Upload The book cover"
                      required
                      onChange={(e) => {
                        (async () => {
                          if (!e.target.files) {
                            console.error("Select a file");
                            return;
                          }

                          const file = e.target.files[0];

                          setValue("bookCover", file, { shouldValidate: true });
                          setUploadedBookCover(file);
                        })();
                      }}
                      uploaded={uploadedBookCover}
                    />
                    <UploadField
                      content="Upload book sample"
                      onChange={(e) => {
                        if (!e.target.files) {
                          console.error("Select a file");
                          return;
                        }

                        const file = e.target.files[0];
                        setValue("bookSample", file, { shouldValidate: true });
                        setUploadedBookSample(file);
                      }}
                      uploaded={uploadedBookSample}
                    />
                  </Stack>
                </Stack>
              </ContentGroup>
              <ContentGroup title="Book details">
                <Stack direction="column" spacing={3}>
                  <Stack direction="column" spacing={3}>
                    <FormGroup label="Book title" required>
                      <Controller
                        name="title"
                        control={control}
                        render={({ field }) => {
                          return (
                            <TextField
                              id="title"
                              fullWidth
                              error={!!errors.title?.message}
                              {...field}
                              onChange={(e) => {
                                const title = e.target.value;
                                setNftBookMeta({
                                  ...nftBookMeta,
                                  title: title
                                });
                                setValue("title", title, {
                                  shouldValidate: true
                                });
                              }}
                            />
                          );
                        }}
                      />
                    </FormGroup>
                    <FormGroup label="Description" required>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => {
                          return (
                            <StyledTextArea
                              id="description"
                              minRows={3}
                              multiline={true}
                              label={`${numberOfCharacters}/${MAXIMUM_NUMBER_OF_CHARACTERS}`}
                              fullWidth
                              InputLabelProps={{
                                shrink: true
                              }}
                              error={!!errors.description?.message}
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
                    <FormGroup
                      label="External link"
                      desc="NFT Bookstore will include a link to this URL on this item's detail page, so that users can click to learn more about it. This may contain extra items for buyers."
                    >
                      <Controller
                        name="externalLink"
                        control={control}
                        render={({ field }) => {
                          return (
                            <TextField
                              id="externalLink"
                              fullWidth
                              error={!!errors.externalLink?.message}
                              {...field}
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
                        label="Version"
                        required
                        className={styles["form__group-half"]}
                      >
                        <Controller
                          name="version"
                          control={control}
                          render={({ field }) => {
                            return (
                              <TextField
                                id="version"
                                fullWidth
                                error={!!errors.version?.message}
                                {...field}
                              />
                            );
                          }}
                        />
                      </FormGroup>
                      <FormGroup
                        label="Max supply"
                        required
                        className={styles["form__group-half"]}
                      >
                        <Controller
                          name="maxSupply"
                          control={control}
                          render={({ field }) => {
                            return (
                              <TextField
                                id="maxSupply"
                                fullWidth
                                error={!!errors.maxSupply?.message}
                                {...field}
                                onChange={(e) => {
                                  if (
                                    !!e.target.value &&
                                    !isNaN(parseFloat(e.target.value)) &&
                                    parseFloat(e.target.value) >= 0
                                  ) {
                                    let newValue = parseFloat(e.target.value);
                                    e.target.value = `${newValue}`;
                                  } else {
                                    e.target.value = "0";
                                  }

                                  field.onChange(e);
                                  setValue(
                                    "maxSupply",
                                    getValues("maxSupply"),
                                    {
                                      shouldValidate: true
                                    }
                                  );
                                }}
                              />
                            );
                          }}
                        />
                        {errors.maxSupply && <p>{errors.maxSupply.message}</p>}
                      </FormGroup>
                    </Stack>
                    <FormGroup label="Genres" required>
                      <MultipleSelectChip
                        items={bookGenres}
                        value={chosenGenres}
                        // onChange={handleGenresChange}
                        onChange={(
                          event: SelectChangeEvent<typeof bookGenres>
                        ) => {
                          const {
                            target: { value }
                          } = event;
                          setChosenGenres(
                            // On autofill we get a stringified value.
                            typeof value === "string" ? value.split(",") : value
                          );
                          setValue("genres", value, { shouldValidate: true });
                        }}
                      />
                    </FormGroup>
                    <FormGroup label="Languages" required>
                      <MultipleSelectChip
                        items={languages}
                        value={chosenLanguages}
                        onChange={(event: SelectChangeEvent<string[]>) => {
                          const {
                            target: { value }
                          } = event;
                          setChosenLanguages(
                            // On autofill we get a stringified value.
                            typeof value === "string" ? value.split(",") : value
                          );
                          setValue("languages", value, {
                            shouldValidate: true
                          });
                        }}
                      />
                    </FormGroup>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={{ xs: 2 }}
                    >
                      <FormGroup
                        label="Total Page"
                        className={styles["profile__formGroup-half"]}
                        required
                      >
                        <Controller
                          name="totalPages"
                          control={control}
                          render={({ field }) => {
                            return (
                              <TextField
                                id="totalPages"
                                fullWidth
                                error={!!errors.totalPages?.message}
                                {...field}
                                onChange={(e) => {
                                  if (
                                    !!e.target.value &&
                                    !isNaN(parseFloat(e.target.value)) &&
                                    parseFloat(e.target.value) >= 0
                                  ) {
                                    let newValue = parseFloat(e.target.value);
                                    e.target.value = `${newValue}`;
                                  } else {
                                    e.target.value = "0";
                                  }

                                  field.onChange(e);
                                  setValue(
                                    "totalPages",
                                    getValues("totalPages"),
                                    {
                                      shouldValidate: true
                                    }
                                  );
                                }}
                              />
                            );
                          }}
                        />
                        {errors.minPrice && <p>{errors.minPrice.message}</p>}
                      </FormGroup>
                      <FormGroup
                        label="Key words"
                        className={styles["form__group-half"]}
                      >
                        <Controller
                          name="keywords"
                          control={control}
                          render={({ field }) => {
                            return (
                              <TextField
                                id="userName"
                                fullWidth
                                error={!!errors.keywords?.message}
                                {...field}
                              />
                            );
                          }}
                        />
                        {errors.maxPrice && <p>{errors.maxPrice.message}</p>}
                      </FormGroup>
                    </Stack>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={{ xs: 2 }}
                    >
                      <FormGroup
                        label="Min price"
                        className={styles["form__group-half"]}
                      >
                        <Controller
                          name="minPrice"
                          control={control}
                          render={({ field }) => {
                            return (
                              <TextField
                                id="minPrice"
                                fullWidth
                                error={!!errors.minPrice?.message}
                                {...field}
                                onChange={(e) => {
                                  const input = e.target.value;
                                  if (isFloat(input)) {
                                    field.onChange(e);
                                    setValue(
                                      "minPrice",
                                      getValues("minPrice"),
                                      {
                                        shouldValidate: true
                                      }
                                    );
                                  }
                                }}
                              />
                            );
                          }}
                        />
                        {errors.minPrice && <p>{errors.minPrice.message}</p>}
                      </FormGroup>
                      <FormGroup
                        label="Max price"
                        className={styles["form__group-half"]}
                      >
                        <Controller
                          name="maxPrice"
                          control={control}
                          render={({ field }) => {
                            return (
                              <TextField
                                id="maxPrice"
                                fullWidth
                                error={!!errors.maxPrice?.message}
                                {...field}
                                onChange={(e) => {
                                  const input = e.target.value;
                                  if (isFloat(input)) {
                                    field.onChange(e);
                                    setValue(
                                      "maxPrice",
                                      getValues("maxPrice"),
                                      {
                                        shouldValidate: true
                                      }
                                    );
                                  }
                                }}
                              />
                            );
                          }}
                        />
                        {errors.maxPrice && <p>{errors.maxPrice.message}</p>}
                      </FormGroup>
                    </Stack>
                    <FormGroup label="Listing price" required>
                      <Controller
                        name="listingPrice"
                        control={control}
                        render={({ field }) => {
                          return (
                            <TextField
                              id="listingPrice"
                              fullWidth
                              error={!!errors.listingPrice?.message}
                              {...field}
                              onChange={(e) => {
                                const input = e.target.value;
                                if (isFloat(input)) {
                                  field.onChange(e);
                                  setValue(
                                    "listingPrice",
                                    getValues("listingPrice"),
                                    {
                                      shouldValidate: true
                                    }
                                  );
                                }
                              }}
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
                      label="Publishing date"
                      className={styles["form__group-half"]}
                    >
                      <DatePicker
                        value={chosenDate}
                        onChange={(newValue: Dayjs | null) => {
                          setChosenDate(newValue);
                          setValue("publishingDate", newValue, {
                            shouldValidate: true
                          });
                        }}
                      />
                    </FormGroup>
                    <FormGroup
                      label="Publishing time"
                      className={styles["form__group-half"]}
                    >
                      <TimePicker
                        value={chosenTime}
                        onChange={(newValue: Dayjs | null) => {
                          setChosenTime(newValue);
                          setValue("publishingTime", newValue, {
                            shouldValidate: true
                          });
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
                sx={{ alignItems: "center", justifyContent: "flex-end", mt: 6 }}
              >
                <StyledButton
                  customVariant="secondary"
                  type="submit"
                  onClick={() => {}}
                >
                  Reset
                </StyledButton>
                <StyledButton
                  customVariant="primary"
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                >
                  Publish
                </StyledButton>
              </Stack>
              <Typography>
                By clicking{" "}
                <b>
                  <i>Publish</i>
                </b>
                , you agree to our{" "}
                <Link href="/terms-of-service">Terms of Service </Link>and that
                you have read our{" "}
                <Link href="/term-of-service">Privacy Policy</Link>, including
                our <Link href="/cookie-use">Cookie Use</Link>.
              </Typography>
            </Stack>
          </Box>
        </ContentContainer>
      </main>
    </>
  );
};

export default AuthorPublishing;
