import { useContext, useEffect } from 'react'
import { Button, Grid, InputAdornment, MenuItem, OutlinedInput, Select, Typography } from '@mui/material'
import { contact_us_sentences } from '../../../configurations/language'
import { Controller, useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { LanguageContext } from '../../../App';



interface Inputs {
  keyword: string,
  region: string,
  city: string,
  shop: string,
}

function FindShops({shopsData, regions, cities, shops, setCities, setShops}:FindShopsPropsTypes) {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  const {register, handleSubmit, control, setValue} = useForm<Inputs>({
    defaultValues: {keyword: "", region: "-1", city: "-1", shop: "-1"}
  })
  
  const selectedRegion = useWatch({ control, name: "region"});
  const selectedCity = useWatch({ control, name: "city"});

  useEffect(()=>{
    if(selectedRegion != "-1") {
      setValue("city","-1")
      setValue("shop","-1")
      const selectedRegionObject = regions.find(
        (region) => region["regionName"+language] === selectedRegion
      );
      setCities(selectedRegionObject?.cities ?? []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selectedRegion])

  useEffect(()=>{
    if(shopsData && selectedCity != "-1") {
      setValue("shop","-1")
      const filtredShops = shopsData?.shops.filter(shop => {
        let isTrue = true;
        if(selectedRegion) {
          isTrue = isTrue && (shop[`regionName${language}`] === selectedRegion);
        }
        if(selectedCity) {
          isTrue = isTrue && (shop[`cityName${language}`] === selectedCity);
        }
        return isTrue;
      }).map(shop => ({shopNameAr: shop.shopNameAr, shopNameEn: shop.shopNameEn}));
      setShops(filtredShops);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selectedCity])

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const filtered = shopsData?.shops.filter(shop => {
      let isTrue = true;
      if(data.region != "-1"){
        isTrue = isTrue && (shop[`regionName${language}`] == data.region)
      }
      if(data.city != "-1"){
        isTrue = isTrue && (shop[`cityName${language}`] == data.city)
      }
      if(data.shop != "-1"){
        isTrue = isTrue && (shop[`shopName${language}`] == data.shop)
      }
      return isTrue;
    })
    console.log(filtered)
  }

  return (
    <Typography 
        component="form" 
        sx={{display: "flex", flexDirection: "column", alignItems: "stretch", gap: {xs:1, md:2}, mt: 1}}
        onSubmit={handleSubmit(onSubmit)}
      >
        <OutlinedInput 
          id="ShopSearch" 
          {...register("keyword")}
          sx={{
            mt: 2,
            width: "100%", 
          }}
          placeholder={contact_us_sentences.NearestShopSearchPlaceholder[language]}
          startAdornment={<InputAdornment position="start"><SearchOutlinedIcon /></InputAdornment>} 
        />
        <Grid container columnSpacing={2} rowSpacing={1}>
          <Grid size={{xs: 12, md: "grow"}}>
            <Controller name="region" control={control} defaultValue="-1" render={({ field }) => (
              <Select {...field} className="important" id="regions" sx={{ width: "100%" }}>
                <MenuItem value="-1" disabled><em>{contact_us_sentences.NearestShopRegion[language]}</em></MenuItem>
                {
                  regions.map(region => (
                    <MenuItem value={region['regionName' + language]}>{region['regionName' + language]}</MenuItem>
                  ))
                }
            </Select>
            )} />
          </Grid>
          <Grid size={{xs: 12, md: "grow"}}>
            <Controller name="city" control={control} defaultValue="-1" render={({ field }) => (
              <Select {...field} className="important" id='cities' sx={{width: '100%'}}>
                <MenuItem value="-1" disabled><em>{contact_us_sentences.NearestShopCity[language]}</em></MenuItem>
                {cities.map(city => (
                  <MenuItem value={city["cityName"+language]}>{city["cityName"+language]}</MenuItem>
                ))}
            </Select>
            )} />
          </Grid>
          <Grid size={{xs: 12, md: "grow"}}>
            <Controller name="shop" control={control} defaultValue="-1" render={({ field }) => (
              <Select {...field} className="important" id='shops' sx={{width: '100%'}}>
                <MenuItem value="-1" disabled><em>{contact_us_sentences.NearestShopShop[language]}</em></MenuItem>
                {shops.map(shop => (
                  <MenuItem value={shop["shopName"+language]}>{shop["shopName"+language]}</MenuItem>
                ))}
              </Select>
            )} />
          </Grid>
          <Button type="submit" variant='contained' color="info" sx={{width: {xs:"100%", md: "auto"}}}><LocationOnOutlinedIcon /> {contact_us_sentences.NearestShopSearchButton[language]}</Button>
        </Grid>
      </Typography>
  )
}

export default FindShops