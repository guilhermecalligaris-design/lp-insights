// V6.2 — App Core + Sections 1-5
document.addEventListener("DOMContentLoaded",()=>{
  const CTX=window.ALLU_CONTEXT;
  // Populate filters sorted by share descending
  const srcSel=document.getElementById("filter-source");
  [...CTX.channels].sort((a,b)=>b.shareS-a.shareS).forEach(c=>{const o=document.createElement("option");o.value=c.name;o.textContent=c.name;srcSel.appendChild(o);});
  const campSel=document.getElementById("filter-campaign");
  [...CTX.campaigns].sort((a,b)=>b.share-a.share).forEach(c=>{const o=document.createElement("option");o.value=c.name;o.textContent=c.name;campSel.appendChild(o);});
  const catSel=document.getElementById("filter-category");
  const cats=[...new Set(CTX.products.map(p=>p.category))];
  cats.forEach(c=>{const o=document.createElement("option");o.value=c;o.textContent=c;catSel.appendChild(o);});
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
// Helpers
const fmt=n=>{if(n>=1e6)return(n/1e6).toFixed(1).replace(".",",")+"M";if(n>=1e3)return(n/1e3).toFixed(1).replace(".",",")+"K";return n.toLocaleString("pt-BR",{maximumFractionDigits:0});};
const fmtF=n=>n.toLocaleString("pt-BR",{maximumFractionDigits:0});
const pct=v=>(v*100).toFixed(2).replace(".",",")+"%";
const pct1=v=>(v*100).toFixed(1).replace(".",",")+"%";
const fmtMoney=n=>"R$ "+n.toLocaleString("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:0});
const fmtDur=s=>{if(!s||isNaN(s))return"0s";const m=Math.floor(s/60);const sc=Math.round(s%60);return`${m}m${sc.toString().padStart(2,"0")}s`;};
function delta(c,p,inv){if(!p||p===0)return{text:"—",cls:"neutral"};const d=((c-p)/p)*100;const s=d>=0?"+":"";let cls=d>1?"up":d<-1?"down":"neutral";if(inv)cls=d>1?"down":d<-1?"up":"neutral";return{text:s+d.toFixed(1).replace(".",",")+"%",cls};}
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
  const funnelConvRate=c.purchases/(data.current.funnel.page_view||1);
  const cards=[
    {l:"Sessões",v:fmtF(c.sessions),d:delta(c.sessions,p.sessions),a:dAbs(c.sessions,p.sessions),s:sp.map(x=>x.s),cf:"#2ECB6F"},
    {l:"Usuários Ativos",v:fmtF(c.users),d:delta(c.users,p.users),a:dAbs(c.users,p.users),s:sp.map(x=>x.u),cf:"#3B82F6"},
    {l:"Novos Usuários",v:fmtF(c.newUsers),d:delta(c.newUsers,p.newUsers),a:dAbs(c.newUsers,p.newUsers)},
    {l:"Taxa de Conversão",v:pct(convRate),d:delta(convRate,prevConvRate),a:"Purchases ÷ Sessions",cf:"#8B5CF6"},
    {l:"Engajamento",v:pct1(c.engagementRate),d:delta(c.engagementRate,p.engagementRate),s:sp.map(x=>x.eng),cf:"#2ECB6F"},
    {l:"Bounce Rate",v:pct1(c.bounceRate),d:delta(c.bounceRate,p.bounceRate,true),s:sp.map(x=>x.bounce),cf:"#EF4444"},
    {l:"Duração Média",v:fmtDur(c.avgDuration),d:delta(c.avgDuration,p.avgDuration)},
    {l:"Receita Bruta",v:fmtMoney(c.revenue),d:delta(c.revenue,p.revenue),a:dAbs(c.revenue,p.revenue),cf:"#F59E0B"},
    {l:"Investimento (Ads)",v:fmtMoney(invest),d:{text:"input manual",cls:"neutral"}},
    {l:"CPA Bruto",v:fmtMoney(cpa),d:{text:"Invest ÷ Purchases",cls:"neutral"}},
    {l:"PDI Bruto",v:pct(pdi),d:{text:"Meta ≤ 9.5%",cls:pdi<=0.095?"pdi-good":"pdi-bad"}}
  ];
  const fLabels=["Page View","View Item","Add to Cart","Checkout","Personal Info","Shipping Info","Purchase"];
  const fKeys=Object.keys(data.current.funnel);const maxF=data.current.funnel.page_view||1;
  document.getElementById("scorecard-layout").innerHTML=`
    <div class="scorecard-left"><div class="kpi-grid">${cards.map((k,i)=>`<div class="kpi-card"><div class="kpi-label">${k.l}</div><div class="kpi-value">${k.v}</div><div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap"><span class="kpi-delta ${k.d.cls}">${k.d.text}</span>${k.a?`<span style="font-size:.58rem;color:var(--text-muted)">(${k.a})</span>`:""}</div>${k.s?`<canvas class="sparkline" id="sp-${i}" style="width:100%;height:28px;margin-top:6px"></canvas>`:""}</div>`).join("")}</div></div>
    <div class="scorecard-right"><h3 class="funnel-visual-title">Funil de Conversão</h3>
    ${fKeys.map((k,i)=>{const v=data.current.funnel[k],pv=data.previous.funnel[k]||1;
      const dropPct=i>0?((1-v/(data.current.funnel[fKeys[i-1]]||1))*100).toFixed(1).replace(".",",")+"%":"—";
      return`<div class="funnel-visual-step"><div class="funnel-visual-label">${fLabels[i]}</div><div class="funnel-visual-bar-wrap"><div class="funnel-visual-bar" style="width:${Math.max(2,(v/maxF)*100)}%"></div></div><div class="funnel-visual-val">${fmt(v)}</div>${tD(v,pv)}<span class="funnel-drop-pct">${i>0?"↓ "+dropPct:""}</span></div>`;}).join("")}</div>`;
  requestAnimationFrame(()=>{cards.forEach((k,i)=>{if(k.s)drawSpark(document.getElementById(`sp-${i}`),k.s,k.cf);});});
  const sessD=delta(c.sessions,p.sessions),revD=delta(c.revenue,p.revenue);
  document.getElementById("scorecard-summary").innerHTML=`<p><strong>📊 Resumo Executivo:</strong> ${fmtF(c.sessions)} sessões (${sessD.text} vs anterior) geraram <strong>${fmtMoney(c.revenue)}</strong> em receita bruta (${revD.text}). Foram <strong>${fmtF(c.purchases)} conversões</strong> com <strong>Conv Rate de ${pct(convRate)}</strong> (${tD(convRate,prevConvRate)}). A base trouxe ${fmtF(c.newUsers)} novos usuários (${pct1(c.newUsers/c.users)} do total). Engajamento em ${pct1(c.engagementRate)}, Bounce em ${pct1(c.bounceRate)}. O funil converte ${pct(funnelConvRate)} de Page Views em Purchases. Com investimento de ${fmtMoney(invest)}, o <strong>CPA = ${fmtMoney(cpa)}</strong> e o <strong>PDI = ${pct(pdi)}</strong> ${pdi<=0.095?"(saudável ≤9.5%)":"(⚠️ acima da meta de 9.5%!!)"}.</p>`;
  const topCh=[...data.current.channels].sort((a,b)=>b.revenue-a.revenue)[0];
  document.getElementById("scorecard-insight").innerHTML=`<p><strong>💡 Insights Acionáveis:</strong></p><p>• <strong>Receita:</strong> ${revD.cls==="up"?`Crescimento de receita — o canal ${topCh?.name||""} foi o maior contribuidor. Escalar budget nele enquanto o ROAS se mantém.`:`Receita em queda — investigar se é volume (menos compras) ou ticket (produtos mais baratos). Priorizar canais com maior CR para recuperar.`}</p><p>• <strong>Conv Rate:</strong> ${pct(convRate)} = a cada 1.000 sessões, ${(convRate*1000).toFixed(0)} convertem. ${convRate<0.008?`<em>Se</em> otimizarmos o fluxo de checkout para reduzir 1 step, <em>então</em> esperamos +15% de CR, <em>porque</em> cada campo extra no form reduz a conversão em ~3% (Baymard Institute).`:`O CR está competitivo para B2C de assinaturas de eletrônicos.`}</p><p>• <strong>CPA:</strong> ${fmtMoney(cpa)} por aquisição. ${cpa>300?`<em>Se</em> priorizarmos canais orgânicos e email (CR 3-5x maior), <em>então</em> esperamos reduzir o CPA em 30%, <em>porque</em> o awareness já está construído e leads mornos convertem com remarketing mais barato.`:`Custo de aquisição dentro de margens saudáveis.`}</p><p>• <strong>PDI:</strong> ${pdi<=0.095?"Investimento sustentável — a receita anual justifica o gasto.":"⚠️ O investimento não está se pagando rápido o suficiente. Reavaliar mix de canais ou aumentar CR para melhorar o payback."}</p>`;
}

// === 2. Channels ===
function renderChannels(data){
  const renderChTable=(tbodyId,tfootId,list,prevList,hasGroup)=>{
    const tS=data.current.kpis.sessions,tP=data.current.kpis.purchases,tR=list.reduce((s,c)=>s+c.revenue,0);
    let sumS=0,sumP=0,sumR=0,sumDur=0,sumEng=0;
    document.getElementById(tbodyId).innerHTML=list.map((c,i)=>{
      const prev=prevList.find(x=>x.name===c.name)||c;sumS+=c.sessions;sumP+=c.purchases;sumR+=c.revenue;sumDur+=c.avgDuration*c.sessions;sumEng+=c.engRate*c.sessions;
      const shS=c.sessions/(tS||1),shP=c.purchases/(tP||1),shR=c.revenue/(tR||1);
      return`<tr>${hasGroup?`<td>${i+1}</td><td><strong>${c.name}</strong></td><td>${c.group}</td>`:`<td><strong>${c.name}</strong></td>`}<td>${fmt(c.sessions)}<br>${tD(c.sessions,prev.sessions)}</td><td>${fmtF(c.purchases)}<br>${tD(c.purchases,prev.purchases)}</td><td>${pct(c.purchases/(c.pageviews||1))}<br>${tD(c.purchases/(c.pageviews||1),prev.purchases/(prev.pageviews||1))}</td><td>${pct1(shS)}</td><td>${pct1(shP)}</td><td>${fmtMoney(c.revenue)}<br>${tD(c.revenue,prev.revenue)}</td><td>${pct1(shR)}</td><td>${pct1(c.engRate)}<br>${tD(c.engRate,prev.engRate)}</td><td>${fmtDur(c.avgDuration)}</td></tr>`;
    }).join("");
    const cols=hasGroup?3:1;
    document.getElementById(tfootId).innerHTML=`<tr><td colspan="${cols}">TOTAL</td><td>${fmt(sumS)}</td><td>${fmtF(sumP)}</td><td>${pct(sumP/(sumS*1.5||1))}</td><td>100%</td><td>100%</td><td>${fmtMoney(sumR)}</td><td>100%</td><td>${pct1(sumEng/(sumS||1))}</td><td>${fmtDur(sumDur/(sumS||1))}</td></tr>`;
  };
  renderChTable("channel-groups-tbody","channel-groups-tfoot",data.current.channelGroups,data.previous.channelGroups,false);
  renderChTable("channels-tbody","channels-tfoot",data.current.channels,data.previous.channels,true);
  const topG=[...data.current.channelGroups].sort((a,b)=>b.revenue-a.revenue)[0];
  const paidShare=data.current.channelGroups.filter(g=>g.name.includes("Paid")).reduce((s,g)=>s+g.sessions,0)/(data.current.kpis.sessions||1);
  document.getElementById("channel-groups-insight").innerHTML=`<p><strong>📊 Resumo:</strong> <strong>${topG.name}</strong> lidera em receita com ${fmtMoney(topG.revenue)}. Canais Paid representam ${pct1(paidShare)} das sessões — ${paidShare>0.5?`alta dependência de mídia paga. <em>Se</em> investirmos em SEO e Content (blog + comparativos), <em>então</em> esperamos reduzir a dependência de paid em 15pp em 6 meses, <em>porque</em> o CR orgânico é consistentemente superior ao pago.`:`mix equilibrado entre paid e orgânico.`}</p>`;
  const topSM=[...data.current.channels].sort((a,b)=>b.revenue-a.revenue)[0];
  const ghostCh=data.current.channels.find(c=>c.name==="(not set)");
  document.getElementById("channels-insight").innerHTML=`<p><strong>📊 Resumo:</strong> <strong>${topSM.name}</strong> é o maior gerador de receita. ${ghostCh?`O tráfego "(not set)" representa ${fmt(ghostCh.sessions)} sessões com bounce de ${pct1(ghostCh.bounceRate)} — <em>Se</em> auditarmos UTMs via GTM, <em>então</em> teremos visibilidade de ~${fmt(ghostCh.sessions)} sessões "fantasma", <em>porque</em> esse volume provavelmente pertence a canais pagos mal tagueados.`:""}</p>`;
}

// === 3. Golden Path ===
function renderFunnel(data){
  const f=data.current.funnel,ticket=390;
  const pvToVi=f.view_item/(f.page_view||1),viToAtc=f.add_to_cart/(f.view_item||1),atcToChk=f.begin_checkout/(f.add_to_cart||1),siToPur=f.purchase/(f.add_shipping_info||1);
  const actions=[
    {step:`Page View → View Item (Drop ${pct1(1-pvToVi)})`,omtm:"View Item / Page View",meta:`Aumentar de ${pct1(pvToVi)} para ${pct1(pvToVi+0.07)}`,
     se:"implementarmos um carrossel de Top Sellers acima da dobra na home com preço e parcela visíveis",
     entao:`esperamos +7pp na taxa de visualização, gerando ~${fmt(Math.round(f.page_view*0.07))} view_items incrementais`,
     porque:`${pct1(1-pvToVi)} dos visitantes nunca visualizam um produto — a exposição imediata com preço reduz a barreira de descoberta no B2C`,
     mrr:`~${fmt(Math.round(f.page_view*0.07*viToAtc*atcToChk*siToPur))} purchases → <strong>${fmtMoney(Math.round(f.page_view*0.07*viToAtc*atcToChk*siToPur*ticket))}/mês</strong>`},
    {step:`Add to Cart → Checkout (Drop ${pct1(1-atcToChk)})`,omtm:"Begin Checkout / Add to Cart",meta:"Aumentar CR Cart→Checkout em 15%",
     se:`inserirmos um widget de 'Simulação de Assinatura Mensal' (R$${ticket} vs compra de R$4.500) no carrinho`,
     entao:"esperamos +15% na taxa de início de checkout",
     porque:"a principal objeção B2C é a comparação mental 'preço de aluguel vs preço de compra' — mostrar que a assinatura custa 8x menos remove essa barreira",
     mrr:`~${fmt(Math.round(f.add_to_cart*0.15*0.5))} checkouts → <strong>${fmtMoney(Math.round(f.add_to_cart*0.15*0.5*ticket))}/mês</strong>`},
    {step:`Shipping → Purchase (Drop ${pct1(1-siToPur)})`,omtm:"Purchase / Shipping Info",meta:"Reduzir drop de última etapa em 20%",
     se:"integrarmos pré-qualificação de crédito antes do form de Shipping Info",
     entao:"esperamos -20% no drop final, evitando frustração de leads reprovados no último passo",
     porque:"sem pré-check, leads B2C preenchem tudo para serem negados no final — gerando churn de experiência e reviews negativos",
     mrr:`~${fmt(Math.round(f.add_shipping_info*0.2*0.8))} conversões salvas → <strong>${fmtMoney(Math.round(f.add_shipping_info*0.2*0.8*ticket))}/mês</strong>`},
  ];
  document.getElementById("funnel-actions").innerHTML=actions.map(a=>`<div class="funnel-action-card"><div class="funnel-action-step">${a.step}</div><div class="hyp-label">OMTM</div><div class="funnel-action-item"><strong>${a.omtm}</strong> — Meta: ${a.meta}</div><div class="hyp-label" style="margin-top:10px">HIPÓTESE (Se → Então → Porque)</div><div class="funnel-action-item"><strong>Se</strong> ${a.se}, <strong>então</strong> ${a.entao}, <strong>porque</strong> ${a.porque}.</div><div class="funnel-action-item mrr"><strong>MRR Incremental (Tkt R$${ticket}):</strong> ${a.mrr}</div></div>`).join("");
}

// === 4. Money Leaks ===
function renderMoneyLeaks(data){
  const steps=["page_view","view_item","add_to_cart","begin_checkout","add_personal_info","add_shipping_info","purchase"];
  const labels=["Page View","View Item","Add to Cart","Checkout","Personal Info","Shipping Info","Purchase"];
  const f=data.current.funnel,pf=data.previous.funnel;let html='';
  for(let i=0;i<steps.length-1;i++){
    const from=f[steps[i]],to=f[steps[i+1]],pfrom=pf[steps[i]],pto=pf[steps[i+1]];
    const drop=from-to,dropPct=((drop/from)*100),contPct=100-dropPct;
    const pDrop=pfrom-pto,pDropPct=((pDrop/pfrom)*100);
    const severity=dropPct>60?"critical":dropPct>30?"high":"normal";
    html+=`<div class="friction-card friction-${severity}"><div class="friction-flow">${labels[i]} → ${labels[i+1]}</div><div class="friction-numbers"><span class="friction-from">${fmt(from)}</span><span style="color:var(--text-muted)">→</span><span class="friction-to">${fmt(to)}</span></div><div class="friction-bars"><div class="friction-bar-continue" style="width:${contPct}%"></div></div><div class="friction-stats"><span>Continua: <strong>${contPct.toFixed(1).replace(".",",")}%</strong></span><span>Drop: <strong>${fmt(drop)}</strong></span></div><div class="friction-variation">Δ Drop: ${tD(dropPct,pDropPct,true)} <span style="font-size:.55rem;color:var(--text-muted)">(${dAbs(drop,pDrop)})</span></div></div>`;
  }
  document.getElementById("leaks-grid").innerHTML=html;
  const worstDrop=steps.reduce((w,s,i)=>{if(i===0)return w;const dp=(f[steps[i-1]]-f[s])/(f[steps[i-1]]||1);return dp>w.v?{v:dp,l:`${labels[i-1]} → ${labels[i]}`}:w;},{v:0,l:""});
  document.getElementById("leaks-insight").innerHTML=`<p><strong>💡 Análise:</strong> A maior fricção está em <strong>${worstDrop.l}</strong> com ${pct1(worstDrop.v)} de drop. Cada lead perdido nessa etapa custa ~R$390 em MRR. <em>Se</em> reduzirmos esse drop em 10%, <em>então</em> resgatamos ~${fmt(Math.round(data.current.funnel.page_view*worstDrop.v*0.1*0.02))} conversões, <em>porque</em> a fricção nessa etapa é a maior barreira entre intenção e ação.</p>`;
}

// === 5. Devices ===
function renderDevices(data){
  const devs=data.current.devices,icons={Mobile:"📱",Desktop:"💻",Tablet:"📟"};
  const tS=devs.reduce((s,x)=>s+x.sessions,0),tP=devs.reduce((s,x)=>s+x.purchases,0);
  document.getElementById("device-grid").innerHTML=devs.map(dev=>{
    const prev=data.previous.devices.find(x=>x.name===dev.name)||dev;
    const cr=dev.purchases/dev.sessions,crP=prev.purchases/prev.sessions;
    const acts=dev.name==="Mobile"?[
      {t:"Checkout Express (Apple/Google Pay)",h:`<em>Se</em> ativarmos wallets digitais, <em>então</em> esperamos +8% de aprovação, <em>porque</em> elimina a fricção de digitação em tela pequena que causa ~30% dos abandonos B2C mobile.`},
      {t:"Auto-fill CEP via GPS",h:`<em>Se</em> usarmos a Location API, <em>então</em> esperamos +15% de conclusão do shipping form, <em>porque</em> preencher endereço manualmente no celular é a etapa mais lenta do form.`},
      {t:"Otimização de LCP (WebP + CDN)",h:`<em>Se</em> migrarmos imagens para WebP servidas via CDN, <em>então</em> esperamos -1.5s de LCP e -4% de bounce, <em>porque</em> 53% dos usuários mobile abandonam sites >3s (Google).`}
    ]:[
      {t:"Exit Intent + Oferta Personalizada",h:`<em>Se</em> implementarmos popup de exit intent com última categoria, <em>então</em> esperamos recuperar 3% dos abandonadores, <em>porque</em> o investimento de tempo (${fmtDur(dev.avgDuration)}) indica alta intenção.`},
      {t:"Live Chat Sales (WhatsApp)",h:`<em>Se</em> adicionarmos chat de vendas, <em>então</em> esperamos +2% de CR em sessões com interação, <em>porque</em> resolução instantânea de objeções (frete, contrato) é driver de conversão B2C.`},
      {t:"Remarketing Email pós-navegação",h:`<em>Se</em> dispararmos email com produtos navegados em 2h, <em>então</em> esperamos recuperar 5% dos visitantes, <em>porque</em> a intenção de ${dev.name} esfria mais lento que mobile.`}
    ];
    return`<div class="device-card"><div class="device-icon">${icons[dev.name]||"📟"}</div><div class="device-name">${dev.name}</div><div class="device-sessions">${fmt(dev.sessions)}</div><div class="device-share">${pct1(dev.sessions/tS)} Sessões | ${pct1(dev.purchases/(tP||1))} Compras</div><div class="device-stats"><div><div class="device-stat-label">Conv Rate</div><div class="device-stat-value">${pct(cr)} ${tD(cr,crP)}</div></div><div><div class="device-stat-label">Compras</div><div class="device-stat-value">${fmtF(dev.purchases)} ${tD(dev.purchases,prev.purchases)}</div></div><div><div class="device-stat-label">Engag Rate</div><div class="device-stat-value">${pct1(dev.engRate)}</div></div><div><div class="device-stat-label">Duração</div><div class="device-stat-value">${fmtDur(dev.avgDuration)}</div></div></div><div class="device-actions"><h4>Planos (${dev.name})</h4>${acts.map(a=>`<div class="device-action-item"><strong>${a.t}</strong><br>${a.h}</div>`).join("")}</div></div>`;
  }).join("");
  const mobCR=devs[0].purchases/devs[0].sessions,dskDev=devs.find(d=>d.name==="Desktop"),dskCR=dskDev?(dskDev.purchases/dskDev.sessions):0;
  document.getElementById("devices-insight").innerHTML=`<p><strong>📊 Resumo:</strong> Mobile domina ${pct1(devs[0].sessions/tS)} das sessões B2C. Desktop tem CR ${(dskCR/mobCR).toFixed(1)}x maior, mas apenas ${pct1((dskDev?.sessions||0)/tS)} de share. A cada +0.1pp de melhoria no CR mobile, são ~${fmt(Math.round(devs[0].sessions*0.001))} compras incrementais.</p>`;
}
