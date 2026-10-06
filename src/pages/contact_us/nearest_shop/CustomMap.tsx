import {AdvancedMarker, Map, Pin} from '@vis.gl/react-google-maps';
import { Box, useTheme } from "@mui/material";

const defaultProps = {
  center: {
    lat: 15.7860696,
    lng: 30.1995791
  },
  zoom: 5
};

const CustomMarker = ({lat, lng}:{lat:number, lng: number})=>{
  const theme = useTheme();
  return (
    <AdvancedMarker position={{lat, lng}}>
      <Pin
        background={theme.palette.primary.main}
        borderColor={'#FFFFFF35'}
        glyphColor={'#E0E0E0'}
      />
    </AdvancedMarker>
  )
} 
const CustomActiveMarker = ({lat, lng}:{lat:number, lng: number})=>{
  return (
    <AdvancedMarker position={{lat, lng}}>
      <Pin
        background={'#953193'}
        borderColor={'#FFFFFF35'}
        glyphColor={'#FAFAFABF'}
        scale={1.5}
      />
    </AdvancedMarker>
  )
} 

const CustomMap = ({shops, activeShopId}:{shops: Shops|undefined, activeShopId: number|null}) => {
  // const languageContext = useContext(LanguageContext);
  // const language = languageContext?.language ?? 'En';

  return (
    <Box sx={{width: "100%", height: {xs:"300px", md:"100%"}}}>
      
        <Map
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          mapId="shops-map"
        >
          {shops?.shops.map(item => {
            const lat = Number(item.latitude);
            const lng = Number(item.longitude);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
              return null;
            }
            return (activeShopId == item.shopId ? <CustomActiveMarker key={item.shopId} lat={lat} lng={lng} />:<CustomMarker key={item.shopId} lat={lat} lng={lng} />)
          })}
        </Map>
    </Box>
  );
};

export default CustomMap;