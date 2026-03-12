// ============================================================
// V6.5 — Data Engine — purchaseRevenue calibrated from GA4
// ============================================================

// UTM Source → Canal / Grupo (from Allu de-para-utm)
window.UTM_MAP = {
  "(direct)":  {canal:"Direto",grupo:"Direto"},
  "direct":    {canal:"Direto",grupo:"Direto"},
  "google":    {canal:"Google Ads",grupo:"Mídia Paga"},
  "meta":      {canal:"Meta Ads",grupo:"Mídia Paga"},
  "facebook":  {canal:"Meta Ads",grupo:"Mídia Paga"},
  "fb":        {canal:"Meta Ads",grupo:"Mídia Paga"},
  "ig":        {canal:"Instagram",grupo:"Social Orgânico"},
  "instagram": {canal:"Instagram",grupo:"Social Orgânico"},
  "bing":      {canal:"Bing",grupo:"Pesquisa Orgânica"},
  "tiktok":    {canal:"TikTok Ads",grupo:"Mídia Paga"},
  "tiktok.com":{canal:"TikTok Ads",grupo:"Mídia Paga"},
  "hs_email":  {canal:"CRM",grupo:"CRM"},
  "hs_automation":{canal:"CRM",grupo:"CRM"},
  "crm":       {canal:"CRM",grupo:"CRM"},
  "email":     {canal:"CRM",grupo:"CRM"},
  "EMAIL":     {canal:"CRM",grupo:"CRM"},
  "parcerias": {canal:"Parcerias",grupo:"Parcerias"},
  "in_app":    {canal:"PicPay",grupo:"Parcerias"},
  "site":      {canal:"Site",grupo:"Site"},
  "whatsapp":  {canal:"WhatsApp",grupo:"Social Orgânico"},
  "youtube":   {canal:"YouTube",grupo:"Social Orgânico"},
  "youtube.com":{canal:"YouTube",grupo:"Social Orgânico"},
  "kwai":      {canal:"Kwai",grupo:"Mídia Paga"},
  "criteo":    {canal:"Criteo",grupo:"Mídia Paga"},
  "socialsoul":{canal:"Afiliados",grupo:"Parcerias"},
  "awin":      {canal:"Awin",grupo:"Parcerias"},
  "chatgpt.com":{canal:"Chat GPT",grupo:"Buscadores IA"},
  "perplexity":{canal:"Perplexity",grupo:"Buscadores IA"},
  "gemini.google.com":{canal:"Gemini",grupo:"Buscadores IA"},
  "l.instagram.com":{canal:"Instagram",grupo:"Social Orgânico"},
  "l.wl.co":   {canal:"Instagram",grupo:"Social Orgânico"},
  "m.facebook.com":{canal:"Facebook",grupo:"Social Orgânico"},
  "l.facebook.com":{canal:"Facebook",grupo:"Social Orgânico"},
  "lm.facebook.com":{canal:"Facebook",grupo:"Social Orgânico"},
  "br.search.yahoo.com":{canal:"Yahoo",grupo:"Pesquisa Orgânica"},
  "duckduckgo":{canal:"DuckDuckGo",grupo:"Pesquisa Orgânica"},
  "vendas":    {canal:"Vendas",grupo:"Interno"},
  "allugator.desk.blip.ai":{canal:"Interno",grupo:"Interno"},
  "NI":        {canal:"Nulo",grupo:"Nulo"},
  "(not set)": {canal:"Nulo",grupo:"Nulo"},
  "facebookads":{canal:"Meta Ads",grupo:"Mídia Paga"},
  "meta-SiteLink":{canal:"Meta Ads",grupo:"Mídia Paga"},
};
window.UTM_MEDIUM_OVERRIDES = {
  "organic":       {canal:"Google",grupo:"Pesquisa Orgânica"},
  "organic_social":{grupo:"Social Orgânico"},
  "referral":      {grupo:"Parcerias"},
  "email":         {grupo:"CRM"},
  "paid_social":   {grupo:"Mídia Paga"},
  "cpc":           {grupo:"Mídia Paga"},
};

// ============================================================
// GA4 Calibration — purchaseRevenue + purchase events (30d)
// Total purchaseRevenue (30d) ≈ R$2,833,887
// Total purchase events (30d) = 7,089
// Total sessions (30d) ≈ 1,537,419
// Avg purchaseRevenue/day ≈ R$93,000
// Avg ticket (purchaseRevenue / purchases) ≈ R$400
// ============================================================
const GA4_CALIBRATION = {
  dailySessions: 51247,
  dailyPurchaseRevenue: 93000,
  dailyPurchases: 236,
  avgTicket: 400,  // purchaseRevenue / purchases
  // Channel share of purchaseRevenue (from GA4 sessionSourceMedium)
  channelRevShare: {
    "(direct) / (none)":      695503 / 2833887,
    "google / cpc":           662673 / 2833887,
    "meta / paid_social":     403662 / 2833887,
    "google / organic":       303791 / 2833887,
    "ig / organic_social":    174944 / 2833887,
    "site / organic_social":  59549 / 2833887,
    "(not set)":              46834 / 2833887,
    "tiktok / paid_social":   25248 / 2833887,
    "parcerias / referral":   21442 / 2833887,
    "bing / organic":         27435 / 2833887,
    "email / newsletter":     14310 / 2833887,
    "whatsapp / organic_social": 9237 / 2833887,
    "kwai / paid_social":     1170 / 2833887,
    "youtube / paid_video":   1679 / 2833887,
    "criteo / retargeting":   8394 / 2833887,
    "sms / push":             6635 / 2833887,
  },
  // Channel purchase counts (from GA4)
  channelPurchases: {
    "(direct) / (none)":      1943,
    "google / cpc":           1761,
    "meta / paid_social":     994,
    "google / organic":       786,
    "ig / organic_social":    442,
    "site / organic_social":  140,
    "(not set)":              132,
    "tiktok / paid_social":   68,
    "parcerias / referral":   54,
    "bing / organic":         73,
    "email / newsletter":     36,
    "whatsapp / organic_social": 26,
    "kwai / paid_social":     4,
    "youtube / paid_video":   4,
    "criteo / retargeting":   23,
    "sms / push":             25,
  },
  // Funnel events (30d from GA4)
  funnelTotals: {
    page_view: 6014068,
    view_item: 2305115,
    add_to_cart: 188425,
    begin_checkout: 232739,
    add_personal_info: 107203,
    add_shipping_info: 83403,
    add_payment_info: 0,  // not separate in GA4, estimated
    purchase: 7089
  }
};

window.ALLU_CONTEXT = {
  channels: [
    { name:"meta / paid_social", group:"Paid Social", canal:"Meta Ads", grupo:"Mídia Paga", sessions:675199, purchases:994, revenue:403662, shareS:0.44, cr:0.00147, bounce:0.06, eng:0.98, dur:120 },
    { name:"google / cpc", group:"Paid Search", canal:"Google Ads", grupo:"Mídia Paga", sessions:197562, purchases:1761, revenue:662673, shareS:0.13, cr:0.00891, bounce:0.04, eng:0.97, dur:240 },
    { name:"(direct) / (none)", group:"Direct", canal:"Direto", grupo:"Direto", sessions:166316, purchases:1943, revenue:695503, shareS:0.11, cr:0.01168, bounce:0.03, eng:0.98, dur:300 },
    { name:"ig / organic_social", group:"Organic Social", canal:"Instagram", grupo:"Social Orgânico", sessions:92556, purchases:442, revenue:174944, shareS:0.06, cr:0.00477, bounce:0.05, eng:0.99, dur:160 },
    { name:"google / organic", group:"Organic Search", canal:"Google", grupo:"Pesquisa Orgânica", sessions:85838, purchases:786, revenue:303791, shareS:0.056, cr:0.00916, bounce:0.03, eng:0.97, dur:260 },
    { name:"tiktok / paid_social", group:"Paid Social", canal:"TikTok Ads", grupo:"Mídia Paga", sessions:66873, purchases:68, revenue:25248, shareS:0.043, cr:0.00102, bounce:0.08, eng:0.98, dur:90 },
    { name:"(not set)", group:"Unassigned", canal:"Nulo", grupo:"Nulo", sessions:65002, purchases:132, revenue:46834, shareS:0.042, cr:0.00203, bounce:0.91, eng:0.09, dur:15 },
    { name:"parcerias / referral", group:"Referral", canal:"Parcerias", grupo:"Parcerias", sessions:62122, purchases:54, revenue:21442, shareS:0.04, cr:0.00087, bounce:0.05, eng:0.98, dur:110 },
    { name:"bing / organic", group:"Organic Search", canal:"Bing", grupo:"Pesquisa Orgânica", sessions:4481, purchases:73, revenue:27435, shareS:0.003, cr:0.01629, bounce:0.04, eng:0.96, dur:230 },
    { name:"email / newsletter", group:"Email", canal:"CRM", grupo:"CRM", sessions:7031, purchases:36, revenue:14310, shareS:0.005, cr:0.00512, bounce:0.02, eng:0.99, dur:280 },
    { name:"whatsapp / organic_social", group:"Organic Social", canal:"WhatsApp", grupo:"Social Orgânico", sessions:3987, purchases:26, revenue:9237, shareS:0.003, cr:0.00652, bounce:0.03, eng:0.98, dur:200 },
    { name:"kwai / paid_social", group:"Paid Social", canal:"Kwai", grupo:"Mídia Paga", sessions:1426, purchases:4, revenue:1170, shareS:0.001, cr:0.0028, bounce:0.10, eng:0.96, dur:70 },
    { name:"youtube / paid_video", group:"Paid Video", canal:"YouTube", grupo:"Mídia Paga", sessions:485, purchases:4, revenue:1679, shareS:0.0003, cr:0.00825, bounce:0.07, eng:0.97, dur:95 },
    { name:"criteo / retargeting", group:"Display", canal:"Criteo", grupo:"Mídia Paga", sessions:1661, purchases:23, revenue:8394, shareS:0.001, cr:0.01385, bounce:0.05, eng:0.94, dur:130 },
    { name:"sms / push", group:"Push", canal:"CRM", grupo:"CRM", sessions:2489, purchases:25, revenue:6635, shareS:0.002, cr:0.01004, bounce:0.04, eng:0.97, dur:180 },
  ],
  campaigns: [
    { name:"allu_acquisition_iphone17_br", share:0.22 },
    { name:"allu_retargeting_abandoners_br", share:0.15 },
    { name:"allu_brand_awareness_br", share:0.12 },
    { name:"allu_ps5_promo_br", share:0.08 },
    { name:"allu_galaxy_s25_launch_br", share:0.06 },
    { name:"allu_iphone16_evergreen_br", share:0.05 },
    { name:"allu_wearables_push_br", share:0.04 },
    { name:"allu_notebook_back2school_br", share:0.03 },
    { name:"(not set)", share:0.18 },
    { name:"(organic)", share:0.07 },
  ],
  devices: [
    { name:"Mobile", share:0.92, crMod:1.0, dur:150, eng:0.95 },
    { name:"Desktop", share:0.07, crMod:3.7, dur:370, eng:0.84 },
    { name:"Tablet", share:0.01, crMod:0.9, dur:210, eng:0.93 },
  ],
  regions: [
    { name:"São Paulo", share:0.30, crMod:1.2, dur:170 },
    { name:"Minas Gerais", share:0.11, crMod:1.0, dur:185 },
    { name:"Rio de Janeiro", share:0.10, crMod:1.1, dur:160 },
    { name:"Paraná", share:0.06, crMod:1.0, dur:165 },
    { name:"Rio Grande do Sul", share:0.05, crMod:0.9, dur:180 },
    { name:"Bahia", share:0.05, crMod:0.75, dur:165 },
    { name:"Santa Catarina", share:0.04, crMod:0.9, dur:160 },
    { name:"Goiás", share:0.03, crMod:0.7, dur:155 },
    { name:"Pernambuco", share:0.03, crMod:0.65, dur:150 },
    { name:"Ceará", share:0.02, crMod:0.6, dur:148 },
  ],
  cities: [
    { name:"São Paulo", share:0.15, crMod:1.3, dur:175 },
    { name:"Rio de Janeiro", share:0.06, crMod:1.1, dur:171 },
    { name:"Belo Horizonte", share:0.04, crMod:1.0, dur:214 },
    { name:"Curitiba", share:0.03, crMod:1.1, dur:176 },
    { name:"Porto Alegre", share:0.025, crMod:0.95, dur:187 },
    { name:"Brasília", share:0.025, crMod:1.1, dur:165 },
    { name:"Campinas", share:0.02, crMod:1.0, dur:170 },
    { name:"Fortaleza", share:0.02, crMod:0.7, dur:158 },
    { name:"Salvador", share:0.018, crMod:0.6, dur:152 },
    { name:"Goiânia", share:0.015, crMod:0.65, dur:149 },
  ],
  // Product data calibrated from GA4 itemRevenue & itemsPurchased
  products: [
    { name:"iPhone 17 Pro Max 256GB", category:"Smartphones", shareV:0.12, cr:0.0027, avgRevenue:720, dur:200 },
    { name:"iPhone 17 Pro 256GB",     category:"Smartphones", shareV:0.12, cr:0.0015, avgRevenue:664, dur:195 },
    { name:"iPhone 16 128GB",         category:"Smartphones", shareV:0.08, cr:0.0042, avgRevenue:378, dur:160 },
    { name:"iPhone 15 128GB",         category:"Smartphones", shareV:0.07, cr:0.0043, avgRevenue:301, dur:150 },
    { name:"Samsung Galaxy S25 5G",   category:"Smartphones", shareV:0.05, cr:0.0016, avgRevenue:375, dur:180 },
    { name:"iPhone 16 Pro Max 256GB", category:"Smartphones", shareV:0.04, cr:0.0023, avgRevenue:571, dur:195 },
    { name:"PS5 Slim Digital",        category:"Consoles",     shareV:0.04, cr:0.0163, avgRevenue:256, dur:210 },
    { name:"iPhone 17 256GB",         category:"Smartphones", shareV:0.035, cr:0.0023, avgRevenue:473, dur:195 },
    { name:"PS5 Pro",                 category:"Consoles",     shareV:0.025, cr:0.0108, avgRevenue:437, dur:220 },
    { name:"Nintendo Switch V2",      category:"Consoles",     shareV:0.02, cr:0.0028, avgRevenue:167, dur:175 },
    { name:"MacBook Pro M5 14",       category:"Notebooks",    shareV:0.018, cr:0.0055, avgRevenue:793, dur:280 },
    { name:"Notebook Acer TravelMate i5", category:"Notebooks", shareV:0.015, cr:0.0255, avgRevenue:212, dur:260 },
    { name:"Apple Watch Series 10",   category:"Wearables",    shareV:0.015, cr:0.0120, avgRevenue:129, dur:140 },
    { name:"Samsung Galaxy Watch 7",  category:"Wearables",    shareV:0.012, cr:0.0100, avgRevenue:99, dur:130 },
    { name:"AirPods Pro 3",           category:"Wearables",    shareV:0.01, cr:0.0200, avgRevenue:79, dur:100 },
    { name:"iPad Air M2",             category:"Tablets",      shareV:0.01, cr:0.0080, avgRevenue:299, dur:240 },
    { name:"Samsung Galaxy S24 FE",   category:"Smartphones", shareV:0.01, cr:0.0140, avgRevenue:199, dur:155 },
    { name:"Notebook Lenovo IdeaPad i7", category:"Notebooks", shareV:0.008, cr:0.0044, avgRevenue:287, dur:250 },
  ],
  // Funnel rates calibrated from GA4 event counts (relative to page_view)
  // page_view=6,014,068  view_item=2,305,115  add_to_cart=188,425
  // begin_checkout=232,739  add_personal_info=107,203  add_shipping_info=83,403
  // purchase=7,089
  funnelRates: { pv:1.0, vi:0.383, atc:0.031, chk:0.0387, pi:0.0178, si:0.0139, api:0.009, pur:0.00118 }
};

// Seeded PRNG
function sfc32(a,b,c,d){return function(){a>>>=0;b>>>=0;c>>>=0;d>>>=0;let t=(a+b)|0;a=b^b>>>9;b=(c+(c<<3))|0;c=(c<<21)|(c>>>11);d=(d+1)|0;t=(t+d)|0;c=(c+t)|0;return(t>>>0)/4294967296;};}
function getSeed(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19;}return function(){h=Math.imul(h^(h>>>16),2246822507);h=Math.imul(h^(h>>>13),3266489909);return(h^=h>>>16)>>>0;};}

function buildDashboardData(startDate, endDate, compareMode, sourceFilter, catFilter, prodFilter, campaignFilter) {
  const start = new Date(startDate); const end = new Date(endDate);
  const days = Math.max(1, Math.round((end - start) / 86400000) + 1);

  let prevStart = new Date(start), prevEnd = new Date(end);
  if(compareMode === "prev_period"){ prevStart.setDate(start.getDate()-days); prevEnd.setDate(end.getDate()-days); }
  else if(compareMode === "prev_month_dates"){ prevStart.setMonth(start.getMonth()-1); prevEnd.setMonth(end.getMonth()-1); }
  else if(compareMode === "prev_month_days"){ prevStart.setDate(start.getDate()-28); prevEnd.setDate(end.getDate()-28); }

  const gen = (dStart, dEnd, dCount) => {
    const seedStr = dStart.toISOString().slice(0,10) + "|" + dEnd.toISOString().slice(0,10) + "|" + (sourceFilter||"") + "|" + (catFilter||"") + "|" + (prodFilter||"") + "|" + (campaignFilter||"");
    let sg = getSeed(seedStr);
    let rand = sfc32(sg(),sg(),sg(),sg());

    const monthNum = dStart.getMonth();
    const periodNoise = rand();
    const seasonal = 1.0 + (monthNum === 0 ? -0.08 : monthNum === 1 ? 0.05 : monthNum === 2 ? 0.12 : 0.03);

    let sourceMult = 1.0;
    const CTX = window.ALLU_CONTEXT;
    if(sourceFilter && sourceFilter !== "all"){
      const found = CTX.channels.find(c=>c.name===sourceFilter);
      sourceMult = found ? found.shareS : 0.1;
    }
    let campMult = 1.0;
    if(campaignFilter && campaignFilter !== "all"){
      const found = CTX.campaigns.find(c=>c.name===campaignFilter);
      campMult = found ? found.share : 0.05;
    }
    let prodMult = 1.0;
    let activeProds = CTX.products;
    if(catFilter && catFilter !== "all") activeProds = activeProds.filter(p=>p.category===catFilter);
    if(prodFilter && prodFilter !== "") activeProds = activeProds.filter(p=>p.name===prodFilter);
    if((catFilter && catFilter!=="all")||prodFilter) { prodMult = activeProds.reduce((s,p)=>s+p.shareV,0)||0.001; }

    // Calibrated from GA4: ~51K sessions/day, ~R$93K purchaseRevenue/day, ~236 purchases/day
    const dailyBase = GA4_CALIBRATION.dailySessions * seasonal * (0.85 + periodNoise * 0.30) * sourceMult * campMult * prodMult;
    const sparklines=[];
    let totS=0,totU=0,totEng=0,totBounce=0,totDur=0;

    for(let i=0;i<dCount;i++){
      const d=new Date(dStart);d.setDate(d.getDate()+i);
      const dow=d.getDay(); const isWE=dow===0||dow===6;
      const dowFactor = isWE ? (0.85 + rand()*0.1) : (dow===1 ? 1.05 : dow===4 ? 1.1 : 1.0);
      const dailyNoise = 0.75 + rand()*0.50;
      const sess = Math.round(dailyBase * dowFactor * dailyNoise);
      const users = Math.round(sess * (0.62 + rand()*0.12));
      totS += sess; totU += users;
      const engR = 0.935 + rand()*0.025; const bounceR = 1 - engR;
      totEng += sess*engR; totBounce += sess*bounceR;
      totDur += sess*(140 + rand()*60);
      sparklines.push({d:d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}),s:sess,u:users,bounce:bounceR,eng:engR});
    }

    const kpis={sessions:totS,users:totU,newUsers:Math.round(totU*(0.33+rand()*0.06)),engagementRate:totEng/(totS||1),bounceRate:totBounce/(totS||1),avgDuration:totDur/(totS||1)};

    // Channels — use GA4 calibrated purchase counts and purchaseRevenue
    const channels=[]; const groupsMap={};
    let activeChannels = CTX.channels;
    if(sourceFilter&&sourceFilter!=="all") activeChannels = activeChannels.filter(c=>c.name===sourceFilter);

    let totalChRev=0, totalChPurch=0;
    activeChannels.forEach(c=>{
      const chNoise = 0.8 + rand()*0.4;
      const cSess = Math.round(totS * (c.shareS/sourceMult) * chNoise);
      // Purchases calibrated from GA4 purchase counts per channel
      const ga4Purch30d = GA4_CALIBRATION.channelPurchases[c.name] || Math.round(cSess * c.cr);
      const dailyPurchBase = ga4Purch30d / 30;
      const purchNoise = 0.7 + rand()*0.6;
      const cPurch = Math.max(1, Math.round(dailyPurchBase * dCount * purchNoise));
      // Revenue from GA4 purchaseRevenue proportional to channel
      const ga4Rev30d = GA4_CALIBRATION.channelRevShare[c.name] ? GA4_CALIBRATION.channelRevShare[c.name] * GA4_CALIBRATION.dailyPurchaseRevenue * 30 : cPurch * GA4_CALIBRATION.avgTicket;
      const revNoise = 0.85 + rand()*0.3;
      const cRev = Math.round((ga4Rev30d / 30) * dCount * revNoise);
      totalChRev += cRev;
      totalChPurch += cPurch;
      channels.push({name:c.name,group:c.group,canal:c.canal,grupo:c.grupo,sessions:cSess,purchases:cPurch,engRate:c.eng*(0.97+rand()*0.06),avgDuration:c.dur*(0.9+rand()*0.2),bounceRate:c.bounce,pageviews:Math.round(cSess*(1.3+rand()*0.4)),revenue:cRev});
      if(!groupsMap[c.group])groupsMap[c.group]={name:c.group,sessions:0,purchases:0,engSum:0,durSum:0,pv:0,revenue:0};
      groupsMap[c.group].sessions+=cSess;groupsMap[c.group].purchases+=cPurch;
      groupsMap[c.group].engSum+=c.eng*cSess;groupsMap[c.group].durSum+=c.dur*cSess;
      groupsMap[c.group].pv+=Math.round(cSess*1.5);groupsMap[c.group].revenue+=cRev;
    });
    const channelGroups=Object.values(groupsMap).map(g=>({name:g.name,sessions:g.sessions,purchases:g.purchases,engRate:g.engSum/(g.sessions||1),avgDuration:g.durSum/(g.sessions||1),pageviews:g.pv,revenue:g.revenue}));

    // Products — revenue = purchaseRevenue (GA4 itemRevenue calibrated)
    const products=[];const catsMap={};
    let totProdRev=0,totalProdPurch=0;
    activeProds.forEach(p=>{
      const pNoise = 0.75 + rand()*0.5;
      const pViews = Math.round(totS*1.5*(p.shareV/prodMult)*pNoise);
      const crN = 0.7 + rand()*0.6;
      const pPurch = Math.max(1, Math.round(pViews*p.cr*crN));
      // Revenue = purchases × avgRevenue (calibrated from GA4 itemRevenue/itemsPurchased)
      const pRev = Math.round(pPurch * p.avgRevenue * (0.9 + rand()*0.2));
      totProdRev += pRev; totalProdPurch += pPurch;
      products.push({name:p.name,category:p.category,views:pViews,purchases:pPurch,revenue:pRev,engRate:0.93+rand()*0.04,duration:p.dur*(0.9+rand()*0.2)});
      if(!catsMap[p.category])catsMap[p.category]={name:p.category,views:0,purchases:0,revenue:0,durSum:0};
      catsMap[p.category].views+=pViews;catsMap[p.category].purchases+=pPurch;catsMap[p.category].revenue+=pRev;catsMap[p.category].durSum+=pViews*p.dur;
    });
    const categories=Object.values(catsMap).map(c=>({name:c.name,views:c.views,purchases:c.purchases,revenue:c.revenue,avgDuration:c.durSum/(c.views||1)}));

    // Revenue = purchaseRevenue (always from GA4)
    kpis.revenue = totalChRev || totProdRev;
    kpis.purchases = totalChPurch || totalProdPurch;

    // Funnel (calibrated from GA4 event counts)
    const FR = CTX.funnelRates;
    const totalPV = Math.round(totS * (3.5 + rand()*0.5)); // GA4: ~6M PV / 1.5M sessions ≈ 3.9x
    const funnel = {
      page_view: totalPV,
      view_item: Math.round(totalPV * FR.vi * (0.9+rand()*0.2)),
      add_to_cart: Math.round(totalPV * FR.atc * (0.85+rand()*0.3)),
      begin_checkout: Math.round(totalPV * FR.chk * (0.85+rand()*0.3)),
      add_personal_info: Math.round(totalPV * FR.pi * (0.85+rand()*0.3)),
      add_shipping_info: Math.round(totalPV * FR.si * (0.85+rand()*0.3)),
      add_payment_info: Math.round(totalPV * FR.api * (0.85+rand()*0.3)),
      purchase: kpis.purchases
    };

    // Regions & Cities — revenue = purchaseRevenue proportional
    const regions=CTX.regions.map(r=>{const rNoise=0.8+rand()*0.4;const rS=Math.round(totS*r.share*rNoise);const cr=(kpis.purchases/totS)*r.crMod*(0.8+rand()*0.4);const rP=Math.max(1,Math.round(rS*cr));const rRev=Math.round(rP*GA4_CALIBRATION.avgTicket*(0.85+rand()*0.3));return{name:r.name,sessions:rS,purchases:rP,revenue:rRev,engRate:0.93+rand()*0.04,avgDuration:r.dur};});
    const cities=CTX.cities.map(c=>{const cNoise=0.8+rand()*0.4;const cS=Math.round(totS*c.share*cNoise);const cr=(kpis.purchases/totS)*c.crMod*(0.8+rand()*0.4);const cP=Math.max(1,Math.round(cS*cr));const cRev=Math.round(cP*GA4_CALIBRATION.avgTicket*(0.85+rand()*0.3));return{name:c.name,sessions:cS,purchases:cP,revenue:cRev,engRate:0.94+rand()*0.04,avgDuration:c.dur};});
    const devices=CTX.devices.map(d=>{const dNoise=0.85+rand()*0.3;const dS=Math.round(totS*d.share*dNoise);const cr=(kpis.purchases/totS)*d.crMod*(0.85+rand()*0.3);const dP=Math.max(1,Math.round(dS*cr));return{name:d.name,sessions:dS,purchases:dP,engRate:d.eng*(0.97+rand()*0.06),avgDuration:d.dur*(0.9+rand()*0.2)};});

    // Attribution paths
    const topSources=[...channels].sort((a,b)=>b.sessions-a.sessions);
    const attributionPaths = [
      {path:`${topSources[0]?.name||"meta"} → google / organic → (direct) / (none) → Purchase`,share:0.28*(0.9+rand()*0.2),conv:0.018*(0.8+rand()*0.4),label:"Social → SEO → Direct"},
      {path:`google / cpc → (direct) / (none) → Purchase`,share:0.22*(0.9+rand()*0.2),conv:0.025*(0.8+rand()*0.4),label:"Paid Search → Direct"},
      {path:`${topSources[0]?.name||"meta"} → (direct) / (none) → Purchase`,share:0.18*(0.9+rand()*0.2),conv:0.012*(0.8+rand()*0.4),label:"Social → Direct"},
      {path:`google / organic → Purchase`,share:0.12*(0.9+rand()*0.2),conv:0.032*(0.8+rand()*0.4),label:"Orgânico Direto"},
      {path:`email / newsletter → Purchase`,share:0.08*(0.9+rand()*0.2),conv:0.045*(0.8+rand()*0.4),label:"Email Direto"},
      {path:`${topSources[0]?.name||"meta"} → email / newsletter → Purchase`,share:0.07*(0.9+rand()*0.2),conv:0.035*(0.8+rand()*0.4),label:"Social → Email"},
      {path:`criteo / retargeting → Purchase`,share:0.05*(0.9+rand()*0.2),conv:0.028*(0.8+rand()*0.4),label:"Retargeting Direto"},
    ];

    return{kpis,sparklines,channels,channelGroups,products,categories,funnel,regions,cities,devices,attributionPaths};
  };

  const current=gen(start,end,days);const previous=gen(prevStart,prevEnd,days);
  return{rawStart:startDate,rawEnd:endDate,label:`${days} dias`,days,
    currentText:`${start.toLocaleDateString('pt-BR')} até ${end.toLocaleDateString('pt-BR')}`,
    previousText:`${prevStart.toLocaleDateString('pt-BR')} até ${prevEnd.toLocaleDateString('pt-BR')}`,
    current,previous};
}

window.V6_ENGINE = { buildDashboardData };
