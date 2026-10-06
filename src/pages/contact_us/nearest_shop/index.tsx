import { Box, Grid, Paper, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../../App';
import { contact_us_sentences } from '../../../configurations/language';
import CustomMap from './CustomMap';
import ShopCard from './ShopCard';
import { useGetShopsQuery } from '../../../store';
import FindShops from './FindShops';


const calculateShopDistances = async (latitude: number | null, longitude: number | null, shops: Shops | undefined ) => {
  if (latitude === null || longitude === null || !shops?.shops?.length) {
    return;
  }
  const { RouteMatrix } = (await google.maps.importLibrary(
    "routes"
  )) as google.maps.RoutesLibrary;

  const origin = {
    lat: latitude,
    lng: longitude,
  };

  const destinations = shops.shops
    .map((shop) => ({
      lat: Number(shop.latitude),
      lng: Number(shop.longitude),
    }))
    .filter(
      (location) =>
        Number.isFinite(location.lat) &&
        Number.isFinite(location.lng)
    );

  const { matrix } = await RouteMatrix.computeRouteMatrix({
    origins: [origin],
    destinations,
    travelMode: "DRIVING",
    fields: [
      "distanceMeters",
    ],
  });
  console.log("Route matrix:", matrix);
};


function NearestShop():React.ReactElement {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [filteredShops, setFilteredShops] = useState<Shops | undefined>(undefined);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [shops, setShops] = useState<InnerShop[]>([]);
  const [activeShopId, setActiveShopId] = useState<number | null>(null);

  const {data: shopsData, isFetching: isShopsLoading, isError: isShopsError, isSuccess: isShopsSuccess} = useGetShopsQuery();

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

  useEffect(()=>{
    if(!isShopsLoading && isShopsSuccess) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilteredShops(shopsData);
      const reducedRegions = Array.from(
        shopsData.shops.reduce((regionMap, shop) => {
          const regionKey = shop.regionNameEn;

          if (!regionMap.has(regionKey)) {
            regionMap.set(regionKey, {
              regionNameEn: shop.regionNameEn,
              regionNameAr: shop.regionNameAr,
              cities: [],
            });
          }
          const region = regionMap.get(regionKey)!;

          const cityExists = region.cities.some(
            (city) => city.cityNameEn === shop.cityNameEn
          );

          if (!cityExists) {
            region.cities.push({
              cityNameEn: shop.cityNameEn,
              cityNameAr: shop.cityNameAr,
            });
          }
          return regionMap;
        }, new Map<string, Region>()).values());
      setRegions(reducedRegions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShopsSuccess, isShopsLoading])

  useEffect(()=>{
    if(latitude && longitude && shopsData) {
      calculateShopDistances(latitude, longitude, shopsData);
    }
  }, [latitude, longitude, shopsData])

  if(isShopsLoading || locationLoading){
    return <></>;
  }
  if (isShopsError) {
    return <></>;
  }

  return (
    <Paper>
      <Typography variant='h2'>{contact_us_sentences.NearestShopTitle[language]}</Typography>
      <Typography variant='body1'>{contact_us_sentences.NearestShopDescription[language]}</Typography>
      <FindShops shopsData={shopsData!} regions={regions} cities={cities} shops={shops} setCities={setCities} setShops={setShops} setFilteredShops={setFilteredShops} />
      <Box sx={{mt: 2}}>
        <Grid container columnSpacing={2.5} rowSpacing={1}>
          <Grid size="grow">
            <CustomMap shops={filteredShops} activeShopId={activeShopId} />
          </Grid>
          <Box sx={{
            width: "430px", height: "450px", overflowY: "scroll", 
            gap: 2, display: "flex", flexDirection: "column", p:0.5, paddingInlineEnd: 1,
            scrollbarWidth: 'thin',
            scrollbarColor: '#953193 #F5F5F5',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#F2F2F2',
              borderRadius: '999px',
              border: "1px solid #A3A3A3",
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#953193',
              borderRadius: '999px',
              border: "1px solid #A3A3A3",
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#7D297B',
            },
          }}>
            {filteredShops?.shops.map(shop => <ShopCard shop={shop} isActive={activeShopId == shop.shopId} setActiveShopId={setActiveShopId} />)}
          </Box>
        </Grid>
      </Box>
    </Paper>
  )
}

export default NearestShop