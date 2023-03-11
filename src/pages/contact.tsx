import { FormProvider, useForm } from "react-hook-form";

import { Box, Button, Grid, TextField } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/FilterBar.module.scss";
import * as yup from "yup";

import { ContentContainer } from "@/components/shared/ContentContainer";
import {
  InputController,
  TextAreaController
} from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { StyledButton } from "@/styles/components/Button";

const defaultValues = {
  name: "",
  email: "",
  message: ""
};

const schema = yup
  .object({
    name: yup.string().required("Please enter your name"),
    email: yup
      .string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    message: yup.string().required("Please enter your message")
  })
  .required();

export default function Contact() {
  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: any) => {
    console.log(data);
    // handle form submission here
  };

  return (
    <Box sx={{ pt: 6 }}>
      <ContentContainer titles={["We love", "to hear your story"]}>
        <Box sx={{ flexGrow: 1 }}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormGroup label="Name" required>
                    <InputController name="name" />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormGroup label="Email" required>
                    <InputController name="email" />
                  </FormGroup>
                </Grid>
                <Grid item xs={12}>
                  <FormGroup label="Message" required>
                    <TextAreaController name="message" />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} container justifyContent="flex-end">
                  <StyledButton variant="contained" type="submit">
                    Send
                  </StyledButton>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </ContentContainer>
    </Box>
  );
}
