// ============================================================
// V6.4 — Data Engine — UTM Canal/Grupo + Chart Support
// ============================================================

// UTM Source → Canal / Grupo (from Allu de-para-utm)
window.UTM_MAP = {
  "(direct)":  {canal:"Direto",grupo:"Direto"},
  "direct":    {canal:"Direto",grupo:"Direto"},
  "google":    {canal:"Google Ads",grupo:"Mídia Paga"},  // default, overridden by medium
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
// Medium override: when source is google and medium is organic → Pesquisa Orgânica
window.UTM_MEDIUM_OVERRIDES = {
  "organic":       {canal:"Google",grupo:"Pesquisa Orgânica"},
  "organic_social":{grupo:"Social Orgânico"},
  "referral":      {grupo:"Parcerias"},
  "email":         {grupo:"CRM"},
  "paid_social":   {grupo:"Mídia Paga"},
  "cpc":           {grupo:"Mídia Paga"},
};

window.ALLU_CONTEXT = {
  channels: [
    { name:"meta / paid_social", group:"Paid Social", canal:"Meta Ads", grupo:"Mídia Paga", shareS:0.38, cr:0.0015, bounce:0.06, eng:0.98, dur:120 },
    { name:"google / cpc", group:"Paid Search", canal:"Google Ads", grupo:"Mídia Paga", shareS:0.14, cr:0.0090, bounce:0.04, eng:0.97, dur:240 },
    { name:"(direct) / (none)", group:"Direct", canal:"Direto", grupo:"Direto", shareS:0.11, cr:0.0110, bounce:0.03, eng:0.98, dur:300 },
    { name:"ig / organic_social", group:"Organic Social", canal:"Instagram", grupo:"Social Orgânico", shareS:0.06, cr:0.0048, bounce:0.05, eng:0.99, dur:160 },
    { name:"google / organic", group:"Organic Search", canal:"Google", grupo:"Pesquisa Orgânica", shareS:0.05, cr:0.0095, bounce:0.03, eng:0.97, dur:260 },
    { name:"tiktok / paid_social", group:"Paid Social", canal:"TikTok Ads", grupo:"Mídia Paga", shareS:0.04, cr:0.0008, bounce:0.08, eng:0.98, dur:90 },
    { name:"(not set)", group:"Unassigned", canal:"Nulo", grupo:"Nulo", shareS:0.04, cr:0.0020, bounce:0.91, eng:0.09, dur:15 },
    { name:"parcerias / referral", group:"Referral", canal:"Parcerias", grupo:"Parcerias", shareS:0.03, cr:0.0008, bounce:0.05, eng:0.98, dur:110 },
    { name:"bing / cpc", group:"Paid Search", canal:"Bing", grupo:"Mídia Paga", shareS:0.025, cr:0.0085, bounce:0.04, eng:0.96, dur:230 },
    { name:"email / newsletter", group:"Email", canal:"CRM", grupo:"CRM", shareS:0.02, cr:0.0180, bounce:0.02, eng:0.99, dur:280 },
    { name:"whatsapp / organic_social", group:"Organic Social", canal:"WhatsApp", grupo:"Social Orgânico", shareS:0.018, cr:0.0200, bounce:0.03, eng:0.98, dur:200 },
    { name:"kwai / paid_social", group:"Paid Social", canal:"Kwai", grupo:"Mídia Paga", shareS:0.015, cr:0.0005, bounce:0.10, eng:0.96, dur:70 },
    { name:"youtube / paid_video", group:"Paid Video", canal:"YouTube", grupo:"Mídia Paga", shareS:0.012, cr:0.0012, bounce:0.07, eng:0.97, dur:95 },
    { name:"criteo / retargeting", group:"Display", canal:"Criteo", grupo:"Mídia Paga", shareS:0.01, cr:0.0060, bounce:0.05, eng:0.94, dur:130 },
    { name:"sms / push", group:"Push", canal:"CRM", grupo:"CRM", shareS:0.008, cr:0.0140, bounce:0.04, eng:0.97, dur:180 },
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
  products: [
    { name:"iPhone 17 Pro Max 256GB", category:"Smartphones", shareV:0.14, cr:0.0053, subPrice:399, dur:200 },
    { name:"iPhone 17 Pro 128GB", category:"Smartphones", shareV:0.12, cr:0.0051, subPrice:369, dur:190 },
    { name:"iPhone 16 128GB", category:"Smartphones", shareV:0.08, cr:0.0075, subPrice:279, dur:160 },
    { name:"iPhone 15 128GB", category:"Smartphones", shareV:0.07, cr:0.0078, subPrice:229, dur:150 },
    { name:"Samsung Galaxy S25 5G", category:"Smartphones", shareV:0.05, cr:0.0160, subPrice:259, dur:180 },
    { name:"iPhone 16 Pro Max 256GB", category:"Smartphones", shareV:0.04, cr:0.0100, subPrice:359, dur:195 },
    { name:"PS5 Slim Digital", category:"Consoles", shareV:0.04, cr:0.0168, subPrice:149, dur:210 },
    { name:"iPhone 17 Pro 256GB", category:"Smartphones", shareV:0.035, cr:0.0048, subPrice:429, dur:195 },
    { name:"PS5 Pro", category:"Consoles", shareV:0.025, cr:0.0115, subPrice:199, dur:220 },
    { name:"Nintendo Switch OLED", category:"Consoles", shareV:0.02, cr:0.0190, subPrice:119, dur:175 },
    { name:"MacBook Air M3", category:"Notebooks", shareV:0.018, cr:0.008, subPrice:449, dur:280 },
    { name:"Notebook Acer TravelMate i5", category:"Notebooks", shareV:0.015, cr:0.0250, subPrice:189, dur:260 },
    { name:"Apple Watch Series 10", category:"Wearables", shareV:0.015, cr:0.0120, subPrice:129, dur:140 },
    { name:"Samsung Galaxy Watch 7", category:"Wearables", shareV:0.012, cr:0.0100, subPrice:99, dur:130 },
    { name:"AirPods Pro 3", category:"Wearables", shareV:0.01, cr:0.0200, subPrice:79, dur:100 },
    { name:"iPad Air M2", category:"Tablets", shareV:0.01, cr:0.0080, subPrice:299, dur:240 },
    { name:"Samsung Galaxy S24 FE", category:"Smartphones", shareV:0.01, cr:0.0140, subPrice:199, dur:155 },
    { name:"Notebook Lenovo IdeaPad i7", category:"Notebooks", shareV:0.008, cr:0.0220, subPrice:219, dur:250 },
  ],
  // Funnel retention rates (% who proceed from page_view)
  // Includes add_payment_info as per Allu's actual funnel
  funnelRates: { pv:1.0, vi:0.38, atc:0.083, chk:0.054, pi:0.046, si:0.035, api:0.022, pur:0.0138 }
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

    // Period-level seasonal multiplier (creates real variation between periods)
    const monthNum = dStart.getMonth();
    const dayOfMonth = dStart.getDate();
    const periodNoise = rand(); // unique per period due to different seed
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

    // Calibrated: ~60K sessions/day for full site ≈ R$100K/day revenue
    const dailyBase = 60000 * seasonal * (0.85 + periodNoise * 0.30) * sourceMult * campMult * prodMult;
    const sparklines=[];
    let totS=0,totU=0,totEng=0,totBounce=0,totDur=0;

    for(let i=0;i<dCount;i++){
      const d=new Date(dStart);d.setDate(d.getDate()+i);
      const dow=d.getDay(); const isWE=dow===0||dow===6;
      // Day-of-week pattern + strong daily variation
      const dowFactor = isWE ? (0.85 + rand()*0.1) : (dow===1 ? 1.05 : dow===4 ? 1.1 : 1.0);
      const dailyNoise = 0.75 + rand()*0.50; // 0.75-1.25 strong daily variation
      const sess = Math.round(dailyBase * dowFactor * dailyNoise);
      const users = Math.round(sess * (0.62 + rand()*0.12));
      totS += sess; totU += users;
      const engR = 0.935 + rand()*0.025; const bounceR = 1 - engR;
      totEng += sess*engR; totBounce += sess*bounceR;
      totDur += sess*(140 + rand()*60);
      sparklines.push({d:d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}),s:sess,u:users,bounce:bounceR,eng:engR});
    }

    const kpis={sessions:totS,users:totU,newUsers:Math.round(totU*(0.33+rand()*0.06)),engagementRate:totEng/(totS||1),bounceRate:totBounce/(totS||1),avgDuration:totDur/(totS||1)};

    // Channels — each channel gets its own variation via random
    const channels=[]; const groupsMap={};
    let activeChannels = CTX.channels;
    if(sourceFilter&&sourceFilter!=="all") activeChannels = activeChannels.filter(c=>c.name===sourceFilter);

    let totalChRev=0;
    activeChannels.forEach(c=>{
      const chNoise = 0.8 + rand()*0.4; // per-channel variation
      const cSess = Math.round(totS * (c.shareS/sourceMult) * chNoise);
      const crNoise = 0.7 + rand()*0.6; // per-channel CR variation
      const cPurch = Math.round(cSess * c.cr * crNoise);
      const cRev = Math.round(cPurch * (250 + rand()*200)); // avg subscription rev R$250-450
      totalChRev += cRev;
      channels.push({name:c.name,group:c.group,sessions:cSess,purchases:cPurch,engRate:c.eng*(0.97+rand()*0.06),avgDuration:c.dur*(0.9+rand()*0.2),bounceRate:c.bounce,pageviews:Math.round(cSess*(1.3+rand()*0.4)),revenue:cRev});
      if(!groupsMap[c.group])groupsMap[c.group]={name:c.group,sessions:0,purchases:0,engSum:0,durSum:0,pv:0,revenue:0};
      groupsMap[c.group].sessions+=cSess;groupsMap[c.group].purchases+=cPurch;
      groupsMap[c.group].engSum+=c.eng*cSess;groupsMap[c.group].durSum+=c.dur*cSess;
      groupsMap[c.group].pv+=Math.round(cSess*1.5);groupsMap[c.group].revenue+=cRev;
    });
    const channelGroups=Object.values(groupsMap).map(g=>({name:g.name,sessions:g.sessions,purchases:g.purchases,engRate:g.engSum/(g.sessions||1),avgDuration:g.durSum/(g.sessions||1),pageviews:g.pv,revenue:g.revenue}));

    // Products — revenue = subscription price, not retail
    const products=[];const catsMap={};
    let totProdRev=0,totalProdPurch=0;
    activeProds.forEach(p=>{
      const pNoise = 0.75 + rand()*0.5;
      const pViews = Math.round(totS*1.5*(p.shareV/prodMult)*pNoise);
      const crN = 0.7 + rand()*0.6;
      const pPurch = Math.round(pViews*p.cr*crN);
      const pRev = pPurch * p.subPrice; // subscription monthly fee
      totProdRev += pRev; totalProdPurch += pPurch;
      products.push({name:p.name,category:p.category,views:pViews,purchases:pPurch,revenue:pRev,engRate:0.93+rand()*0.04,duration:p.dur*(0.9+rand()*0.2)});
      if(!catsMap[p.category])catsMap[p.category]={name:p.category,views:0,purchases:0,revenue:0,durSum:0};
      catsMap[p.category].views+=pViews;catsMap[p.category].purchases+=pPurch;catsMap[p.category].revenue+=pRev;catsMap[p.category].durSum+=pViews*p.dur;
    });
    const categories=Object.values(catsMap).map(c=>({name:c.name,views:c.views,purchases:c.purchases,revenue:c.revenue,avgDuration:c.durSum/(c.views||1)}));

    kpis.revenue = totProdRev || totalChRev;
    kpis.purchases = totalProdPurch || channels.reduce((s,c)=>s+c.purchases,0);

    // Funnel (with add_payment_info)
    const FR = CTX.funnelRates;
    const totalPV = Math.round(totS * (1.15 + rand()*0.15));
    // Each rate gets its own noise for real variation
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

    // Regions & Cities
    const regions=CTX.regions.map(r=>{const rNoise=0.8+rand()*0.4;const rS=Math.round(totS*r.share*rNoise);const cr=(kpis.purchases/totS)*r.crMod*(0.8+rand()*0.4);const rP=Math.round(rS*cr);return{name:r.name,sessions:rS,purchases:rP,revenue:rP*(280+rand()*120),engRate:0.93+rand()*0.04,avgDuration:r.dur};});
    const cities=CTX.cities.map(c=>{const cNoise=0.8+rand()*0.4;const cS=Math.round(totS*c.share*cNoise);const cr=(kpis.purchases/totS)*c.crMod*(0.8+rand()*0.4);const cP=Math.round(cS*cr);return{name:c.name,sessions:cS,purchases:cP,revenue:cP*(280+rand()*120),engRate:0.94+rand()*0.04,avgDuration:c.dur};});
    const devices=CTX.devices.map(d=>{const dNoise=0.85+rand()*0.3;const dS=Math.round(totS*d.share*dNoise);const cr=(kpis.purchases/totS)*d.crMod*(0.85+rand()*0.3);const dP=Math.round(dS*cr);return{name:d.name,sessions:dS,purchases:dP,engRate:d.eng*(0.97+rand()*0.06),avgDuration:d.dur*(0.9+rand()*0.2)};});

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
