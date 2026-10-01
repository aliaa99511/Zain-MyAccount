import { Box, Grid, IconButton, Skeleton, Stack, styled, Typography } from '@mui/material'
import React, { useContext } from 'react';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
// import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
// import { contact_us_sentences } from '../../configurations/language';
import { LanguageContext } from '../../App';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';
import ThreadsIcon from '../../shared/icons/Threads';
import TiktokIcon from '../../shared/icons/Tiktok';
import { useGetContactUsInforamtionQuery } from '../../store';
import FailedIcon from '../../shared/icons/Failed';

const SocialIcons = {
  Facebook: <FacebookOutlinedIcon />,
  X: <XIcon />,
  Instagram: <InstagramIcon />,
  LinkedIn: <LinkedInIcon />,
  TikTok: <TiktokIcon />,
  Threads: <ThreadsIcon />,
  YouTube: <YouTubeIcon />,
  Telegram: <TelegramIcon />,
}

const CustomBox = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: theme.spacing(3),
  background:`linear-gradient(
    180deg,
    #953193 0%,
    ${theme.palette.primary.light} 100%
  )`,
  borderRadius: "0.75rem",
  color: "#FAFAFA",
}));

function ContactInformation():React.ReactElement {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  const {data: ContactUsInfo, isFetching: isInforamtionLoading, isError: isInforamtionError} = useGetContactUsInforamtionQuery("B2C");


  if(isInforamtionLoading) {
    return (<CustomBox>
      {/* <CircularProgress sx={{color: "#FAFAFA"}} aria-label="Loading…" /> */}
      <Box>
        <Skeleton animation="wave" sx={{ width: '100%', height: "36px" }} />
        <Skeleton animation="wave" sx={{ width: '100%', height: "56px"}} />
        <Stack sx={{mt:3}} spacing={1.5} >
          <Skeleton animation="wave" sx={{ width: '100%', height: "30px"}} />
          <Skeleton animation="wave" sx={{ width: '100%', height: "30px"}} />
          <Skeleton animation="wave" sx={{ width: '100%', height: "30px"}} />
          <Skeleton animation="wave" sx={{ width: '100%', height: "30px"}} />
          <Skeleton animation="wave" sx={{ width: '100%', height: "30px"}} />
        </Stack>
      </Box>
      <Grid container>
        <Grid size="grow">
          <Skeleton variant="circular" animation="wave" width={40} height={40} />
        </Grid>
        <Grid size="grow">
          <Skeleton variant="circular" animation="wave" width={40} height={40} />
        </Grid>
        <Grid size="grow">
          <Skeleton variant="circular" animation="wave" width={40} height={40} />
        </Grid>
        <Grid size="grow">
          <Skeleton variant="circular" animation="wave" width={40} height={40} />
        </Grid>
        <Grid size="grow">
          <Skeleton variant="circular" animation="wave" width={40} height={40} />
        </Grid>
        <Grid size="grow">
          <Skeleton variant="circular" animation="wave" width={40} height={40}  />
        </Grid>
        <Grid size="grow">
          <Skeleton variant="circular" animation="wave" width={40} height={40}  />
        </Grid>
        <Grid size="grow">
          <Skeleton variant="circular" animation="wave" width={40} height={40}  />
        </Grid>
      </Grid>
    </CustomBox>)
  }
  if(!isInforamtionLoading && isInforamtionError && !ContactUsInfo?.succeeded) {
    return (<CustomBox sx={{display: "flex", alignItems: "center", justifyContent:"center"}}>
      <FailedIcon sx={{fontSize: "5rem"}} />
      <Typography variant='h6' sx={{textAlign: "center", mt: 3}}>An error occurred while retrieving the contact information. Please try again later</Typography>
    </CustomBox>)
  }
  return (
    <CustomBox>
      <Box>
        <Box>
        <Typography variant='h2'>{ContactUsInfo?.result["title"+language]}</Typography>
        <Typography variant='body1'>{ContactUsInfo?.result["subTitle"+language]}</Typography>
        </Box>
        <Stack sx={{mt:3}} spacing={1.5} >
          {ContactUsInfo?.result?.contactItems?.map(item => (
            <Typography variant='body2'><PhoneOutlinedIcon fontSize='small' sx={{marginInlineEnd: 1}} /> <span>{item["header"+language]}</span>:&nbsp;<span dir="ltr">{item["value"+language]}</span></Typography>
          ))}
          {/* <Typography variant='body2'><PhoneOutlinedIcon fontSize='small' sx={{marginInlineEnd: 1}} /> <span>{ContactUsInfo?.result?.contactItems[0]["header"+language]}</span>:&nbsp;<span>{ContactUsInfo?.result?.contactItems[0]["value"+language]}</span></Typography>
          <Typography variant='body2'><PhoneOutlinedIcon fontSize='small' sx={{marginInlineEnd: 1}}/> From Sudan: 123</Typography>
          <Typography variant='body2'><WhatsAppIcon fontSize='small' sx={{marginInlineEnd: 1}}/> 091 234 5678</Typography>
          <Typography variant='body2'><MailOutlinedIcon fontSize='small' sx={{marginInlineEnd: 1}}/> info@sd.zain.com</Typography>
          <Typography variant='body2'><LanguageOutlinedIcon fontSize='small' sx={{marginInlineEnd: 1}}/> www.zain-sudan.com</Typography> */}
        </Stack>
      </Box>
        <Grid container sx={{mt:3, pt: "1.25rem", borderTop: "1px solid #FAFAFA"}}>
          {ContactUsInfo?.result?.socialLinks?.map(item => (
            <Grid size="grow">
              <IconButton 
                sx={{p:0}} 
                onClick={() => {
                  window.open(item.link, "_blank", "noopener,noreferrer");
                }}
              >
                {SocialIcons[item.platform]}
              </IconButton>
            </Grid>
          ))}
        </Grid>
    </CustomBox>
  )
}

export default ContactInformation