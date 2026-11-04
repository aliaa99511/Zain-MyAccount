import { useContext, useEffect, useState } from 'react'
import OTP from '../../shared/Auth/OTP'
import { useLogin } from '../../shared/Auth/login/useLogin';
import { useGenerateLoginOTPMutation, useValidateLoginOTPMutation } from '../../store';
import { Typography } from '@mui/material';
import { login_sentences } from '../../configurations/language';
import { LanguageContext } from '../../App';
import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router';
import SecurityQuestion from './SecurityQuestion';

type StepsTypes = "Password" | "SecuirtyQuestion" | "OTP";

function LoginWithOTP() {
  const { identifier, rememberMe } = useLogin();
  const {login} = useAuth();
  const navigate = useNavigate();
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  //, {isLoading: isGeneratingOTP}
  const [generateLoginOTP, { data: generatedOTPData }] = useGenerateLoginOTPMutation();
  const [validateLoginOTP, { data: validatedOTPData }] = useValidateLoginOTPMutation();

  const [step, setStep] = useState<StepsTypes>("OTP");

  useEffect(() => {
    if (identifier && language) {
      generateLoginOTP({ userName: identifier.replace("+249", ""), rememberMe });
    }
  }, [])
  const handleGenerateOtp = async () => {
    if (!identifier) {
        throw new Error("Phone number is missing.");
    }
    const response = await generateLoginOTP({
        userName: identifier.replace("+249", ""),
        rememberMe,
    }).unwrap();
    if (
        !response.succeeded ||
        (response.result?.status &&
            response.result.status !== "OtpRequired")
    ) {
        throw new Error(
            response[`message${language}`] ??
            login_sentences.OtpSendError[language]
        );
    }
    return response;
  };
  const handleValidateOtp = async (code: string) => {
    const response = await validateLoginOTP({ code }).unwrap();
    console.log(response)
    try {
      if (response?.succeeded) {
        if (response?.result?.status == "Completed") {
          login(response?.result?.accessToken ?? "");
          navigate("/dashboard");
        }
        else if(response?.result?.status == "SecurityQuestion") {
          setStep("SecuirtyQuestion");
        }
      }
    }
    catch {
      console.error(login_sentences.LoginFailedErrorOccurred[language]);
    }
    return response;
  };
  // const onSuccess = () => {
  //   console.log(validatedOTPData);
  //     try {
  //         if (validatedOTPData?.succeeded) {
  //             if (validatedOTPData?.result?.status == "Completed") {
  //                 login(validatedOTPData?.result?.accessToken ?? "");
  //                 navigate("/dashboard");
  //             }
  //             else if(validatedOTPData?.result?.status == "SecurityQuestion") {
  //                 setStep("SecuirtyQuestion");
  //             }
  //         }
  //     }
  //     catch {
  //         console.error(login_sentences.LoginFailedErrorOccurred[language]);
  //     }
  // };

  return (
    <>
      {
        step === "OTP"?
        <OTP
          phoneNumber={identifier}
          onSuccess={()=>{}}
          SectionTitle={<Typography variant='h1'>{login_sentences.EnterReceivedOTP[language]}</Typography>}
          SectionDescription={<Typography variant='body1'>{login_sentences.EnterReceivedOTPDescription[language]}</Typography>}
          SubmitBtnText={login_sentences.LoginToAccount[language]}
          firstResult={generatedOTPData?.result}
          onGenerateOTP={handleGenerateOtp}
          onValidateOTP={handleValidateOtp}
        />
        : ""
      }
      {step === "SecuirtyQuestion"? <SecurityQuestion question={validatedOTPData?.result?.question} /> : ""}
    </>
  )
}

export default LoginWithOTP