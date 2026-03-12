// V6.3 — App Core + Sections 1–5
document.addEventListener("DOMContentLoaded",()=>{
  const CTX=window.ALLU_CONTEXT;
  const srcSel=document.getElementById("filter-source");
  [...CTX.channels].sort((a,b)=>b.shareS-a.shareS).forEach(c=>{const o=document.createElement("option");o.value=c.name;o.textContent=c.name;srcSel.appendChild(o);});
  const campSel=document.getElementById("filter-campaign");
  [...CTX.campaigns].sort((a,b)=>b.share-a.share).forEach(c=>{const o=document.createElement("option");o.value=c.name;o.textContent=c.name;campSel.appendChild(o);});
  const catSel=document.getElementById("filter-category");
  [...new Set(CTX.products.map(p=>p.category))].forEach(c=>{const o=document.createElement("option");o.value=c;o.textContent=c;catSel.appendChild(o);});
  const prodSel=document.getElementById("filter-product");
  [...CTX.products].sort((a,b)=>b.shareV-a.shareV).forEach(p=>{const o=document.createElement("option");o.value=p.name;o.textContent=p.name;prodSel.appendChild(o);});
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
  const data=window.V6_ENGINE.buildDashboardData(s,e,document.getElementById("filter-compare").value,document.getElementById("filter-source").value,document.getElementById("filter-category").value,document.getElementById("filter-product").value,document.getElementById("filter-campaign").value);
  window._lastData=data;
  document.getElementById("period-badge").textContent=`Base GA4 Engine | Período: ${data.currentText} | Comparação: ${data.previousText}`;
  renderAll(data);
}
const fmt=n=>{if(n>=1e6)return(n/1e6).toFixed(1).replace(".",",")+"M";if(n>=1e3)return(n/1e3).toFixed(1).replace(".",",")+"K";return n.toLocaleString("pt-BR",{maximumFractionDigits:0});};
const fmtF=n=>n.toLocaleString("pt-BR",{maximumFractionDigits:0});
const pct=v=>(v*100).toFixed(2).replace(".",",")+"%";
const pct1=v=>(v*100).toFixed(1).replace(".",",")+"%";
const fmtMoney=n=>"R$ "+n.toLocaleString("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:0});
const fmtDur=s=>{if(!s||isNaN(s))return"0s";const m=Math.floor(s/60);const sc=Math.round(s%60);return`${m}m${sc.toString().padStart(2,"0")}s`;};
function delta(c,p,inv){if(!p||p===0)return{text:"—",cls:"neutral"};const d=((c-p)/p)*100;const s=d>=0?"+":"";let cls=d>1?"up":d<-1?"down":"neutral";if(inv)cls=d>1?"down":d<-1?"up":"neutral";return{text:s+d.toFixed(1).replace(".",",")+"%",cls,raw:d};}
const tD=(c,p,inv)=>{const d=delta(c,p,inv);return`<span class="kpi-delta ${d.cls}">${d.text}</span>`;};
const dAbs=(c,p)=>{const d=c-p;return(d>=0?"+":"")+fmtF(d);};
function drawSpark(cv,vals,color="#00c566"){if(!cv)return;const ctx=cv.getContext("2d");const w=cv.width=cv.offsetWidth*2;const h=cv.height=cv.offsetHeight*2;ctx.clearRect(0,0,w,h);if(!vals||vals.length<2)return;const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1,step=w/(vals.length-1);const gr=ctx.createLinearGradient(0,0,0,h);gr.addColorStop(0,color+"40");gr.addColorStop(1,color+"00");ctx.beginPath();ctx.moveTo(0,h);vals.forEach((v,i)=>{ctx.lineTo(i*step,h-((v-mn)/rng)*(h*.85)-h*.05);});ctx.lineTo(w,h);ctx.closePath();ctx.fillStyle=gr;ctx.fill();ctx.beginPath();vals.forEach((v,i)=>{const x=i*step,y=h-((v-mn)/rng)*(h*.85)-h*.05;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();}
function renderAll(d){renderKPIs(d);renderChannels(d);renderFunnel(d);renderMoneyLeaks(d);renderDevices(d);renderAudience(d);renderSegments(d);renderProducts(d);renderICE(d);renderGrowth(d);}

// === 1. KPIs ===
function renderKPIs(data){
  const c=data.current.kpis,p=data.previous.kpis,sp=data.current.sparklines;
  const invest=parseFloat(document.getElementById("input-investment").value)||0;
  const cpa=invest/(c.purchases||1),pdi=invest/((c.revenue*12)||1);
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
    {l:"Receita Bruta",v:fmtMoney(c.revenue),d:delta(c.revenue,p.revenue),a:dAbs(c.revenue,p.revenue),cf:"#F59E0B"},
    {l:"Investimento (Ads)",v:fmtMoney(invest),d:{text:"input manual",cls:"neutral"}},
    {l:"CPA Bruto",v:fmtMoney(cpa),d:{text:"Invest ÷ Purchases",cls:"neutral"}},
    {l:"PDI Bruto",v:pct(pdi),d:{text:"Meta ≤ 9.5%",cls:pdi<=0.095?"pdi-good":"pdi-bad"}}
  ];
  // FUNNEL: show RETENTION % (who stays), not drop; compare vs previous in pp
  const fLabels=["Page View","View Item","Add to Cart","Checkout","Personal Info","Shipping Info","Payment Info","Purchase"];
  const fKeys=Object.keys(data.current.funnel);
  const maxF=data.current.funnel.page_view||1;
  const pMaxF=data.previous.funnel.page_view||1;

  document.getElementById("scorecard-layout").innerHTML=`
    <div class="scorecard-left"><div class="kpi-grid">${cards.map((k,i)=>`<div class="kpi-card"><div class="kpi-label">${k.l}</div><div class="kpi-value">${k.v}</div><div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap"><span class="kpi-delta ${k.d.cls}">${k.d.text}</span>${k.a?`<span style="font-size:.58rem;color:var(--text-muted)">(${k.a})</span>`:""}</div>${k.s?`<canvas class="sparkline" id="sp-${i}" style="width:100%;height:28px;margin-top:6px"></canvas>`:""}</div>`).join("")}</div></div>
    <div class="scorecard-right"><h3 class="funnel-visual-title">Funil de Conversão</h3>
    ${fKeys.map((k,i)=>{
      const v=data.current.funnel[k];
      const pv=data.previous.funnel[k]||1;
      // Retention % = this step / page_view (what % of ALL visitors reach this step)
      const retPct = v / maxF;
      const prevRetPct = (data.previous.funnel[k]||1) / pMaxF;
      const ppDelta = ((retPct - prevRetPct) * 100); // pp change
      const ppSign = ppDelta >= 0 ? "+" : "";
      const ppCls = ppDelta > 0.5 ? "up" : ppDelta < -0.5 ? "down" : "neutral";
      return`<div class="funnel-visual-step"><div class="funnel-visual-label">${fLabels[i]}</div><div class="funnel-visual-bar-wrap"><div class="funnel-visual-bar" style="width:${Math.max(2,(v/maxF)*100)}%"></div></div><div class="funnel-visual-val">${fmt(v)}</div>${tD(v,pv)}<span class="funnel-ret-pct">${i>0?pct1(retPct):""}</span>${i>0?`<span class="funnel-ret-delta kpi-delta ${ppCls}">${ppSign}${ppDelta.toFixed(1).replace(".",",")}pp</span>`:""}</div>`;}).join("")}</div>`;
  requestAnimationFrame(()=>{cards.forEach((k,i)=>{if(k.s)drawSpark(document.getElementById(`sp-${i}`),k.s,k.cf);});});

  // Funnel summary — detailed analysis of strengths and bottlenecks
  const fVals=fKeys.map(k=>data.current.funnel[k]);
  const fStepRets=fKeys.map((k,i)=>i===0?1.0:fVals[i]/(fVals[i-1]||1));
  const worstStepIdx = fStepRets.slice(1).reduce((w,v,i)=>v<fStepRets[w+1]?i:w,0)+1;
  const bestStepIdx = fStepRets.slice(1).reduce((w,v,i)=>v>fStepRets[w+1]?i:w,0)+1;
  const overallCR = fVals[fVals.length-1]/(fVals[0]||1);

  const sessD=delta(c.sessions,p.sessions),revD=delta(c.revenue,p.revenue);
  document.getElementById("scorecard-summary").innerHTML=`<p><strong>📊 Resumo Executivo:</strong> ${fmtF(c.sessions)} sessões (${sessD.text} vs anterior) geraram <strong>${fmtMoney(c.revenue)}</strong> em receita bruta (${revD.text}). Foram <strong>${fmtF(c.purchases)} pedidos brutos</strong> com <strong>Conv Rate de ${pct(convRate)}</strong>. ${fmtF(c.newUsers)} novos usuários (${pct1(c.newUsers/c.users)} da base). CPA = ${fmtMoney(cpa)}, PDI = ${pct(pdi)} ${pdi<=0.095?"(saudável)":"(⚠️ acima de 9.5%!)"}. Lembre: apenas 30% dos pedidos brutos serão aprovados pelo risco → ~${fmtF(Math.round(c.purchases*0.3))} pedidos líquidos estimados.</p>
  <p><strong>📈 Análise do Funil:</strong> O funil converte ${pct(overallCR)} de Page Views em Purchases. <strong>Maior gargalo:</strong> ${fLabels[worstStepIdx-1]} → ${fLabels[worstStepIdx]} (apenas ${pct1(fStepRets[worstStepIdx])} prosseguem). <strong>Maior fortaleza:</strong> ${fLabels[bestStepIdx-1]} → ${fLabels[bestStepIdx]} (${pct1(fStepRets[bestStepIdx])} de retenção). ${fStepRets[1]<0.45?`A descoberta de produto (PV→VI a ${pct1(fStepRets[1])}) é saudável para B2C de assinaturas.`:`O discovery rate (${pct1(fStepRets[1])}) está excelente — visitantes estão encontrando produtos.`} ${fStepRets[worstStepIdx]<0.6?`O gargalo em ${fLabels[worstStepIdx]} sugere fricção operacional — cada ponto percentual de melhoria aqui vale ~${fmtMoney(Math.round(fVals[worstStepIdx-1]*0.01*overallCR*390))} em MRR.`:""}</p>`;
  const topCh=[...data.current.channels].sort((a,b)=>b.revenue-a.revenue)[0];
  document.getElementById("scorecard-insight").innerHTML=`<p><strong>💡 Insights Acionáveis:</strong></p><p>• <strong>Receita:</strong> ${revD.cls==="up"?`Crescimento de receita — ${topCh?.name||""} lidera contribuição.`:`Receita em queda — investigar volume vs ticket.`}</p><p>• <strong>CPA:</strong> ${fmtMoney(cpa)}. ${cpa>300?`Acima do ideal. <em>Se</em> priorizarmos Email/WhatsApp (CR 3-5x), <em>então</em> reduzimos CPA em ~30%.`:``}</p><p>• <strong>Pedidos Líquidos:</strong> Com aprovação de 30%, ~${fmtF(Math.round(c.purchases*0.3))} serão aprovados. CPA Líquido estimado: ${fmtMoney(invest/(c.purchases*0.3||1))}.</p>`;
}

// === 2. Channels ===
function renderChannels(data){
  const renderChTable=(tbodyId,tfootId,list,prevList,hasGroup)=>{
    const tS=data.current.kpis.sessions,tP=data.current.kpis.purchases,tR=list.reduce((s,c)=>s+c.revenue,0);
    let sumS=0,sumP=0,sumR=0,sumDur=0,sumEng=0;
    document.getElementById(tbodyId).innerHTML=list.map((c,i)=>{
      const prev=prevList.find(x=>x.name===c.name)||c;sumS+=c.sessions;sumP+=c.purchases;sumR+=c.revenue;sumDur+=c.avgDuration*c.sessions;sumEng+=c.engRate*c.sessions;
      const shS=c.sessions/(tS||1),shP=c.purchases/(tP||1),shR=c.revenue/(tR||1);
      const cr=c.purchases/(c.pageviews||c.sessions||1),pCr=prev.purchases/(prev.pageviews||prev.sessions||1);
      return`<tr>${hasGroup?`<td>${i+1}</td><td><strong>${c.name}</strong></td><td>${c.group}</td>`:`<td><strong>${c.name}</strong></td>`}<td>${fmt(c.sessions)}<br>${tD(c.sessions,prev.sessions)}</td><td>${fmtF(c.purchases)}<br>${tD(c.purchases,prev.purchases)}</td><td>${pct(cr)}<br>${tD(cr,pCr)}</td><td>${pct1(shS)}</td><td>${pct1(shP)}</td><td>${fmtMoney(c.revenue)}<br>${tD(c.revenue,prev.revenue)}</td><td>${pct1(shR)}</td><td>${pct1(c.engRate)}<br>${tD(c.engRate,prev.engRate)}</td><td>${fmtDur(c.avgDuration)}</td></tr>`;
    }).join("");
    const cols=hasGroup?3:1;
    document.getElementById(tfootId).innerHTML=`<tr><td colspan="${cols}">TOTAL</td><td>${fmt(sumS)}</td><td>${fmtF(sumP)}</td><td>${pct(sumP/(sumS*1.5||1))}</td><td>100%</td><td>100%</td><td>${fmtMoney(sumR)}</td><td>100%</td><td>${pct1(sumEng/(sumS||1))}</td><td>${fmtDur(sumDur/(sumS||1))}</td></tr>`;
  };
  renderChTable("channel-groups-tbody","channel-groups-tfoot",data.current.channelGroups,data.previous.channelGroups,false);
  renderChTable("channels-tbody","channels-tfoot",data.current.channels,data.previous.channels,true);
  const topG=[...data.current.channelGroups].sort((a,b)=>b.revenue-a.revenue)[0];
  const paidShare=data.current.channelGroups.filter(g=>g.name.includes("Paid")).reduce((s,g)=>s+g.sessions,0)/(data.current.kpis.sessions||1);
  document.getElementById("channel-groups-insight").innerHTML=`<p><strong>📊 Resumo:</strong> <strong>${topG.name}</strong> lidera receita com ${fmtMoney(topG.revenue)}. Canais Paid = ${pct1(paidShare)} das sessões — ${paidShare>0.5?`alta dependência. <em>Se</em> investirmos em SEO+Content, <em>então</em> reduzimos dependência de paid em 15pp, <em>porque</em> CR orgânico é superior.`:`mix saudável.`}</p>`;
  const topSM=[...data.current.channels].sort((a,b)=>b.revenue-a.revenue)[0];
  const ghostCh=data.current.channels.find(c=>c.name==="(not set)");
  document.getElementById("channels-insight").innerHTML=`<p><strong>📊 Resumo:</strong> <strong>${topSM.name}</strong> lidera receita. ${ghostCh?`"(not set)" = ${fmt(ghostCh.sessions)} sessões com ${pct1(ghostCh.bounceRate)} bounce — auditar UTMs via GTM.`:""}</p>`;
}

// === 3. Golden Path ===
function renderFunnel(data){
  const f=data.current.funnel,ticket=390;
  const viRate=f.view_item/(f.page_view||1),atcToChk=f.begin_checkout/(f.add_to_cart||1),siToPur=f.purchase/(f.add_shipping_info||1);
  const apiToPur=f.purchase/(f.add_payment_info||1);
  const actions=[
    {step:`Page View → View Item (Retenção: ${pct1(viRate)})`,omtm:"View Item / Page View",meta:`Aumentar de ${pct1(viRate)} para ${pct1(viRate+0.07)}`,
     se:"implementarmos um carrossel de Top Sellers com preço e parcela visíveis acima da dobra",
     entao:`+7pp na discovery rate, gerando ~${fmt(Math.round(f.page_view*0.07))} view_items adicionais`,
     porque:`${pct1(1-viRate)} dos visitantes nunca veem um produto — exposição imediata com preço reduz barreira de descoberta B2C`,
     mrr:`~${fmt(Math.round(f.page_view*0.07*atcToChk*siToPur))} purchases → <strong>${fmtMoney(Math.round(f.page_view*0.07*atcToChk*siToPur*ticket))}/mês</strong>`},
    {step:`Add to Cart → Checkout (Retenção: ${pct1(atcToChk)})`,omtm:"Begin Checkout / Add to Cart",meta:"Aumentar retenção Cart→Checkout em 15%",
     se:`inserirmos widget 'Simulação de Assinatura' (R$${ticket}/mês vs compra de R$4.500) no carrinho`,
     entao:"+15% na taxa de início de checkout",
     porque:"a objeção B2C principal é 'preço de aluguel vs compra' — mostrar que assinar custa 8x menos remove fricção cognitiva",
     mrr:`~${fmt(Math.round(f.add_to_cart*0.15*0.5))} checkouts → <strong>${fmtMoney(Math.round(f.add_to_cart*0.15*0.5*ticket))}/mês</strong>`},
    {step:`Payment Info → Purchase (Retenção: ${pct1(apiToPur)})`,omtm:"Purchase / Payment Info",meta:"Reduzir drop de última etapa em 20%",
     se:"integrarmos pré-qualificação de crédito (Serasa) antes de exigir dados de cartão",
     entao:"-20% no drop final, evitando frustração de leads reprovados na análise de risco",
     porque:"sem pré-check, leads B2C preenchem tudo para serem negados no fim — churn de experiência afeta NPS e gera objeções boca-a-boca",
     mrr:`~${fmt(Math.round(f.add_payment_info*0.2*0.8))} conversões salvas → <strong>${fmtMoney(Math.round(f.add_payment_info*0.2*0.8*ticket))}/mês</strong>`},
  ];
  document.getElementById("funnel-actions").innerHTML=actions.map(a=>`<div class="funnel-action-card"><div class="funnel-action-step">${a.step}</div><div class="hyp-label">OMTM</div><div class="funnel-action-item"><strong>${a.omtm}</strong> — Meta: ${a.meta}</div><div class="hyp-label" style="margin-top:10px">HIPÓTESE (Se → Então → Porque)</div><div class="funnel-action-item"><strong>Se</strong> ${a.se}, <strong>então</strong> ${a.entao}, <strong>porque</strong> ${a.porque}.</div><div class="funnel-action-item mrr"><strong>MRR Incremental (Tkt R$${ticket}):</strong> ${a.mrr}</div></div>`).join("");
}

// === 4. Money Leaks ===
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
  const worst=retRates.reduce((w,x)=>x.v<w.v?x:w);
  const best=retRates.reduce((w,x)=>x.v>w.v?x:w);
  document.getElementById("leaks-insight").innerHTML=`<p><strong>💡 Análise:</strong> Maior fricção: <strong>${worst.l}</strong> (${pct1(worst.v)} de retenção). Maior fortaleza: <strong>${best.l}</strong> (${pct1(best.v)}). Cada +1pp de melhoria no gargalo vale ~${fmtMoney(Math.round(data.current.funnel.page_view*0.01*0.013*390))} em MRR. Foco: otimizar <strong>${worst.l}</strong> com ações de UX e confiança.</p>`;
}

// === 5. Devices ===
function renderDevices(data){
  const devs=data.current.devices,icons={Mobile:"📱",Desktop:"💻",Tablet:"📟"};
  const tS=devs.reduce((s,x)=>s+x.sessions,0),tP=devs.reduce((s,x)=>s+x.purchases,0);
  document.getElementById("device-grid").innerHTML=devs.map(dev=>{
    const prev=data.previous.devices.find(x=>x.name===dev.name)||dev;
    const cr=dev.purchases/(dev.sessions||1),crP=prev.purchases/(prev.sessions||1);
    const acts=dev.name==="Mobile"?[
      {t:"Checkout Express (Apple/Google Pay)",h:`<em>Se</em> ativarmos wallets, <em>então</em> +8% aprovação mobile, <em>porque</em> elimina fricção de digitação (~30% dos abandonos B2C mobile).`},
      {t:"Auto-fill CEP via GPS",h:`<em>Se</em> usarmos Location API, <em>então</em> +15% conclusão shipping, <em>porque</em> endereço manual é a etapa mais lenta no celular.`},
      {t:"WebP + CDN (LCP <2s)",h:`<em>Se</em> otimizarmos LCP, <em>então</em> -4% bounce, <em>porque</em> 53% dos mobile abandonam sites >3s (Google).`}
    ]:[
      {t:"Exit Intent + Oferta Personalizada",h:`<em>Se</em> popup de exit intent com último produto visto, <em>então</em> recuperamos 3% dos abandonadores, <em>porque</em> tempo de ${fmtDur(dev.avgDuration)} indica alta intenção.`},
      {t:"Live Chat Sales (WhatsApp)",h:`<em>Se</em> chat de vendas, <em>então</em> +2% CR em sessões com interação, <em>porque</em> dúvidas sobre contrato/crédito travam a conversão B2C.`},
      {t:"Email Remarketing (2h pós-visita)",h:`<em>Se</em> email com produtos navegados em 2h, <em>então</em> 5% de recuperação, <em>porque</em> intenção de ${dev.name} esfria mais devagar.`}
    ];
    return`<div class="device-card"><div class="device-icon">${icons[dev.name]||"📟"}</div><div class="device-name">${dev.name}</div><div class="device-sessions">${fmt(dev.sessions)}</div><div class="device-share">${pct1(dev.sessions/(tS||1))} Sessões | ${pct1(dev.purchases/(tP||1))} Compras</div><div class="device-stats"><div><div class="device-stat-label">Conv Rate</div><div class="device-stat-value">${pct(cr)} ${tD(cr,crP)}</div></div><div><div class="device-stat-label">Compras</div><div class="device-stat-value">${fmtF(dev.purchases)} ${tD(dev.purchases,prev.purchases)}</div></div><div><div class="device-stat-label">Engag Rate</div><div class="device-stat-value">${pct1(dev.engRate)}</div></div><div><div class="device-stat-label">Duração</div><div class="device-stat-value">${fmtDur(dev.avgDuration)}</div></div></div><div class="device-actions"><h4>Planos (${dev.name})</h4>${acts.map(a=>`<div class="device-action-item"><strong>${a.t}</strong><br>${a.h}</div>`).join("")}</div></div>`;
  }).join("");
  const mobCR=devs[0].purchases/(devs[0].sessions||1),dskDev=devs.find(d=>d.name==="Desktop"),dskCR=dskDev?(dskDev.purchases/(dskDev.sessions||1)):0;
  document.getElementById("devices-insight").innerHTML=`<p><strong>📊 Resumo:</strong> Mobile = ${pct1(devs[0].sessions/(tS||1))} sessões. Desktop CR ${(dskCR/(mobCR||1)).toFixed(1)}x maior. A cada +0.1pp mobile CR = ~${fmt(Math.round(devs[0].sessions*0.001))} purchases incrementais.</p>`;
}
