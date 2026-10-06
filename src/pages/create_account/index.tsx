import React, { useContext } from 'react'
import CreateAccountImg from "../../assets/imgs/create_account.png"
import { Box, Grid, Paper, Step, StepLabel, Stepper } from '@mui/material'
import NumberStep from './number_step';
import { create_account_sentences } from '../../configurations/language';
import { LanguageContext } from '../../App';

function CreateAccount():React.ReactElement {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const previousActiveStepRef = React.useRef(activeStep);

  React.useEffect(() => {
    previousActiveStepRef.current = activeStep;
  }, [activeStep]);

  return (
    <Grid container sx={{height: "100vh", maxHeight: "100vh", overflow: {xs:'visible', md:'hidden'}}}>
      <Grid size="auto" sx={{height: "100vh", maxHeight: "100vh", position: "relative"}}>
        <Box 
          component="img"
          src={CreateAccountImg} 
          sx={{ 
            display: "block",
            objectFit: "cover",
            height: "100%",
            aspectRatio: {xs: "16/11",md:"7/8"},
          }} 
        />
        <Box sx={{position: "absolute", inset: 0,
          background: `linear-gradient(142.56deg, rgba(24, 24, 24, 0.5) 0%, rgba(66, 66, 66, 0) 80.29%),
linear-gradient(217.44deg, rgba(66, 66, 66, 0) 0%, rgba(24, 24, 24, 0.5) 100%)`,
        }}
        />
      </Grid>
      <Grid size={{xs:12, md:"grow"}} sx={{p:3}}>
        <Paper className='responsive-parent' sx={{boxShadow: 'none', border: '1px solid #E3E3E3', height: "100%", display: "flex", flexDirection: "column"}}>
          <Stepper activeStep={activeStep} sx={{mb: 3}}>
          {create_account_sentences.CreateAccountSteps[language].map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            return (
              <Step key={label} {...stepProps} sx={(index === 0 || index === create_account_sentences.CreateAccountSteps[language].length - 1)?{p:0}:{} }>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === 0 && (
          <NumberStep />
        )}
        </Paper>
      </Grid>
    </Grid>
  )
}

export default CreateAccount