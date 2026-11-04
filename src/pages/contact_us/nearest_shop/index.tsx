import { Box, Grid, Paper, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../../App';
import { contact_us_sentences } from '../../../configurations/language';
import CustomMap from './CustomMap';
import ShopCard from './ShopCard';
import { useGetShopsQuery } from '../../../store';
import FindShops from './FindShops';


const calculateShopDistances = async (latitude: number | null, longitude: number | null, shops: Shops | undefined, setshopsWithDistance: React.Dispatch<React.SetStateAction<Shops | undefined>>) => {
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

  const { matrix } = await RouteMatrix.computeRouteMatrix({
    origins: [origin],
    destinations,
    travelMode: "DRIVING",
    fields: [
      "distanceMeters",
    ],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const RouteMatrixResponse:any = matrix.toJSON();
  if (RouteMatrixResponse.rows && RouteMatrixResponse.rows.length > 0) {
    const updatedShops = shops.shops.map((shop, index) => ({
      ...shop,
      distance: RouteMatrixResponse.rows[0].items[index].distanceMeters ?? null,
    })).sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    setshopsWithDistance({ ...shops, shops: updatedShops });
  }
}


function NearestShop():React.ReactElement {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [filteredShops, setFilteredShops] = useState<Shops | undefined>(undefined);
  //setshopsWithDistance
  const [shopsWithDistance, setshopsWithDistance] = useState<Shops | undefined>(undefined);
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

  useEffect(() => {
    if(shopsWithDistance && shopsWithDistance.shops.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilteredShops(shopsWithDistance);
    }
    else {
      setFilteredShops(shopsData);
    }
  }, [shopsWithDistance, shopsData]);

  useEffect(()=>{
    if(!isShopsLoading && isShopsSuccess) {
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRegions(reducedRegions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShopsSuccess, isShopsLoading])

  useEffect(()=>{
    if(latitude && longitude && shopsData) {
      calculateShopDistances(latitude, longitude, shopsData, setshopsWithDistance);
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
      <FindShops shopsData={shopsWithDistance! || shopsData!} regions={regions} cities={cities} shops={shops} setCities={setCities} setShops={setShops} setFilteredShops={setFilteredShops} />
      <Box sx={{mt: 2}}>
        <Grid container columnSpacing={2.5} rowSpacing={1}>
          <Grid size="grow">
            <CustomMap shops={filteredShops} activeShopId={activeShopId} />
          </Grid>
          <Box sx={{
            width: "430px", height: "450px", overflowY: "scroll", 
            gap: 2, display: "flex", flexDirection: "column", p:0.5, paddingInlineEnd: 1,
          }}>
            {filteredShops?.shops.map(shop => <ShopCard shop={shop} isActive={activeShopId == shop.shopId} setActiveShopId={setActiveShopId} />)}
          </Box>
        </Grid>
      </Box>
    </Paper>
  )
}

export default NearestShop