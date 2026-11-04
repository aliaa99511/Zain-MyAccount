
import React, { useCallback, useContext, useState } from "react";
import { Box, Step, StepLabel, Stepper, useMediaQuery, useTheme } from "@mui/material";
import NumberStep from "./number_step";
import OTPStep from "./otp_step";
import CreatePassword from "./createPassword_Step";
import SecurityQuestionsStep from "./SecurityQuestions_Step";
import { create_account_sentences } from "../../configurations/language";
import { LanguageContext } from "../../App";
import { useCreateIsUserMutation } from "../../store/apis/create_account_api";

type SecurityAnswer = {
  questionSetId: string;
  questionId: string;
  question: string;
  answer: string;
};

function CreateAccount(): React.ReactElement {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? "En";
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [securityAnswers, setSecurityAnswers] = useState<SecurityAnswer[]>([]);

  const [activeStep, setActiveStep] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  const [createIsUser, { isLoading: isCreatingAccount }] = useCreateIsUserMutation();

  const handleNext = useCallback(() => {
    setActiveStep((prev) => prev + 1);
  }, []);

  const handleSecurityQuestionsNext = (answers: SecurityAnswer[]) => {
    setSecurityAnswers(answers);
    handleNext();
  };

  const handleCreateAccount = async (newPassword: string) => {
    setApiError(null);

    try {
      const response = await createIsUser({
        userName: phoneNumber.replace("+249", ""),
        password: newPassword,
        answers: securityAnswers,
      }).unwrap();

      console.log("Account created successfully", response);

    } catch (error) {
      console.error(error)
    }
  };

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel={isSmallScreen} sx={{ mb: 3, "& .Mui-completed .MuiSvgIcon-root": { color: "success.main" } }}>
        {create_account_sentences.CreateAccountSteps[language].map(
          (label, index, steps) => (
            <Step
              key={label}
              sx={
                index === 0 || index === steps.length - 1
                  ? { p: 0 }
                  : {}
              }
            >
              <StepLabel>{label}</StepLabel>
            </Step>
          )
        )}
      </Stepper>

      {apiError && (
        <Box role="alert" sx={{ color: "error.main", mb: 2 }}>
          {apiError}
        </Box>
      )}

      {activeStep === 0 && (
        <NumberStep
          handleNext={handleNext}
          setPhoneNumber={setPhoneNumber}
        />
      )}

      {activeStep === 1 && (
        <SecurityQuestionsStep
          onNext={handleSecurityQuestionsNext}
        />
      )}

      {activeStep === 2 && (
        <OTPStep
          onSuccess={handleNext}
          phoneNumber={phoneNumber}
        />
      )}

      {activeStep === 3 && (
        <CreatePassword
          phoneNumber={phoneNumber}
          onNext={handleCreateAccount}
          isCreatingAccount={isCreatingAccount}
        />
      )}
    </>
  );
}

export default CreateAccount;
