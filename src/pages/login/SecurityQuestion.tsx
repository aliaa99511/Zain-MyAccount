import { Box, Button, FormHelperText, InputLabel, OutlinedInput, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { login_sentences } from '../../configurations/language'
import { LanguageContext } from '../../App';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useCheckSecuirtyQuestionAnswerMutation } from '../../store';
import CustomAlert from '../../shared/CustomAlert';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/useAuth';

type StepsTypes = "Password" | "SecuirtyQuestion" | "OTP";
interface Input {
  security_question: string
}
interface SecurityQuestionProps {
  question?: {
    text?: string, 
    step?: number, 
    totalRequired?: number
  },
  onSuccess?: (arg0: StepsTypes) => void,
}
function SecurityQuestion({question, onSuccess}: SecurityQuestionProps) {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? "En";
  const {login} = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const [alert, setAlert] = useState({
      message: "",
      type: "",
  });
  const [checkSecuirtyQuestionAnswer, {isLoading}] = useCheckSecuirtyQuestionAnswerMutation();

  const {register, handleSubmit, setError, reset, formState: { errors }} = useForm<Input>({
      mode: "onChange",
      defaultValues: {
        security_question: "",
      }
    });
  
  const onSubmit: SubmitHandler<Input> = async (data) => {
    if(data.security_question.trim().length == 0) {
      setError("security_question", {message: "Please enter question answer"});
      return;
    }
    try {
      const response = await checkSecuirtyQuestionAnswer({answer: data.security_question}).unwrap();
      if(response.succeeded && response.result.status === "Completed") {
        login(response.result.accessToken);
        navigate("/dashboard");
      }
      else if(response.succeeded && response.result.status === "SecurityQuestion") {
        setCurrentQuestion({...response.result.question});
        reset();
      }
      else if(response.succeeded && response.result.status === "OtpRequired") {
        onSuccess?.("OTP");
      }
      else if(!response.succeeded) {
        setAlert({message: response?.[`message${language}`] ?? login_sentences.LoginFailedErrorOccurred[language], type: "error"});
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      }
    } catch {
      setAlert({message: login_sentences.LoginFailedErrorOccurred[language], type: "error"});
    }
  }

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      <Typography variant='h1'>{login_sentences.SecurityQuestionTitle[language]}</Typography>
      <Typography variant='body1'>{login_sentences.SecurityQuestionDescription[language]}</Typography>
      <Box component="form" noValidate
        sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 3,
            mt: 3,
        }} 
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box>
          <InputLabel htmlFor="SecurityQuestion">{currentQuestion?.text}</InputLabel>
          <OutlinedInput {...register("security_question")} id="SecurityQuestion" sx={{width: "100%"}} />
          {errors.security_question && (
            <FormHelperText>
              {errors.security_question.message}
            </FormHelperText>
          )}
          {alert.message && (
              <CustomAlert alert={alert} />
          )}
        </Box>
        <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
                py: 1.2,
                background: (theme) =>
                    `linear-gradient(90deg, #953193 0%, ${theme.palette.primary.light} 100%)`,
                "&:disabled, &.disabled": {
                    background: "#A3A3A3",
                    color: "#FAFAFA",
                    "&.MuiButton-loading": {
                    color: "transparent",
                    }
                }
            }}
            loading = {isLoading}
        >
            {currentQuestion?.step === (currentQuestion?.totalRequired ?? 3 - 1) ? login_sentences.SendOTP[language] : login_sentences.NextQuestion[language]}
        </Button>
      </Box>
    </Box>
  )
}

export default SecurityQuestion