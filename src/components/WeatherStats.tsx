'use client';

import { City } from '@/data/cities';
import { WeatherData } from '@/lib/weatherService';

interface WeatherStatsProps {
  weather: WeatherData;
  city: City;
}

export default function WeatherStats({ weather, city }: WeatherStatsProps) {
  const { current_weather, daily } = weather;

  const avgTemp =
    (daily.temperature_2m_max.reduce((a, b) => a + b, 0) +
      daily.temperature_2m_min.reduce((a, b) => a + b, 0)) /
    (daily.temperature_2m_max.length + daily.temperature_2m_min.length);
  const totalRain = daily.precipitation_sum.reduce((a, b) => a + b, 0);
  const warmest = Math.max(...daily.temperature_2m_max);
  const coolest = Math.min(...daily.temperature_2m_min);
  const windiest = Math.max(...daily.windspeed_10m_max);
  const rainyDays = daily.precipitation_sum.filter((value) => value > 1).length;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
      <Stat label="Current" value={`${Math.round(current_weather.temperature)}°`} />
      <Stat label="Average" value={`${avgTemp.toFixed(1)}°`} />
      <Stat label="Warmest" value={`${Math.round(warmest)}°`} />
      <Stat label="Coolest" value={`${Math.round(coolest)}°`} />
      <Stat label="Rain total" value={`${totalRain.toFixed(1)} mm`} />
      <Stat label={city.name} value={`${rainyDays} rainy • ${Math.round(windiest)} km/h`} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/6 p-3 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-secondary)]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[var(--text-primary)] sm:text-xl">{value}</p>
    </div>
  );
}
