'use client';

import { useMemo } from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { WeatherData, getWeatherDescription, getWeatherIcon } from '@/lib/weatherService';
import { format, parseISO } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

interface ForecastChartProps {
  weather: WeatherData;
  cityName: string;
}

export default function ForecastChart({ weather, cityName }: ForecastChartProps) {
  const { daily } = weather;

  const stats = useMemo(() => {
    const avgMax = daily.temperature_2m_max.reduce((a, b) => a + b, 0) / daily.temperature_2m_max.length;
    const avgMin = daily.temperature_2m_min.reduce((a, b) => a + b, 0) / daily.temperature_2m_min.length;
    const totalRain = daily.precipitation_sum.reduce((a, b) => a + b, 0);
    const rainyDays = daily.precipitation_sum.filter((p) => p > 1).length;
    return { avgMax, avgMin, totalRain, rainyDays };
  }, [daily]);

  const labels = daily.time.map((date) => format(parseISO(date), 'EEE'));
  const temperatureData = {
    labels,
    datasets: [
      {
        label: 'High',
        data: daily.temperature_2m_max,
        borderColor: '#F4A261',
        backgroundColor: 'rgba(244, 162, 97, 0.16)',
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: '#F4A261',
        pointBorderColor: '#F8F5F2',
        pointBorderWidth: 2,
      },
      {
        label: 'Low',
        data: daily.temperature_2m_min,
        borderColor: '#B8B0A5',
        backgroundColor: 'rgba(184, 176, 165, 0.12)',
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: '#B8B0A5',
        pointBorderColor: '#F8F5F2',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#B8B0A5',
          usePointStyle: true,
          padding: 18,
          font: { size: 12, weight: 'bold' as const },
        },
      },
      title: {
        display: true,
        text: `Weekly temperature curve — ${cityName}`,
        color: '#F8F5F2',
        font: { size: 18, weight: 'bold' as const },
        padding: { top: 8, bottom: 18 },
      },
      tooltip: {
        backgroundColor: 'rgba(18, 18, 18, 0.94)',
        titleColor: '#F8F5F2',
        bodyColor: '#F8F5F2',
        borderColor: 'rgba(233, 196, 106, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const value = context.parsed.y ?? 0;
            return `${context.dataset.label}: ${value.toFixed(1)}°C`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#B8B0A5' },
      },
      y: {
        grid: { color: 'rgba(248,245,242,0.08)' },
        ticks: {
          color: '#B8B0A5',
          callback: (value: string | number) => `${value}°`,
        },
      },
    },
  };

  return (
    <section className="lux-panel luxury-shadow overflow-hidden rounded-[34px] text-[var(--text-primary)]">
      <div className="border-b border-white/8 bg-[linear-gradient(135deg,rgba(233,196,106,0.12),rgba(217,119,6,0.08),transparent)] p-6 sm:p-7">
        <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr] lg:items-end">
          <div>
            <p className="eyebrow">Weekly Forecast</p>
            <h3 className="section-title mt-2 text-2xl font-semibold sm:text-3xl">
              A refined outlook for the coming week
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              Smooth temperature curves, lighter graph strokes, and a calmer reading rhythm inspired by magazine layouts.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatChip label="Avg high" value={`${stats.avgMax.toFixed(1)}°`} />
            <StatChip label="Avg low" value={`${stats.avgMin.toFixed(1)}°`} />
            <StatChip label="Total rain" value={`${stats.totalRain.toFixed(1)} mm`} />
            <StatChip label="Rainy days" value={`${stats.rainyDays}/7`} />
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6 sm:p-7">
        <div className="rounded-[30px] border border-white/8 bg-black/18 p-4 sm:p-5">
          <div className="h-72 sm:h-80">
            <Line data={temperatureData} options={chartOptions} />
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Editorial Notes</p>
              <h4 className="section-title mt-2 text-2xl font-semibold">Seven vertical forecast cards</h4>
            </div>
            <p className="hidden text-sm text-[var(--text-secondary)] sm:block">
              Sunrise, sunset, rain, and wind in one quiet stack.
            </p>
          </div>

          <div className="space-y-3">
            {daily.time.map((date, index) => (
              <article
                key={date}
                className={`grid gap-4 rounded-[28px] border p-4 transition duration-300 sm:grid-cols-[1.05fr,0.8fr,0.8fr,0.95fr] sm:items-center ${
                  index === 0
                    ? 'border-[var(--highlight)]/25 bg-[linear-gradient(135deg,rgba(233,196,106,0.12),rgba(244,162,97,0.08),rgba(255,255,255,0.03))]'
                    : 'border-white/8 bg-white/5 hover:bg-white/7'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{getWeatherIcon(daily.weathercode[index])}</div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                      {index === 0 ? 'Today' : format(parseISO(date), 'EEEE')}
                    </p>
                    <p className="mt-1 text-base font-medium text-[var(--text-primary)]">
                      {getWeatherDescription(daily.weathercode[index])}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-secondary)]">Temperature</p>
                  <p className="mt-2 text-lg font-semibold">
                    <span className="text-[var(--accent)]">{Math.round(daily.temperature_2m_max[index])}°</span>
                    <span className="mx-2 text-[var(--text-secondary)]">/</span>
                    <span>{Math.round(daily.temperature_2m_min[index])}°</span>
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-secondary)]">Sunrise / Sunset</p>
                  <p className="mt-2 text-sm text-[var(--text-primary)]">
                    {format(parseISO(daily.sunrise[index]), 'h:mm a')} • {format(parseISO(daily.sunset[index]), 'h:mm a')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-secondary)]">Rain</p>
                    <p className="mt-2 text-[var(--text-primary)]">{daily.precipitation_sum[index].toFixed(1)} mm</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-secondary)]">Wind</p>
                    <p className="mt-2 text-[var(--text-primary)]">
                      {Math.round(daily.windspeed_10m_max[index])} km/h {getWindDirection(daily.winddirection_10m_dominant[index])}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/6 p-3">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-secondary)]">{label}</p>
      <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((degrees % 360) / 45) % 8;
  return directions[index];
}
