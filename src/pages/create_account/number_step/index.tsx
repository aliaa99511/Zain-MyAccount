import { Box, Button, Checkbox, Divider, FormHelperText, FormLabel, InputAdornment, InputLabel, OutlinedInput, styled, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { LanguageContext } from '../../../App';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { create_account_sentences } from '../../../configurations/language';

const inputsSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(
      /^(?:\+249|00249|249|0)(9|1|2|6)\d{8}$/,
      "Incorrect Number, check your input"
    ),
  Agree: z.boolean().refine((value) => value === true, {
    message: "You must agree to the Terms & Conditions and Privacy Policy",
  }),
});

type Inputs = {phoneNumber: string, Agree: boolean} 

const CustomLinkButton = styled(Button)(() => ({
  color: "#0153A5", 
  textDecoration: "underline", 
  padding:0, 
  fontSize: "1rem",
  "&:hover": {background: "none", textDecoration: "underline"}
}))

function NumberStep():React.ReactElement {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';

  const {
      register, handleSubmit, formState: { errors },
    } = useForm<Inputs>({
      resolver: zodResolver(inputsSchema),
      mode: "onChange",
      defaultValues: { phoneNumber: "0912345678" }
    });

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

  return (
    <Box sx={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
      <>
      <Typography variant='h1'>{create_account_sentences.CreateAccountTitle[language]}</Typography>
      <Typography variant='body1'>{create_account_sentences.CreateAccountDescription[language]}</Typography>
      </>
      <Typography component="form" sx={{flexGrow: 1,display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "space-between", gap: 2, mt: 2}} onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <InputLabel htmlFor="PhoneNumber">{create_account_sentences.PhoneNumber[language]}<span>*</span></InputLabel>
          <OutlinedInput 
            id="PhoneNumber" 
            {...register("phoneNumber")}
            placeholder='9xxxxxxxxx'
            error={!!errors.phoneNumber}
            sx={{ width: "100%" }}
            startAdornment={<InputAdornment position="start" sx={{color: "#5C1E5B"}}><SmartphoneOutlinedIcon fontSize='small' /> <span style={{marginTop: 4}}>+249</span></InputAdornment>} 
          />
          {errors.phoneNumber && (
            <FormHelperText>
              {errors.phoneNumber.message}
            </FormHelperText>
          )}
        </Box>
        <Box>
          <Box> 
            <Checkbox {...register("Agree")} aria-label='Terms & Conditions and Privacy Policy' sx={{p:0, marginInlineEnd: 1}} />
            <FormLabel>{create_account_sentences.IAgreeTo[language]} <CustomLinkButton variant='text'>{create_account_sentences.TermsAndConditions[language]}</CustomLinkButton> {create_account_sentences.And[language]} <CustomLinkButton variant='text'>{create_account_sentences.PrivacyPolicy[language]}</CustomLinkButton></FormLabel>
            {errors.Agree && (
              <FormHelperText>
                {errors.Agree.message}
              </FormHelperText>
            )}
          </Box>
          <Button type='submit' variant='contained' 
            sx={{
              width: "100%", 
              py: 1, 
              mt: 1.5,
              background: (theme) => `linear-gradient(90deg, #953193 0%, ${theme.palette.primary.light} 100%)`,
              "&:disabled, &.disabled": {
                background: "#A3A3A3",
                color: "#FAFAFA",
              }
            }}
          >{create_account_sentences.ProceedToNext[language]}</Button>
          <Divider sx={{my:1.5}}>{create_account_sentences.Or[language]}</Divider>
          <Button type='submit' variant='contained' color="info" sx={{width: "100%", py: 1}}>{create_account_sentences.AlreadyHaveAccount[language]}</Button>
        </Box>
      </Typography>
    </Box>
  )
}

export default NumberStep