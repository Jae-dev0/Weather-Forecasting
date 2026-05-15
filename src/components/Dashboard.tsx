'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { City, getRegions, philippineCities } from '@/data/cities';
import { fetchWeatherData, WeatherData, getWeatherDescription, getWeatherIcon } from '@/lib/weatherService';

const WeatherMap = dynamic(() => import('./WeatherMap'), {
  ssr: false,
  loading: () => <MapLoading />,
});

const navItems = ['Home', 'Forecast', 'Radar', 'Alerts', 'Settings'];

export default function WeatherDashboard() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [showMetrics, setShowMetrics] = useState(false);

  const handleCitySelect = (city: City, weather: WeatherData) => {
    setSelectedCity(city);
    setWeatherData(weather);
    setIsDrawerOpen(true);
  };

  const handleCityChange = async (cityName: string) => {
    const city = philippineCities.find((c) => c.name === cityName);
    if (!city) return;

    setSelectedCity(city);
    try {
      const weather = await fetchWeatherData(city.lat, city.lon);
      setWeatherData(weather);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    }
  };

  const filteredCities = useMemo(() => {
    return philippineCities.filter((city) => {
      const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || city.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  const regions = useMemo(() => getRegions(), []);
  const currentTemp = weatherData ? Math.round(weatherData.current_weather.temperature) : null;
  const currentDesc = weatherData ? getWeatherDescription(weatherData.current_weather.weathercode) : '';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 overflow-hidden">
      <div className="mx-auto max-w-[1920px] flex h-screen gap-4 p-4 lg:p-6">
        {/* Left Navigation Rail */}
        <aside className="hidden w-20 flex-col items-center justify-between rounded-3xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl py-8 lg:flex">
          <div className="flex flex-col items-center gap-8">
            <div className="text-4xl font-serif tracking-tighter text-amber-400">A</div>
            
            <nav className="flex flex-col gap-3">
              {navItems.map((item, i) => (
                <button
                  key={item}
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-medium tracking-widest transition-all ${
                    i === 0
                      ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                      : 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {item[0]}
                </button>
              ))}
            </nav>
          </div>

          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[2px] text-zinc-500 mb-3">Favorites</p>
            {philippineCities.slice(0, 3).map((city) => (
              <div
                key={city.name}
                className="mb-2 rounded-2xl bg-white/5 px-3 py-2.5 text-xs text-zinc-400 hover:bg-white/10 cursor-pointer transition"
                onClick={() => handleCityChange(city.name)}
              >
                {city.name.split(' ')[0]}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Header */}
          <header className="rounded-3xl border border-white/10 bg-zinc-900/80 backdrop-blur-2xl p-6 lg:p-8">
            <div className="flex flex-col xl:flex-row xl:items-start gap-8">
              <div className="flex-1">
                <p className="uppercase tracking-[3px] text-amber-400 text-sm font-medium">Editorial Weather</p>
                <h1 className="mt-3 text-4xl lg:text-5xl font-semibold leading-tight text-white">
                  Cinematic forecasting for the Philippines.
                </h1>
                <p className="mt-4 max-w-xl text-zinc-400">
                  Warm gradients, charcoal glass, and refined storytelling.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 xl:w-96">
                <HeroStat label="City" value={selectedCity?.name ?? 'None'} detail={currentTemp ? `${currentTemp}° • ${currentDesc}` : ''} />
                <HeroStat label="Scope" value={`${philippineCities.length} cities`} detail={`${filteredCities.length} filtered`} />
              </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex-1 min-w-[240px]">
                <SearchField
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search cities..."
                />
              </div>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="h-12 rounded-2xl border border-white/10 bg-zinc-900 px-5 text-sm focus:outline-none focus:border-amber-400/50"
              >
                <option value="all">All Regions</option>
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              <select
                value={selectedCity?.name || ''}
                onChange={(e) => handleCityChange(e.target.value)}
                className="h-12 rounded-2xl border border-white/10 bg-zinc-900 px-5 text-sm focus:outline-none focus:border-amber-400/50 min-w-[200px]"
              >
                <option value="">Jump to city...</option>
                {filteredCities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowMetrics(!showMetrics)}
                className="h-12 px-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 text-sm font-medium transition whitespace-nowrap"
              >
                {showMetrics ? 'Hide' : 'Show'} Metrics
              </button>
            </div>

            {showMetrics && weatherData && selectedCity && (
              <div className="mt-6 pt-6 border-t border-white/10">
                {/* <WeatherStats ... /> */}
              </div>
            )}
          </header>

          {/* Main Grid */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4 min-h-0">
            {/* Map */}
            <div className="xl:col-span-8 rounded-3xl border border-white/10 bg-zinc-900/80 backdrop-blur-2xl overflow-hidden relative min-h-[520px] group">
              <WeatherMap onCitySelect={handleCitySelect} selectedCity={selectedCity} />

              <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
                <AmbientBadge>{selectedCity ? selectedCity.name : 'Philippine Atlas'}</AmbientBadge>
                <AmbientBadge>{selectedCity?.region || 'All Islands'}</AmbientBadge>
                {currentTemp && <AmbientBadge>{currentTemp}° • {currentDesc}</AmbientBadge>}
              </div>

              {!selectedCity && (
                <div className="absolute bottom-8 left-8 max-w-md rounded-3xl border border-white/10 bg-black/70 backdrop-blur-xl p-8">
                  <p className="uppercase tracking-widest text-amber-400 text-sm">Welcome to the forecast</p>
                  <h2 className="text-3xl font-semibold mt-3 leading-tight">Select a city on the map to begin your journey.</h2>
                </div>
              )}
            </div>

            {/* Side Panels */}
            <div className="xl:col-span-4 flex flex-col gap-4">
              {/* Current Story */}
              <div className="flex-1 rounded-3xl border border-white/10 bg-zinc-900/80 backdrop-blur-2xl p-7">
                <p className="uppercase tracking-widest text-xs text-zinc-500">Current Story</p>
                <div className="mt-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-4xl font-semibold leading-none">
                      {selectedCity?.name ?? 'Choose a city'}
                    </h2>
                    <p className="text-zinc-400 mt-2">
                      {selectedCity ? selectedCity.region : 'Interactive map • Real-time data'}
                    </p>
                  </div>
                  <div className="text-6xl opacity-80">
                    {weatherData ? getWeatherIcon(weatherData.current_weather.weathercode) : '☀︎'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-10">
                  <MiniPanel title="Aesthetic">Charcoal glass • Amber warmth</MiniPanel>
                  <MiniPanel title="Mood">Calm • Cinematic • Elevated</MiniPanel>
                  <MiniPanel title="Data">Open-Meteo • Live</MiniPanel>
                </div>
              </div>

              {/* Favorites */}
              <div className="rounded-3xl border border-white/10 bg-zinc-900/80 backdrop-blur-2xl p-7">
                <p className="uppercase tracking-widest text-xs text-zinc-500 mb-4">Quick Access</p>
                <div className="grid grid-cols-2 gap-3">
                  {philippineCities.slice(0, 4).map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCityChange(city.name)}
                      className="group rounded-2xl border border-white/10 bg-zinc-950/50 hover:border-amber-400/30 p-5 text-left transition-all hover:-translate-y-0.5"
                    >
                      <p className="font-medium group-hover:text-amber-400 transition">{city.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">{city.region}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-4 left-4 right-4 lg:hidden z-50">
        <div className="mx-auto max-w-md rounded-full border border-white/10 bg-zinc-900/95 backdrop-blur-2xl p-2 flex items-center justify-around">
          {navItems.map((item, i) => (
            <button
              key={item}
              className={`px-5 py-3 text-xs font-medium tracking-widest rounded-full transition ${i === 0 ? 'bg-amber-400 text-black' : 'text-zinc-400'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* Forecast Drawer */}
      {selectedCity && weatherData && (
        <ForecastDrawer
          city={selectedCity}
          weather={weatherData}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  );
}

/* ====================== Sub Components ====================== */

function HeroStat({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
      <p className="text-xs uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="text-2xl font-semibold mt-2 text-white">{value}</p>
      {detail && <p className="text-sm text-zinc-400 mt-1">{detail}</p>}
    </div>
  );
}

function SearchField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500">⌕</div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 pl-12 pr-5 rounded-2xl border border-white/10 bg-zinc-900 text-sm focus:outline-none focus:border-amber-400/50 placeholder:text-zinc-500"
      />
    </div>
  );
}

function AmbientBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-full border border-white/10 bg-black/60 backdrop-blur-xl px-5 py-2 text-xs uppercase tracking-widest">
      {children}
    </div>
  );
}

function MiniPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5 text-sm">
      <p className="uppercase text-[10px] tracking-widest text-zinc-500 mb-2">{title}</p>
      <p className="text-zinc-300 leading-snug">{children}</p>
    </div>
  );
}

function MapLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-900">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-b-transparent" />
        <p className="text-sm text-zinc-400 mt-4">Rendering atmospheric map...</p>
      </div>
    </div>
  );
}

// You can keep or replace ForecastDrawer with your existing sliding panel logic
function ForecastDrawer({
  city,
  weather,
  isOpen,
  onClose,
}: {
  city: City;
  weather: WeatherData;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div className={`fixed inset-0 z-[2000] transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      
      <div className={`absolute inset-y-0 right-0 w-full max-w-[880px] bg-zinc-950 border-l border-white/10 translate-x-0 transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Drawer Header + Content */}
        {/* Reuse your WeatherAlerts, WeatherCard, HourlyForecast, ForecastChart here */}
      </div>
    </div>
  );
}