import {AdvancedMarker, Map, Pin, useMap} from '@vis.gl/react-google-maps';
import { Box, useTheme } from "@mui/material";
import { useEffect } from 'react';

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
const FitShopsBounds = ({ shops }: { shops: Shop[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !shops.length) return;

    const bounds = new google.maps.LatLngBounds();

    shops.forEach((shop) => {
      const lat = Number(shop.latitude);
      const lng = Number(shop.longitude);
      bounds.extend({lat, lng});
    });

    if (bounds.isEmpty()) return;

    map.fitBounds(bounds, {
      top: 80,
      right: 80,
      bottom: 80,
      left: 80,
    });
  }, [map, shops]);

  return null;
};
const CustomMap = ({shops, activeShopId}:{shops: Shops|undefined, activeShopId: number|null}) => {
  return (
    <Box sx={{width: "100%", height: {xs:"300px", md:"100%"}}}>
      
        <Map
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          mapId="shops-map"
        >
          <FitShopsBounds shops={shops?.shops ?? []} />
          {shops?.shops.map(item => {
            const lat = Number(item.latitude);
            const lng = Number(item.longitude);
            return (activeShopId == item.shopId ? <CustomActiveMarker key={item.shopId} lat={lat} lng={lng} />:<CustomMarker key={item.shopId} lat={lat} lng={lng} />)
          })}
        </Map>
    </Box>
  );
};

export default CustomMap;