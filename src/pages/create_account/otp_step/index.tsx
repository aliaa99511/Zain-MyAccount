import React, { useContext, useEffect } from "react";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { otp_sentences, create_account_sentences } from "../../../configurations/language";
import { LanguageContext } from "../../../App";
import { useGenerateOTPMutation, useValidateOTPMutation } from "../../../store";
import OTP from "../../../shared/Auth/OTP";


function OTPStep({ phoneNumber, onSuccess }: { phoneNumber: string, onSuccess?: () => void }): React.ReactElement {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';

  const [validateOTP] = useValidateOTPMutation();
  const [generateOTP, { data: generatedData, isLoading: isGeneratingOTP }] = useGenerateOTPMutation();


  useEffect(() => {
    if (phoneNumber && language) {
      generateOTP({ number: phoneNumber.replace("+", ""), language: language.toLowerCase() });
    }
  }, [])

  return (
    <>
      {!isGeneratingOTP && generatedData && (<OTP
        phoneNumber={phoneNumber}
        onSuccess={onSuccess}
        generateOTP={generateOTP}
        validateOTP={validateOTP}
        SectionTitle={<Typography variant='h1'>{otp_sentences.EnterReceivedOTP[language]}</Typography>}
        SectionDescription={<Typography variant='body1'>{otp_sentences.EnterReceivedOTPDescription[language]}</Typography>}
        SubmitBtnText={create_account_sentences.ProceedToNext[language]}
        firstResult={generatedData?.result}
      />)}
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isGeneratingOTP}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );

}

export default OTPStep