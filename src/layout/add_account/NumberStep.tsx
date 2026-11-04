import React, { useContext } from 'react'
import { PhoneNumberUtil } from 'google-libphonenumber';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { LanguageContext } from '../../App';
import { Backdrop, Box, Button, CircularProgress, FormHelperText, Grid, InputLabel, Typography } from '@mui/material';
import { layout_sentences } from '../../configurations/language';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import CustomAlert from '../../shared/CustomAlert';
import { MuiPhone } from '../../shared/MuiPhone';


const phoneUtil = PhoneNumberUtil.getInstance();

const inputsSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required"),
}).superRefine(({phoneNumber}, ctx) => {
  let isPhoneNumberValid = true;
  if(!phoneNumber)return;
  try {
    isPhoneNumberValid =  phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phoneNumber));
  }
  catch{isPhoneNumberValid = false}
  finally {
    if (!isPhoneNumberValid) {
      ctx.addIssue({
        code: "custom",
        path: ["phoneNumber"],
        message: "Please enter a valid Sudan phone number",
      });
    }
  }

});

type Inputs = {phoneNumber: string} 
interface Props {
  setPhoneNumber: (string) => void;
  onSuccess: () => void;
  onClose: () => void;
}

function NumberStep({setPhoneNumber, onSuccess, onClose}: Props) {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  const {
      handleSubmit, control, formState: { errors }, 
    } = useForm<Inputs>({
      resolver: zodResolver(inputsSchema),
      mode: "onBlur",
      reValidateMode: "onChange",
      defaultValues: { phoneNumber: "" }
  });
  //setFailedMessage
  const [failedMessage] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<Inputs> = () => {
    onSuccess?.();
  }

  return (
    <>
    <Box sx={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
          <Typography variant='h3'>{layout_sentences.AddAccountTitle[language]}</Typography>
          <Typography variant='body1' sx={{color: theme => theme.palette.text.secondary}}>{layout_sentences.AddAccountDescription[language]}</Typography>
          <Typography component="form" sx={{flexGrow: 1,display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "space-between", gap: 2, mt: 2}} onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <InputLabel htmlFor="PhoneNumber">{layout_sentences.PhoneNumber[language]}<span>*</span></InputLabel>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <>
                    <MuiPhone
                      defaultCountry="sd"
                      value={field.value ?? ""}
                      withCountries={false}
                      onChange={(value) => {field.onChange(value ?? ""); setPhoneNumber(value ?? "")}}
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
                <CustomAlert alert={{message: failedMessage, type:"error"}} />
              )}
            </Box>
            <Grid container columnSpacing={2} sx={{mt: 1.5}}>
              <Grid size={{xs: 12, md: 'grow'}}>
                <Button type='submit' variant='contained'  //loading={isCheckingHasAccount || isChecking}
                  sx={{
                    width: "100%",
                    py: 1, 
                    background: (theme) => `linear-gradient(90deg, #953193 0%, ${theme.palette.primary.light} 100%)`,
                    "&:disabled, &.disabled": {
                      background: "#A3A3A3",
                      color: "#FAFAFA",
                      "&.MuiButton-loading": {
                        color: "transparent",
                      }
                    }
                  }}
                >{layout_sentences.AddAccountSendOTP[language]}</Button>
              </Grid>
              <Grid size={{xs: 12, md: 'grow'}}>
                <Button 
                  variant="contained" 
                  color='info' 
                  sx={{width: "100%"}}
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Typography>
    </Box>
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={false} //isGettingAppLegal}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    </>
  )
}

export default NumberStep