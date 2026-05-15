'use client';

import { City } from '@/data/cities';
import {
  WeatherData,
  estimateHumidity,
  getTemperatureColor,
  getWeatherDescription,
  getWeatherIcon,
} from '@/lib/weatherService';
import { format, parseISO } from 'date-fns';

interface WeatherCardProps {
  city: City;
  weather: WeatherData;
}

export default function WeatherCard({ city, weather }: WeatherCardProps) {
  const { current_weather, daily, hourly } = weather;
  const humidity = hourly.relative_humidity_2m[0] ?? estimateHumidity(current_weather.weathercode);
  const tempColor = getTemperatureColor(current_weather.temperature);
  const feelsLike = current_weather.temperature + (current_weather.windspeed > 24 ? -2 : 1);
  const todayHigh = daily.temperature_2m_max[0];
  const todayLow = daily.temperature_2m_min[0];
  const sunrise = daily.sunrise[0];
  const sunset = daily.sunset[0];
  const weatherLabel = getWeatherDescription(current_weather.weathercode);
  const airQuality = getAirQualityLabel(current_weather.weathercode, humidity);
  const comfort = getComfortIndex(current_weather.temperature, humidity);

  return (
    <section className="lux-panel luxury-shadow overflow-hidden rounded-[34px] text-[var(--text-primary)]">
      <div
        className="relative overflow-hidden p-6 sm:p-7 lg:p-8"
        style={{
          background: `linear-gradient(145deg, ${tempColor}, rgba(18, 18, 18, 0.92) 72%)`,
        }}
      >
        <div className="absolute inset-0 weather-grain opacity-50" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(248,245,242,0.2),transparent_38%)]" />
        <div className="absolute -right-2 top-2 text-[7rem] opacity-12 sm:text-[9rem]">
          {getWeatherIcon(current_weather.weathercode)}
        </div>

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr,0.8fr]">
          <div>
            <p className="eyebrow text-[var(--text-primary)]/70">Current Atmosphere</p>
            <h2 className="section-title mt-3 text-4xl font-semibold sm:text-5xl">{city.name}</h2>
            <p className="mt-2 text-sm text-[var(--text-primary)]/70">{city.region} • Philippines</p>

            <div className="mt-8 flex items-end gap-6">
              <div className="text-7xl font-semibold leading-none sm:text-[5.75rem]">
                {Math.round(current_weather.temperature)}°
              </div>
              <div className="pb-2">
                <p className="text-lg text-[var(--text-primary)]/90">{weatherLabel}</p>
                <p className="mt-1 text-sm text-[var(--text-primary)]/65">
                  {format(parseISO(current_weather.time), 'EEEE • MMMM dd • h:mm a')}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <HighlightCard label="Feels like" value={`${Math.round(feelsLike)}°`} />
              <HighlightCard label="Air quality" value={airQuality} />
              <HighlightCard label="Comfort" value={comfort} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <MoodMetric
              label="Daylight"
              primary={`${format(parseISO(sunrise), 'h:mm a')} sunrise`}
              secondary={`${format(parseISO(sunset), 'h:mm a')} sunset`}
            />
            <MoodMetric
              label="Temperature span"
              primary={`${Math.round(todayLow)}° to ${Math.round(todayHigh)}°`}
              secondary="Balanced daytime arc"
            />
            <MoodMetric
              label="Coordinates"
              primary={`${city.lat.toFixed(2)}°N`}
              secondary={`${city.lon.toFixed(2)}°E`}
            />
          </div>
        </div>
      </div>

      <div className="border-y border-white/8 bg-black/18 px-6 py-5 sm:px-7 lg:px-8">
        <div className="mb-3 flex items-center justify-between text-sm text-[var(--text-secondary)]">
          <span>{Math.round(todayLow)}°</span>
          <span className="tracking-[0.18em] uppercase">Today&apos;s Range</span>
          <span>{Math.round(todayHigh)}°</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/8">
          <div className="h-full rounded-full bg-[linear-gradient(90deg,#5f4b57_0%,#e9c46a_52%,#d97706_100%)]" />
        </div>
      </div>

      <div className="grid gap-3 p-6 sm:grid-cols-2 sm:p-7 lg:grid-cols-4 lg:p-8">
        <MetricCard
          label="Humidity"
          value={`${humidity}%`}
          subtext={humidity > 70 ? 'Dense and tropical' : humidity > 45 ? 'Soft and balanced' : 'Dry and crisp'}
          progress={`${humidity}%`}
          barClassName="from-[#B8B0A5] to-[#E9C46A]"
        />
        <MetricCard
          label="Wind speed"
          value={`${Math.round(current_weather.windspeed)} km/h`}
          subtext={`Bearing ${Math.round(current_weather.winddirection)}°`}
          progress={`${Math.min((current_weather.windspeed / 55) * 100, 100)}%`}
          barClassName="from-[#8F6F63] to-[#D97706]"
        />
        <MetricCard
          label="Precipitation"
          value={`${daily.precipitation_sum[0].toFixed(1)} mm`}
          subtext={daily.precipitation_sum[0] > 8 ? 'Wet outlook' : daily.precipitation_sum[0] > 2 ? 'Passing showers' : 'Mostly dry'}
          progress={`${Math.min((daily.precipitation_sum[0] / 20) * 100, 100)}%`}
          barClassName="from-[#5F4B57] to-[#B8B0A5]"
        />
        <MetricCard
          label="Wind direction"
          value={getWindDirection(current_weather.winddirection)}
          subtext="Prevailing movement"
          progress={`${((current_weather.winddirection % 360) / 360) * 100}%`}
          barClassName="from-[#E9C46A] to-[#F4A261]"
        />
      </div>
    </section>
  );
}

function HighlightCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/8 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-primary)]/55">{label}</p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function MoodMetric({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: string;
  secondary: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/16 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-primary)]/55">{label}</p>
      <p className="mt-3 text-lg font-medium">{primary}</p>
      <p className="mt-1 text-sm text-[var(--text-primary)]/60">{secondary}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  subtext,
  progress,
  barClassName,
}: {
  label: string;
  value: string;
  subtext: string;
  progress: string;
  barClassName: string;
}) {
  return (
    <div className="rounded-[26px] border border-white/8 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtext}</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
        <div className={`h-full rounded-full bg-gradient-to-r ${barClassName}`} style={{ width: progress }} />
      </div>
    </div>
  );
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((degrees % 360) / 45) % 8;
  return directions[index];
}

function getAirQualityLabel(weatherCode: number, humidity: number): string {
  if (weatherCode === 0 && humidity < 65) return 'Excellent';
  if (weatherCode <= 3) return 'Very good';
  if (humidity > 85) return 'Dense';
  return 'Moderate';
}

function getComfortIndex(temperature: number, humidity: number): string {
  if (temperature >= 31 || humidity >= 85) return 'Intense';
  if (temperature >= 26 || humidity >= 70) return 'Warm';
  if (temperature >= 21) return 'Easy';
  return 'Cool';
}
