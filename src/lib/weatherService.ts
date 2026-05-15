import axios from 'axios';

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  weathercode: number[];
  relative_humidity_2m: number[];
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weathercode: number[];
  sunrise: string[];
  sunset: string[];
  windspeed_10m_max: number[];
  winddirection_10m_dominant: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  current_weather: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
}

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const fetchWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  try {
    const response = await axios.get<WeatherResponse>(BASE_URL, {
      params: {
        latitude,
        longitude,
        current_weather: true,
        hourly: 'temperature_2m,precipitation_probability,weathercode,relative_humidity_2m',
        daily:
          'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,sunrise,sunset,windspeed_10m_max,winddirection_10m_dominant',
        timezone: 'Asia/Manila',
        forecast_days: 7,
      },
    });

    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      current_weather: response.data.current_weather,
      hourly: response.data.hourly,
      daily: response.data.daily,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};

export const getWeatherDescription = (code: number): string => {
  const weatherCodes: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return weatherCodes[code] || 'Unknown';
};

export const getWeatherIcon = (code: number): string => {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '🌤️';
};

export const getTemperatureColor = (temperature: number): string => {
  if (temperature >= 35) return '#d97706';
  if (temperature >= 30) return '#f4a261';
  if (temperature >= 25) return '#e9c46a';
  if (temperature >= 20) return '#b8b0a5';
  if (temperature >= 15) return '#8f6f63';
  return '#5f4b57';
};

export const estimateHumidity = (weatherCode: number): number => {
  if (weatherCode >= 61 && weatherCode <= 67) return 85;
  if (weatherCode >= 80 && weatherCode <= 82) return 80;
  if (weatherCode >= 51 && weatherCode <= 57) return 75;
  if (weatherCode === 45 || weatherCode === 48) return 90;
  if (weatherCode === 3) return 70;
  if (weatherCode === 2) return 60;
  return 55;
};
