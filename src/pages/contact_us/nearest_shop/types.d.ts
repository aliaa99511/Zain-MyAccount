interface Shop {
  shopId: number;
  shopNameEn: string;
  shopNameAr: string;
  regionNameEn: string;
  regionNameAr: string;
  stateNameEn: string;
  stateNameAr: string;
  cityNameEn: string;
  cityNameAr: string;
  addressEn: string;
  addressAr: string;
  nearbyLandmarksEn: string;
  nearbyLandmarksAr: string;
  latitude: number;
  longitude: number;
}
interface Shops {
  message: string;
  shops: Shop[];
}
interface InnerShop {
  shopNameEn: string;
  shopNameAr: string;
}
interface City {
  cityNameAr: string;
  cityNameEn: string;
}
interface Region {
  regionNameEn: string;
  regionNameAr: string;
  cities: City[];
}
interface FindShopsPropsTypes {
  shopsData: Shops;
  regions: Region[];
  cities: City[];
  shops: InnerShop[];
  setCities: React.Dispatch<React.SetStateAction<City[]>>;
  setShops: React.Dispatch<React.SetStateAction<InnerShop[]>>;
  setFilteredShops: React.Dispatch<React.SetStateAction<Shops | undefined>>;
}