import { Alert, Box, Button, FormHelperText, Grid, InputAdornment, InputLabel, OutlinedInput, Paper, Snackbar, Typography, useTheme } from '@mui/material'
import React, { useContext, useMemo, useState } from 'react';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { contact_us_sentences } from '../../configurations/language';
import { LanguageContext } from '../../App';
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PhoneNumberUtil } from 'google-libphonenumber';
import { MuiPhone } from '../../shared/MuiPhone';
import { EmailOutlined } from '@mui/icons-material';
import { useLazySendMessageQuery } from '../../store';

const MAX_SUBJECT_LENGTH = 64;
const MAX_BODY_LENGTH = 255;
const phoneUtil = PhoneNumberUtil.getInstance();

const getInputsSchema = (language: "Ar" | "En") => 
  z.object({
    fullName: z
      .string()
      .trim()
      .min(1, contact_us_sentences.FullNameRequired[language]),

    phoneNumber: z
      .string()
      .trim()
      .min(5, contact_us_sentences.PhoneNumberRequired[language]),

    additionalPhoneNumber: z
      .string()
      .optional(),

    email: z.string().trim().min(1, contact_us_sentences.EmailRequired[language]).pipe(z.email(contact_us_sentences.EmailNotValid[language])),

    subject: z
      .string()
      .trim()
      .min(1, contact_us_sentences.SubjectRequired[language]).max(MAX_SUBJECT_LENGTH, contact_us_sentences.SubjectMaxLimit[language].replace("$$", String(MAX_SUBJECT_LENGTH))),

    body: z
      .string()
      .trim()
      .min(1, contact_us_sentences.BodyRequired[language]).min(11, contact_us_sentences.BodyMinLimit[language]).max(MAX_BODY_LENGTH, contact_us_sentences.BodyMaxLimit[language].replace("$$", String(MAX_BODY_LENGTH))),
    
  }).superRefine(({phoneNumber, additionalPhoneNumber}, ctx) => {
    if(!additionalPhoneNumber)return;
    let isAdditionalValid = true, isPhoneNumberValid = true;
    try {
      isAdditionalValid = phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(additionalPhoneNumber));
    }
    catch {isAdditionalValid = false}
    finally {
      if (!isAdditionalValid && additionalPhoneNumber.length > 5) {
        ctx.addIssue({
          code: "custom",
          path: ["additionalPhoneNumber"],
          message: contact_us_sentences.AdditionalPhoneNumberInvalid[language],
        });
      }
    }
  
  if(!phoneNumber)return;
  try {
    isPhoneNumberValid = phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phoneNumber))
  }
  catch{isPhoneNumberValid = false}
  finally {
    if (!isPhoneNumberValid) {
      ctx.addIssue({
        code: "custom",
        path: ["phoneNumber"],
        message: contact_us_sentences.PhoneNumberInvalid[language],
      });
    }
  }

});



type Inputs = {
  fullName: string,
  additionalPhoneNumber?: string,
  phoneNumber: string,
  email: string,
  subject: string,
  body: string,
}

function ContactForm():React.ReactElement {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  const theme = useTheme();
  const [openAlert, setOpenAlert] = useState(false);
  const [failedMessage, setFailedMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const [sendMessage, {isFetching: isSending}] = useLazySendMessageQuery();

  const inputsSchema = useMemo(
    () => getInputsSchema(language),
    [language]
  );


  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(inputsSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "Mahmoud Abdelaal",
      additionalPhoneNumber: "",
      phoneNumber: "",
      email: "",
      subject: "",
      body: "",
    }
  });

  const handleClose = () => {
    setOpenAlert(false);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await sendMessage(data).unwrap();
      setFailedMessage(null);
      setOpenAlert(true);
      setSuccessMessage(contact_us_sentences.SubmittedSuccessfully[language]);
      reset();
    } catch {
      setSuccessMessage(null);
      setOpenAlert(true);
      setFailedMessage(contact_us_sentences.SubmiteFailed[language])
    }
  }

  return (
    <>
    <Paper>
      <Typography variant='h2'>{contact_us_sentences.SendMessageTitle[language]}</Typography>
      <Typography variant='body1'>{contact_us_sentences.SendMessageDescription[language]}</Typography>
      <Typography 
        component="form" 
        sx={{display: "flex", flexDirection: "column", alignItems: "stretch", gap: 2, mt: 3}}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box>
          <InputLabel htmlFor="FullName">{contact_us_sentences.SendMessageFullName[language]}<span>*</span></InputLabel>
          <OutlinedInput 
            className='important'
            id="FullName" 
            {...register("fullName")}
            placeholder={contact_us_sentences.SendMessageFullNamePlaceholder[language]}
            error={!!errors.fullName}
            sx={{ width: "100%" }}
            startAdornment={<InputAdornment position="start"><PersonOutlineOutlinedIcon fontSize='small' sx={{color: "#181818"}} /></InputAdornment>}  
          />
          {errors.fullName && (
            <FormHelperText>
              {errors.fullName.message}
            </FormHelperText>
          )}
        </Box>
        <Grid container columnSpacing={1.5}>
          <Grid size="grow">
            <Box>
              <InputLabel htmlFor="PhoneNumber">{contact_us_sentences.SendMessagePhoneNumber[language]}<span>*</span></InputLabel>
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
            </Box>
          </Grid>
          <Grid size="grow">
            <Box >
              <InputLabel htmlFor="additionalPhoneNumber">{contact_us_sentences.SendMessageAdditionalPhoneNumber[language]}</InputLabel>
              <Controller
                name="additionalPhoneNumber"
                control={control}
                render={({ field }) => (
                  <>
                    <MuiPhone
                      defaultCountry="sd"
                      value={field.value ?? ""}
                      withCountries={true}
                      onChange={(value) => field.onChange(value ?? "")}
                    />
                    {errors.additionalPhoneNumber && (
                      <FormHelperText>
                        {errors.additionalPhoneNumber.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </Box>
          </Grid>
        </Grid>
        <Box >
          <InputLabel htmlFor="EmailAddress">{contact_us_sentences.SendMessageEmailAddress[language]}<span>*</span></InputLabel>
          <OutlinedInput id="EmailAddress" {...register("email")} error={!!errors.email} placeholder="name@example.com" 
          startAdornment={<InputAdornment position="start" sx={{color: "#5C1E5B"}}><EmailOutlined fontSize='small' /></InputAdornment>}
          sx={{width: "100%"}} />
          {errors.email && (
            <FormHelperText>
              {errors.email.message}
            </FormHelperText>
          )}
        </Box>
        <Box >
          <InputLabel htmlFor="Subject">{contact_us_sentences.SendMessageSubject[language]}<span>*</span></InputLabel>
          <OutlinedInput id="Subject" {...register("subject")} error={!!errors.subject} placeholder={contact_us_sentences.SendMessageSubjectPlaceholder[language]} 
          sx={{width: "100%"}} />
          {errors.subject && (
            <FormHelperText>
              {errors.subject.message}
            </FormHelperText>
          )}
        </Box>
        <Box >
          <InputLabel htmlFor="Body">{contact_us_sentences.SendMessageBody[language]}<span>*</span></InputLabel>
          <OutlinedInput id="Body" {...register("body")} error={!!errors.body} placeholder={contact_us_sentences.SendMessageBodyPlaceholder[language]} multiline minRows={2} sx={{width: "100%", py: 0}} />
          {errors.body && (
            <FormHelperText>
              {errors.body.message}
            </FormHelperText>
          )}
        </Box>
        <Box>
          <Button type='submit' variant='contained' loading={isSending}
          sx={{
            width: "100%", 
            py: 1, 
            background: `linear-gradient(90deg, #953193 0%, ${theme.palette.primary.light} 100%)`,
            "&:disabled, &.disabled": {
              background: "#A3A3A3",
              color: "#FAFAFA",
              "&.MuiButton-loading": {
                color: "transparent",
              }
            }
          }}
        >{contact_us_sentences.SendMessageButtonText[language]}</Button>
        </Box>
      </Typography>
    </Paper>
    <Snackbar
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      open={openAlert}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={successMessage? "success" : "error"}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {successMessage || failedMessage}
      </Alert>
    </Snackbar>
    </>
  )
}

export default ContactForm;