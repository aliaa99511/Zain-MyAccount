import { Box, Grid, IconButton, Skeleton, Stack, styled, Typography } from '@mui/material'
import React, { useContext } from 'react';
import { contact_us_sentences } from '../../configurations/language';
import { LanguageContext } from '../../App';
import { useGetContactUsInforamtionQuery } from '../../store';
import FailedIcon from '../../shared/icons/Failed';
import { useDialog } from '../../shared/dialog/hooks/useDialog';

const CustomBox = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: theme.spacing(3),
  background: `linear-gradient(
    180deg,
    #953193 0%,
    ${theme.palette.primary.light} 100%
  )`,
  borderRadius: "0.75rem",
  color: "#FAFAFA",
}));

function ContactInformation():React.ReactElement {
  const { confirm } = useDialog();
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  const { data: ContactUsInfo, isFetching: isInforamtionLoading, isError: isInforamtionError } = useGetContactUsInforamtionQuery("B2C");


  if (isInforamtionLoading) {
    return (<CustomBox>
      <Box>
        <Skeleton animation="wave" sx={{ width: '100%', height: "36px" }} />
        <Skeleton animation="wave" sx={{ width: '100%', height: "56px"}} />
        <Stack sx={{mt:3}} spacing={1.5} >
          {Array.from({ length: 5 }).map(() => (
            <Skeleton animation="wave" sx={{ width: '100%', height: "30px"}} />
          ))}
        </Stack>
      </Box>
      <Grid container>
        {Array.from({ length: 8 }).map(() => (
          <Grid size="grow">
            <Skeleton variant="circular" animation="wave" width={40} height={40} />
          </Grid>
        ))}
      </Grid>
    </CustomBox>)
  }
  if (!isInforamtionLoading && isInforamtionError && !ContactUsInfo?.succeeded) {
    return (<CustomBox sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <FailedIcon sx={{ fontSize: "5rem" }} />
      <Typography variant='h6' sx={{ textAlign: "center", mt: 3 }}>An error occurred while retrieving the contact information. Please try again later</Typography>
    </CustomBox>)
  }
  return (
    <CustomBox>
      <Box>
        <Box>
          <Typography variant='h2'>{ContactUsInfo?.result["title" + language]}</Typography>
          <Typography variant='body1'>{ContactUsInfo?.result["subTitle" + language]}</Typography>
        </Box>
        <Stack sx={{ mt: 3 }} spacing={1.5} >
          {ContactUsInfo?.result?.contactItems?.map(item => (
            <Typography variant='body2'><img src={item.iconDataUri} style={{marginInlineEnd: "8px", marginBottom: "2px"}} /> <span>{item["header"+language]}</span>:&nbsp;<span dir="ltr">{item["value"+language]}</span></Typography>
          ))}
        </Stack>
      </Box>
        <Grid container sx={{mt:3, pt: "1.25rem", borderTop: "1px solid #FAFAFA"}}>
          {ContactUsInfo?.result?.socialMediaItems?.map(item => (
            <Grid size="grow">
              <IconButton 
                sx={{p:0}} 
                onClick={async() => {
                  const confirmed = await confirm({
                    title: contact_us_sentences.ContactInformationConfirmTitle[language],
                    description: contact_us_sentences.ContactInformationConfirmDescription[language],
                    confirmText: contact_us_sentences.ContactInformationConfirmButton[language],
                    confirmColor: "info",
                  });
                  if (!confirmed) {
                    return;
                  }
                  window.open(item.link, "_self", "noopener,noreferrer");
                }}
              >
                <img src={item.iconDataUri} style={{marginInlineEnd: "8px", marginBottom: "2px"}} />
              </IconButton>
            </Grid>
          ))}
        </Grid>
    </CustomBox>
  )
}

export default ContactInformation