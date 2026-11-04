import { useContext } from 'react'
import OTP from '../../shared/Auth/OTP'
import { Typography } from '@mui/material'
import { layout_sentences } from '../../configurations/language'
import { LanguageContext } from '../../App';

function OTPStep({ phoneNumber }: { phoneNumber: string }) {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  return (
    <>
      <OTP
        SectionTitle={<Typography variant='h3'>{layout_sentences.EnterReceivedOTP[language]}</Typography>}
        SectionDescription={<Typography variant='body1'>{layout_sentences.ReceivedOTPDescription[language]}</Typography>}
        SubmitBtnText={layout_sentences.AddAccountSubmitText[language]}
        phoneNumber={phoneNumber}
      />
    </>
  )
}

export default OTPStep