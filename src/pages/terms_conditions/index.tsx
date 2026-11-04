import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { LanguageContext } from "../../App";
import { useLazyGetAppLegalPagesQuery } from "../../store";
import { general_sentences } from "../../configurations/language";

function TermsConditions() {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  const [getAppLegal, {data, isFetching: isGettingAppLegal}] = useLazyGetAppLegalPagesQuery();

  useEffect(() => {
    getAppLegal({type: 0}, true);
  },[getAppLegal])
  
  return (
    <>
      <Typography variant='h2' sx={{marginBottom: 2}}>{general_sentences.TermsConditions[language]}</Typography>
      {data?.result.map(item => (
      <Box sx={{marginBottom: 2}}>
        <Typography variant='h6' sx={{marginBottom: 0}}>{item[`title${language}`]}</Typography>
        <Typography variant='body2'>{item[`content${language}`]}</Typography>
      </Box>
      ))}
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isGettingAppLegal}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

    </>
  )
}

export default TermsConditions