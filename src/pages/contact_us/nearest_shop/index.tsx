import { Box, Grid, Paper, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../../App';
import { contact_us_sentences } from '../../../configurations/language';
import CurrentLocation from './CurrentLocation';
import ShopCard from './ShopCard';
import { useGetShopsQuery } from '../../../store';
import FindShops from './FindShops';

function NearestShop():React.ReactElement {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';

  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [shops, setShops] = useState<InnerShop[]>([]);

  const {data: shopsData, isFetching: isShopsLoading, isError: isShopsError, isSuccess: isShopsSuccess} = useGetShopsQuery();

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
  },[isShopsSuccess,isShopsLoading])

  if(isShopsLoading){
    return <></>;
  }
  if(isShopsError){
    return <></>;
  }

  return (
    <Paper>
      <Typography variant='h2'>{contact_us_sentences.NearestShopTitle[language]}</Typography>
      <Typography variant='body1'>{contact_us_sentences.NearestShopDescription[language]}</Typography>
      <FindShops shopsData={shopsData!} regions={regions} cities={cities} shops={shops} setCities={setCities} setShops={setShops}  />
      <Box sx={{mt: 2}}>
        <Grid container columnSpacing={2.5} rowSpacing={1}>
          <Grid size="grow">
            <CurrentLocation />
          </Grid>
          <Box sx={{
            width: "430px", height: "450px", overflowY: "scroll", 
            gap: 2, display: "flex", flexDirection: "column", p:0.5,
            scrollbarWidth: 'thin',
            scrollbarColor: '#953193 #F5F5F5',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#F2F2F2',
              borderRadius: '999px',
              border:"1px solid #A3A3A3",
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#953193',
              borderRadius: '999px',
              border:"1px solid #A3A3A3",
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#7D297B',
            },
          }}>
            {shopsData?.shops.map(shop => <ShopCard shop={shop} />)}
          </Box>
        </Grid>
      </Box>
    </Paper>
  )
}

export default NearestShop