export interface City {
  name: string;
  lat: number;
  lon: number;
  region: string;
}

export const philippineCities: City[] = [
  // National Capital Region
  { name: "Manila", lat: 14.5995, lon: 120.9842, region: "NCR" },
  { name: "Quezon City", lat: 14.6760, lon: 121.0437, region: "NCR" },
  
  // Luzon
  { name: "Baguio", lat: 16.4023, lon: 120.5960, region: "CAR" },
  { name: "Laoag", lat: 18.1987, lon: 120.5937, region: "Ilocos Norte" },
  { name: "Tuguegarao", lat: 17.6132, lon: 121.7270, region: "Cagayan Valley" },
  { name: "Olongapo", lat: 14.8293, lon: 120.2824, region: "Central Luzon" },
  { name: "Cabanatuan", lat: 15.4860, lon: 120.9670, region: "Central Luzon" },
  { name: "Batangas City", lat: 13.7565, lon: 121.0583, region: "CALABARZON" },
  { name: "Lucena", lat: 13.9372, lon: 121.6170, region: "CALABARZON" },
  { name: "Naga", lat: 13.6192, lon: 123.1814, region: "Bicol" },
  { name: "Legazpi", lat: 13.1391, lon: 123.7436, region: "Bicol" },
  
  // Visayas
  { name: "Iloilo City", lat: 10.7202, lon: 122.5621, region: "Western Visayas" },
  { name: "Bacolod", lat: 10.6770, lon: 122.9510, region: "Western Visayas" },
  { name: "Cebu City", lat: 10.3157, lon: 123.8854, region: "Central Visayas" },
  { name: "Dumaguete", lat: 9.3068, lon: 123.3054, region: "Central Visayas" },
  { name: "Tagbilaran", lat: 9.6479, lon: 123.8530, region: "Central Visayas" },
  { name: "Tacloban", lat: 11.2447, lon: 125.0037, region: "Eastern Visayas" },
  { name: "Ormoc", lat: 11.0059, lon: 124.6074, region: "Eastern Visayas" },
  
  // Mindanao
  { name: "Zamboanga City", lat: 6.9214, lon: 122.0790, region: "Zamboanga Peninsula" },
  { name: "Pagadian", lat: 7.8250, lon: 123.4350, region: "Zamboanga Peninsula" },
  { name: "Cagayan de Oro", lat: 8.4542, lon: 124.6319, region: "Northern Mindanao" },
  { name: "Iligan", lat: 8.2280, lon: 124.2452, region: "Northern Mindanao" },
  { name: "Butuan", lat: 8.9475, lon: 125.5406, region: "Caraga" },
  { name: "Davao City", lat: 7.1907, lon: 125.4553, region: "Davao Region" },
  { name: "General Santos", lat: 6.1164, lon: 125.1716, region: "SOCCSKSARGEN" },
  { name: "Cotabato City", lat: 7.2232, lon: 124.2450, region: "BARMM" },
];

// Helper function to get city by name
export const getCityByName = (name: string): City | undefined => {
  return philippineCities.find(city => city.name.toLowerCase() === name.toLowerCase());
};

// Helper function to get cities by region
export const getCitiesByRegion = (region: string): City[] => {
  return philippineCities.filter(city => city.region === region);
};

// Get unique regions
export const getRegions = (): string[] => {
  return Array.from(new Set(philippineCities.map(city => city.region)));
};
