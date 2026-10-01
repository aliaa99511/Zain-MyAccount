import { useEffect, useState } from "react";
import {AdvancedMarker, APIProvider, Map, Pin} from '@vis.gl/react-google-maps';
import { Box } from "@mui/material";

const defaultProps = {
  center: {
    lat: 15.7860696,
    lng: 30.1995791
  },
  zoom: 5
};

const MapComponent = ({lat, lng}) => {
  return (
    <Map
      defaultCenter={defaultProps.center}
      defaultZoom={defaultProps.zoom}
      mapId="shops-map"
      // defaultBounds="Sudan"
      reuseMaps
    >
      <AdvancedMarker position={defaultProps.center}>
        <Pin
          background={'#008A99'}
          borderColor={'#FFFFFF35'}
          glyphColor={'#E0E0E0'}
        />
      </AdvancedMarker>
      <AdvancedMarker position={{lat, lng}}>
        <Pin
          background={'#953193'}
          borderColor={'#FFFFFF35'}
          glyphColor={'#FAFAFABF'}
          scale={1.5}
        />
      </AdvancedMarker>
    </Map>
  )
}

const CurrentLocation = () => {
  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  const [latitude, setLatitude] = useState<number | string | null>(null);
  const [longitude, setLongitude] = useState<number | string | null>(null);
  useEffect(() => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setLocationLoading(false);
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocationLoading(false);
          }
        );
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocationLoading(false);
      }
    } catch (e) {
      console.log("Somerthing went wrong!", e);
    }
  }, []);

  return (
    <>
      {!locationLoading ? (
        <Box sx={{width: "100%", height: {xs:"300px", md:"100%"}}}>
          <APIProvider apiKey="" language="EN" disableUsageAttribution region="Sudan">
            <MapComponent lat={latitude} lng={longitude} />
          </APIProvider>
        </Box>
      ) : (
        "Location Loading..."
      )}
    </>
  );
};

export default CurrentLocation;