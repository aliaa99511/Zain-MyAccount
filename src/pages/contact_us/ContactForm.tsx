import { Box, Button, FormHelperText, InputAdornment, InputLabel, OutlinedInput, Paper, Typography, useTheme } from '@mui/material'
import React, { useContext } from 'react';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import { contact_us_sentences } from '../../configurations/language';
import { LanguageContext } from '../../App';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const inputsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required"),

  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(
      /^(?:\+249|00249|249|0)(9|1|2|6)\d{8}$/,
      "Please enter a valid Sudan phone number"
    ),

  subject: z
    .string()
    .trim()
    .min(1, "Subject is required"),

  body: z
    .string()
    .trim()
    .min(11, "Body must be at least 11 characters"),
});

type Inputs = {
  fullName: string,
  phoneNumber: string,
  subject: string,
  body: string,
}

function ContactForm():React.ReactElement {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(inputsSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "Mahmoud Abdelaal",
      phoneNumber: "0912345678",
      subject: "",
      body: "",
    }
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

  return (
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
        <Box >
          <InputLabel htmlFor="PhoneNumber">{contact_us_sentences.SendMessagePhoneNumber[language]}<span>*</span></InputLabel>
          <OutlinedInput 
            className='important'
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
          <Button type='submit' variant='contained' 
          sx={{
            width: "100%", 
            py: 1, 
            background: `linear-gradient(90deg, #953193 0%, ${theme.palette.primary.light} 100%)`,
            "&:disabled, &.disabled": {
              background: "#A3A3A3",
              color: "#FAFAFA",
            }
          }}
        >{contact_us_sentences.SendMessageButtonText[language]}</Button>
        </Box>
      </Typography>
    </Paper>
  )
}

export default ContactForm;