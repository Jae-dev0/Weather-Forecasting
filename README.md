# PH Weather Map Dashboard

An interactive map-based weather dashboard displaying real-time weather data and 7-day forecasts for major cities across the Philippines.

![PH Weather Map Dashboard](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8) ![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green)

## 🌟 Features

- **Interactive Map**: Explore weather across the Philippines with an intuitive Leaflet.js map interface
- **Real-time Weather**: Current temperature, wind speed, humidity, and conditions from Open-Meteo API
- **7-Day Forecast**: Visual charts showing temperature trends and precipitation predictions
- **Color-Coded Markers**: Temperature-based color coding for quick visual reference
- **Responsive Design**: Fully responsive layout works seamlessly on desktop and mobile devices
- **26 Major Cities**: Coverage of key cities across Luzon, Visayas, and Mindanao
- **City Quick Select**: Dropdown menu for fast navigation to specific cities
- **Weather Icons**: Emoji-based weather condition indicators

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Map Library**: [Leaflet.js](https://leafletjs.com/) with [React-Leaflet](https://react-leaflet.js.org/)
- **Charts**: [Chart.js](https://www.chartjs.org/) with [React-ChartJS-2](https://react-chartjs-2.js.org/)
- **API Client**: [Axios](https://axios-http.com/)
- **Date Formatting**: [date-fns](https://date-fns.org/)
- **Weather Data**: [Open-Meteo API](https://open-meteo.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page (Dashboard)
│   └── globals.css         # Global styles and Leaflet customizations
├── components/
│   ├── Dashboard.tsx       # Main dashboard layout
│   ├── WeatherMap.tsx      # Interactive map with city markers
│   ├── WeatherCard.tsx     # Current weather display card
│   └── ForecastChart.tsx   # Temperature & precipitation charts
├── data/
│   └── cities.ts           # Philippine cities data (26 cities)
└── lib/
    └── weatherService.ts   # Open-Meteo API integration
```

## 🌐 API Usage

This project uses the free [Open-Meteo API](https://open-meteo.com/) which requires no API key. The service fetches:

- Current weather conditions
- 7-day temperature forecasts (max/min)
- Precipitation predictions
- Weather codes for condition descriptions

## 🎨 Features in Detail

### Interactive Map
- Pan and zoom across the Philippines
- Click city markers to view weather details
- Automatic map animation when selecting cities via dropdown
- Color-coded temperature markers (red=hot, blue=cold)

### Weather Display
- Current temperature with weather icon
- Wind speed and direction
- Estimated humidity levels
- Timestamp of last update

### Forecast Charts
- **Temperature Trend**: Line chart showing 7-day max/min temperatures
- **Precipitation Chart**: Bar chart displaying expected rainfall
- **Daily Cards**: Quick overview with weather icons and key stats

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and deploy

### Build for Production

```bash
npm run build
npm start
```

## 🌍 Covered Cities

**Luzon**: Manila, Quezon City, Baguio, Laoag, Tuguegarao, Olongapo, Cabanatuan, Batangas City, Lucena, Naga, Legazpi

**Visayas**: Iloilo City, Bacolod, Cebu City, Dumaguete, Tagbilaran, Tacloban, Ormoc

**Mindanao**: Zamboanga City, Pagadian, Cagayan de Oro, Iligan, Butuan, Davao City, General Santos, Cotabato City

## 📊 Portfolio Highlights

This project demonstrates:

- ✅ **Full-stack capabilities** with Next.js
- ✅ **Modern React patterns** (hooks, dynamic imports, state management)
- ✅ **TypeScript proficiency** with strong typing
- ✅ **Third-party API integration** and data parsing
- ✅ **Interactive data visualization** with Chart.js
- ✅ **Responsive UI/UX design** with Tailwind CSS
- ✅ **Map integration** using Leaflet.js
- ✅ **Production-ready code** with proper error handling

## 🔧 Customization

### Add More Cities

Edit `src/data/cities.ts`:

```typescript
{ name: "Your City", lat: 14.1234, lon: 121.5678, region: "Your Region" }
```

### Change Temperature Colors

Edit the `getTemperatureColor()` function in `src/lib/weatherService.ts`

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Weather data from [Open-Meteo](https://open-meteo.com/)
- Map tiles from [OpenStreetMap](https://www.openstreetmap.org/)
- Built with Next.js, Leaflet.js, and Chart.js

---

**Built with ❤️ for the Philippines** 🇵🇭

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
