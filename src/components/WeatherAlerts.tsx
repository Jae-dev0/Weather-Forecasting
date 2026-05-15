'use client';

import { WeatherData } from '@/lib/weatherService';
import { useMemo } from 'react';

interface WeatherAlertsProps {
  weather: WeatherData;
  cityName: string;
}

export default function WeatherAlerts({ weather, cityName }: WeatherAlertsProps) {
  const alerts = useMemo(() => {
    const { current_weather, daily } = weather;
    const items: { label: string; title: string; message: string; accent: string }[] = [];

    if (current_weather.temperature >= 35) {
      items.push({
        label: 'Heat',
        title: 'Extreme warmth',
        message: `${cityName} is currently at ${Math.round(current_weather.temperature)}°C. Minimize direct sun exposure and stay hydrated.`,
        accent: 'from-[#D97706] to-[#F4A261]',
      });
    }

    if (daily.precipitation_sum.slice(0, 3).reduce((a, b) => a + b, 0) > 24) {
      items.push({
        label: 'Rain',
        title: 'Wet three-day outlook',
        message: `A more saturated spell is building across the next three days, with measurable rainfall in the near-term forecast.`,
        accent: 'from-[#5F4B57] to-[#8F6F63]',
      });
    }

    if (current_weather.windspeed >= 28) {
      items.push({
        label: 'Wind',
        title: 'Elevated wind movement',
        message: `Winds are moving at ${Math.round(current_weather.windspeed)} km/h. Outdoor plans may feel breezier than usual.`,
        accent: 'from-[#8F6F63] to-[#B8B0A5]',
      });
    }

    return items;
  }, [cityName, weather]);

  if (alerts.length === 0) {
    return (
      <section className="lux-panel luxury-shadow rounded-[28px] p-5 text-[var(--text-primary)]">
        <p className="eyebrow">Atmospheric Brief</p>
        <div className="mt-3 text-lg font-medium">Quiet conditions around {cityName}</div>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          No immediate advisories are standing out right now. The outlook feels calm and manageable.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {alerts.map((alert) => (
        <article
          key={alert.title}
          className={`luxury-shadow rounded-[28px] border border-white/8 bg-gradient-to-r ${alert.accent} p-5 text-[var(--text-primary)]`}
        >
          <div className="flex items-start gap-4">
            <div className="rounded-full border border-white/20 bg-black/15 px-3 py-1 text-xs uppercase tracking-[0.22em]">
              {alert.label}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{alert.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-primary)]/85">{alert.message}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
