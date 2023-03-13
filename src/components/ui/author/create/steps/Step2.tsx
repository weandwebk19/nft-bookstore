import { Box, Stack, Typography } from "@mui/material";

import {
  AttachmentController,
  RadioGroupController
} from "@shared/FormController";

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
  return (
    <Box component="section" sx={{ width: "100%", maxWidth: "720px" }}>
      <ContentGroup title="Upload your book">
        <Box sx={{ my: 2 }}>
          <Typography variant="caption" className="form-label required">
            Required
          </Typography>
        </Box>
        <Stack alignItems="center" spacing={3}>
          <FormGroup label="Choose your book's reading format" required>
            <RadioGroupController items={radioItems} name="fileType" />
          </FormGroup>
          <FormGroup label="Book file" required>
            <AttachmentController
              name="bookFile"
              desc={`File types recommended: PDF, EPUB. Max size: ${formatBytes(
                process.env.NEXT_PUBLIC_MAX_BOOKFILE_SIZE
              )}`}
            />
          </FormGroup>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 3 }}
            sx={{ width: "100%" }}
          >
            <FormGroup label="Book cover" required>
              <AttachmentController
                name="bookCover"
                desc={`File types recommended: 
              JPG, PNG, GIF, SVG. Max size: ${formatBytes(
                process.env.NEXT_PUBLIC_MAX_BOOKCOVER_SIZE
              )}`}
              />
            </FormGroup>
            <FormGroup label="Book sample">
              <AttachmentController
                name="bookSample"
                multiple={true}
                desc={`File types recommended: PDF, EPUB. Max size: ${formatBytes(
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
