// V6.5 — App Core + Searchable Filters + Charts + Sections 1–5
// ====================================================

// ---- Searchable Select Component ----
class SearchableSelect{constructor(inputId,dropdownId,options,placeholder){this.input=document.getElementById(inputId);this.dropdown=document.getElementById(dropdownId);this.options=options;this.value="all";this.placeholder=placeholder||"Todos";this.activeIdx=-1;this.input.value="";this.input.placeholder=this.placeholder;this.renderOptions("");this.input.addEventListener("focus",()=>{this.dropdown.classList.add("show");this.renderOptions(this.input.value);});this.input.addEventListener("input",()=>{this.renderOptions(this.input.value);this.activeIdx=-1;});this.input.addEventListener("keydown",e=>{const items=this.dropdown.querySelectorAll(".searchable-option");if(e.key==="ArrowDown"){e.preventDefault();this.activeIdx=Math.min(this.activeIdx+1,items.length-1);this.highlightItem(items);}else if(e.key==="ArrowUp"){e.preventDefault();this.activeIdx=Math.max(this.activeIdx-1,0);this.highlightItem(items);}else if(e.key==="Enter"&&this.activeIdx>=0){e.preventDefault();items[this.activeIdx]?.click();}else if(e.key==="Escape"){this.dropdown.classList.remove("show");}});document.addEventListener("click",e=>{if(!this.input.contains(e.target)&&!this.dropdown.contains(e.target))this.dropdown.classList.remove("show");});}
renderOptions(filter){const f=filter.toLowerCase();let html=`<div class="searchable-option${this.value==="all"?" selected":""}" data-value="all">${this.placeholder}</div>`;this.options.filter(o=>o.label.toLowerCase().includes(f)).forEach(o=>{html+=`<div class="searchable-option${this.value===o.value?" selected":""}" data-value="${o.value}">${o.label}</div>`;});this.dropdown.innerHTML=html;this.dropdown.querySelectorAll(".searchable-option").forEach(el=>{el.addEventListener("click",()=>{this.value=el.dataset.value;this.input.value=this.value==="all"?"":el.textContent;this.dropdown.classList.remove("show");});});}
highlightItem(items){items.forEach(i=>i.classList.remove("active"));if(items[this.activeIdx])items[this.activeIdx].classList.add("active");}
getValue(){return this.value;}}

// ---- Chart colors ----
const CHART_COLORS=["#2ECB6F","#3B82F6","#A855F7","#F59E0B","#EF4444","#06B6D4","#EC4899","#10B981","#F97316","#6366F1","#14B8A6","#D946EF","#84CC16","#FB923C","#8B5CF6"];

// ---- Init ----
document.addEventListener("DOMContentLoaded",()=>{
  const CTX=window.ALLU_CONTEXT;
  const srcOpts=[...CTX.channels].sort((a,b)=>b.shareS-a.shareS).map(c=>({value:c.name,label:c.name}));
  const campOpts=[...CTX.campaigns].sort((a,b)=>b.share-a.share).map(c=>({value:c.name,label:c.name}));
  const catOpts=[...new Set(CTX.products.map(p=>p.category))].map(c=>({value:c,label:c}));
  const prodOpts=[...CTX.products].sort((a,b)=>b.shareV-a.shareV).map(p=>({value:p.name,label:p.name}));
  const canais=[...new Set(CTX.channels.map(c=>c.canal))].filter(Boolean).sort();
  const grupos=[...new Set(CTX.channels.map(c=>c.grupo))].filter(Boolean).sort();
  const canalOpts=canais.map(c=>({value:c,label:c}));
  const grupoOpts=grupos.map(g=>({value:g,label:g}));

  window._filters={
    source: new SearchableSelect("filter-source","sd-source",srcOpts,"Todos os Canais"),
    campaign: new SearchableSelect("filter-campaign","sd-campaign",campOpts,"Todas as Campanhas"),
    category: new SearchableSelect("filter-category","sd-category",catOpts,"Todas"),
    product: new SearchableSelect("filter-product","sd-product",prodOpts,"Todos os Produtos"),
    canal: new SearchableSelect("filter-canal","sd-canal",canalOpts,"Todos os Canais"),
    grupo: new SearchableSelect("filter-grupo","sd-grupo",grupoOpts,"Todos os Grupos"),
  };

  const now=new Date(),ago=new Date();ago.setDate(now.getDate()-30);
  document.getElementById("filter-date-start").valueAsDate=ago;
  document.getElementById("filter-date-end").valueAsDate=now;
  document.getElementById("btn-apply-filters").addEventListener("click",()=>applyFilters());
  document.getElementById("btn-update-invest").addEventListener("click",()=>{if(window._lastData)renderAll(window._lastData);});
  document.querySelectorAll(".theme-btn").forEach(btn=>{btn.addEventListener("click",()=>{document.documentElement.setAttribute("data-theme",btn.dataset.theme);document.querySelectorAll(".theme-btn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");});});
  applyFilters();
});

function applyFilters(){
  const s=document.getElementById("filter-date-start").value,e=document.getElementById("filter-date-end").value;
  if(!s||!e)return;
  const F=window._filters;
  const data=window.V6_ENGINE.buildDashboardData(s,e,document.getElementById("filter-compare").value,F.source.getValue(),F.category.getValue(),F.product.getValue(),F.campaign.getValue());
  window._lastData=data;
  document.getElementById("period-badge").textContent=`Base GA4 Engine | Período: ${data.currentText} | Comparação: ${data.previousText}`;
  renderAll(data);
}

// ---- Formatters ----
const fmt=n=>{if(n>=1e6)return(n/1e6).toFixed(1).replace(".",",")+`M`;if(n>=1e3)return(n/1e3).toFixed(1).replace(".",",")+`K`;return n.toLocaleString("pt-BR",{maximumFractionDigits:0});};
const fmtF=n=>n.toLocaleString("pt-BR",{maximumFractionDigits:0});
const pct=v=>(v*100).toFixed(2).replace(".",",")+"%";
const pct1=v=>(v*100).toFixed(1).replace(".",",")+"%";
const fmtMoney=n=>"R$ "+n.toLocaleString("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:0});
const fmtDur=s=>{if(!s||isNaN(s))return"0s";const m=Math.floor(s/60);const sc=Math.round(s%60);return`${m}m${sc.toString().padStart(2,"0")}s`;};
function delta(c,p,inv){if(!p||p===0)return{text:"—",cls:"neutral"};const d=((c-p)/p)*100;const s=d>=0?"+":"";let cls=d>1?"up":d<-1?"down":"neutral";if(inv)cls=d>1?"down":d<-1?"up":"neutral";return{text:s+d.toFixed(1).replace(".",",")+"%",cls,raw:d};}
const tD=(c,p,inv)=>{const d=delta(c,p,inv);return`<span class="kpi-delta ${d.cls}">${d.text}</span>`;};
const dAbs=(c,p)=>{const d=c-p;return(d>=0?"+":"")+fmtF(d);};
function drawSpark(cv,vals,color="#00c566"){if(!cv)return;const ctx=cv.getContext("2d");const w=cv.width=cv.offsetWidth*2;const h=cv.height=cv.offsetHeight*2;ctx.clearRect(0,0,w,h);if(!vals||vals.length<2)return;const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1,step=w/(vals.length-1);const gr=ctx.createLinearGradient(0,0,0,h);gr.addColorStop(0,color+"40");gr.addColorStop(1,color+"00");ctx.beginPath();ctx.moveTo(0,h);vals.forEach((v,i)=>{ctx.lineTo(i*step,h-((v-mn)/rng)*(h*.85)-h*.05);});ctx.lineTo(w,h);ctx.closePath();ctx.fillStyle=gr;ctx.fill();ctx.beginPath();vals.forEach((v,i)=>{const x=i*step,y=h-((v-mn)/rng)*(h*.85)-h*.05;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();}

// ---- Chart Helpers ----
const _charts={};
function destroyChart(id){if(_charts[id]){_charts[id].destroy();delete _charts[id];}}
function chartDefaults(){return{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:"#9CA3AF",font:{size:10}},position:"bottom"},tooltip:{bodyFont:{size:11}}}};}

function renderAll(d){renderKPIs(d);renderChannels(d);renderFunnel(d);renderMoneyLeaks(d);renderDevices(d);renderAudience(d);renderSegments(d);renderProducts(d);renderICE(d);renderGrowth(d);}

// === 1. KPIs + Full-Width Funnel ===
function renderKPIs(data){
  const c=data.current.kpis,p=data.previous.kpis,sp=data.current.sparklines;
  const invest=parseFloat(document.getElementById("input-investment").value)||0;
  // CPA = Investimento / Purchases (purchase events)
  const cpa=invest/(c.purchases||1);
  // PDI = Investimento / (Receita Total × 12) — receita = purchaseRevenue
  const pdi=invest/((c.revenue*12)||1);
  const convRate=c.purchases/(c.sessions||1),prevConvRate=p.purchases/(p.sessions||1);
  const cards=[
    {l:"Sessões",v:fmtF(c.sessions),d:delta(c.sessions,p.sessions),a:dAbs(c.sessions,p.sessions),s:sp.map(x=>x.s),cf:"#2ECB6F"},
    {l:"Usuários Ativos",v:fmtF(c.users),d:delta(c.users,p.users),a:dAbs(c.users,p.users),s:sp.map(x=>x.u),cf:"#3B82F6"},
    {l:"Novos Usuários",v:fmtF(c.newUsers),d:delta(c.newUsers,p.newUsers),a:dAbs(c.newUsers,p.newUsers)},
    {l:"Purchases (Pedidos Brutos)",v:fmtF(c.purchases),d:delta(c.purchases,p.purchases),a:dAbs(c.purchases,p.purchases),cf:"#8B5CF6"},
    {l:"Taxa de Conversão",v:pct(convRate),d:delta(convRate,prevConvRate),a:"Purchases ÷ Sessions",cf:"#A855F7"},
    {l:"Engajamento",v:pct1(c.engagementRate),d:delta(c.engagementRate,p.engagementRate),s:sp.map(x=>x.eng),cf:"#2ECB6F"},
    {l:"Bounce Rate",v:pct1(c.bounceRate),d:delta(c.bounceRate,p.bounceRate,true),s:sp.map(x=>x.bounce),cf:"#EF4444"},
    {l:"Duração Média",v:fmtDur(c.avgDuration),d:delta(c.avgDuration,p.avgDuration)},
    {l:"Receita Bruta (purchaseRevenue)",v:fmtMoney(c.revenue),d:delta(c.revenue,p.revenue),a:dAbs(c.revenue,p.revenue),cf:"#F59E0B"},
    {l:"Investimento (Ads)",v:fmtMoney(invest),d:{text:"input manual",cls:"neutral"}},
    {l:"CPA Bruto",v:fmtMoney(cpa),d:{text:"Invest ÷ Purchases",cls:"neutral"}},
    {l:"PDI Bruto",v:pct(pdi),d:{text:"Meta ≤ 9.5%",cls:pdi<=0.095?"pdi-good":"pdi-bad"},a:"Invest ÷ (Receita×12)"}
  ];
  // Funnel — full height, fills scorecard-right
  const fLabels=["Page View","View Item","Add to Cart","Checkout","Personal Info","Shipping Info","Payment Info","Purchase"];
  const fKeys=Object.keys(data.current.funnel);
  const maxF=data.current.funnel.page_view||1;
  const pMaxF=data.previous.funnel.page_view||1;

  document.getElementById("scorecard-layout").innerHTML=`
    <div class="scorecard-left"><div class="kpi-grid">${cards.map((k,i)=>`<div class="kpi-card"><div class="kpi-label">${k.l}</div><div class="kpi-value">${k.v}</div><div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap"><span class="kpi-delta ${k.d.cls}">${k.d.text}</span>${k.a?`<span style="font-size:.58rem;color:var(--text-muted)">(${k.a})</span>`:""}</div>${k.s?`<canvas class="sparkline" id="sp-${i}" style="width:100%;height:28px;margin-top:6px"></canvas>`:""}</div>`).join("")}</div></div>
    <div class="scorecard-right"><h3 class="funnel-visual-title">Funil de Conversão (purchase events)</h3>
    <div class="funnel-full">${fKeys.map((k,i)=>{
      const v=data.current.funnel[k],pv=data.previous.funnel[k]||1;
      const retPct=v/maxF,prevRetPct=(data.previous.funnel[k]||1)/pMaxF;
      const ppDelta=(retPct-prevRetPct)*100;
      const ppSign=ppDelta>=0?"+":"",ppCls=ppDelta>0.5?"up":ppDelta<-0.5?"down":"neutral";
      const prevStepVal=i>0?data.current.funnel[fKeys[i-1]]||1:v;
      const stepRet=i>0?v/(prevStepVal||1):1.0;
      const prevPrevStepVal=i>0?(data.previous.funnel[fKeys[i-1]]||1):1;
      const prevStepRet=i>0?(data.previous.funnel[k]||1)/(prevPrevStepVal||1):1.0;
      return`<div class="funnel-visual-step"><div class="funnel-visual-label">${fLabels[i]}</div><div class="funnel-visual-bar-wrap"><div class="funnel-visual-bar" style="width:${Math.max(2,retPct*100)}%"></div></div><div class="funnel-visual-val">${fmt(v)}</div><div>${tD(v,pv)}</div><div class="funnel-ret-pct">${i>0?pct1(retPct):""}</div><div>${i>0?`<span class="funnel-ret-delta kpi-delta ${ppCls}">${ppSign}${ppDelta.toFixed(1).replace(".",",")}pp</span>`:""}</div></div>`;}).join("")}</div></div>`;
  requestAnimationFrame(()=>{cards.forEach((k,i)=>{if(k.s)drawSpark(document.getElementById(`sp-${i}`),k.s,k.cf);});});

  // Executive summary
  const fVals=fKeys.map(k=>data.current.funnel[k]);
  const fStepRets=fKeys.map((k,i)=>i===0?1.0:fVals[i]/(fVals[i-1]||1));
  const worstStepIdx=fStepRets.slice(1).reduce((w,v,i)=>v<fStepRets[w+1]?i:w,0)+1;
  const bestStepIdx=fStepRets.slice(1).reduce((w,v,i)=>v>fStepRets[w+1]?i:w,0)+1;
  const overallCR=fVals[fVals.length-1]/(fVals[0]||1);
  const sessD=delta(c.sessions,p.sessions),revD=delta(c.revenue,p.revenue);

  document.getElementById("scorecard-summary").innerHTML=`<p><strong>📊 Resumo Executivo:</strong> ${fmtF(c.sessions)} sessões (${sessD.text} vs anterior) geraram <strong>${fmtMoney(c.revenue)}</strong> em purchaseRevenue (${revD.text}). Foram <strong>${fmtF(c.purchases)} purchases</strong> (Conv Rate ${pct(convRate)}). CPA = ${fmtMoney(cpa)}, PDI = ${pct(pdi)} ${pdi<=0.095?"✅":"⚠️ acima de 9.5%!"}.</p>
  <p><strong>📈 Funil:</strong> Converte ${pct(overallCR)} de PV em Purchase. <strong>Maior gargalo:</strong> ${fLabels[worstStepIdx-1]} → ${fLabels[worstStepIdx]} (${pct1(fStepRets[worstStepIdx])}). <strong>Fortaleza:</strong> ${fLabels[bestStepIdx-1]} → ${fLabels[bestStepIdx]} (${pct1(fStepRets[bestStepIdx])}). ${fStepRets[worstStepIdx]<0.6?`Cada +1pp aqui = ~${fmtMoney(Math.round(fVals[worstStepIdx-1]*0.01*overallCR*GA4_CALIBRATION.avgTicket))} MRR.`:""}</p>`;

  document.getElementById("scorecard-insight").innerHTML=`<p><strong>💡 Ações Prioritárias:</strong></p><p>• <strong>Receita:</strong> ${revD.cls==="up"?"Crescimento validado — escalar canais top.":"Queda detectada — auditar drop por canal."}</p><p>• <strong>CPA:</strong> ${fmtMoney(cpa)}. ${cpa>300?`<em>Se</em> priorizarmos CRM (CR 3-5x), <em>então</em> reduzimos CPA em ~30%.`:""}</p><p>• <strong>Funil:</strong> Foco em ${fLabels[worstStepIdx]} — maior oportunidade de MRR incremental.</p>`;
}

// === 2. Channels + Charts ===
function renderChannels(data){
  const renderChTable=(tbodyId,tfootId,list,prevList,hasGroup)=>{
    const tS=data.current.kpis.sessions,tP=data.current.kpis.purchases,tR=list.reduce((s,c)=>s+c.revenue,0);
    let sumS=0,sumP=0,sumR=0,sumDur=0,sumEng=0;
    document.getElementById(tbodyId).innerHTML=list.map((c,i)=>{
      const prev=prevList.find(x=>x.name===c.name)||c;sumS+=c.sessions;sumP+=c.purchases;sumR+=c.revenue;sumDur+=c.avgDuration*c.sessions;sumEng+=c.engRate*c.sessions;
      const shS=c.sessions/(tS||1),shP=c.purchases/(tP||1),shR=c.revenue/(tR||1);
      // Conv Rate = purchases / sessions (purchase event based)
      const cr=c.purchases/(c.sessions||1),pCr=prev.purchases/(prev.sessions||1);
      return`<tr>${hasGroup?`<td>${i+1}</td><td><strong>${c.name}</strong></td><td>${c.canal||c.group}</td>`:`<td><strong>${c.name}</strong></td>`}<td>${fmt(c.sessions)}<br>${tD(c.sessions,prev.sessions)}</td><td>${fmtF(c.purchases)}<br>${tD(c.purchases,prev.purchases)}</td><td>${pct(cr)}<br>${tD(cr,pCr)}</td><td>${pct1(shS)}</td><td>${pct1(shP)}</td><td>${fmtMoney(c.revenue)}<br>${tD(c.revenue,prev.revenue)}</td><td>${pct1(shR)}</td><td>${pct1(c.engRate)}<br>${tD(c.engRate,prev.engRate)}</td><td>${fmtDur(c.avgDuration)}</td></tr>`;
    }).join("");
    const cols=hasGroup?3:1;
    document.getElementById(tfootId).innerHTML=`<tr><td colspan="${cols}">TOTAL</td><td>${fmt(sumS)}</td><td>${fmtF(sumP)}</td><td>${pct(sumP/(sumS||1))}</td><td>100%</td><td>100%</td><td>${fmtMoney(sumR)}</td><td>100%</td><td>${pct1(sumEng/(sumS||1))}</td><td>${fmtDur(sumDur/(sumS||1))}</td></tr>`;
  };
  renderChTable("channel-groups-tbody","channel-groups-tfoot",data.current.channelGroups,data.previous.channelGroups,false);
  renderChTable("channels-tbody","channels-tfoot",data.current.channels,data.previous.channels,true);

  // Group insight + plan
  const topG=[...data.current.channelGroups].sort((a,b)=>b.revenue-a.revenue)[0];
  const paidShare=data.current.channelGroups.filter(g=>g.name.includes("Paid")).reduce((s,g)=>s+g.sessions,0)/(data.current.kpis.sessions||1);
  document.getElementById("channel-groups-insight").innerHTML=`<p><strong>📊 Análise:</strong> <strong>${topG.name}</strong> lidera receita (${fmtMoney(topG.revenue)}). Canais Paid = ${pct1(paidShare)} sessões. ${paidShare>0.5?`Alta dependência de mídia paga.`:`Mix equilibrado.`}</p>`;
  document.getElementById("channel-groups-plan").innerHTML=`<p><strong>🎯 Plano de Ação:</strong></p><p>• <em>Se</em> redirecionarmos 15% do budget de canais com CR<0.5% para Email+WhatsApp, <em>então</em> esperamos +20% ROAS, <em>porque</em> canais owned têm CR 3-5x superior ao paid social.</p><p>• <em>Se</em> investirmos em SEO/Content, <em>então</em> reduzimos dependência de paid em 10pp em 6 meses.</p>`;

  // Source insight + plan
  const topSM=[...data.current.channels].sort((a,b)=>b.revenue-a.revenue)[0];
  document.getElementById("channels-insight").innerHTML=`<p><strong>📊 Análise:</strong> <strong>${topSM.name}</strong> lidera receita (${fmtMoney(topSM.revenue)}). Top 3 canais por CR: ${[...data.current.channels].sort((a,b)=>(b.purchases/(b.sessions||1))-(a.purchases/(a.sessions||1))).slice(0,3).map(c=>`${c.name} (${pct(c.purchases/(c.sessions||1))})`).join(", ")}.</p>`;
  document.getElementById("channels-plan").innerHTML=`<p><strong>🎯 Hipótese:</strong> <em>Se</em> concentrarmos remarketing nos top 3 canais por CR, <em>então</em> esperamos +15% de conversões com mesmo budget, <em>porque</em> tráfego qualificado converte melhor que volume bruto.</p>`;

  // PIE + SCATTER
  renderPieChart("chart-pie-grupo",data.current.channelGroups.map(g=>g.name),data.current.channelGroups.map(g=>g.revenue));
  const top8=[...data.current.channels].sort((a,b)=>b.revenue-a.revenue).slice(0,8);
  renderPieChart("chart-pie-source",top8.map(c=>c.name),top8.map(c=>c.revenue));
  renderScatterChart("chart-scatter-grupo",data.current.channelGroups.map(g=>({x:g.purchases,y:g.purchases/(g.sessions||1)*100,label:g.name,r:Math.max(4,g.revenue/50000)})));
  renderScatterChart("chart-scatter-source",data.current.channels.map(c=>({x:c.purchases,y:c.purchases/(c.sessions||1)*100,label:c.name,r:Math.max(4,c.revenue/50000)})));

  // Chart insights — Group
  const grupoByRev=[...data.current.channelGroups].sort((a,b)=>b.revenue-a.revenue);
  const grupoInsEl=document.getElementById("charts-grupo-insight");
  if(grupoInsEl) grupoInsEl.innerHTML=`<p><strong>📊 Insight dos Gráficos:</strong> <strong>${grupoByRev[0]?.name}</strong> concentra ${pct1(grupoByRev[0]?.revenue/(grupoByRev.reduce((s,g)=>s+g.revenue,0)||1))} da receita. ${grupoByRev.length>2?`<strong>${grupoByRev[grupoByRev.length-1]?.name}</strong> com menor share — avaliar reposicionamento de budget.`:""}</p><p><strong>🎯 Ação:</strong> <em>Se</em> alocarmos 20% do budget de ${grupoByRev[grupoByRev.length-1]?.name} para ${grupoByRev[0]?.name}, <em>então</em> esperamos +${pct1(0.08)} ROAS, <em>porque</em> escalar canal validado tem ROI superior a testar canal fraco.</p>`;

  // Chart insights — Source
  const srcByRev=[...data.current.channels].sort((a,b)=>b.revenue-a.revenue);
  const srcInsEl=document.getElementById("charts-source-insight");
  if(srcInsEl) srcInsEl.innerHTML=`<p><strong>📊 Insight dos Gráficos:</strong> Top 3 Sources por receita: ${srcByRev.slice(0,3).map(c=>`${c.name} (${fmtMoney(c.revenue)})`).join(", ")}. Scatter mostra que canais com alto volume de purchases nem sempre têm melhor conv rate — priorizar canais no quadrante superior-direito.</p><p><strong>🎯 Ação:</strong> <em>Se</em> segmentarmos budget para canais no Q1 (alto CR + alto purchase), <em>então</em> maximizamos MRR com mesmo investimento.</p>`;
}

function renderPieChart(canvasId,labels,values){
  destroyChart(canvasId);
  const ctx=document.getElementById(canvasId);if(!ctx)return;
  _charts[canvasId]=new Chart(ctx,{type:"doughnut",data:{labels,datasets:[{data:values,backgroundColor:CHART_COLORS.slice(0,labels.length),borderWidth:0}]},options:{...chartDefaults(),cutout:"55%",plugins:{...chartDefaults().plugins,tooltip:{callbacks:{label:ctx2=>{const tot=ctx2.dataset.data.reduce((a,b)=>a+b,0);return`${ctx2.label}: ${fmtMoney(ctx2.raw)} (${((ctx2.raw/tot)*100).toFixed(1)}%)`;}}},legend:{labels:{color:"#9CA3AF",font:{size:9},boxWidth:10},position:"right"}}}});
}
function renderScatterChart(canvasId,points){
  destroyChart(canvasId);
  const ctx=document.getElementById(canvasId);if(!ctx)return;
  _charts[canvasId]=new Chart(ctx,{type:"bubble",data:{datasets:[{data:points.map(p=>({x:p.x,y:p.y,r:Math.min(20,p.r||6)})),backgroundColor:points.map((_,i)=>CHART_COLORS[i%CHART_COLORS.length]+"AA"),borderWidth:0}]},options:{...chartDefaults(),plugins:{...chartDefaults().plugins,legend:{display:false},tooltip:{callbacks:{label:ctx2=>{const p=points[ctx2.dataIndex];return p?`${p.label}: ${fmtF(p.x)} purchases, ${p.y.toFixed(2)}% CR`:"";}}}},scales:{x:{title:{display:true,text:"Purchases",color:"#9CA3AF"},ticks:{color:"#9CA3AF"},grid:{color:"rgba(255,255,255,.05)"}},y:{title:{display:true,text:"Conv Rate %",color:"#9CA3AF"},ticks:{color:"#9CA3AF"},grid:{color:"rgba(255,255,255,.05)"}}}}});
}

// === 3. Golden Path ===
function renderFunnel(data){
  const f=data.current.funnel,ticket=GA4_CALIBRATION.avgTicket;
  const viRate=f.view_item/(f.page_view||1),atcToChk=f.begin_checkout/(f.add_to_cart||1),apiToPur=f.purchase/(f.add_payment_info||f.add_shipping_info||1);
  const actions=[
    {step:`Page View → View Item (Retenção: ${pct1(viRate)})`,omtm:"View Item / Page View",meta:`Aumentar de ${pct1(viRate)} para ${pct1(viRate+0.07)}`,se:"implementarmos carrossel de Top Sellers com preço visível acima da dobra",entao:`+7pp na discovery rate`,porque:`${pct1(1-viRate)} dos visitantes nunca veem um produto`,mrr:`~${fmtMoney(Math.round(f.page_view*0.07*atcToChk*(f.purchase/(f.add_shipping_info||1))*ticket))}/mês`},
    {step:`Add to Cart → Checkout (Retenção: ${pct1(atcToChk)})`,omtm:"Checkout / Add to Cart",meta:"Aumentar retenção em 15%",se:`inserirmos widget 'Simulação de Assinatura' (R$${ticket}/mês vs compra) no carrinho`,entao:"+15% início de checkout",porque:"objeção B2C principal é preço — mostrar que assinar custa 8x menos remove fricção",mrr:`~${fmtMoney(Math.round(f.add_to_cart*0.15*0.5*ticket))}/mês`},
    {step:`Payment Info → Purchase (Retenção: ${pct1(apiToPur)})`,omtm:"Purchase / Payment Info",meta:"Reduzir drop final em 20%",se:"integrarmos pré-qualificação de crédito (Serasa) antes dos dados de cartão",entao:"-20% drop final",porque:"sem pré-check, leads preenchem tudo para serem negados — churn de experiência",mrr:`~${fmtMoney(Math.round((f.add_payment_info||f.add_shipping_info)*0.2*0.8*ticket))}/mês`},
  ];
  document.getElementById("funnel-actions").innerHTML=actions.map(a=>`<div class="funnel-action-card"><div class="funnel-action-step">${a.step}</div><div class="hyp-label">OMTM</div><div class="funnel-action-item"><strong>${a.omtm}</strong> — Meta: ${a.meta}</div><div class="hyp-label" style="margin-top:10px">HIPÓTESE (Se → Então → Porque)</div><div class="funnel-action-item"><strong>Se</strong> ${a.se}, <strong>então</strong> ${a.entao}, <strong>porque</strong> ${a.porque}.</div><div class="funnel-action-item mrr"><strong>MRR Incremental (Tkt R$${ticket}):</strong> ${a.mrr}</div></div>`).join("");
}

// === 4. Money Leaks (compact grid cards) ===
function renderMoneyLeaks(data){
  const steps=["page_view","view_item","add_to_cart","begin_checkout","add_personal_info","add_shipping_info","add_payment_info","purchase"];
  const labels=["Page View","View Item","Add to Cart","Checkout","Personal Info","Shipping Info","Payment Info","Purchase"];
  const f=data.current.funnel,pf=data.previous.funnel;let html='';
  for(let i=0;i<steps.length-1;i++){
    const from=f[steps[i]]||0,to=f[steps[i+1]]||0;
    const pfrom=pf[steps[i]]||1,pto=pf[steps[i+1]]||1;
    const retPct=to/(from||1),prevRetPct=pto/(pfrom||1);
    const ppDelta=(retPct-prevRetPct)*100;
    const dropAbs=from-to;
    const severity=retPct<0.35?"critical":retPct<0.65?"high":"normal";
    html+=`<div class="friction-card friction-${severity}"><div class="friction-flow">${labels[i]} → ${labels[i+1]}</div><div class="friction-numbers"><span class="friction-from">${fmt(from)}</span><span style="color:var(--text-muted)">→</span><span class="friction-to">${fmt(to)}</span></div><div class="friction-bars"><div class="friction-bar-continue" style="width:${retPct*100}%"></div></div><div class="friction-stats"><span>Retenção: <strong>${pct1(retPct)}</strong></span><span>Perda: <strong>${fmt(dropAbs)}</strong></span></div><div class="friction-variation">Δ Retenção: <span class="kpi-delta ${ppDelta>0.5?"up":ppDelta<-0.5?"down":"neutral"}">${ppDelta>=0?"+":""}${ppDelta.toFixed(1).replace(".",",")}pp</span> vs anterior</div></div>`;
  }
  document.getElementById("leaks-grid").innerHTML=html;
  const retRates=[];for(let i=0;i<steps.length-1;i++){retRates.push({l:`${labels[i]}→${labels[i+1]}`,v:(f[steps[i+1]]||0)/(f[steps[i]]||1)});}
  const worst=retRates.reduce((w,x)=>x.v<w.v?x:w);const best=retRates.reduce((w,x)=>x.v>w.v?x:w);
  document.getElementById("leaks-insight").innerHTML=`<p><strong>💡 Análise:</strong> Maior fricção: <strong>${worst.l}</strong> (${pct1(worst.v)}). Maior fortaleza: <strong>${best.l}</strong> (${pct1(best.v)}). Cada +1pp no gargalo ≈ ${fmtMoney(Math.round(data.current.funnel.page_view*0.01*0.013*GA4_CALIBRATION.avgTicket))} MRR.</p>`;
}

// === 5. Devices ===
function renderDevices(data){
  const devs=data.current.devices,icons={Mobile:"📱",Desktop:"💻",Tablet:"📟"};
  const tS=devs.reduce((s,x)=>s+x.sessions,0),tP=devs.reduce((s,x)=>s+x.purchases,0);
  document.getElementById("device-grid").innerHTML=devs.map(dev=>{
    const prev=data.previous.devices.find(x=>x.name===dev.name)||dev;
    const cr=dev.purchases/(dev.sessions||1),crP=prev.purchases/(prev.sessions||1);
    const acts=dev.name==="Mobile"?[
      {t:"Checkout Express (Apple/Google Pay)",h:`<em>Se</em> ativarmos wallets, <em>então</em> +8% aprovação mobile.`},
      {t:"Auto-fill CEP via GPS",h:`<em>Se</em> Location API, <em>então</em> +15% conclusão shipping.`},
      {t:"WebP + CDN (LCP <2s)",h:`<em>Se</em> LCP otimizado, <em>então</em> -4% bounce.`}
    ]:[
      {t:"Exit Intent + Oferta",h:`<em>Se</em> popup exit intent, <em>então</em> +3% recuperação.`},
      {t:"Live Chat Sales",h:`<em>Se</em> chat vendas, <em>então</em> +2% CR.`},
      {t:"Email Remarketing (2h)",h:`<em>Se</em> email 2h pós-visita, <em>então</em> 5% recuperação.`}
    ];
    return`<div class="device-card"><div class="device-icon">${icons[dev.name]||"📟"}</div><div class="device-name">${dev.name}</div><div class="device-sessions">${fmt(dev.sessions)}</div><div class="device-share">${pct1(dev.sessions/(tS||1))} Sessões | ${pct1(dev.purchases/(tP||1))} Compras</div><div class="device-stats"><div><div class="device-stat-label">Conv Rate</div><div class="device-stat-value">${pct(cr)} ${tD(cr,crP)}</div></div><div><div class="device-stat-label">Compras</div><div class="device-stat-value">${fmtF(dev.purchases)} ${tD(dev.purchases,prev.purchases)}</div></div><div><div class="device-stat-label">Engaj</div><div class="device-stat-value">${pct1(dev.engRate)}</div></div><div><div class="device-stat-label">Duração</div><div class="device-stat-value">${fmtDur(dev.avgDuration)}</div></div></div><div class="device-actions"><h4>Planos (${dev.name})</h4>${acts.map(a=>`<div class="device-action-item"><strong>${a.t}</strong><br>${a.h}</div>`).join("")}</div></div>`;
  }).join("");
  const mobCR=devs[0].purchases/(devs[0].sessions||1),dskDev=devs.find(d=>d.name==="Desktop"),dskCR=dskDev?(dskDev.purchases/(dskDev.sessions||1)):0;
  document.getElementById("devices-insight").innerHTML=`<p><strong>📊 Resumo:</strong> Mobile = ${pct1(devs[0].sessions/(tS||1))} sessões. Desktop CR ${(dskCR/(mobCR||1)).toFixed(1)}x maior. +0.1pp mobile CR = ~${fmt(Math.round(devs[0].sessions*0.001))} purchases adicionais.</p>`;
}
