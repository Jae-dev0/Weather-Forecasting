'use client';

import { WeatherData, getWeatherIcon } from '@/lib/weatherService';
import { format, parseISO } from 'date-fns';

interface HourlyForecastProps {
  weather: WeatherData;
}

export default function HourlyForecast({ weather }: HourlyForecastProps) {
  const startIndex = weather.hourly.time.findIndex((time) => time === weather.current_weather.time);
  const safeStart = startIndex >= 0 ? startIndex : 0;
  const hours = weather.hourly.time.slice(safeStart, safeStart + 12).map((time, index) => ({
    time,
    temperature: weather.hourly.temperature_2m[safeStart + index],
    rainChance: weather.hourly.precipitation_probability[safeStart + index],
    humidity: weather.hourly.relative_humidity_2m[safeStart + index],
    weathercode: weather.hourly.weathercode[safeStart + index],
  }));

  return (
    <section className="lux-panel luxury-shadow rounded-[32px] p-5 sm:p-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Hourly Forecast</p>
          <h3 className="section-title mt-2 text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
            Through the next twelve hours
          </h3>
        </div>
        <p className="hidden text-sm text-[var(--text-secondary)] sm:block">
          Smooth scroll and compare short-term shifts.
        </p>
      </div>

      <div className="no-scrollbar -mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
        {hours.map((hour) => (
          <article
            key={hour.time}
            className="min-w-[144px] snap-start rounded-[28px] border border-white/8 bg-white/5 p-4 transition duration-300 hover:-translate-y-1 hover:border-[var(--highlight)]/30 hover:bg-white/8"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">
              {format(parseISO(hour.time), 'ha')}
            </p>
            <div className="mt-4 text-4xl">{getWeatherIcon(hour.weathercode)}</div>
            <div className="mt-4 text-3xl font-semibold text-[var(--text-primary)]">
              {Math.round(hour.temperature)}°
            </div>
            <div className="mt-4 space-y-2 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center justify-between">
                <span>Rain</span>
                <span>{hour.rainChance}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Humidity</span>
                <span>{hour.humidity}%</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
