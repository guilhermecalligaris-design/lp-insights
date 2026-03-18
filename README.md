# Allu Growth Intelligence Dashboard V6.2

Real-time GA4 data with dynamic date filtering, comparative analysis, and revenue attribution.

**Live:** https://lp-insights.vercelapp.com

## What's New (V6.2)

- ✅ **Real GA4 Data**: Replaced fake PRNG generator with live GA4 Data API
- ✅ **Date Filtering**: Full support for any date range + comparative periods
- ✅ **Multi-Filter Support**: Canal (group), Source/Medium, Campaign, Category, Product
- ✅ **Async Loading**: Real-time data fetching with loading states
- ✅ **Metrics Match GA4**: Sessions, Revenue (purchaseRevenue), Funnel, Devices, Regions

**Data Validation:**
- Dashboard: 803k sessions / R$1.47M revenue
- GA4 native: 803k sessions / R$1.47M revenue ✅

## Setup

### Local Development

```bash
npm install
node server.js
# Open http://localhost:3001/index.html
```

Requires `credentials.json` (Google service account). Get it from:
1. Google Cloud Console → APIs & Services → Service Accounts
2. Create/select service account
3. Keys → Add Key → Create new JSON key
4. Place in this directory (`.gitignore` protects it)

### Production (Vercel)

Set these environment variables in Vercel Project Settings:

```
GA4_PRIVATE_KEY_ID     = [from credentials.json]
GA4_PRIVATE_KEY        = [full private key with \n newlines]
GA4_CLIENT_EMAIL       = [from credentials.json]
GA4_PROJECT_ID         = [from credentials.json]
```

Server automatically detects env vars vs local credentials.json.

## API Endpoints

### GET /api/data
Fetch analytics for a date range with filters.

**Query params:**
- `start` (YYYY-MM-DD) - Period start
- `end` (YYYY-MM-DD) - Period end
- `compare_mode` - `prev_period`, `prev_month_dates`, `prev_month_days`
- `source` (optional) - sessionSourceMedium filter
- `channel` (optional) - sessionDefaultChannelGrouping filter
- `campaign` (optional) - sessionCampaignName filter
- `category` (optional) - itemCategory filter
- `product` (optional) - itemName filter

**Response:** Current period + previous period metrics (KPIs, channels, funnel, devices, regions, cities, products, categories)

### GET /api/filters
Get available filter options (dropdowns) from GA4.

**Query params:**
- `start` (optional) - Filter by date
- `end` (optional)

**Response:** Lists of sourceMediums, channelGroups, campaigns, categories, products

## Architecture

- **Frontend**: Vanilla JS (app.js, styles.css)
- **Backend**: Express.js + @google-analytics/data (GA4 API client)
- **Data**: 10 concurrent GA4 reports per request (optimized for speed)

## Troubleshooting

### 403 Credentials Error
- Check GA4_* env vars are set in Vercel
- Verify service account has GA4 read permissions
- Local: ensure credentials.json exists and is valid

### Mismatch with GA4 UI
- GA4 applies 48h processing delay
- Small ~2% variance is normal
- Use same date range for comparison

## Files

- `server.js` - Express backend + GA4 queries
- `app.js` - Frontend logic (async filters, rendering)
- `index.html` - UI layout + filter dropdowns
- `data.js` - Client config (API base URL)
- `styles.css` - Dashboard styles (unchanged from V6.1)
- `package.json` - Dependencies
- `.env.example` - Required env vars reference

---

**Last updated:** Mar 17, 2026
**Built with:** Claude + GA4 Data API v1
