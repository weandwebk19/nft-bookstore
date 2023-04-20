import { useState } from "react";

import { Box, Stack, Typography } from "@mui/material";

import {
  AttachmentController,
  RadioGroupController
} from "@shared/FormController";
import { useTranslation } from "next-i18next";

import { ContentGroup } from "@/components/shared/ContentGroup";
import { FormGroup } from "@/components/shared/FormGroup";
import formatBytes from "@/utils/formatBytes";

const radioItems = [
  {
    id: 0,
    value: "pdf",
    label: "PDF"
  },
  {
    id: 1,
    value: "epub",
    label: "Epub"
  }
];

const Step2 = () => {
  const { t } = useTranslation("createBook");

  return (
    <Box component="section" sx={{ width: "100%", maxWidth: "720px" }}>
      <ContentGroup title={t("titleStep2") as string}>
        <Box sx={{ my: 2 }}>
          <Typography variant="caption" className="form-label required">
            {t("required") as string}
          </Typography>
        </Box>
        <Stack alignItems="center" spacing={3}>
          {/* <FormGroup label={t("chooseFormatBook") as string} required>
            <RadioGroupController items={radioItems} name="fileType" />
          </FormGroup> */}
          <FormGroup label={t("bookFile") as string} required>
            <AttachmentController
              name="bookFile"
              desc={`${t("descAttachment1") as string} ${formatBytes(
                process.env.NEXT_PUBLIC_MAX_BOOKFILE_SIZE
              )}`}
            />
          </FormGroup>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 3 }}
            sx={{ width: "100%" }}
          >
            <FormGroup label={t("bookCover") as string} required>
              <AttachmentController
                name="bookCover"
                desc={`${t("descAttachment2") as string} ${formatBytes(
                  process.env.NEXT_PUBLIC_MAX_BOOKCOVER_SIZE
                )}`}
              />
            </FormGroup>
            <FormGroup label={t("bookSample") as string}>
              <AttachmentController
                name="bookSample"
                // multiple={true}
                desc={`${t("descAttachment1") as string} ${formatBytes(
                  process.env.NEXT_PUBLIC_MAX_BOOKSAMPLE_SIZE
                )}`}
              />
            </FormGroup>
          </Stack>
        </Stack>
      </ContentGroup>
    </Box>
  );
};

export default Step2;
