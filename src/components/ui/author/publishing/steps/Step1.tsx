import { Box, Stack, Typography } from "@mui/material";

import { InputController, TextAreaController } from "@shared/FormController";

import { ContentGroup } from "@/components/shared/ContentGroup";
import { FormGroup } from "@/components/shared/FormGroup";

const Step1 = () => {
  return (
    <ContentGroup title="Book title">
      <Box sx={{ my: 2 }}>
        <Typography variant="caption" className="form-label required">
          Required
        </Typography>
      </Box>
      <Stack direction="column" spacing={3}>
        <FormGroup label="Book title" required>
          <InputController name="bookTitle" />
        </FormGroup>
        <FormGroup label="Description" required>
          <TextAreaController name="description" />
        </FormGroup>
      </Stack>
    </ContentGroup>
  );
};

export default Step1;
