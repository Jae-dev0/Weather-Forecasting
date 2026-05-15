## Deployment Guide

### Quick Deploy to Vercel

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit: PH Weather Map Dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/weather-forecast.git
git push -u origin main
```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

### Alternative Deployment Options

#### Netlify
```bash
npm run build
# Deploy the .next folder
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables (Optional)

If you add backend API routes or need custom configuration:

```env
# .env.local
NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
```

### Performance Optimization Tips

1. **Enable Image Optimization** (already configured in Next.js)
2. **Use CDN for static assets**
3. **Enable caching for API responses**
4. **Monitor with Vercel Analytics**

### Post-Deployment Checklist

- [ ] Test all city markers
- [ ] Verify API calls work
- [ ] Check mobile responsiveness
- [ ] Test chart rendering
- [ ] Verify map functionality
- [ ] Update README with live URL
