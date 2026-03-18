// =============================================
// Allu — V6.2 — App Logic (GA4 Real Data)
// =============================================

document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  const ago = new Date(); ago.setDate(now.getDate() - 30);
  document.getElementById("filter-date-start").value = ago.toISOString().slice(0,10);
  document.getElementById("filter-date-end").value   = now.toISOString().slice(0,10);

  // Load filter dropdowns from GA4
  loadFilterOptions();

  // Buttons
  document.getElementById("btn-apply-filters").addEventListener("click", applyFilters);
  document.getElementById("btn-update-invest").addEventListener("click", () => {
    if (window._lastData) renderAll(window._lastData);
  });

  // Theme
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.documentElement.setAttribute("data-theme", btn.dataset.theme);
      document.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  applyFilters();
});

// ─── Load filter dropdowns from /api/filters ──────────────────
async function loadFilterOptions() {
  const start = document.getElementById("filter-date-start").value;
  const end   = document.getElementById("filter-date-end").value;
  try {
    const r = await fetch(`${window.GA4_API_BASE}/api/filters?start=${start}&end=${end}`);
    if (!r.ok) return;
    const data = await r.json();

    // Canal (channel group)
    const canalSel = document.getElementById("filter-channel");
    if (canalSel) {
      canalSel.innerHTML = '<option value="">Todos os Grupos</option>';
      (data.channelGroups || []).forEach(g => {
        const o = document.createElement("option"); o.value = g; o.textContent = g; canalSel.appendChild(o);
      });
    }

    // Source / Medium
    const srcSel = document.getElementById("filter-source");
    if (srcSel) {
      srcSel.innerHTML = '<option value="">Todos os Canais</option>';
      (data.sourceMediums || []).forEach(c => {
        const o = document.createElement("option"); o.value = c.name; o.textContent = c.name; srcSel.appendChild(o);
      });
    }

    // Campanha
    const campSel = document.getElementById("filter-campaign");
    if (campSel) {
      campSel.innerHTML = '<option value="">Todas as Campanhas</option>';
      (data.campaigns || []).forEach(c => {
        const o = document.createElement("option"); o.value = c; o.textContent = c; campSel.appendChild(o);
      });
    }

    // Brand / Category
    const catSel = document.getElementById("filter-category");
    if (catSel) {
      catSel.innerHTML = '<option value="">Todas</option>';
      (data.categories || []).forEach(c => {
        const o = document.createElement("option"); o.value = c; o.textContent = c; catSel.appendChild(o);
      });
    }

    // Produto
    const prodSel = document.getElementById("filter-product");
    if (prodSel) {
      prodSel.innerHTML = '<option value="">Todos os Produtos</option>';
      (data.products || []).forEach(p => {
        const o = document.createElement("option"); o.value = p.name; o.textContent = p.name; prodSel.appendChild(o);
      });
    }
  } catch (e) {
    console.warn("Filter load failed:", e.message);
  }
}

// ─── Apply Filters → fetch GA4 data ──────────────────────────
async function applyFilters() {
  const start    = document.getElementById("filter-date-start").value;
  const end      = document.getElementById("filter-date-end").value;
  const compare  = document.getElementById("filter-compare").value;
  const channel  = document.getElementById("filter-channel")?.value  || "";
  const source   = document.getElementById("filter-source")?.value   || "";
  const campaign = document.getElementById("filter-campaign")?.value || "";
  const category = document.getElementById("filter-category")?.value || "";
  const product  = document.getElementById("filter-product")?.value  || "";

  if (!start || !end) return;

  setLoading(true);

  const params = new URLSearchParams({ start, end, compare_mode: compare });
  if (channel)  params.set("channel",  channel);
  if (source)   params.set("source",   source);
  if (campaign) params.set("campaign", campaign);
  if (category) params.set("category", category);
  if (product)  params.set("product",  product);

  try {
    const r = await fetch(`${window.GA4_API_BASE}/api/data?${params}`);
    if (!r.ok) {
      const err = await r.json();
      throw new Error(err.error || `HTTP ${r.status}`);
    }
    const data = await r.json();
    window._lastData = data;
    document.getElementById("period-badge").textContent =
      `Base GA4 Engine | Período: ${data.currentText} | Comparação: ${data.previousText}`;
    renderAll(data);
  } catch (e) {
    document.getElementById("period-badge").textContent = `⚠️ Erro ao carregar dados: ${e.message}`;
    console.error("API Error:", e);
  } finally {
    setLoading(false);
  }
}

function setLoading(on) {
  const btn = document.getElementById("btn-apply-filters");
  const main = document.querySelector(".main");
  if (on) {
    btn.textContent = "Carregando..."; btn.disabled = true;
    if (main) main.style.opacity = "0.5";
  } else {
    btn.textContent = "Aplicar Filtros"; btn.disabled = false;
    if (main) main.style.opacity = "1";
  }
}

// === HELPERS ===
const fmt = n => { if(n>=1e6) return (n/1e6).toFixed(1).replace(".",",")+"M"; if(n>=1e3) return (n/1e3).toFixed(1).replace(".",",")+"K"; return n.toLocaleString("pt-BR",{maximumFractionDigits:0}); };
const fmtF = n => n.toLocaleString("pt-BR",{maximumFractionDigits:0});
const pct  = v => (v*100).toFixed(2).replace(".",",")+"%";
const pct1 = v => (v*100).toFixed(1).replace(".",",")+"%";
const fmtMoney = n => "R$ "+n.toLocaleString("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:0});
const fmtDur   = s => { if(!s||isNaN(s)) return "0s"; const m=Math.floor(s/60); const sc=Math.round(s%60); return `${m}m${sc.toString().padStart(2,"0")}s`; };

function delta(c, p, inv=false) {
  if(!p||p===0) return {text:"—",cls:"neutral"};
  const d=((c-p)/p)*100; const s=d>=0?"+":"";
  let cls=d>1?"up":d<-1?"down":"neutral";
  if(inv) cls=d>1?"down":d<-1?"up":"neutral";
  return {text:s+d.toFixed(1).replace(".",",")+"%",cls};
}
const tD  = (c,p,inv) => { const d=delta(c,p,inv); return `<span class="kpi-delta ${d.cls}">${d.text}</span>`; };
const dAbs = (c,p) => { const d=c-p; return (d>=0?"+":"")+fmtF(d); };

function drawSpark(cv, vals, color="#00c566") {
  if(!cv) return;
  const ctx=cv.getContext("2d"); const w=cv.width=cv.offsetWidth*2; const h=cv.height=cv.offsetHeight*2;
  ctx.clearRect(0,0,w,h); if(!vals||vals.length<2) return;
  const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1,step=w/(vals.length-1);
  const gr=ctx.createLinearGradient(0,0,0,h); gr.addColorStop(0,color+"40"); gr.addColorStop(1,color+"00");
  ctx.beginPath(); ctx.moveTo(0,h);
  vals.forEach((v,i)=>{ ctx.lineTo(i*step, h-((v-mn)/rng)*(h*.85)-h*.05); });
  ctx.lineTo(w,h); ctx.closePath(); ctx.fillStyle=gr; ctx.fill();
  ctx.beginPath();
  vals.forEach((v,i)=>{ const x=i*step,y=h-((v-mn)/rng)*(h*.85)-h*.05; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
  ctx.strokeStyle=color; ctx.lineWidth=2; ctx.stroke();
}

function renderAll(data) {
  renderKPIs(data); renderChannels(data); renderFunnel(data);
  renderMoneyLeaks(data); renderDevices(data); renderAudience(data);
  renderSegments(data); renderProducts(data);
}

// =====================================
// 1. KPIs
// =====================================
function renderKPIs(data) {
  const c=data.current.kpis, p=data.previous.kpis, sp=data.current.sparklines;
  const invest = parseFloat(document.getElementById("input-investment").value) || 0;
  const approvalRate = (parseFloat(document.getElementById("input-approval-rate")?.value) || 30) / 100;
  const days = data.days || 30;

  // Bruto
  const cpaBruto = invest / (c.purchases||1);
  const pdiBruto = invest / ((c.revenue*12)||1);
  // Líquido (aplica taxa de aprovação)
  const pedidosLiquidos = Math.round(c.purchases * approvalRate);
  const receitaLiquida  = c.revenue * approvalRate;
  const cpaLiquido      = invest / (pedidosLiquidos||1);
  const pdiLiquido      = invest / ((receitaLiquida*12)||1);
  // MRR Projetado (receita líquida diária × 30)
  const mrrProjetado    = (receitaLiquida / (days||1)) * 30;
  const metaMRR         = 27000000;
  const pctMeta         = mrrProjetado / metaMRR;

  const convRate     = c.purchases / (data.current.funnel.page_view||1);
  const prevConvRate = p.purchases / (data.previous.funnel.page_view||1);

  const cards = [
    {l:"Sessões",              v:fmtF(c.sessions),        d:delta(c.sessions,p.sessions),            a:dAbs(c.sessions,p.sessions),  s:sp.map(x=>x.s), cf:"#2ECB6F"},
    {l:"Usuários Ativos",      v:fmtF(c.users),            d:delta(c.users,p.users),                  a:dAbs(c.users,p.users),        s:sp.map(x=>x.u), cf:"#3B82F6"},
    {l:"Novos Usuários",       v:fmtF(c.newUsers),         d:delta(c.newUsers,p.newUsers),             a:dAbs(c.newUsers,p.newUsers)},
    {l:"Engajamento",          v:pct1(c.engagementRate),   d:delta(c.engagementRate,p.engagementRate), s:sp.map(x=>x.eng),  cf:"#2ECB6F"},
    {l:"Bounce Rate",          v:pct1(c.bounceRate),       d:delta(c.bounceRate,p.bounceRate,true),    s:sp.map(x=>x.bounce),cf:"#EF4444"},
    {l:"Duração Média",        v:fmtDur(c.avgDuration),    d:delta(c.avgDuration,p.avgDuration)},
    {l:"Receita Bruta",        v:fmtMoney(c.revenue),      d:delta(c.revenue,p.revenue),               a:dAbs(c.revenue,p.revenue), cf:"#F59E0B"},
    {l:"Investimento (Ads)",   v:fmtMoney(invest),         d:{text:"input manual",cls:"neutral"}},
    {l:"Pedidos Brutos (GA4)", v:fmtF(c.purchases),        d:delta(c.purchases,p.purchases),           a:dAbs(c.purchases,p.purchases)},
    {l:`Pedidos Líquidos (~${Math.round(approvalRate*100)}% aprov.)`, v:fmtF(pedidosLiquidos), d:{text:`${c.purchases} × ${Math.round(approvalRate*100)}%`,cls:"neutral"}, highlight:"liquid"},
    {l:"CPA Bruto",            v:fmtMoney(cpaBruto),       d:{text:"Invest ÷ Pedidos Brutos",cls:"neutral"}},
    {l:"CPA Líquido",          v:fmtMoney(cpaLiquido),     d:{text:"Invest ÷ Pedidos Líquidos",cls:"neutral"}, highlight:"liquid"},
    {l:"PDI Bruto",            v:pct(pdiBruto),            d:{text:"Meta ≤ 9.5%",cls:pdiBruto<=0.095?"pdi-good":"pdi-bad"}},
    {l:"PDI Líquido",          v:pct(pdiLiquido),          d:{text:"Meta ≤ 9.5%",cls:pdiLiquido<=0.095?"pdi-good":"pdi-bad"}, highlight:pdiLiquido>0.095?"danger":"liquid"},
    {l:"MRR Projetado (30d)",  v:fmtMoney(mrrProjetado),   d:{text:`${pct1(pctMeta)} da meta R$27M`,cls:pctMeta>=1?"pdi-good":pctMeta>=0.7?"neutral":"pdi-bad"}, highlight:"liquid"}
  ];

  // Ordem real da jornada Allu (Brain Growth Partner)
  const fSteps = [
    {key:'page_view',         label:'Page View'},
    {key:'view_item',         label:'View Item'},
    {key:'begin_checkout',    label:'Checkout'},
    {key:'add_to_cart',       label:'Add Cart'},
    {key:'add_personal_info', label:'Personal Info'},
    {key:'add_shipping_info', label:'Shipping Info'},
    {key:'add_payment_info',  label:'Payment Info'},
    {key:'purchase',          label:'Purchase (Bruto)'}
  ];
  const cf=data.current.funnel, pf=data.previous.funnel;
  const maxF=cf.page_view||1;

  const funnelHtml=fSteps.map((s,i)=>{
    const v=cf[s.key]||0, pv=pf[s.key]||1;
    const barPct=v/maxF*100;
    const volD=delta(v,pv);

    // step-to-step conversion rate (current period)
    const prevStepV = i>0 ? (cf[fSteps[i-1].key]||1) : v;
    const prevStepPrev = i>0 ? (pf[fSteps[i-1].key]||1) : pv;
    const stepRate = i>0 ? v/prevStepV : 1;
    const stepRatePrev = i>0 ? pv/prevStepPrev : 1;
    const ppDelta = i>0 ? (stepRate - stepRatePrev)*100 : null;
    const ppText = ppDelta!==null ? (ppDelta>=0?'+':'')+ppDelta.toFixed(1)+'pp' : '—';
    const ppColor = ppDelta===null?'var(--text-muted)':ppDelta>=0?'var(--success)':'var(--danger)';
    const rateColor = i===0?'var(--text-muted)':stepRate>=0.7?'var(--success)':stepRate>=0.4?'var(--warning)':'var(--danger)';

    return`<div class="fn-step">
      <span class="fn-lbl">${s.label}</span>
      <div class="fn-track"><div class="fn-fill" style="width:${Math.max(1,barPct).toFixed(1)}%"></div></div>
      <span class="fn-vol">${fmt(v)}</span>
      <span class="fn-vol-d"><span class="kpi-delta ${volD.cls}">${volD.text}</span></span>
      <span class="fn-rate" style="color:${rateColor}">${i>0?(stepRate*100).toFixed(0)+'%':'100%'}</span>
      <span class="fn-pp" style="color:${ppColor}">${ppText}</span>
    </div>`;
  }).join('');

  const convGeral=cf.purchase/(maxF||1), prevConvGeral=pf.purchase/(pf.page_view||1);

  // PDI gauge html
  const pdiGaugePct = Math.min(pdiLiquido / 0.095 * 100, 100);
  const pdiGaugeColor = pdiLiquido <= 0.095 ? 'var(--success)' : 'var(--danger)';
  const pdiGaugeHtml = `<div class="pdi-gauge-wrap">
    <div class="pdi-gauge-label">PDI Líquido vs Meta 9,5%</div>
    <div class="pdi-gauge-track"><div class="pdi-gauge-fill" style="width:${pdiGaugePct.toFixed(1)}%;background:${pdiGaugeColor}"></div><div class="pdi-gauge-mark"></div></div>
    <div class="pdi-gauge-vals"><span>${pct(pdiLiquido)}</span><span style="color:var(--text-muted)">meta: 9,5%</span></div>
  </div>`;

  document.getElementById("scorecard-layout").innerHTML = `
    <div class="scorecard-left">
      <div class="kpi-grid">${cards.map((k,i)=>`<div class="kpi-card${k.highlight?` kpi-${k.highlight}`:''}">
        <div class="kpi-label">${k.l}</div><div class="kpi-value">${k.v}</div>
        <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap"><span class="kpi-delta ${k.d.cls}">${k.d.text}</span>${k.a?`<span style="font-size:.58rem;color:var(--text-muted)">(${k.a})</span>`:""}</div>
        ${k.s?`<canvas class="sparkline" id="sp-${i}" style="width:100%;height:28px;margin-top:6px"></canvas>`:""}
      </div>`).join("")}</div>
      ${pdiGaugeHtml}
    </div>
    <div class="scorecard-right">
      <div class="fn-header">
        <span class="fn-title">Funil de Conversão GA4</span>
        <span class="fn-legend">
          <span>Vol. Δ = vs período ant.</span>
          <span>% = retenção etapa</span>
          <span>pp = Δ da quebra</span>
        </span>
      </div>
      <div style="display:grid;grid-template-columns:72px 1fr 58px 48px 44px 48px;gap:5px;padding:4px 0 6px;border-bottom:2px solid var(--border);margin-bottom:2px;">
        <span style="font-size:.5rem;font-weight:800;text-transform:uppercase;color:var(--text-muted)">Etapa</span>
        <span style="font-size:.5rem;font-weight:800;text-transform:uppercase;color:var(--text-muted)">Volume</span>
        <span style="font-size:.5rem;font-weight:800;text-transform:uppercase;color:var(--text-muted);text-align:right">Total</span>
        <span style="font-size:.5rem;font-weight:800;text-transform:uppercase;color:var(--text-muted);text-align:right">Vol Δ</span>
        <span style="font-size:.5rem;font-weight:800;text-transform:uppercase;color:var(--text-muted);text-align:right">Ret%</span>
        <span style="font-size:.5rem;font-weight:800;text-transform:uppercase;color:var(--text-muted);text-align:right">pp Δ</span>
      </div>
      <div class="fn-steps">${funnelHtml}</div>
      <div class="fn-footer">
        <span>Conv. global PV→Purchase: <strong>${pct(convGeral)}</strong></span>
        ${tD(convGeral,prevConvGeral)}
      </div>
    </div>`;

  requestAnimationFrame(()=>{ cards.forEach((k,i)=>{ if(k.s) drawSpark(document.getElementById(`sp-${i}`),k.s,k.cf); }); });

  const sessD=delta(c.sessions,p.sessions); const revD=delta(c.revenue,p.revenue);
  const engD=delta(c.engagementRate,p.engagementRate); const bounceD=delta(c.bounceRate,p.bounceRate,true);

  document.getElementById("scorecard-summary").innerHTML=`<p><strong>📊 Resumo Executivo:</strong> No período analisado, o site registrou <strong>${fmtF(c.sessions)} sessões</strong> (${sessD.text} vs anterior), gerando <strong>${fmtMoney(c.revenue)}</strong> em receita bruta (${revD.text}). Foram <strong>${fmtF(c.purchases)} compras</strong> concluídas, com taxa de conversão de <strong>${pct(convRate)}</strong> (${tD(convRate,prevConvRate)}). Base de <strong>${fmtF(c.newUsers)} novos usuários</strong> = ${pct1(c.newUsers/(c.users||1))} do total. Engajamento em <strong>${pct1(c.engagementRate)}</strong> (${engD.text}), bounce rate em <strong>${pct1(c.bounceRate)}</strong> (${bounceD.text}). Investimento de ${fmtMoney(invest)} → <strong>CPA = ${fmtMoney(cpa)}</strong>, <strong>PDI = ${pct(pdi)}</strong> ${pdi<=0.095?'(dentro da meta ≤ 9.5%)':'(⚠️ acima da meta de 9.5%)'}.</p>`;

  document.getElementById("scorecard-insight").innerHTML=`<p><strong>💡 Insights Acionáveis:</strong></p>
  <p>• <strong>Receita:</strong> ${revD.cls==="up"?"A receita subiu — investigar quais SKUs e canais puxaram essa alta.":"A receita caiu — validar se é queda de volume (menos compras) ou ticket (produtos mais baratos)."}</p>
  <p>• <strong>Conversão:</strong> A taxa de ${pct(convRate)} indica que a cada 1.000 pageviews, ${(convRate*1000).toFixed(1)} convertem. ${convRate<0.005?"Está abaixo de benchmarks B2C (0.5-1.0%). Priorizar CRO no funil.":"O funil está dentro de benchmarks aceitáveis."}</p>
  <p>• <strong>CPA:</strong> Com CPA de ${fmtMoney(cpa)}, ${cpa>300?"o custo está elevado. Revisar canais de menor CAC ou melhorar o CR.":"o investimento está rendendo aquisições a custo razoável."}</p>
  <p>• <strong>PDI:</strong> ${pdi<=0.095?"O Payback de Investimento está saudável.":"⚠️ PDI acima de 9.5% — revisar mix de canais ou otimizar CR."}</p>`;
}

// =====================================
// 2. Channels
// =====================================
function renderChannels(data) {
  const renderChTable = (tbodyId, tfootId, list, prevList, hasGroup) => {
    const tS=data.current.kpis.sessions, tP=data.current.kpis.purchases;
    const tR=list.reduce((s,c)=>s+c.revenue,0);
    let sumS=0,sumP=0,sumR=0,sumDur=0,sumEng=0;
    const html = list.map((c,i) => {
      const prev = prevList.find(x=>x.name===c.name) || c;
      sumS+=c.sessions; sumP+=c.purchases; sumR+=c.revenue; sumDur+=c.avgDuration*c.sessions; sumEng+=c.engRate*c.sessions;
      const shS=c.sessions/(tS||1), shP=c.purchases/(tP||1), shR=c.revenue/(tR||1);
      return `<tr>${hasGroup?`<td>${i+1}</td><td><strong>${c.name}</strong></td><td>${c.group}</td>`:`<td><strong>${c.name}</strong></td>`}
        <td>${fmt(c.sessions)}<br>${tD(c.sessions,prev.sessions)}</td>
        <td>${fmtF(c.purchases)}<br>${tD(c.purchases,prev.purchases)}</td>
        <td>${pct(c.purchases/(c.pageviews||1))}<br>${tD(c.purchases/(c.pageviews||1),prev.purchases/(prev.pageviews||1))}</td>
        <td>${pct1(shS)}</td><td>${pct1(shP)}</td>
        <td>${fmtMoney(c.revenue)}<br>${tD(c.revenue,prev.revenue)}</td><td>${pct1(shR)}</td>
        <td>${pct1(c.engRate)}<br>${tD(c.engRate,prev.engRate)}</td><td>${fmtDur(c.avgDuration)}</td></tr>`;
    }).join("");
    document.getElementById(tbodyId).innerHTML = html;
    const cols = hasGroup ? 3 : 1;
    document.getElementById(tfootId).innerHTML = `<tr><td colspan="${cols}">TOTAL</td><td>${fmt(sumS)}</td><td>${fmtF(sumP)}</td><td>${pct(sumP/(sumS*1.5||1))}</td><td>100%</td><td>100%</td><td>${fmtMoney(sumR)}</td><td>100%</td><td>${pct1(sumEng/(sumS||1))}</td><td>${fmtDur(sumDur/(sumS||1))}</td></tr>`;
  };

  renderChTable("channel-groups-tbody","channel-groups-tfoot",data.current.channelGroups,data.previous.channelGroups,false);
  renderChTable("channels-tbody","channels-tfoot",data.current.channels,data.previous.channels,true);

  const topG   = [...data.current.channelGroups].sort((a,b)=>b.revenue-a.revenue)[0];
  const lowCR  = [...data.current.channelGroups].sort((a,b)=>(a.purchases/(a.pageviews||1))-(b.purchases/(b.pageviews||1)))[0];
  if (topG) document.getElementById("channel-groups-insight").innerHTML=`<p><strong>📊 Resumo (Agrupamentos):</strong> O grupo <strong>${topG.name}</strong> lidera em receita com ${fmtMoney(topG.revenue)}, enquanto <strong>${lowCR?.name||"—"}</strong> tem a menor taxa de conversão. A concentração em Paid Social indica dependência de mídia paga — diversificar canais orgânicos reduziria o CAC médio.</p>
  <p><strong>💡 Insight:</strong> <em>Se</em> redirecionarmos 10% do budget de Paid Social para SEO e Content, <em>então</em> esperamos +15% em sessões orgânicas em 90 dias, <em>porque</em> o CR orgânico tende a ser superior ao pago.</p>`;

  const topSM = [...data.current.channels].sort((a,b)=>b.revenue-a.revenue)[0];
  if (topSM) document.getElementById("channels-insight").innerHTML=`<p><strong>📊 Resumo (Source/Medium):</strong> <strong>${topSM.name}</strong> é o canal de maior receita absoluta (${fmtMoney(topSM.revenue)}). Canais com durações altas indicam tráfego qualificado com alta intenção de compra.</p>
  <p><strong>💡 Insight:</strong> <em>Se</em> auditarmos as UTMs do tráfego "(not set)", <em>então</em> teremos visibilidade real do volume que está atualmente não atribuído, <em>porque</em> esse volume provavelmente pertence a canais pagos mal tagueados.</p>`;
}

// =====================================
// 3. Golden Path Actions
// =====================================
function renderFunnel(data) {
  const ticket = 390;
  const actions = [
    {step:"Page View → View Item (Drop de ~62%)",
     omtm:"Taxa de Visualização de Produto (View Item / Page View)",
     meta:"Aumentar de 38% para 45% (+7pp)",
     se:"implementarmos um carrossel de Top Sellers personalizados above-the-fold na home e páginas de categoria",
     entao:`esperamos um aumento de 7pp na taxa de visualização de produto, gerando ~${fmt(Math.round(data.current.funnel.page_view*(0.45-0.38)))} view_items incrementais`,
     porque:"62% dos visitantes nunca passam da primeira rolagem — exposição visual imediata de produtos reduz a barreira de descoberta",
     mrr:`${fmt(Math.round(data.current.funnel.page_view*0.07*0.03))} checkouts projetados → <strong>${fmtMoney(Math.round(data.current.funnel.page_view*0.07*0.03*ticket))}/mês MRR incremental</strong>`},
    {step:"Add to Cart → Begin Checkout (Alta Fricção)",
     omtm:"Taxa de Início de Checkout (Begin Checkout / Add to Cart)",
     meta:"Aumentar CR de Cart→Checkout em 15%",
     se:"inserirmos um widget de 'Simulação de Parcela Mensal' no carrinho",
     entao:"esperamos um aumento de 15% na taxa de início de checkout",
     porque:"a principal objeção é a comparação mental preço de aluguel vs compra — mostrar que a assinatura custa 8x menos remove essa barreira cognitiva",
     mrr:`${fmt(Math.round(data.current.funnel.add_to_cart*0.15*0.5))} checkouts → <strong>${fmtMoney(Math.round(data.current.funnel.add_to_cart*0.15*0.5*ticket))}/mês MRR incremental</strong>`},
    {step:"Shipping Info → Purchase (Última milha)",
     omtm:"Taxa de Conclusão Final (Purchase / Shipping Info)",
     meta:"Reduzir drop de última etapa em 20%",
     se:"integrarmos soft-check de crédito (API Serasa) antes da etapa de Shipping",
     entao:"esperamos uma redução de 20% no drop da última etapa",
     porque:"sem pré-qualificação, leads preenchem todas as etapas apenas para serem negados no final — isso gera churn de experiência e NPS negativo",
     mrr:`${fmt(Math.round(data.current.funnel.add_shipping_info*0.2*0.8))} conversões salvas → <strong>${fmtMoney(Math.round(data.current.funnel.add_shipping_info*0.2*0.8*ticket))}/mês MRR protegido</strong>`},
  ];

  document.getElementById("funnel-actions").innerHTML = actions.map(a=>`
    <div class="funnel-action-card">
      <div class="funnel-action-step">${a.step}</div>
      <div class="hyp-label">OMTM (Métrica-Chave)</div>
      <div class="funnel-action-item"><strong>${a.omtm}</strong> — Meta: ${a.meta}</div>
      <div class="hyp-label" style="margin-top:10px">HIPÓTESE (Se → Então → Porque)</div>
      <div class="funnel-action-item"><strong>Se</strong> ${a.se}, <strong>então</strong> ${a.entao}, <strong>porque</strong> ${a.porque}.</div>
      <div class="funnel-action-item mrr" style="margin-top:8px"><strong>MRR Incremental (Tkt R$390):</strong> ${a.mrr}</div>
    </div>`).join("");
}

// =====================================
// 4. Money Leaks
// =====================================
function renderMoneyLeaks(data) {
  const steps  = ["page_view","view_item","add_to_cart","begin_checkout","add_personal_info","add_shipping_info","purchase"];
  const labels = ["Page View","View Item","Add to Cart","Checkout","Personal Info","Shipping Info","Purchase"];
  const f=data.current.funnel; const pf=data.previous.funnel;
  let html='';
  for(let i=0;i<steps.length-1;i++){
    const from=f[steps[i]],to=f[steps[i+1]]; const pfrom=pf[steps[i]],pto=pf[steps[i+1]];
    const drop=from-to, dropPct=((drop/from)*100), contPct=100-dropPct;
    const pDrop=pfrom-pto, pDropPct=((pDrop/pfrom)*100);
    const severity=dropPct>60?"critical":dropPct>30?"high":"normal";
    html+=`<div class="friction-card friction-${severity}">
      <div class="friction-flow">${labels[i]} → ${labels[i+1]}</div>
      <div class="friction-numbers"><span class="friction-from">${fmt(from)}</span><span style="color:var(--text-muted)">→</span><span class="friction-to">${fmt(to)}</span></div>
      <div class="friction-bars"><div class="friction-bar-continue" style="width:${contPct}%"></div></div>
      <div class="friction-stats"><span>Continua: <strong>${contPct.toFixed(1).replace(".",",")}%</strong></span><span>Drop: <strong>${fmt(drop)}</strong></span></div>
      <div class="friction-variation">Δ Drop: ${tD(dropPct,pDropPct,true)} <span style="font-size:.55rem;color:var(--text-muted)">(${dAbs(drop,pDrop)} leads)</span></div>
    </div>`;
  }
  document.getElementById("leaks-grid").innerHTML = html;
  document.getElementById("leaks-insight").innerHTML = `<p><strong>💡 Análise de Fricção:</strong> As etapas com mais de 60% de drop (vermelho) representam vazamentos críticos de receita. Cada lead perdido custa ~R$390 em MRR potencial. Priorize otimizações nas etapas vermelhas — maior ROI por esforço de CRO.</p>`;
}

// =====================================
// 5. Devices
// =====================================
function renderDevices(data) {
  const devs  = data.current.devices;
  const icons = { Mobile:"📱", Desktop:"💻", Tablet:"📟" };
  const tS=devs.reduce((s,x)=>s+x.sessions,0);
  const tP=devs.reduce((s,x)=>s+x.purchases,0);

  document.getElementById("device-grid").innerHTML = devs.map(dev => {
    const prev = data.previous.devices.find(x=>x.name===dev.name) || dev;
    const cr=dev.purchases/dev.sessions; const crP=prev.purchases/prev.sessions;
    const acts = dev.name==="Mobile" ? [
      {t:"Checkout Express (Apple/Google Pay)", h:"<em>Se</em> ativarmos Apple Pay e Google Pay no checkout mobile, <em>então</em> esperamos +8% de aprovação de pagamento, <em>porque</em> wallets digitais eliminam a fricção de digitar dados de cartão em telas pequenas."},
      {t:"Auto-fill CEP via GPS", h:"<em>Se</em> usarmos a Location API para pré-preencher o CEP, <em>então</em> esperamos +15% de conclusão do formulário de shipping, <em>porque</em> o preenchimento manual em mobile é a etapa mais lenta e com maior taxa de erro."},
      {t:"LCP Optimization (WebP + CDN Edge)", h:"<em>Se</em> migrarmos imagens para WebP via CDN, <em>então</em> esperamos -1.5s de LCP e -4% de bounce, <em>porque</em> 53% dos usuários mobile abandonam sites que levam mais de 3s para carregar."}
    ] : dev.name==="Desktop" ? [
      {t:"LP B2B com Calculadora de ROI", h:"<em>Se</em> criarmos uma landing page 'Allu for Business' com ROI Calculator, <em>então</em> esperamos +1.5% de CR desktop, <em>porque</em> tráfego desktop em horário comercial indica decisores B2B que precisam de argumentos financeiros."},
      {t:"Exit Intent com Oferta Personalizada", h:"<em>Se</em> implementarmos popup de exit intent com a última categoria navegada, <em>então</em> esperamos recuperar 3% dos abandonadores, <em>porque</em> o visitante desktop já investiu tempo significativo."},
      {t:"Live Chat Sales (WhatsApp Widget)", h:"<em>Se</em> adicionarmos chat de vendas ao vivo no desktop, <em>então</em> esperamos +2% de CR em sessões com interação, <em>porque</em> resolução de objeções em tempo real é o principal driver de conversão para tickets altos."}
    ] : [
      {t:"Reutilizar fluxo Mobile", h:"Com share baixo, o ROI de desenvolvimento dedicado para tablet é negativo. Manter responsividade do mobile."},
      {t:"QA periódico de layout", h:"Verificar mensalmente que não há quebras visuais em iPad/Android Tablet."},
      {t:"Monitorar tendência", h:"Se share de tablet crescer acima de 3%, reavaliar investimento em UX dedicado."}
    ];

    return `<div class="device-card">
      <div class="device-icon">${icons[dev.name]||"💻"}</div><div class="device-name">${dev.name}</div>
      <div class="device-sessions">${fmt(dev.sessions)}</div>
      <div class="device-share">${pct1(dev.sessions/(tS||1))} Share Sessões | ${pct1(dev.purchases/(tP||1))} Share Compras</div>
      <div class="device-stats">
        <div><div class="device-stat-label">Conv Rate</div><div class="device-stat-value">${pct(cr)} ${tD(cr,crP)}</div></div>
        <div><div class="device-stat-label">Compras</div><div class="device-stat-value">${fmtF(dev.purchases)} ${tD(dev.purchases,prev.purchases)}</div></div>
        <div><div class="device-stat-label">Engag Rate</div><div class="device-stat-value">${pct1(dev.engRate)} ${tD(dev.engRate,prev.engRate)}</div></div>
        <div><div class="device-stat-label">Duração</div><div class="device-stat-value">${fmtDur(dev.avgDuration)}</div></div>
      </div>
      <div class="device-actions"><h4>Planos de Ação (${dev.name})</h4>
      ${acts.map(a=>`<div class="device-action-item"><strong>${a.t}</strong><br><span>${a.h}</span></div>`).join("")}</div>
    </div>`;
  }).join("");

  const mob = devs.find(d=>d.name==="Mobile");
  const desk = devs.find(d=>d.name==="Desktop");
  if (mob) {
    const desktopCRMult = desk ? ((desk.purchases/desk.sessions) / (mob.purchases/mob.sessions||0.001)).toFixed(1) : "—";
    document.getElementById("devices-insight").innerHTML=`<p><strong>📊 Resumo:</strong> Mobile domina ${pct1(mob.sessions/(tS||1))} das sessões mas apresenta CR inferior ao Desktop (${desktopCRMult}x maior). A cada 0.1pp de melhoria no CR mobile, são ~${fmt(Math.round(mob.sessions*0.001))} compras incrementais.</p>`;
  }
}

// =====================================
// 6. Audience
// =====================================
function renderAudience(data) {
  const tS=data.current.kpis.sessions, tP=data.current.kpis.purchases;
  const renderRows = (tbodyId, list, prevList) => {
    document.getElementById(tbodyId).innerHTML = list.map(r => {
      const p = prevList.find(x=>x.name===r.name) || r;
      return `<tr><td><strong>${r.name}</strong></td>
        <td>${fmt(r.sessions)} ${tD(r.sessions,p.sessions)}</td>
        <td>${fmtF(r.purchases)} ${tD(r.purchases,p.purchases)}</td>
        <td>${fmtMoney(r.revenue)} ${tD(r.revenue,p.revenue)}</td>
        <td>${pct(r.purchases/(r.sessions||1))}</td>
        <td>${pct1(r.sessions/(tS||1))}</td><td>${pct1(r.purchases/(tP||1))}</td></tr>`;
    }).join("");
  };
  renderRows("regions-tbody", data.current.regions, data.previous.regions);
  renderRows("cities-tbody",  data.current.cities,  data.previous.cities);

  const sortBy = (arr,fn,asc=false) => [...arr].sort((a,b)=>asc?fn(a)-fn(b):fn(b)-fn(a));
  const cits=data.current.cities, regs=data.current.regions;
  const topRevC  = sortBy(cits,c=>c.revenue).slice(0,5);
  const flopRevC = sortBy(cits,c=>c.revenue,true).slice(0,5);
  const topShP   = sortBy(regs,r=>r.purchases/tP).slice(0,5);
  const flopShP  = sortBy(regs,r=>r.purchases/tP,true).slice(0,5);
  const topCR    = sortBy(cits,c=>c.purchases/c.sessions).slice(0,5);
  const flopCR   = sortBy(cits,c=>c.purchases/c.sessions,true).slice(0,5);

  document.getElementById("audience-topflop").innerHTML=`<div class="top-flop-grid">
    <div class="top-flop-card top"><h4>🏆 Top 5 Cidades (Receita)</h4><ol>${topRevC.map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)}</li>`).join("")}</ol>
    <div class="tf-action"><strong>Ação:</strong> <em>Se</em> alocarmos budget incremental de Ads nessas praças, <em>então</em> escalamos o MRR com CAC já validado.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 Cidades (Receita)</h4><ol>${flopRevC.map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)}</li>`).join("")}</ol>
    <div class="tf-action"><strong>Ação:</strong> <em>Se</em> testarmos criativos com prova social local, <em>então</em> esperamos +15% de CR regional.</div></div>
    <div class="top-flop-card top"><h4>🏆 Top 5 Cidades (Conv Rate)</h4><ol>${topCR.map(c=>`<li>${c.name}: ${pct(c.purchases/c.sessions)}</li>`).join("")}</ol>
    <div class="tf-action"><strong>Ação:</strong> Replicar messaging dessas praças em mercados similares via lookalike audiences.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 Cidades (Conv Rate)</h4><ol>${flopCR.map(c=>`<li>${c.name}: ${pct(c.purchases/c.sessions)}</li>`).join("")}</ol>
    <div class="tf-action"><strong>Ação:</strong> <em>Se</em> reduzirmos budget nessas praças, <em>então</em> esperamos +5% de ROAS geral.</div></div>
    <div class="top-flop-card top"><h4>🏆 Top 5 Estados (Share Compras)</h4><ol>${topShP.map(r=>`<li>${r.name}: ${pct1(r.purchases/tP)}</li>`).join("")}</ol>
    <div class="tf-action"><strong>Ação:</strong> Consolidar como praças-âncora. Frete subsidiado e estoque local reduzem SLA e aumentam NPS.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 Estados (Share Compras)</h4><ol>${flopShP.map(r=>`<li>${r.name}: ${pct1(r.purchases/tP)}</li>`).join("")}</ol>
    <div class="tf-action"><strong>Ação:</strong> Validar se o serviço está disponível nessas praças antes de investir em awareness.</div></div>
  </div>`;
}

// =====================================
// 7. Segments
// =====================================
function renderSegments(data) {
  const topCh  = data.current.channels.length ? [...data.current.channels].sort((a,b)=>b.sessions-a.sessions)[0].name : "meta / paid_social";
  const topDev = data.current.devices.length  ? [...data.current.devices].sort((a,b)=>b.sessions-a.sessions)[0] : {name:"Mobile",sessions:1};
  const dur    = fmtDur(data.current.kpis.avgDuration);
  const cr     = pct(data.current.kpis.purchases/(data.current.funnel.page_view||1));

  document.getElementById("customer-profile").innerHTML=`
    <h3>👤 Raio-X: Perfil Médio do Cliente Allu no Período</h3>
    <p>O assinante típico é um consumidor de <strong>${topDev.name}</strong> (${pct1(topDev.sessions/(data.current.kpis.sessions||1))} das sessões) que chega majoritariamente via <strong>${topCh}</strong>. Ele navega por aproximadamente <strong>${dur}</strong> antes de converter. A taxa de engajamento de ${pct1(data.current.kpis.engagementRate)} sugere que quem chega à LP tem intenção — o desafio é <strong>converter confiança em ação</strong>.</p>
    <p><strong>Jornada típica:</strong> Impactado por anúncio em feed (Meta/TikTok) → pesquisa branded no Google → acessa a LP via direct/orgânico → navega 2-3 produtos → abandona no preenchimento de dados financeiros.</p>
    <p><strong>Oportunidade:</strong> <em>Se</em> criarmos sequência de nutrição pós-primeiro-acesso (email + WhatsApp) com depoimentos de aprovação rápida, <em>então</em> esperamos recuperar 8% dos abandonadores, <em>porque</em> a hesitação não é sobre o produto mas sobre o processo.</p>`;

  const segs = [
    {icon:"💳",title:"Abandonadores de Checkout Quente",def:"Preencheram dados até etapa de crédito e recuaram nos últimos 14d.",m:"Drop de Shipping→Purchase",a:"<em>Se</em> enviarmos WhatsApp em 1h ('Sua aprovação está garantida'), <em>então</em> recuperamos ~12% desses leads."},
    {icon:"🛒",title:"Multi-Cart Sem Decisão",def:"Adicionaram 2+ SKUs ao carrinho sem iniciar checkout.",m:"Add to Cart → Begin Checkout",a:"<em>Se</em> enviarmos email com bundle discount, <em>então</em> esperamos +20% de início de checkout."},
    {icon:"👔",title:"Compradores B2B Desktop",def:"Sessões >5min em horário comercial via Desktop.",m:"CR B2B Pipeline",a:"LP dedicada 'Allu for Business' com ROI Calculator e formulário de lead."},
    {icon:"📱",title:"Mobile High-Intent (iOS)",def:"Navegaram iPhone Pro Max 2x+ em 7 dias.",m:"Recompra de high-intent",a:"<em>Se</em> ativarmos retargeting Meta com oferta exclusiva de 7 dias, <em>então</em> esperamos +25% de conversão."},
    {icon:"♻️",title:"Retornantes de Consideração",def:"3+ sessões em 14 dias sem compra.",m:"Conversão de Lead Morno",a:"<em>Se</em> nutrirmos via email com authority content (reviews + comparativos), <em>então</em> esperamos converter 5% em 30 dias."},
    {icon:"🎮",title:"Gamers Night (Impulso)",def:"Busca PS5/console sexta 20h-23h.",m:"Conversão por impulso",a:"<em>Se</em> programarmos ads 'Jogue neste FDS — PS5 entregue amanhã', <em>então</em> esperamos +30% de CR nesse horário."}
  ];
  document.getElementById("segments-grid").innerHTML = segs.map(s=>`
    <div class="segment-card"><div class="segment-icon">${s.icon}</div><div class="segment-title">${s.title}</div>
    <div class="segment-def">${s.def}</div><div class="segment-meta-item">📍 OMTM: ${s.m}</div><div class="segment-meta-item">🎯 ${s.a}</div></div>`).join("");
}

// =====================================
// 8. Products
// =====================================
function renderProducts(data) {
  const renderTbl = (tbodyId, tfootId, list, prevList, isProduct) => {
    const tV=list.reduce((s,c)=>s+c.views,0); const tR=list.reduce((s,c)=>s+c.revenue,0);
    let sumV=0,sumP=0,sumR=0;
    const html = list.map((c,i) => {
      const prev = prevList.find(x=>x.name===c.name) || c;
      sumV+=c.views; const cP=c.purchases||0; const pP=prev.purchases||0; sumP+=cP; sumR+=c.revenue;
      const shV=c.views/(tV||1); const shR=c.revenue/(tR||1);
      return `<tr>${isProduct?`<td>${i+1}</td><td><strong>${c.name}</strong></td><td>${c.category}</td>`:`<td><strong>${c.name}</strong></td>`}
        <td>${fmt(c.views)}<br>${tD(c.views,prev.views)}</td><td>${pct1(shV)}</td>
        <td>${fmtF(cP)}<br>${tD(cP,pP)}</td><td>${pct(cP/(c.views||1))}</td>
        ${isProduct?`<td>${pct1(c.engRate||0.95)}</td>`:""}
        <td>${fmtDur(c.duration||c.avgDuration||0)}</td>
        <td>${fmtMoney(c.revenue)}<br>${tD(c.revenue,prev.revenue)}</td><td>${pct1(shR)}</td></tr>`;
    }).join("");
    document.getElementById(tbodyId).innerHTML = html;
    const cols = isProduct ? 3 : 1;
    document.getElementById(tfootId).innerHTML = `<tr><td colspan="${cols}">TOTAL</td><td>${fmt(sumV)}</td><td>100%</td><td>${fmtF(sumP)}</td><td>${pct(sumP/(sumV||1))}</td>${isProduct?`<td>-</td>`:""}<td>-</td><td>${fmtMoney(sumR)}</td><td>100%</td></tr>`;
  };

  renderTbl("products-tbody","products-tfoot",data.current.products,data.previous.products,true);
  renderTbl("categories-tbody","categories-tfoot",data.current.categories,data.previous.categories,false);

  const sortBy = (arr,fn,asc=false) => [...arr].sort((a,b)=>asc?fn(a)-fn(b):fn(b)-fn(a));
  const tR     = data.current.products.reduce((s,p)=>s+p.revenue,0);
  const topR   = sortBy(data.current.products,c=>c.revenue).slice(0,5);
  const flopR  = sortBy(data.current.products,c=>c.revenue,true).slice(0,5);
  const topP   = sortBy(data.current.products,c=>c.purchases||0).slice(0,5);
  const flopP  = sortBy(data.current.products,c=>c.purchases||0,true).slice(0,5);

  document.getElementById("products-topflop").innerHTML=`<div class="top-flop-grid">
    <div class="top-flop-card top"><h4>🏆 Top 5 (Share Receita)</h4><ol>${topR.map(c=>`<li>${c.name}: ${pct1(c.revenue/(tR||1))} (${fmtMoney(c.revenue)})</li>`).join("")}</ol>
    <div class="tf-action"><strong>Ação:</strong> <em>Se</em> concentrarmos 70% do budget de remarketing dinâmico nesses produtos, <em>então</em> esperamos +12% de ROAS.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 (Share Receita)</h4><ol>${flopR.map(c=>`<li>${c.name}: ${pct1(c.revenue/(tR||1))} (${fmtMoney(c.revenue)})</li>`).join("")}</ol>
    <div class="tf-action"><strong>Ação:</strong> Avaliar se esses produtos justificam vitrine principal. Considerar bundling.</div></div>
    <div class="top-flop-card top"><h4>🏆 Top 5 (Compras)</h4><ol>${topP.map(c=>`<li>${c.name}: ${fmtF(c.purchases||0)} compras</li>`).join("")}</ol>
    <div class="tf-action"><strong>Ação:</strong> Garantir stock permanente. Criar bundle sugerido com acessórios para aumentar AOV.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 (Compras)</h4><ol>${flopP.map(c=>`<li>${c.name}: ${fmtF(c.purchases||0)} compras</li>`).join("")}</ol>
    <div class="tf-action"><strong>Ação:</strong> <em>Se</em> reposicionarmos esses produtos como 'complementares' em bundles, <em>então</em> esperamos +25% de vendas.</div></div>
  </div>`;

  const catTR  = data.current.categories.reduce((s,c)=>s+c.revenue,0);
  const topCR  = sortBy(data.current.categories,c=>c.revenue).slice(0,5);
  const flopCR = sortBy(data.current.categories,c=>c.revenue,true).slice(0,5);
  document.getElementById("categories-topflop").innerHTML=`<div class="top-flop-grid">
    <div class="top-flop-card top"><h4>🏆 Top Categorias (Receita)</h4><ol>${topCR.map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)} (${pct1(c.revenue/(catTR||1))})</li>`).join("")}</ol>
    <div class="tf-action"><strong>Ação:</strong> Fortalecer storytelling dessa categoria — é o carro-chefe.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop Categorias (Receita)</h4><ol>${flopCR.map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)} (${pct1(c.revenue/(catTR||1))})</li>`).join("")}</ol>
    <div class="tf-action"><strong>Ação:</strong> <em>Se</em> criarmos landing pages por categoria com USPs específicos, <em>então</em> esperamos +20% de CR por categoria.</div></div>
  </div>`;
}
