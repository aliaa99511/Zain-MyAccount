import { Alert, Backdrop, Box, Button, Checkbox, CircularProgress, Divider, FormHelperText, FormLabel, InputLabel, styled, Typography } from '@mui/material'
import React, { useContext, useMemo } from 'react'
import { LanguageContext } from '../../../App';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { create_account_sentences, general_sentences } from '../../../configurations/language';
import { useLazyCheckNumberHasAccountQuery, useLazyCheckNumberInCRMQuery, useLazyGetAppLegalPagesQuery } from '../../../store';
import{ useDialog } from '../../../shared/dialog/hooks/useDialog';
import { CheckCircleOutlineOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { MuiPhone } from '../../../shared/MuiPhone';
import { PhoneNumberUtil } from 'google-libphonenumber';


const phoneUtil = PhoneNumberUtil.getInstance();

const getInputsSchema = (language: "Ar" | "En") =>
  z.object({
    phoneNumber: z
      .string()
      .trim()
      .min(5, general_sentences.PhoneNumberIsRequired[language]),
    Agree: z.boolean().refine((value) => value === true, {
      message: create_account_sentences.NotCheckAgree[language],
    }),
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

type Inputs = {phoneNumber: string, Agree: boolean} 

const CustomLinkButton = styled(Button)(() => ({
  color: "#0153A5", 
  textDecoration: "underline", 
  padding:0, 
  fontSize: "1rem",
  "&:hover": {background: "none", textDecoration: "underline"}
}))

function NumberStep({ handleNext, setPhoneNumber }: { handleNext: () => void; setPhoneNumber: React.Dispatch<React.SetStateAction<string>> }):React.ReactElement {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  const navigate = useNavigate();
  const {customDialog} = useDialog();
  const [checkNumberHasAccount, {isFetching: isCheckingHasAccount}] = useLazyCheckNumberHasAccountQuery();
  const [checkNumberInCRM, {isFetching: isChecking}] = useLazyCheckNumberInCRMQuery();
  const [getAppLegal, {isFetching: isGettingAppLegal}] = useLazyGetAppLegalPagesQuery();
  const [failedMessage, setFailedMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const inputsSchema = useMemo(
    () => getInputsSchema(language),
    [language]
  );

  const {
    register,watch, handleSubmit,control, formState: { errors }, 
  } = useForm<Inputs>({
    resolver: zodResolver(inputsSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { phoneNumber: "" }
  });

  const handleOpenTermsAndConditions = async () => {
    // Type 0 refer to Terms & Conditions
    const TermsAndConditionsResponse = await getAppLegal({type: 0}, true).unwrap();
    const TermsAndConditions = TermsAndConditionsResponse.result.map(item => (
      <Box sx={{marginBottom: 2}}>
        <Typography variant='h6' sx={{marginBottom: 0}}>{item[`title${language}`]}</Typography>
        <Typography variant='body2'>{item[`content${language}`]}</Typography>
      </Box>
    ))
    await customDialog({
      title: create_account_sentences.TermsAndConditions[language],
      content: TermsAndConditions,
      width: "lg",
    });
  }
  const handleOpenPrivacyPolicy = async () => {
     // Type 1 refer to Privacy and Policy
    const PrivacyPolicyResponse = await getAppLegal({type: 1}, true).unwrap();
    const PrivacyPolicy = PrivacyPolicyResponse.result.map(item => (
      <Box sx={{marginBottom: 2}}>
        <Typography variant='h6' sx={{marginBottom: 0}}>{item[`title${language}`]}</Typography>
        <Typography variant='body2'>{item[`content${language}`]}</Typography>
      </Box>
    ))
    await customDialog({
      title: create_account_sentences.PrivacyPolicy[language],
      content: PrivacyPolicy,
      width: "lg",
    });
  }
  const handleLoginClick = () => {
    navigate("/login");
  }

  React.useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => {
      setSuccessMessage(null);
      handleNext();
      const number = watch("phoneNumber").toString() ?? "";
      setPhoneNumber(number);
    }, 3000);
    return () => clearTimeout(timer);
  }, [successMessage, handleNext]);


  const onSubmit: SubmitHandler<Inputs> = async(data) => {
    try {
      const hasAccountresult = await checkNumberHasAccount(data.phoneNumber.slice(4)).unwrap();
      if(hasAccountresult.result) {
        navigate("/login", {state: {
          message: hasAccountresult[`message${language}`],
        },});
        return;
      }
      const checkInCRMresult = await checkNumberInCRM(data.phoneNumber.slice(4)).unwrap();
      if(!checkInCRMresult.succeeded) {
        setFailedMessage(checkInCRMresult[`message${language}`]);
        setSuccessMessage(null);
      }
      else {
        setFailedMessage(null);
        setSuccessMessage(checkInCRMresult[`message${language}`]);
      }
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  return (
    <>
    <Box sx={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
      <>
      <Typography variant='h1'>{create_account_sentences.CreateAccountTitle[language]}</Typography>
      <Typography variant='body1'>{create_account_sentences.CreateAccountDescription[language]}</Typography>
      </>
      {successMessage && (
        <Alert variant="outlined" severity="success" 
        sx={{
          mt: 3, 
          backgroundColor: theme => theme.palette.success.light, 
          borderColor: theme => theme.palette.success.main, 
          color: theme => theme.palette.success.main,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        icon={<CheckCircleOutlineOutlined fontSize="large" />}
        >
          <Typography variant='h3'>{successMessage}</Typography>
        </Alert>
      )}
      {!successMessage && (
        <Typography component="form" sx={{flexGrow: 1,display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "space-between", gap: 2, mt: 2}} onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <InputLabel htmlFor="PhoneNumber">{create_account_sentences.PhoneNumber[language]}<span>*</span></InputLabel>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <>
                <MuiPhone
                  defaultCountry="sd"
                  value={field.value ?? ""}
                  withCountries={false}
                  onChange={(value) => field.onChange(value ?? "")}
                />
                {errors.phoneNumber && (
                  <FormHelperText>
                    {errors.phoneNumber.message}
                  </FormHelperText>
                )}
              </>
            )}
          />
          {failedMessage && (
            <Alert variant="outlined" severity="error" sx={{mt: 3, backgroundColor: theme => theme.palette.error.light, borderColor: theme => theme.palette.error.main, color: theme => theme.palette.error.main}}>
              {failedMessage}
            </Alert>
          )}
        </Box>
        <Box>
          <Box> 
            <Checkbox {...register("Agree")} aria-label='Terms & Conditions and Privacy Policy' sx={{p:0, marginInlineEnd: 1}} />
            <FormLabel>{create_account_sentences.IAgreeTo[language]} <CustomLinkButton variant='text' onClick={handleOpenTermsAndConditions}>{create_account_sentences.TermsAndConditions[language]}</CustomLinkButton> {create_account_sentences.And[language]} <CustomLinkButton variant='text' onClick={handleOpenPrivacyPolicy}>{create_account_sentences.PrivacyPolicy[language]}</CustomLinkButton></FormLabel>
            {errors.Agree && (
              <FormHelperText>
                {errors.Agree.message}
              </FormHelperText>
            )}
          </Box>
          <Button type='submit' variant='contained' loading={isCheckingHasAccount || isChecking}
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
          >{create_account_sentences.ProceedToNext[language]}</Button>
          <Divider sx={{my:1.5}}>{create_account_sentences.Or[language]}</Divider>
          <Button variant='contained' color="info" sx={{width: "100%", py: 1}} onClick={() => handleLoginClick()}>{create_account_sentences.AlreadyHaveAccount[language]}</Button>
        </Box>
      </Typography>)}
    </Box>
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={isGettingAppLegal}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    </>
  )
}

export default NumberStep