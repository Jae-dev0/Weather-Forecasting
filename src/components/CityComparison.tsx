'use client';

import { City } from '@/data/cities';
import { philippineCities } from '@/data/cities';
import { useState, useEffect } from 'react';
import { fetchWeatherData, getWeatherIcon, getTemperatureColor } from '@/lib/weatherService';

interface CityWeather {
  city: City;
  temperature: number;
  weathercode: number;
}

export default function CityComparison() {
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'temp-high' | 'temp-low' | 'name'>('temp-high');

  const loadCityData = async () => {
    const promises = philippineCities.slice(0, 10).map(async (city) => {
      try {
        const weather = await fetchWeatherData(city.lat, city.lon);
        return {
          city,
          temperature: weather.current_weather.temperature,
          weathercode: weather.current_weather.weathercode,
        };
      } catch {
        return null;
      }
    });

    const results = await Promise.all(promises);
    const validResults = results.filter((r): r is CityWeather => r !== null);
    setCities(validResults);
    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadCityData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const sortedCities = [...cities].sort((a, b) => {
    switch (sortBy) {
      case 'temp-high':
        return b.temperature - a.temperature;
      case 'temp-low':
        return a.temperature - b.temperature;
      case 'name':
        return a.city.name.localeCompare(b.city.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>🏙️</span>
          <span>City Comparison</span>
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'temp-high' | 'temp-low' | 'name')}
          className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="temp-high">Hottest First</option>
          <option value="temp-low">Coolest First</option>
          <option value="name">Alphabetical</option>
        </select>
      </div>

      <div className="space-y-2">
        {sortedCities.map((item, index) => (
          <div
            key={item.city.name}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <div className="flex-shrink-0 w-8 text-center">
              <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
            </div>
            
            <div className="flex-shrink-0 text-3xl">
              {getWeatherIcon(item.weathercode)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 truncate">{item.city.name}</p>
              <p className="text-sm text-gray-500">{item.city.region}</p>
            </div>

            <div className="flex-shrink-0">
              <div
                className="text-2xl font-bold px-4 py-2 rounded-lg text-white shadow-md"
                style={{ backgroundColor: getTemperatureColor(item.temperature) }}
              >
                {Math.round(item.temperature)}°
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="text-gray-500 mb-1">Hottest</p>
            <p className="font-bold text-red-600 text-lg">
              {Math.round(Math.max(...cities.map(c => c.temperature)))}°C
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Average</p>
            <p className="font-bold text-gray-700 text-lg">
              {Math.round(cities.reduce((acc, c) => acc + c.temperature, 0) / cities.length)}°C
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Coolest</p>
            <p className="font-bold text-blue-600 text-lg">
              {Math.round(Math.min(...cities.map(c => c.temperature)))}°C
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
