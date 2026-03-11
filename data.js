// ============================================================
// V6.1 — Data Engine (window-scoped)
// ============================================================

window.ALLU_CONTEXT = {
  channels: [
    { name:"meta / paid_social", group:"Paid Social", shareS:0.43, cr:0.0015, bounce:0.06, eng:0.98, dur:120, revMul:0.18 },
    { name:"google / cpc", group:"Paid Search", shareS:0.13, cr:0.0090, bounce:0.04, eng:0.97, dur:240, revMul:0.32 },
    { name:"(direct) / (none)", group:"Direct", shareS:0.11, cr:0.0110, bounce:0.03, eng:0.98, dur:300, revMul:0.22 },
    { name:"ig / organic_social", group:"Organic Social", shareS:0.06, cr:0.0048, bounce:0.05, eng:0.99, dur:160, revMul:0.06 },
    { name:"google / organic", group:"Organic Search", shareS:0.05, cr:0.0095, bounce:0.03, eng:0.97, dur:260, revMul:0.12 },
    { name:"tiktok / paid_social", group:"Paid Social", shareS:0.04, cr:0.0008, bounce:0.08, eng:0.98, dur:90, revMul:0.02 },
    { name:"(not set)", group:"Unassigned", shareS:0.04, cr:0.0020, bounce:0.91, eng:0.09, dur:15, revMul:0.01 },
    { name:"parcerias / referral", group:"Referral", shareS:0.03, cr:0.0008, bounce:0.05, eng:0.98, dur:110, revMul:0.02 },
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
    { name:"iPhone 17 Pro Max", category:"Smartphones", shareV:0.15, cr:0.0053, price:4500, dur:200 },
    { name:"iPhone 17 Pro", category:"Smartphones", shareV:0.14, cr:0.0051, price:4100, dur:190 },
    { name:"iPhone 16", category:"Smartphones", shareV:0.09, cr:0.0075, price:2800, dur:160 },
    { name:"Samsung Galaxy S25 5G", category:"Smartphones", shareV:0.05, cr:0.0160, price:2600, dur:180 },
    { name:"iPhone 15", category:"Smartphones", shareV:0.08, cr:0.0075, price:2200, dur:150 },
    { name:"PS5 Slim Digital", category:"Consoles", shareV:0.04, cr:0.0168, price:1500, dur:210 },
    { name:"iPhone 16 Pro Max", category:"Smartphones", shareV:0.03, cr:0.0100, price:3500, dur:190 },
    { name:"Notebook Acer TravelMate i5", category:"Notebooks", shareV:0.02, cr:0.0250, price:1800, dur:260 },
    { name:"Apple Watch Series 10", category:"Wearables", shareV:0.02, cr:0.0120, price:1500, dur:140 },
    { name:"iPhone 17 Pro 256GB", category:"Smartphones", shareV:0.04, cr:0.0048, price:4700, dur:195 },
    { name:"PS5 Pro", category:"Consoles", shareV:0.015, cr:0.0115, price:2200, dur:220 },
    { name:"MacBook Air M3", category:"Notebooks", shareV:0.015, cr:0.008, price:5800, dur:280 },
  ],
  funnelDrops: { pv:1.0, vi:0.38, atc:0.031, chk:0.020, pi:0.017, si:0.013, pur:0.0065 }
};

// Seeded PRNG
function sfc32(a,b,c,d){return function(){a>>>=0;b>>>=0;c>>>=0;d>>>=0;let t=(a+b)|0;a=b^b>>>9;b=(c+(c<<3))|0;c=(c<<21)|(c>>>11);d=(d+1)|0;t=(t+d)|0;c=(c+t)|0;return(t>>>0)/4294967296;}}
function getSeed(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19;}return function(){h=Math.imul(h^(h>>>16),2246822507);h=Math.imul(h^(h>>>13),3266489909);return(h^=h>>>16)>>>0;}}

function buildDashboardData(startDate, endDate, compareMode, sourceFilter, catFilter, prodFilter) {
  const start = new Date(startDate); const end = new Date(endDate);
  const days = Math.max(1, Math.round((end - start) / 86400000) + 1);

  let prevStart = new Date(start), prevEnd = new Date(end);
  if(compareMode === "prev_period"){ prevStart.setDate(start.getDate()-days); prevEnd.setDate(end.getDate()-days); }
  else if(compareMode === "prev_month_dates"){ prevStart.setMonth(start.getMonth()-1); prevEnd.setMonth(end.getMonth()-1); }
  else if(compareMode === "prev_month_days"){ prevStart.setDate(start.getDate()-28); prevEnd.setDate(end.getDate()-28); }

  const gen = (dStart, dEnd, dCount) => {
    let sg = getSeed(dStart.toISOString()+sourceFilter+catFilter+prodFilter);
    let rand = sfc32(sg(),sg(),sg(),sg());
    const epoch = new Date("2026-01-01").getTime();
    const trendMod = 1 + ((dStart.getTime()-epoch)/86400000)*0.002;

    let sourceMult = 1.0;
    const CTX = window.ALLU_CONTEXT;
    if(sourceFilter && sourceFilter !== "all"){
      const found = CTX.channels.find(c=>c.name===sourceFilter);
      sourceMult = found ? found.shareS : 0.1;
    }
    let prodMult = 1.0;
    let activeProds = CTX.products;
    if(catFilter && catFilter !== "all") activeProds = activeProds.filter(p=>p.category===catFilter);
    if(prodFilter) activeProds = activeProds.filter(p=>p.name===prodFilter);
    if(catFilter!=="all"||prodFilter) { prodMult = activeProds.reduce((s,p)=>s+p.shareV,0)||0.001; }

    const dailyBase = 50000 * trendMod * sourceMult * prodMult;
    const sparklines=[];
    let totS=0,totU=0,totEng=0,totBounce=0,totDur=0;

    for(let i=0;i<dCount;i++){
      const d=new Date(dStart);d.setDate(d.getDate()+i);
      const isWE=d.getDay()===0||d.getDay()===6;
      const dv=0.8+(rand()*0.4)+(isWE?0.15:0);
      const sess=Math.round(dailyBase*dv);
      const users=Math.round(sess*(0.65+rand()*0.1));
      totS+=sess;totU+=users;
      const engR=0.95*(1-rand()*0.02);const bounceR=1-engR;
      totEng+=sess*engR;totBounce+=sess*bounceR;totDur+=sess*(150+rand()*50);
      sparklines.push({d:d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}),s:sess,u:users,bounce:bounceR,eng:engR});
    }

    const kpis={sessions:totS,users:totU,newUsers:Math.round(totU*0.35),engagementRate:totEng/(totS||1),bounceRate:totBounce/(totS||1),avgDuration:totDur/(totS||1)};

    // Channels
    const channels=[]; const groupsMap={};
    let activeChannels = CTX.channels;
    if(sourceFilter&&sourceFilter!=="all") activeChannels = activeChannels.filter(c=>c.name===sourceFilter);

    let totalRev=0;
    activeChannels.forEach(c=>{
      const cSess=Math.round(totS*(c.shareS/sourceMult));
      const cPurch=Math.round(cSess*c.cr*(1+(rand()-0.4)*0.2));
      const cRev=Math.round(cPurch*3200*(0.8+rand()*0.4));
      totalRev+=cRev;
      channels.push({name:c.name,group:c.group,sessions:cSess,purchases:cPurch,engRate:c.eng,avgDuration:c.dur,bounceRate:c.bounce,pageviews:Math.round(cSess*1.5),revenue:cRev});
      if(!groupsMap[c.group])groupsMap[c.group]={name:c.group,sessions:0,purchases:0,engSum:0,durSum:0,pv:0,revenue:0};
      groupsMap[c.group].sessions+=cSess;groupsMap[c.group].purchases+=cPurch;
      groupsMap[c.group].engSum+=c.eng*cSess;groupsMap[c.group].durSum+=c.dur*cSess;
      groupsMap[c.group].pv+=Math.round(cSess*1.5);groupsMap[c.group].revenue+=cRev;
    });
    const channelGroups=Object.values(groupsMap).map(g=>({name:g.name,sessions:g.sessions,purchases:g.purchases,engRate:g.engSum/(g.sessions||1),avgDuration:g.durSum/(g.sessions||1),pageviews:g.pv,revenue:g.revenue}));

    // Products
    const products=[];const catsMap={};
    let totProdRev=0;
    activeProds.forEach(p=>{
      const pViews=Math.round(totS*1.5*(p.shareV/prodMult));
      const pPurch=Math.round(pViews*p.cr*(1+(rand()-0.5)*0.3));
      const pRev=pPurch*p.price;
      totProdRev+=pRev;
      products.push({name:p.name,category:p.category,views:pViews,purchases:pPurch,revenue:pRev,engRate:0.95,duration:p.dur});
      if(!catsMap[p.category])catsMap[p.category]={name:p.category,views:0,purchases:0,revenue:0,durSum:0};
      catsMap[p.category].views+=pViews;catsMap[p.category].purchases+=pPurch;catsMap[p.category].revenue+=pRev;catsMap[p.category].durSum+=pViews*p.dur;
    });
    const categories=Object.values(catsMap).map(c=>({name:c.name,views:c.views,purchases:c.purchases,revenue:c.revenue,avgDuration:c.durSum/(c.views||1)}));

    kpis.revenue = totProdRev || totalRev;
    kpis.purchases = products.reduce((s,p)=>s+p.purchases,0) || channels.reduce((s,c)=>s+c.purchases,0);

    // Funnel
    const FD = CTX.funnelDrops;
    const totalPV = Math.round(totS*1.2);
    const funnel = {
      page_view:totalPV,view_item:Math.round(totalPV*FD.vi),add_to_cart:Math.round(totalPV*FD.atc),
      begin_checkout:Math.round(totalPV*FD.chk),add_personal_info:Math.round(totalPV*FD.pi),
      add_shipping_info:Math.round(totalPV*FD.si),purchase:kpis.purchases
    };

    // Regions & Cities
    const regions=CTX.regions.map(r=>{const rS=Math.round(totS*r.share);const cr=(kpis.purchases/totS)*r.crMod;const rP=Math.round(rS*cr);return{name:r.name,sessions:rS,purchases:rP,revenue:rP*3200,engRate:0.95,avgDuration:r.dur};});
    const cities=CTX.cities.map(c=>{const cS=Math.round(totS*c.share);const cr=(kpis.purchases/totS)*c.crMod;const cP=Math.round(cS*cr);return{name:c.name,sessions:cS,purchases:cP,revenue:cP*3200,engRate:0.96,avgDuration:c.dur};});
    const devices=CTX.devices.map(d=>{const dS=Math.round(totS*d.share);const cr=(kpis.purchases/totS)*d.crMod;const dP=Math.round(dS*cr);return{name:d.name,sessions:dS,purchases:dP,engRate:d.eng,avgDuration:d.dur};});

    return{kpis,sparklines,channels,channelGroups,products,categories,funnel,regions,cities,devices};
  };

  const current=gen(start,end,days);const previous=gen(prevStart,prevEnd,days);
  return{rawStart:startDate,rawEnd:endDate,label:`${days} dias`,
    currentText:`${start.toLocaleDateString('pt-BR')} até ${end.toLocaleDateString('pt-BR')}`,
    previousText:`${prevStart.toLocaleDateString('pt-BR')} até ${prevEnd.toLocaleDateString('pt-BR')}`,
    current,previous};
}

window.V6_ENGINE = { buildDashboardData };
