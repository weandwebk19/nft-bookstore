import { Box, FormGroup, Link, Stack, Typography } from "@mui/material";

import { ContentGroup } from "@/components/shared/ContentGroup";
import { CheckboxController } from "@/components/shared/FormController";

const FinalStep = () => {
  return (
    <ContentGroup title="Terms and Conditions">
      <Box sx={{ my: 2 }}>
        <Typography variant="caption" className="form-label required">
          You must accept the <i>Terms and Conditions</i> and{" "}
          <i>Privacy Policy</i>
        </Typography>
      </Box>
      <Stack direction="column" spacing={3}>
        <FormGroup>
          <CheckboxController
            name="termsOfService"
            label={
              <>
                I certify that I am at least 18 years old and of lawful age, and
                I have read and accpet the{" "}
                <Link href="/term-and-conditions">Term and conditions</Link>
              </>
            }
          />
        </FormGroup>
        <FormGroup>
          <CheckboxController
            name="privacyPolicy"
            label={
              <>
                I have read and accept{" "}
                <Link href="/privacy-policy">Privacy Policy</Link>
              </>
            }
          />
        </FormGroup>
      </Stack>
    </ContentGroup>
  );
};

export default FinalStep;
