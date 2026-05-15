# Quick Start Guide

## 🚀 Get Up and Running in 2 Minutes

### Step 1: Verify Installation
The project is already set up! All dependencies are installed.

### Step 2: Start Development Server
The server is already running at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.1.129:3000

### Step 3: Explore the Application

#### On Desktop:
1. Open http://localhost:3000 in your browser
2. You'll see a map of the Philippines with city markers
3. Click any city marker to view weather details
4. Use the dropdown in the header for quick city selection
5. View current weather card and 7-day forecast charts in the sidebar

#### On Mobile:
1. Access http://192.168.1.129:3000 from your phone (same WiFi)
2. Tap any city marker
3. Weather details appear in a full-screen overlay
4. Tap the X to close and select another city

## 📱 What You'll See

### Map View
- Interactive map centered on the Philippines
- **Color-coded markers**: 
  - 🔴 Red = Very hot (35°C+)
  - 🟠 Orange = Hot (30-35°C)
  - 🟡 Yellow = Warm (25-30°C)
  - 🟢 Green = Comfortable (20-25°C)
  - 🔵 Blue = Cool (15-20°C)

### Weather Card
- City name and region
- Current temperature (large display)
- Weather condition with emoji
- Wind speed and direction
- Estimated humidity
- Coordinates and timestamp

### Forecast Charts
- **Line Chart**: 7-day temperature max/min trends
- **Bar Chart**: Daily precipitation amounts
- **Daily Cards**: Individual day forecasts with icons

## 🎯 Quick Actions to Try

1. **Click Manila** → See current weather for the capital
2. **Click Baguio** → Compare cooler mountain climate
3. **Click Cebu** → View Visayas weather
4. **Click Davao** → Check Mindanao conditions
5. **Use Dropdown** → Quickly jump to any of 26 cities
6. **Resize Window** → Test responsive design
7. **Check on Phone** → Experience mobile layout

## 🔧 Making Changes

### Add More Cities
Edit `src/data/cities.ts`:
```typescript
{ 
  name: "Your City", 
  lat: 14.1234, 
  lon: 121.5678, 
  region: "Your Region" 
}
```

### Change Map Style
Edit `src/components/WeatherMap.tsx`:
```typescript
// Find the TileLayer and change the url prop
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
```

### Adjust Temperature Colors
Edit `src/lib/weatherService.ts`:
```typescript
export const getTemperatureColor = (temperature: number): string => {
  // Modify the temperature ranges and colors
}
```

## 📊 Testing Different Weather

The weather data is **live** from Open-Meteo API, so you'll see:
- Different temperatures across regions
- Varying weather conditions (sunny, rainy, cloudy)
- Real precipitation forecasts
- Actual wind speeds

Try cities at different times to see weather changes!

## 🐛 Troubleshooting

### Map Not Loading?
- Check browser console for errors
- Ensure internet connection is active
- Try refreshing the page

### Weather Data Not Showing?
- Click the marker again
- Check if Open-Meteo API is accessible
- Look for errors in browser console

### Charts Not Rendering?
- Ensure Chart.js loaded properly
- Check browser compatibility
- Try a different browser

### Server Not Starting?
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 📝 Next Steps

1. **Test All Features**: Click through all 26 cities
2. **Mobile Testing**: View on your phone
3. **Customize**: Add your favorite cities
4. **Deploy**: Follow DEPLOYMENT.md when ready
5. **Enhance**: Check FEATURES.md for improvement ideas

## 🎨 Portfolio Tips

When showcasing this project:

1. **Demo Flow**:
   - Start with map overview
   - Click a major city (Manila/Cebu)
   - Show weather card details
   - Scroll to forecast charts
   - Switch to mobile view
   - Demonstrate dropdown selection

2. **Highlight Features**:
   - "Real-time weather from Open-Meteo API"
   - "Interactive map with 26 Philippine cities"
   - "Responsive design for mobile and desktop"
   - "Data visualization with Chart.js"
   - "TypeScript for type safety"

3. **Technical Talking Points**:
   - Next.js 14 with App Router
   - Leaflet.js for mapping
   - Client-side data caching
   - Dynamic marker colors
   - Responsive Tailwind CSS

## 📞 Need Help?

- Check **FEATURES.md** for detailed implementation info
- See **DEPLOYMENT.md** for deployment instructions
- Review **README.md** for full documentation

---

**Happy Weather Tracking!** 🌤️🇵🇭
