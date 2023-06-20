import { FormProvider, useForm } from "react-hook-form";

import { Paper, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import * as yup from "yup";

import { TextFieldController } from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { Logo } from "@/components/shared/Logo";
import { ZenLayout } from "@/layouts/ZenLayout";
import { StyledButton } from "@/styles/components/Button";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

export default function Login() {
  const { t } = useTranslation("login");

  const defaultValues = {
    email: "",
    password: ""
  };

  const schema = yup
    .object({
      email: yup.string().email().required("Required"),
      password: yup.string().required("Required")
    })
    .required();

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });

  const { handleSubmit, watch } = methods;

  const onSubmit = (data: any) => {
    console.log({
      email: data.email,
      password: data.password
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        sx={{
          p: 3,
          mt: 8
        }}
      >
        <Stack
          spacing={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Logo />
          <Typography component="h1" variant="h5">
            {t("login")}
          </Typography>
          <Stack
            spacing={3}
            sx={{
              mt: 1,
              width: "100%"
            }}
          >
            <FormProvider {...methods}>
              <FormGroup label={t("email")} required>
                <TextFieldController name="email" type="email" />
              </FormGroup>
              <FormGroup label={t("password")} required>
                <TextFieldController name="password" type="password" />
              </FormGroup>
            </FormProvider>

            <Box>
              <StyledButton
                type="submit"
                fullWidth
                sx={{ mt: 5, mb: 2 }}
                onClick={handleSubmit(onSubmit)}
              >
                {t("login")}
              </StyledButton>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

Login.PageLayout = ZenLayout;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "login"
      ]))
    }
  };
}
