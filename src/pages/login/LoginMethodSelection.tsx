import React, { useContext, useEffect, useMemo, useState } from 'react'
import { LanguageContext } from '../../App';
import { useLocation, useNavigate } from 'react-router';
import { Alert, Box, Button, Checkbox, Divider, FormHelperText, FormLabel, Grid, InputLabel, styled, Typography, type AlertColor } from '@mui/material';
import { general_sentences, login_sentences } from '../../configurations/language';
import { z } from "zod";
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLazyCheckNumberHasAccountQuery } from '../../store';
import { MuiPhone } from '../../shared/MuiPhone';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { useLogin } from '../../shared/Auth/login/useLogin';

const CustomLinkButton = styled(Button)(() => ({
  color: "#00B3C7",
  textDecoration: "underline",
  textTransform: "none",
  paddingBlock: 0,
  fontSize: "1rem",
  "&:hover": { background: "none", textDecoration: "underline" }
}))

const phoneUtil = PhoneNumberUtil.getInstance();
const getInputsSchema = (language: "Ar" | "En") =>
  z.object({
    phoneNumber: z
      .string()
      .trim()
      .min(5, general_sentences.PhoneNumberIsRequired[language]),
    rememberMe: z.boolean().optional(),
  }).superRefine(({ phoneNumber }, ctx) => {
    if (!phoneNumber) return;

    // eslint-disable-next-line no-useless-assignment
    let isPhoneNumberValid = true;

    try {
      isPhoneNumberValid = phoneUtil.isValidNumber(
        phoneUtil.parseAndKeepRawInput(phoneNumber)
      );
    } catch {
      isPhoneNumberValid = false;
    }

    if (!isPhoneNumberValid) {
      ctx.addIssue({
        code: "custom",
        path: ["phoneNumber"],
        message: general_sentences.PhoneNumberIsNotSudanNumber[language],
      });
    }
});

type Inputs = { phoneNumber: string, rememberMe?: boolean }
type LoginType = "otp" | "password" | undefined;

function LoginMethodSelection(): React.ReactElement {
  const location = useLocation();
  const message = location.state?.message;
  const navigate = useNavigate();
  const {
    identifier,
    setIdentifier,
    rememberMe,
    setRememberMe,
    setSelectedMethod,
  } = useLogin();
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? "En";
  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });
  const [loginType, setLoginType] = useState<LoginType>(undefined);
  const inputsSchema = useMemo(
    () => getInputsSchema(language),
    [language]
  );

  const [checkNumberHasAccount, { isFetching: isCheckingHasAccount }] = useLazyCheckNumberHasAccountQuery();
  // const [checkNumberInCRM, { isFetching: isChecking }] = useLazyCheckNumberInCRMQuery();

  const {
    handleSubmit, control, setValue, formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(inputsSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { phoneNumber: "", rememberMe: false }
  });

  const onSubmit: SubmitHandler<Inputs> = async(data) => {
      try {
        const hasAccountresult = await checkNumberHasAccount(data.phoneNumber.replace("+249","")).unwrap();
        if(!hasAccountresult.result) {
          if(hasAccountresult.succeeded) {
            setAlert({message: login_sentences.LoginWithoutAccount[language], type: "error"});
          }
          else {
            setAlert({message: login_sentences.LoginFailedErrorOccurred[language], type: "error"});
          }
          return;
        }
        if (!identifier.trim() || !loginType) return;
        setSelectedMethod(loginType);
        navigate(`/login/${loginType}`);
        // const checkInCRMresult = await checkNumberInCRM(data.phoneNumber.replace("+","")).unwrap();
        // if(!checkInCRMresult.succeeded) {
        //   setFailedMessage(checkInCRMresult.message);
        // }
        // else {
        //   setFailedMessage(null);
        // }
      } catch {
        setAlert({message: login_sentences.LoginFailedErrorOccurred[language], type: "error"});
      }
  };
  const handleCreateAccountClick = () => {
    navigate("/create_account");
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isCheckingHasAccount === false) setLoginType(undefined)
  }, [isCheckingHasAccount])




  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      <>
        <Typography variant='h1'>{login_sentences.LoginTitle[language]}</Typography>
        <Typography variant='body1'>{login_sentences.LoginDescription[language]}</Typography>
      </>
      <Typography component="form" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "space-between", gap: 2, mt: 2 }} onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <InputLabel htmlFor="PhoneNumber">{login_sentences.PhoneNumber[language]}<span>*</span></InputLabel>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <>
                <MuiPhone
                  defaultCountry="sd"
                  value={identifier ?? ""}
                  withCountries={false}
                  onChange={(value) => {field.onChange(value ?? ""); setValue("phoneNumber", value); setIdentifier(value ?? "");}}
                />
                {errors.phoneNumber && (
                  <FormHelperText>
                    {errors.phoneNumber.message}
                  </FormHelperText>
                )}
              </>
            )}
          />
          {message && (
            <Alert variant="outlined" severity="success"
              sx={{
                mt: 3,
                backgroundColor: theme => theme.palette.success.light,
                borderColor: theme => theme.palette.success.main,
                color: theme => theme.palette.success.main,
              }}
            >
              <Typography variant='body2'>{message}</Typography>
            </Alert>
          )}
          {alert.message && (
            <Alert variant="outlined" severity={alert.type as AlertColor}
              sx={{
                mt: 3,
                backgroundColor: theme => theme.palette[alert.type].light,
                borderColor: theme => theme.palette[alert.type].main,
                color: theme => theme.palette[alert.type].main,
              }}
            >
              <Typography variant='body2'>{alert.message}</Typography>
            </Alert>
          )}
        </Box>
        <Box>
          <Box>
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="RememberMeCheck"
                  aria-label='Terms & Conditions and Privacy Policy'
                  sx={{ p: 0, marginInlineEnd: 0.5 }}
                  checked={rememberMe}
                  onChange={(event) => { field.onChange(event.target.checked); setRememberMe(event.target.checked) }}
                />
              )}
            />

            <FormLabel htmlFor='RememberMeCheck'>{login_sentences.RememberMe[language]}</FormLabel>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: "grow" }}>
              <Button type='submit' variant='contained' loading={loginType === "password" && isCheckingHasAccount} disabled={loginType === "otp" && isCheckingHasAccount}
                sx={{
                  width: "100%",
                  py: 1,
                  mt: 1.5,
                  background: (theme) => `linear-gradient(90deg, #953193 0%, ${theme.palette.primary.light} 100%)`,
                  "&:disabled, &.disabled": {
                    background: "#A3A3A3",
                    color: "#FAFAFA",
                    "&.MuiButton-loading": {
                      color: "transparent",
                    }
                  }
                }}
                onClick={() => setLoginType("password")}
              >
                {login_sentences.LoginUsingPassword[language]}
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: "grow" }}>
              <Button type='submit' variant='contained' color="info" loading={loginType === "otp" && isCheckingHasAccount} disabled={loginType === "password" && isCheckingHasAccount}
                sx={{
                  width: "100%",
                  py: 1,
                  mt: 1.5,
                  boxShadow: "none",
                  "&:disabled, &.disabled": {
                    background: "#A3A3A3",
                    color: "#FAFAFA",
                    "&.MuiButton-loading": {
                      color: "transparent",
                    }
                  }
                }}
                onClick={() => setLoginType("otp")}
              >
                {login_sentences.LoginUsingOTP[language]}
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ my: 1.5 }}>{login_sentences.Or[language]}</Divider>
          <Typography variant='body2' sx={{ justifyContent: "center" }}>{login_sentences.FirstTimeUsingPortal[language]} <CustomLinkButton variant='text' onClick={handleCreateAccountClick}>{login_sentences.CreateAccount[language]}</CustomLinkButton></Typography>
        </Box>
      </Typography>
    </Box>
  )
}

export default LoginMethodSelection