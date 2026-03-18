// ============================================================
// Allu Growth Dashboard — GA4 Real Data Server
// Runs on http://localhost:3001
// ============================================================
const express = require('express');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const PROPERTY_ID = '316747128';

// Load credentials from environment variables or file (for local dev)
const analyticsClient = new BetaAnalyticsDataClient(
  process.env.GA4_PRIVATE_KEY
    ? {
        projectId: process.env.GA4_PROJECT_ID,
        keyId: process.env.GA4_PRIVATE_KEY_ID,
        privateKey: process.env.GA4_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.GA4_CLIENT_EMAIL
      }
    : { keyFilename: path.join(__dirname, 'credentials.json') }
);

app.use(cors());
app.use(express.static(__dirname));

// ─── Helper: run a GA4 report ────────────────────────────────
async function runReport(params) {
  const [response] = await analyticsClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    ...params
  });
  return response;
}

// ─── Helper: build dimension filter ──────────────────────────
function dimFilter(fieldName, value) {
  if (!value || value === 'all' || value === '') return null;
  return { filter: { fieldName, stringFilter: { value, matchType: 'EXACT' } } };
}

function andFilters(...filters) {
  const valid = filters.filter(Boolean);
  if (!valid.length) return undefined;
  if (valid.length === 1) return valid[0];
  return { andGroup: { expressions: valid } };
}

// ─── Fetch all data for one period ───────────────────────────
async function fetchPeriod(startDate, endDate, { source, channel, campaign, category, product } = {}) {
  const dateRanges = [{ startDate, endDate }];

  // Filters
  const sourceFilter = dimFilter('sessionSourceMedium', source);
  const channelFilter = dimFilter('sessionDefaultChannelGrouping', channel);
  const campaignFilter = dimFilter('sessionCampaignName', campaign);
  const trafficFilter = andFilters(sourceFilter, channelFilter, campaignFilter);

  const categoryFilter = dimFilter('itemCategory', category);
  const productFilter = dimFilter('itemName', product);
  const productDimFilter = andFilters(categoryFilter, productFilter);

  const funnelEvents = [
    'page_view', 'view_item', 'add_to_cart', 'begin_checkout',
    'add_personal_info', 'add_shipping_info', 'add_payment_info', 'purchase'
  ];

  // Run all 10 queries in parallel
  const [
    kpiRes,
    sparkRes,
    channelGroupRes,
    sourceMediumRes,
    funnelRes,
    deviceRes,
    regionRes,
    cityRes,
    productRes,
    categoryRes
  ] = await Promise.all([

    // 1. KPI totals
    runReport({
      dateRanges,
      metrics: [
        { name: 'sessions' }, { name: 'activeUsers' }, { name: 'newUsers' },
        { name: 'engagementRate' }, { name: 'bounceRate' },
        { name: 'averageSessionDuration' }, { name: 'purchaseRevenue' },
        { name: 'transactions' }
      ],
      dimensionFilter: trafficFilter || undefined
    }),

    // 2. Daily sparkline (sessions + users per day)
    runReport({
      dateRanges,
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'engagementRate' }, { name: 'bounceRate' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
      dimensionFilter: trafficFilter || undefined
    }),

    // 3. Channel groups
    runReport({
      dateRanges,
      dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
      metrics: [
        { name: 'sessions' }, { name: 'transactions' }, { name: 'purchaseRevenue' },
        { name: 'engagementRate' }, { name: 'averageSessionDuration' }, { name: 'screenPageViews' }
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      dimensionFilter: trafficFilter || undefined
    }),

    // 4. Source / Medium
    runReport({
      dateRanges,
      dimensions: [
        { name: 'sessionSourceMedium' },
        { name: 'sessionDefaultChannelGrouping' }
      ],
      metrics: [
        { name: 'sessions' }, { name: 'transactions' }, { name: 'purchaseRevenue' },
        { name: 'engagementRate' }, { name: 'averageSessionDuration' }, { name: 'screenPageViews' }
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 25,
      dimensionFilter: trafficFilter || undefined
    }),

    // 5. Funnel events
    runReport({
      dateRanges,
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: { values: funnelEvents }
        }
      }
    }),

    // 6. Device categories
    runReport({
      dateRanges,
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [
        { name: 'sessions' }, { name: 'transactions' },
        { name: 'engagementRate' }, { name: 'averageSessionDuration' }
      ],
      dimensionFilter: trafficFilter || undefined
    }),

    // 7. Regions (states)
    runReport({
      dateRanges,
      dimensions: [{ name: 'region' }],
      metrics: [{ name: 'sessions' }, { name: 'transactions' }, { name: 'purchaseRevenue' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 15,
      dimensionFilter: trafficFilter || undefined
    }),

    // 8. Cities
    runReport({
      dateRanges,
      dimensions: [{ name: 'city' }],
      metrics: [{ name: 'sessions' }, { name: 'transactions' }, { name: 'purchaseRevenue' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 20,
      dimensionFilter: trafficFilter || undefined
    }),

    // 9. Products
    runReport({
      dateRanges,
      dimensions: [{ name: 'itemName' }, { name: 'itemCategory' }],
      metrics: [
        { name: 'itemViews' }, { name: 'itemsPurchased' },
        { name: 'itemRevenue' }, { name: 'averageSessionDuration' }
      ],
      orderBys: [{ metric: { metricName: 'itemRevenue' }, desc: true }],
      limit: 25,
      dimensionFilter: productDimFilter || undefined
    }),

    // 10. Categories
    runReport({
      dateRanges,
      dimensions: [{ name: 'itemCategory' }],
      metrics: [{ name: 'itemViews' }, { name: 'itemsPurchased' }, { name: 'itemRevenue' }],
      orderBys: [{ metric: { metricName: 'itemRevenue' }, desc: true }],
      dimensionFilter: categoryFilter || undefined
    })
  ]);

  // ── Parse KPIs ──────────────────────────────────────────────
  const kr = kpiRes.rows?.[0]?.metricValues || [];
  const kpis = {
    sessions:        parseInt(kr[0]?.value  || 0),
    users:           parseInt(kr[1]?.value  || 0),
    newUsers:        parseInt(kr[2]?.value  || 0),
    engagementRate:  parseFloat(kr[3]?.value || 0),
    bounceRate:      parseFloat(kr[4]?.value || 0),
    avgDuration:     parseFloat(kr[5]?.value || 0),
    revenue:         parseFloat(kr[6]?.value || 0),
    purchases:       parseInt(kr[7]?.value  || 0)
  };

  // ── Parse Sparklines ────────────────────────────────────────
  const sparklines = (sparkRes.rows || []).map(r => {
    const raw = r.dimensionValues[0].value; // "20260301"
    const d = `${raw.slice(6,8)}/${raw.slice(4,6)}`;
    return {
      d,
      s:      parseInt(r.metricValues[0].value),
      u:      parseInt(r.metricValues[1].value),
      eng:    parseFloat(r.metricValues[2].value),
      bounce: parseFloat(r.metricValues[3].value)
    };
  });

  // ── Parse Channel Groups ─────────────────────────────────────
  const channelGroups = (channelGroupRes.rows || []).map(r => ({
    name:        r.dimensionValues[0].value,
    sessions:    parseInt(r.metricValues[0].value),
    purchases:   parseInt(r.metricValues[1].value),
    revenue:     parseFloat(r.metricValues[2].value),
    engRate:     parseFloat(r.metricValues[3].value),
    avgDuration: parseFloat(r.metricValues[4].value),
    pageviews:   parseInt(r.metricValues[5].value)
  }));

  // ── Parse Source / Medium ────────────────────────────────────
  const channels = (sourceMediumRes.rows || []).map(r => ({
    name:        r.dimensionValues[0].value,
    group:       r.dimensionValues[1].value,
    sessions:    parseInt(r.metricValues[0].value),
    purchases:   parseInt(r.metricValues[1].value),
    revenue:     parseFloat(r.metricValues[2].value),
    engRate:     parseFloat(r.metricValues[3].value),
    avgDuration: parseFloat(r.metricValues[4].value),
    pageviews:   parseInt(r.metricValues[5].value)
  }));

  // ── Parse Funnel ─────────────────────────────────────────────
  const funnelMap = {};
  (funnelRes.rows || []).forEach(r => {
    funnelMap[r.dimensionValues[0].value] = parseInt(r.metricValues[0].value);
  });
  const funnel = {
    page_view:        funnelMap['page_view']        || 0,
    view_item:        funnelMap['view_item']         || 0,
    add_to_cart:      funnelMap['add_to_cart']       || 0,
    begin_checkout:   funnelMap['begin_checkout']    || 0,
    add_personal_info: funnelMap['add_personal_info'] || funnelMap['add_payment_info'] || 0,
    add_shipping_info: funnelMap['add_shipping_info'] || 0,
    purchase:         funnelMap['purchase']          || kpis.purchases
  };

  // ── Parse Devices ────────────────────────────────────────────
  const deviceNameMap = { mobile: 'Mobile', desktop: 'Desktop', tablet: 'Tablet' };
  const devices = (deviceRes.rows || []).map(r => ({
    name:        deviceNameMap[r.dimensionValues[0].value] || r.dimensionValues[0].value,
    sessions:    parseInt(r.metricValues[0].value),
    purchases:   parseInt(r.metricValues[1].value),
    engRate:     parseFloat(r.metricValues[2].value),
    avgDuration: parseFloat(r.metricValues[3].value)
  }));

  // ── Parse Regions ─────────────────────────────────────────────
  const regions = (regionRes.rows || [])
    .filter(r => r.dimensionValues[0].value && r.dimensionValues[0].value !== '(not set)')
    .map(r => ({
      name:      r.dimensionValues[0].value,
      sessions:  parseInt(r.metricValues[0].value),
      purchases: parseInt(r.metricValues[1].value),
      revenue:   parseFloat(r.metricValues[2].value),
      engRate:   0.95,
      avgDuration: kpis.avgDuration
    }));

  // ── Parse Cities ──────────────────────────────────────────────
  const cities = (cityRes.rows || [])
    .filter(r => r.dimensionValues[0].value && r.dimensionValues[0].value !== '(not set)')
    .map(r => ({
      name:      r.dimensionValues[0].value,
      sessions:  parseInt(r.metricValues[0].value),
      purchases: parseInt(r.metricValues[1].value),
      revenue:   parseFloat(r.metricValues[2].value),
      engRate:   0.96,
      avgDuration: kpis.avgDuration
    }));

  // ── Parse Products ────────────────────────────────────────────
  const products = (productRes.rows || [])
    .filter(r => r.dimensionValues[0].value && r.dimensionValues[0].value !== '(not set)')
    .map(r => ({
      name:        r.dimensionValues[0].value,
      category:    r.dimensionValues[1].value,
      views:       parseInt(r.metricValues[0].value),
      purchases:   parseFloat(r.metricValues[1].value),
      revenue:     parseFloat(r.metricValues[2].value),
      engRate:     0.95,
      duration:    parseFloat(r.metricValues[3].value)
    }));

  // ── Parse Categories ──────────────────────────────────────────
  const categories = (categoryRes.rows || [])
    .filter(r => r.dimensionValues[0].value && r.dimensionValues[0].value !== '(not set)')
    .map(r => ({
      name:        r.dimensionValues[0].value,
      views:       parseInt(r.metricValues[0].value),
      purchases:   parseFloat(r.metricValues[1].value),
      revenue:     parseFloat(r.metricValues[2].value),
      avgDuration: kpis.avgDuration
    }));

  return { kpis, sparklines, channels, channelGroups, funnel, devices, regions, cities, products, categories };
}

// ─── Date math ────────────────────────────────────────────────
function calcComparisonDates(start, end, mode) {
  const s = new Date(start), e = new Date(end);
  const days = Math.round((e - s) / 86400000) + 1;
  let cs = new Date(s), ce = new Date(e);

  if (mode === 'prev_period') {
    cs.setDate(s.getDate() - days);
    ce.setDate(e.getDate() - days);
  } else if (mode === 'prev_month_dates') {
    cs.setMonth(s.getMonth() - 1);
    ce.setMonth(e.getMonth() - 1);
  } else if (mode === 'prev_month_days') {
    cs.setDate(s.getDate() - 28);
    ce.setDate(e.getDate() - 28);
  }

  const fmt = d => d.toISOString().slice(0, 10);
  return { compareStart: fmt(cs), compareEnd: fmt(ce) };
}

function fmtDateBR(isoDate) {
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

// ─── /api/data endpoint ───────────────────────────────────────
app.get('/api/data', async (req, res) => {
  const { start, end, compare_mode = 'prev_period', source, channel, campaign, category, product } = req.query;
  if (!start || !end) return res.status(400).json({ error: 'start and end required' });

  const filters = { source, channel, campaign, category, product };

  try {
    const { compareStart, compareEnd } = calcComparisonDates(start, end, compare_mode);
    const days = Math.round((new Date(end) - new Date(start)) / 86400000) + 1;

    const [current, previous] = await Promise.all([
      fetchPeriod(start, end, filters),
      fetchPeriod(compareStart, compareEnd, filters)
    ]);

    res.json({
      rawStart: start,
      rawEnd: end,
      label: `${days} dias`,
      currentText: `${fmtDateBR(start)} até ${fmtDateBR(end)}`,
      previousText: `${fmtDateBR(compareStart)} até ${fmtDateBR(compareEnd)}`,
      current,
      previous
    });
  } catch (err) {
    console.error('GA4 Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── /api/filters — populate dropdowns from GA4 ───────────────
app.get('/api/filters', async (req, res) => {
  const { start, end } = req.query;
  const dateRanges = [{ startDate: start || '30daysAgo', endDate: end || 'today' }];

  try {
    const [smRes, campaignRes, categoryRes, productRes] = await Promise.all([
      runReport({
        dateRanges,
        dimensions: [{ name: 'sessionSourceMedium' }, { name: 'sessionDefaultChannelGrouping' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 30
      }),
      runReport({
        dateRanges,
        dimensions: [{ name: 'sessionCampaignName' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 30
      }),
      runReport({
        dateRanges,
        dimensions: [{ name: 'itemCategory' }],
        metrics: [{ name: 'itemViews' }],
        orderBys: [{ metric: { metricName: 'itemViews' }, desc: true }]
      }),
      runReport({
        dateRanges,
        dimensions: [{ name: 'itemName' }, { name: 'itemCategory' }],
        metrics: [{ name: 'itemViews' }],
        orderBys: [{ metric: { metricName: 'itemViews' }, desc: true }],
        limit: 50
      })
    ]);

    const sourceMediums = (smRes.rows || [])
      .filter(r => r.dimensionValues[0].value !== '(not set)')
      .map(r => ({ name: r.dimensionValues[0].value, group: r.dimensionValues[1].value }));

    const channelGroups = [...new Set(sourceMediums.map(s => s.group))].filter(Boolean);

    const campaigns = (campaignRes.rows || [])
      .map(r => r.dimensionValues[0].value)
      .filter(v => v && v !== '(not set)' && v !== '(direct)');

    const categories = (categoryRes.rows || [])
      .map(r => r.dimensionValues[0].value)
      .filter(v => v && v !== '(not set)');

    const products = (productRes.rows || [])
      .filter(r => r.dimensionValues[0].value && r.dimensionValues[0].value !== '(not set)')
      .map(r => ({ name: r.dimensionValues[0].value, category: r.dimensionValues[1].value }));

    res.json({ sourceMediums, channelGroups, campaigns, categories, products });
  } catch (err) {
    console.error('Filters Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Local dev: start server directly. Vercel: export app as serverless function.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n✅ Allu GA4 Dashboard Server rodando`);
    console.log(`   → Abra: http://localhost:${PORT}/index.html\n`);
  });
}

module.exports = app;
