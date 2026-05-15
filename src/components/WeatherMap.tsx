'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { philippineCities, City } from '@/data/cities';
import { fetchWeatherData, WeatherData, getWeatherIcon, getTemperatureColor, getWeatherDescription } from '@/lib/weatherService';
import LoadingSpinner from './LoadingSpinner';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WeatherMapProps {
  onCitySelect: (city: City, weather: WeatherData) => void;
  selectedCity: City | null;
}

// Custom marker icon creator
const createCustomIcon = (temperature: number) => {
  const color = getTemperatureColor(temperature);
  const html = `
    <div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 12px;
    ">
      ${Math.round(temperature)}°
    </div>
  `;
  
  return L.divIcon({
    html,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Component to handle map events
function MapEventHandler({ selectedCity }: { selectedCity: City | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCity) {
      map.flyTo([selectedCity.lat, selectedCity.lon], 10, {
        duration: 1.5,
      });
    }
  }, [selectedCity, map]);

  return null;
}

export default function WeatherMap({ onCitySelect, selectedCity }: WeatherMapProps) {
  const [weatherCache, setWeatherCache] = useState<Map<string, WeatherData>>(new Map());
  const [loadingCity, setLoadingCity] = useState<string | null>(null);

  const handleMarkerClick = async (city: City) => {
    const cacheKey = `${city.lat},${city.lon}`;
    
    // Check if we already have the data cached
    if (weatherCache.has(cacheKey)) {
      const cachedWeather = weatherCache.get(cacheKey)!;
      onCitySelect(city, cachedWeather);
      return;
    }

    // Fetch new data
    setLoadingCity(city.name);
    try {
      const weatherData = await fetchWeatherData(city.lat, city.lon);
      
      // Update cache
      setWeatherCache(prev => new Map(prev).set(cacheKey, weatherData));
      
      // Notify parent
      onCitySelect(city, weatherData);
    } catch (error) {
      console.error(`Failed to fetch weather for ${city.name}:`, error);
    } finally {
      setLoadingCity(null);
    }
  };

  // Philippines center coordinates
  const center: [number, number] = [12.8797, 121.7740];

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={6}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapEventHandler selectedCity={selectedCity} />

        {philippineCities.map((city) => {
          const cacheKey = `${city.lat},${city.lon}`;
          const cachedWeather = weatherCache.get(cacheKey);
          const temperature = cachedWeather?.current_weather.temperature;

          return (
            <Marker
              key={`${city.name}-${city.region}`}
              position={[city.lat, city.lon]}
              icon={temperature !== undefined ? createCustomIcon(temperature) : new L.Icon.Default()}
              eventHandlers={{
                click: () => handleMarkerClick(city),
              }}
            >
              <Popup className="custom-popup" maxWidth={360} minWidth={300}>
                <div className="relative">
                  {/* Header with City Info */}
                  <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white p-4 -m-1 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{city.name}</h3>
                        <div className="flex items-center gap-1 text-slate-300 text-sm mt-1">
                          <span>📍</span>
                          <span>{city.region}</span>
                        </div>
                      </div>
                      {cachedWeather && (
                        <div className="text-4xl ml-3">
                          {getWeatherIcon(cachedWeather.current_weather.weathercode)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {loadingCity === city.name ? (
                    <div className="py-8 px-4">
                      <LoadingSpinner size="sm" message="Fetching weather..." />
                    </div>
                  ) : cachedWeather ? (
                    <div className="px-4 pb-4 space-y-4">
                      {/* Main Temperature Display */}
                      <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl"
                        style={{
                          background: `linear-gradient(135deg, ${getTemperatureColor(cachedWeather.current_weather.temperature)}, ${getTemperatureColor(cachedWeather.current_weather.temperature)}dd)`
                        }}
                      >
                        <div className="relative z-10">
                          <div className="text-sm font-medium opacity-90 mb-1">Currently</div>
                          <div className="text-5xl font-bold mb-3">
                            {Math.round(cachedWeather.current_weather.temperature)}°
                          </div>
                          <div className="text-base font-medium opacity-95">
                            {getWeatherDescription(cachedWeather.current_weather.weathercode)}
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 text-8xl opacity-20 -mt-4 -mr-4">
                          {getWeatherIcon(cachedWeather.current_weather.weathercode)}
                        </div>
                      </div>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Wind Card */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-lg">💨</span>
                            </div>
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">WIND</span>
                          </div>
                          <div className="text-2xl font-bold text-slate-800">
                            {Math.round(cachedWeather.current_weather.windspeed)}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">km/h</div>
                        </div>
                        
                        {/* Today's Range Card */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-lg">🌡️</span>
                            </div>
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">TODAY</span>
                          </div>
                          <div className="text-2xl font-bold text-slate-800">
                            {Math.round(cachedWeather.daily.temperature_2m_max[0])}°
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            / {Math.round(cachedWeather.daily.temperature_2m_min[0])}°
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCitySelect(city, cachedWeather);
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
                      >
                        <span>View Full Forecast</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="px-4 pb-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkerClick(city);
                        }}
                        className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
                      >
                        <span className="text-2xl">🌤️</span>
                        <span>Load Weather Data</span>
                      </button>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
