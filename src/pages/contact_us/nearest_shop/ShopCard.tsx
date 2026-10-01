import { Box, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { LanguageContext } from '../../../App';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import MapMarkerDistanceIcon from '../../../shared/icons/MapMarkerDistance';
import { contact_us_sentences } from '../../../configurations/language';

interface Shop {
  shopId: number,
  shopNameEn: string,
  shopNameAr: string,
  nearbyLandmarksEn: string,
  nearbyLandmarksAr: string,
  latitude: number,
  longitude: number,
}
interface PropsType {
  shop: Shop
}

function ShopCard({shop}:PropsType): React.ReactElement {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  return (
    <Box sx={{
      p: 2,
      ms: 0.5,
      boxShadow: "1px 1px 8px 0px #1818181F",
      borderRadius: "12px",
    }}>
      <Box sx={{display: "flex",
      flexDirection: "column",
      gap: 1, color: "#525252"}}>
        <Typography variant='h6' sx={{mb:0}}>{shop?.["shopName"+language]}</Typography>
        <Typography variant='subtitle2'><LocationOnOutlinedIcon sx={{marginInlineEnd: 0.5}} />{contact_us_sentences.NearestShopNearTo[language]}: {shop?.["nearbyLandmarks"+language]}</Typography>
        <Box sx={{display: 'flex', alignItems: "center", gap: 2}}>
          <Typography variant='subtitle2'> <AccessTimeOutlinedIcon sx={{marginInlineEnd: 0.5}} />9:00 {contact_us_sentences.NearestShopDurationAM[language]} {contact_us_sentences.NearestShopDurationTo[language]} 6:00 {contact_us_sentences.NearestShopDurationPM[language]}</Typography>
          <Typography variant='subtitle2'>•</Typography>
          <Typography variant='subtitle2'><MapMarkerDistanceIcon sx={{marginInlineEnd: 0.5}} /> 3 KM Away</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ShopCard