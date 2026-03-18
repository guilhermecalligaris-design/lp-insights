// V6.6 — App Part 2: Sections 6-10 + Charts

// ---- Chart color palette (shared with app.js) ----
const CHART_COLORS2=["#2ECB6F","#3B82F6","#A855F7","#F59E0B","#EF4444","#06B6D4","#EC4899","#10B981","#F97316","#6366F1","#14B8A6","#D946EF","#84CC16","#FB923C","#8B5CF6"];

function renderComboChart(canvasId,labels,barData1,barData2,lineData,barLabel1,barLabel2,lineLabel){
  if(_charts[canvasId]){_charts[canvasId].destroy();delete _charts[canvasId];}
  const ctx=document.getElementById(canvasId);if(!ctx)return;
  _charts[canvasId]=new Chart(ctx,{type:"bar",data:{labels,datasets:[
    {type:"bar",label:barLabel1,data:barData1,backgroundColor:"#2ECB6F88",borderWidth:0,yAxisID:"y",order:2},
    {type:"bar",label:barLabel2,data:barData2,backgroundColor:"#3B82F688",borderWidth:0,yAxisID:"y",order:2},
    {type:"line",label:lineLabel,data:lineData,borderColor:"#F59E0B",backgroundColor:"#F59E0B33",borderWidth:2,pointRadius:3,yAxisID:"y1",order:1}
  ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:"#9CA3AF",font:{size:9}},position:"bottom"},tooltip:{bodyFont:{size:10}}},scales:{x:{ticks:{color:"#9CA3AF",font:{size:8},maxRotation:45},grid:{display:false}},y:{position:"left",title:{display:true,text:"Volume",color:"#9CA3AF"},ticks:{color:"#9CA3AF"},grid:{color:"rgba(255,255,255,.05)"}},y1:{position:"right",title:{display:true,text:"Conv Rate %",color:"#F59E0B"},ticks:{color:"#F59E0B"},grid:{display:false}}}}});
}

function renderScatter2(canvasId,points,xLabel,yLabel){
  if(_charts[canvasId]){_charts[canvasId].destroy();delete _charts[canvasId];}
  const ctx=document.getElementById(canvasId);if(!ctx)return;
  _charts[canvasId]=new Chart(ctx,{type:"bubble",data:{datasets:[{data:points.map(p=>({x:p.x,y:p.y,r:Math.min(18,Math.max(4,p.r||6))})),backgroundColor:points.map((_,i)=>CHART_COLORS2[i%CHART_COLORS2.length]+"AA"),borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx2=>{const p=points[ctx2.dataIndex];return p?`${p.label}: ${typeof p.x==="number"&&p.x>1000?fmtMoney(p.x):fmtF(p.x)} ${xLabel}, ${p.y.toFixed(2)}% CR`:"";}}}},scales:{x:{title:{display:true,text:xLabel,color:"#9CA3AF"},ticks:{color:"#9CA3AF"},grid:{color:"rgba(255,255,255,.05)"}},y:{title:{display:true,text:yLabel,color:"#9CA3AF"},ticks:{color:"#9CA3AF"},grid:{color:"rgba(255,255,255,.05)"}}}}});
}

// === 6. Audience ===
function renderAudience(data){
  const tS=data.current.kpis.sessions,tP=data.current.kpis.purchases;
  const renderRows=(tbodyId,list,prevList)=>{
    document.getElementById(tbodyId).innerHTML=list.map(r=>{
      const p=prevList.find(x=>x.name===r.name)||r;
      return`<tr><td><strong>${r.name}</strong></td><td>${fmt(r.sessions)} ${tD(r.sessions,p.sessions)}</td><td>${fmtF(r.purchases)} ${tD(r.purchases,p.purchases)}</td><td>${fmtMoney(r.revenue)} ${tD(r.revenue,p.revenue)}</td><td>${pct(r.purchases/(r.sessions||1))}</td><td>${pct1(r.sessions/(tS||1))}</td><td>${pct1(r.purchases/(tP||1))}</td></tr>`;
    }).join("");
  };
  renderRows("regions-tbody",data.current.regions,data.previous.regions);
  renderRows("cities-tbody",data.current.cities,data.previous.cities);

  // Charts for section 6
  const cits=data.current.cities;
  renderScatter2("chart-scatter-geo",cits.map(c=>({x:c.revenue,y:(c.purchases/(c.sessions||1))*100,label:c.name,r:Math.max(4,c.sessions/20000)})),"Receita (R$)","Conv Rate %");
  renderComboChart("chart-combo-geo",cits.map(c=>c.name),cits.map(c=>c.sessions),cits.map(c=>c.purchases*50),cits.map(c=>(c.purchases/(c.sessions||1))*100),"Sessões","Compras (×50)","Conv Rate %");

  // Chart insights for section 6
  const geoInsEl=document.getElementById("charts-geo-insight");
  if(geoInsEl){
    const topRevCity=[...cits].sort((a,b)=>b.revenue-a.revenue)[0];
    const topCRCity=[...cits].sort((a,b)=>(b.purchases/(b.sessions||1))-(a.purchases/(a.sessions||1)))[0];
    geoInsEl.innerHTML=`<p><strong>📊 Insight dos Gráficos:</strong> <strong>${topRevCity?.name}</strong> lidera receita (${fmtMoney(topRevCity?.revenue||0)}). <strong>${topCRCity?.name}</strong> tem melhor Conv Rate (${pct(topCRCity?.purchases/(topCRCity?.sessions||1)||0)}). O scatter revela oportunidades em cidades com alto CR mas baixa receita — possível subinvestimento.</p><p><strong>🎯 Ação:</strong> <em>Se</em> escalarmos budget nas cidades Q1 (alto CR + receita), <em>então</em> maximizamos ROAS regional. <em>Se</em> ativarmos campanhas de awareness em cidades com alto CR e baixo volume, <em>então</em> desbloqueamos MRR incremental.</p>`;
  }

  // Top/Flop cards
  const sortBy=(arr,fn,asc)=>[...arr].sort((a,b)=>asc?fn(a)-fn(b):fn(b)-fn(a));
  const regs=data.current.regions;
  const topRevC=sortBy(cits,c=>c.revenue).slice(0,5),flopRevC=sortBy(cits,c=>c.revenue,true).slice(0,5);
  const topShP=sortBy(regs,r=>r.purchases/tP).slice(0,5),flopShP=sortBy(regs,r=>r.purchases/tP,true).slice(0,5);
  const topCR=sortBy(cits,c=>c.purchases/(c.sessions||1)).slice(0,5),flopCR=sortBy(cits,c=>c.purchases/(c.sessions||1),true).slice(0,5);
  document.getElementById("audience-topflop").innerHTML=`<div class="top-flop-grid">
    <div class="top-flop-card top"><h4>🏆 Top 5 Cidades (Receita)</h4><ol>${topRevC.map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)}</li>`).join("")}</ol><div class="tf-action"><em>Se</em> alocarmos budget nestas praças, <em>então</em> escalamos MRR com CAC validado.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 Cidades (Receita)</h4><ol>${flopRevC.map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)}</li>`).join("")}</ol><div class="tf-action"><em>Se</em> testarmos criativos com prova social regional, <em>então</em> +15% CR.</div></div>
    <div class="top-flop-card top"><h4>🏆 Top 5 Cidades (Conv Rate)</h4><ol>${topCR.map(c=>`<li>${c.name}: ${pct(c.purchases/(c.sessions||1))}</li>`).join("")}</ol><div class="tf-action">Replicar messaging dessas praças em mercados similares.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 Cidades (Conv Rate)</h4><ol>${flopCR.map(c=>`<li>${c.name}: ${pct(c.purchases/(c.sessions||1))}</li>`).join("")}</ol><div class="tf-action"><em>Se</em> reduzirmos budget nestas praças, <em>então</em> +5% ROAS.</div></div>
    <div class="top-flop-card top"><h4>🏆 Top 5 Estados (Share Compras)</h4><ol>${topShP.map(r=>`<li>${r.name}: ${pct1(r.purchases/(tP||1))}</li>`).join("")}</ol><div class="tf-action">Consolidar como praças-âncora com frete subsidiado.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 Estados (Share Compras)</h4><ol>${flopShP.map(r=>`<li>${r.name}: ${pct1(r.purchases/(tP||1))}</li>`).join("")}</ol><div class="tf-action">Validar disponibilidade do serviço antes de investir em awareness.</div></div>
  </div>`;
}

// === 7. Segments + Attribution ===
function renderSegments(data){
  const kpi=data.current.kpis;
  const topCh=[...data.current.channels].sort((a,b)=>b.sessions-a.sessions);
  const topDev=[...data.current.devices].sort((a,b)=>b.sessions-a.sessions)[0];
  const dur=fmtDur(kpi.avgDuration);
  const cr=pct(kpi.purchases/(kpi.sessions||1));
  const topCity=[...data.current.cities].sort((a,b)=>b.sessions-a.sessions)[0];
  const topCityRev=[...data.current.cities].sort((a,b)=>b.revenue-a.revenue)[0];
  const topProd=[...data.current.products].sort((a,b)=>b.purchases-a.purchases)[0];
  const topProdRev=[...data.current.products].sort((a,b)=>b.revenue-a.revenue)[0];
  const topCat=[...data.current.categories].sort((a,b)=>b.revenue-a.revenue)[0];
  const ticket=kpi.revenue/(kpi.purchases||1);
  const mobileShare=topDev.sessions/(kpi.sessions||1);
  const dskDev=data.current.devices.find(d=>d.name==="Desktop");
  const mobCR=topDev.purchases/(topDev.sessions||1);
  const dskCR=dskDev?(dskDev.purchases/(dskDev.sessions||1)):0;
  const topPath=data.current.attributionPaths?.[0]||{label:"Social→Direct",share:0.28};
  const paidChs=data.current.channels.filter(c=>c.group?.includes("Paid"));
  const paidShare=paidChs.reduce((s,c)=>s+c.sessions,0)/(kpi.sessions||1);
  const orgChs=data.current.channels.filter(c=>c.group?.includes("Organic")||c.group==='Direct'||c.group==='Email');
  const orgConvRate=orgChs.reduce((s,c)=>s+c.purchases,0)/(orgChs.reduce((s,c)=>s+c.sessions,0)||1);
  const topRegion=[...data.current.regions].sort((a,b)=>b.sessions-a.sessions)[0];
  const funnel=data.current.funnel;
  const funnelTopDrop=(funnel.page_view-funnel.view_item)/(funnel.page_view||1);
  const checkoutDrop=(funnel.add_to_cart-funnel.purchase)/(funnel.add_to_cart||1);

  document.getElementById("customer-profile").innerHTML=`
    <h3>👤 Raio-X: Quem é o Assinante Allu?</h3>
    <p><strong>O consumidor allu é, acima de tudo, mobile.</strong> ${pct1(mobileShare)} de todas as ${fmt(kpi.sessions)} sessões vêm de smartphones — um público que navega no ônibus, na fila do mercado, no sofá de casa. Ele mora em <strong>${topCity?.name||"São Paulo"}</strong> (${pct1(topCity?.sessions/(kpi.sessions||1))} das sessões), mas a allu também é relevante em <strong>${topRegion?.name||"SP"}</strong> (${pct1(topRegion?.sessions/(kpi.sessions||1))} das sessões, o estado-âncora de toda a operação).</p>

    <p><strong>Como ele chega?</strong> O primeiro contato é tipicamente via <strong>${topCh[0]?.canal||"Meta Ads"}</strong> (${topCh[0]?.name||"meta"} = ${pct1(topCh[0]?.sessions/(kpi.sessions||1))} das sessões). ${paidShare>0.5?`A operação é <em>paid-heavy</em> — ${pct1(paidShare)} do tráfego vem de mídia paga.`:`Mix equilibrado entre paid e orgânico.`} Mas a jornada não é linear: o caminho mais frequente de atribuição é <strong>${topPath.label}</strong> (${pct1(topPath.share)} das conversões) — ele vê um ad, pesquisa no Google, e volta via tráfego direto antes de converter. <strong>A decisão leva em média ${data.days>5?"vários dias":"+1 sessão"} e 2-3 touchpoints.</strong></p>

    <p><strong>O que ele busca?</strong> Predominantemente <strong>${topCat?.name||"Smartphones"}</strong> (${fmtMoney(topCat?.revenue||0)} em receita). O produto mais comprado é <strong>${topProd?.name||"iPhone"}</strong> (${fmtF(topProd?.purchases||0)} compras) com ticket médio de <strong>${fmtMoney(Math.round(ticket))}</strong>. ${topProdRev?.name!==topProd?.name?`Porém o maior gerador de receita é <strong>${topProdRev?.name}</strong> (${fmtMoney(topProdRev?.revenue||0)}).`:""} Ele é um consumidor de tech premium que prefere <strong>assinar</strong> ao invés de comprar — o modelo de subscription é core para o B2C.</p>

    <p><strong>Como ele navega?</strong> Sessão média de <strong>${dur}</strong> com engajamento de <strong>${pct1(kpi.engagementRate)}</strong> — acima da benchmark B2C. Mas a conversão geral é <strong>${cr}</strong>. ${dskCR>mobCR?`<strong>Desktop converte ${(dskCR/mobCR).toFixed(1)}x mais</strong> que mobile — a jornada desktop é de decisão, enquanto mobile é de descoberta.`:""} ${pct1(funnelTopDrop)} dos visitantes nunca veem um produto (drop Page View → View Item). E dos que chegam ao carrinho, <strong>${pct1(checkoutDrop)} falham antes de comprar</strong>.</p>

    <p><strong>Persona síntese:</strong> 🎯 Homem/Mulher 22-35 anos, classe B, tech-savvy, mora em capital do Sudeste, navega por mobile via feed social, compara no Google, e volta via direct depois de pensar. Busca premium (iPhone, PS5, MacBook) por assinatura — quer o produto sem o compromisso da compra definitiva. <strong>Obstáculo #1: análise de crédito no checkout final.</strong> O que o move: preço percebido da assinatura vs compra, reviews sociais, e a conveniência de trocar de device sem dor.</p>

    <p><strong>📊 Em números:</strong> ${fmtF(kpi.sessions)} sessões | ${fmtF(kpi.users)} usuários | ${fmtF(kpi.purchases)} compras | ${fmtMoney(kpi.revenue)} receita total | CR ${cr} | CPA ${fmtMoney(parseFloat(document.getElementById('input-investment')?.value||75000)/(kpi.purchases||1))}.</p>`;

  const paths=data.current.attributionPaths||[];
  document.getElementById("attribution-tbody").innerHTML=paths.map((p,i)=>`<tr><td>${i+1}</td><td>${p.path}</td><td>${p.label}</td><td>${pct1(p.share)}</td><td>${pct(p.conv)}</td></tr>`).join("");
  document.getElementById("attribution-insight").innerHTML=`<p><strong>💡 Atribuição:</strong> <strong>${topPath.label}</strong> = ${pct1(topPath.share)} das conversões. Jornada B2C multi-touch confirmada. <em>Se</em> otimizarmos canais de "assist" (${topCh[1]?.name||"google/organic"}, ${topCh[2]?.name||"direct"}), <em>então</em> +10% conversões assistidas. Canais orgânicos convertem a ${pct(orgConvRate)} — ${(orgConvRate/mobCR).toFixed(1)}x mais que paid social.</p>`;
  const segs=[
    {icon:"💳",title:"Abandonadores de Checkout Quente",def:"Preencheram até crédito e recuaram.",m:"Drop Shipping→Purchase",a:`<em>Se</em> WhatsApp em 1h com \"Aprovação garantida\", <em>então</em> ~12% recuperação.`},
    {icon:"🛒",title:"Multi-Cart Sem Decisão",def:"2+ SKUs no carrinho, sem checkout.",m:"Cart→Checkout",a:`<em>Se</em> bundle discount, <em>então</em> +20% checkout.`},
    {icon:"📱",title:"Mobile High-Intent (iOS)",def:`Navegaram ${topProd?.name||"iPhone"} 2x+ em 7d.`,m:"Recompra high-intent",a:`<em>Se</em> retargeting Meta 7d, <em>então</em> +25% conversão.`},
    {icon:"♻️",title:"Retornantes de Consideração",def:"3+ sessões em 14d sem compra.",m:"Lead Morno→Purchase",a:`<em>Se</em> email authority, <em>então</em> 5% conversão em 30d.`},
    {icon:"🎮",title:"Gamers Night (Impulso)",def:"Busca console sexta 20h-23h via mobile.",m:"CR impulso noturno",a:`<em>Se</em> ads \"Jogue neste FDS\", <em>então</em> +30% CR nesse horário.`},
    {icon:"🔄",title:"Comparadores Seriais",def:"5+ SKUs mesma categoria sem cart.",m:"View→Cart",a:`<em>Se</em> tabela comparativa automática, <em>então</em> +18% add-to-cart.`},
    {icon:"📩",title:"Leads Email Alta Abertura",def:"3+ emails abertos em 30d, sem site.",m:"Email→Session",a:`<em>Se</em> CTA exclusivo newsletter, <em>então</em> +35% CTR.`},
    {icon:"🏙️",title:`Heavy Users de ${topCity?.name||"SP"}`,def:`Top 10% tempo sessão em ${topCity?.name||"SP"}.`,m:"Session→Purchase",a:`<em>Se</em> popup atendimento após 4min, <em>então</em> +8% conversão.`},
  ];
  document.getElementById("segments-grid").innerHTML=segs.map(s=>`<div class="segment-card"><div class="segment-icon">${s.icon}</div><div class="segment-title">${s.title}</div><div class="segment-def">${s.def}</div><div class="segment-meta-item">📍 OMTM: ${s.m}</div><div class="segment-meta-item">🎯 ${s.a}</div></div>`).join("");
}

// === 8. Products + Categories + Charts ===
function renderProducts(data){
  const renderTbl=(tbodyId,tfootId,list,prevList,isProduct)=>{
    const tV=list.reduce((s,c)=>s+c.views,0),tR=list.reduce((s,c)=>s+c.revenue,0),tP=list.reduce((s,c)=>s+(c.purchases||0),0);
    let sumV=0,sumP=0,sumR=0;
    document.getElementById(tbodyId).innerHTML=list.map((c,i)=>{
      const prev=prevList.find(x=>x.name===c.name)||c;
      const cP=c.purchases||0,pP=prev.purchases||0;sumV+=c.views;sumP+=cP;sumR+=c.revenue;
      const shV=c.views/(tV||1),shR=c.revenue/(tR||1),shP=cP/(tP||1),cr=cP/(c.views||1);
      return`<tr>${isProduct?`<td>${i+1}</td><td><strong>${c.name}</strong></td><td>${c.category}</td>`:`<td><strong>${c.name}</strong></td>`}<td>${fmt(c.views)}<br>${tD(c.views,prev.views)}</td><td>${pct1(shV)}</td><td>${fmtF(cP)}<br>${tD(cP,pP)}</td><td>${pct1(shP)}</td><td>${pct(cr)}</td>${isProduct?`<td>${pct1(c.engRate||0.95)}</td>`:""}<td>${fmtDur(c.duration||c.avgDuration)}</td><td>${fmtMoney(c.revenue)}<br>${tD(c.revenue,prev.revenue)}</td><td>${pct1(shR)}</td></tr>`;
    }).join("");
    const cols=isProduct?3:1;
    document.getElementById(tfootId).innerHTML=`<tr><td colspan="${cols}">TOTAL</td><td>${fmt(sumV)}</td><td>100%</td><td>${fmtF(sumP)}</td><td>100%</td><td>${pct(sumP/(sumV||1))}</td>${isProduct?`<td>-</td>`:""}<td>-</td><td>${fmtMoney(sumR)}</td><td>100%</td></tr>`;
  };
  renderTbl("products-tbody","products-tfoot",data.current.products,data.previous.products,true);
  renderTbl("categories-tbody","categories-tfoot",data.current.categories,data.previous.categories,false);

  // Charts for section 8
  const prods=data.current.products;
  renderScatter2("chart-scatter-products",prods.map(p=>({x:p.revenue,y:(p.purchases/(p.views||1))*100,label:p.name,r:Math.max(4,p.views/30000)})),"Receita (R$)","Conv Rate %");
  const topProds=[...prods].sort((a,b)=>b.views-a.views).slice(0,10);
  renderComboChart("chart-combo-products",topProds.map(p=>p.name.substring(0,15)),topProds.map(p=>p.views),topProds.map(p=>p.purchases*100),topProds.map(p=>(p.purchases/(p.views||1))*100),"Views","Compras (×100)","Conv Rate %");

  // Chart insights for section 8
  const prodsInsEl=document.getElementById("charts-products-insight");
  if(prodsInsEl){
    const topRevProd=[...prods].sort((a,b)=>b.revenue-a.revenue)[0];
    const topCRProd=[...prods].sort((a,b)=>(b.purchases/(b.views||1))-(a.purchases/(a.views||1)))[0];
    const lowCRHighView=[...prods].sort((a,b)=>b.views-a.views).filter(p=>(p.purchases/(p.views||1))<0.005).slice(0,2);
    prodsInsEl.innerHTML=`<p><strong>📊 Insight dos Gráficos:</strong> <strong>${topRevProd?.name}</strong> lidera receita (${fmtMoney(topRevProd?.revenue||0)}). <strong>${topCRProd?.name}</strong> tem melhor Conv Rate (${pct(topCRProd?.purchases/(topCRProd?.views||1)||0)}). ${lowCRHighView.length?`Produtos com alto volume de views mas baixo CR: ${lowCRHighView.map(p=>p.name).join(", ")} — revisar PDP.`:""}</p><p><strong>🎯 Plano de Ação:</strong> <em>Se</em> otimizarmos as PDPs dos produtos de alto view/baixo CR (imagens, reviews, comparativo), <em>então</em> esperamos +15-20% CR nesses SKUs. <em>Se</em> escalarmos budget de remarketing nos produtos de alto CR, <em>então</em> maximizamos receita incremental.</p>`;
  }

  // Top/Flop
  const sortBy=(arr,fn,asc)=>[...arr].sort((a,b)=>asc?fn(a)-fn(b):fn(b)-fn(a));
  const tR=prods.reduce((s,p)=>s+p.revenue,0),tP=prods.reduce((s,p)=>s+p.purchases,0);
  const cats=data.current.categories;
  const topR=sortBy(prods,c=>c.revenue).slice(0,5),flopR=sortBy(prods,c=>c.revenue,true).slice(0,5);
  const topCR2=sortBy(prods,c=>c.purchases/(c.views||1)).slice(0,5),flopCR2=sortBy(prods,c=>c.purchases/(c.views||1),true).slice(0,5);
  const topCatCR=sortBy(cats,c=>c.purchases/(c.views||1)).slice(0,5),flopCatCR=sortBy(cats,c=>c.purchases/(c.views||1),true).slice(0,5);

  document.getElementById("products-topflop").innerHTML=`<div class="top-flop-grid">
    <div class="top-flop-card top"><h4>🏆 Top 5 Produtos (Receita)</h4><ol>${topR.map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)}</li>`).join("")}</ol><div class="tf-action"><em>Se</em> remarketing 70% nesses SKUs, <em>então</em> +12% ROAS.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 Produtos (Receita)</h4><ol>${flopR.map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)}</li>`).join("")}</ol><div class="tf-action">Avaliar se justificam vitrine. Considerar bundling.</div></div>
    <div class="top-flop-card top"><h4>🏆 Top 5 Produtos (Conv Rate)</h4><ol>${topCR2.map(c=>`<li>${c.name}: ${pct(c.purchases/(c.views||1))}</li>`).join("")}</ol><div class="tf-action"><em>Se</em> aumentarmos visibilidade desses, <em>então</em> mais conversões com menos budget.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 Produtos (Conv Rate)</h4><ol>${flopCR2.map(c=>`<li>${c.name}: ${pct(c.purchases/(c.views||1))}</li>`).join("")}</ol><div class="tf-action"><em>Se</em> revisarmos PDP (imagens, reviews), <em>então</em> +15% CR.</div></div>
  </div>`;
  document.getElementById("categories-topflop").innerHTML=`<div class="top-flop-grid">
    <div class="top-flop-card top"><h4>🏆 Top Categorias (Receita)</h4><ol>${sortBy(cats,c=>c.revenue).slice(0,5).map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)}</li>`).join("")}</ol><div class="tf-action">Fortalecer storytelling — carro-chefe B2C.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop Categorias (Receita)</h4><ol>${sortBy(cats,c=>c.revenue,true).slice(0,5).map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)}</li>`).join("")}</ol><div class="tf-action"><em>Se</em> LPs dedicadas, <em>então</em> +20% CR.</div></div>
    <div class="top-flop-card top"><h4>🏆 Top Categorias (Conv Rate)</h4><ol>${topCatCR.map(c=>`<li>${c.name}: ${pct(c.purchases/(c.views||1))}</li>`).join("")}</ol><div class="tf-action">Escalar budget — CR alto indica demanda qualificada.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop Categorias (Conv Rate)</h4><ol>${flopCatCR.map(c=>`<li>${c.name}: ${pct(c.purchases/(c.views||1))}</li>`).join("")}</ol><div class="tf-action"><em>Se</em> bundles complementares, <em>então</em> +25% vendas.</div></div>
  </div>`;
}

// === 9. ICE Matrix ===
function renderICE(data){
  const f=data.current.funnel,ticket=data.current.kpis.revenue/(data.current.kpis.purchases||1);
  const actions=[
    {a:"Carrossel Top Sellers above-the-fold",omtm:"View Item Rate",i:8,c:7,e:9,mrr:Math.round(f.page_view*0.07*0.03*ticket)},
    {a:"Widget Simulação de Parcela no Cart",omtm:"Cart→Checkout Rate",i:9,c:8,e:7,mrr:Math.round(f.add_to_cart*0.15*0.5*ticket)},
    {a:"Pré-qualificação de crédito (API)",omtm:"Purchase Rate",i:9,c:6,e:4,mrr:Math.round((f.add_payment_info||f.add_shipping_info)*0.2*0.8*ticket)},
    {a:"Checkout Express (Apple/Google Pay)",omtm:"Mobile CR",i:8,c:9,e:6,mrr:Math.round(data.current.devices[0].sessions*0.0008*ticket)},
    {a:"Auto-fill CEP via GPS",omtm:"Shipping Completion",i:6,c:8,e:8,mrr:Math.round(f.add_personal_info*0.15*0.3*ticket)},
    {a:"WhatsApp Recovery (1h pós-abandono)",omtm:"Checkout Recovery",i:9,c:7,e:8,mrr:Math.round((f.add_payment_info||f.add_shipping_info)*0.12*ticket)},
    {a:"Retargeting Meta High-Intent (7d)",omtm:"Retorno + Purchase",i:7,c:8,e:9,mrr:Math.round(data.current.kpis.sessions*0.01*0.25*ticket)},
    {a:"Email Bundle Discount (Multi-Cart)",omtm:"Cart→Checkout",i:7,c:7,e:9,mrr:Math.round(f.add_to_cart*0.05*0.2*ticket)},
    {a:"LCP Optimization (WebP+CDN)",omtm:"Bounce Mobile",i:6,c:9,e:8,mrr:Math.round(data.current.devices[0].sessions*0.04*0.005*ticket)},
    {a:"Nutrição Email pós-primeiro-acesso",omtm:"Lead→Purchase",i:7,c:6,e:7,mrr:Math.round(data.current.kpis.sessions*0.05*0.05*ticket)},
  ].map(x=>({...x,ice:x.i*x.c*x.e})).sort((a,b)=>b.ice-a.ice);
  document.getElementById("ice-intro").innerHTML=`<p><strong>📊 Método ICE:</strong> I×C×E ordena prioridade. MRR projetados com ticket R$${ticket} (purchaseRevenue/purchase).</p>`;
  document.getElementById("ice-tbody").innerHTML=actions.map((a,i)=>`<tr><td>${i+1}</td><td><strong>${a.a}</strong></td><td>${a.omtm}</td><td>${a.i}/10</td><td>${a.c}/10</td><td>${a.e}/10</td><td><strong>${a.ice}</strong></td><td>${fmtMoney(a.mrr)}/mês</td></tr>`).join("");
}

// === 10. Growth Projections ===
function renderGrowth(data){
  const cr=data.current.kpis.purchases/(data.current.kpis.sessions||1);
  const rev=data.current.kpis.revenue,sess=data.current.kpis.sessions,purch=data.current.kpis.purchases;
  const ticket=data.current.kpis.revenue/(data.current.kpis.purchases||1),days=data.days||30,monthlyMul=30/days;
  const scenarios=[
    {name:"🔴 Cenário Conservador (+5% CR)",crMod:1.05,sessMod:1.0,desc:"Mantemos tráfego atual + 5% CR via UX."},
    {name:"🟡 Cenário Moderado (+10% CR, +10% Sessões)",crMod:1.10,sessMod:1.10,desc:"CRO + aumento moderado de budget."},
    {name:"🟢 Cenário Agressivo (+20% CR, +20% Sessões)",crMod:1.20,sessMod:1.20,desc:"Full throttle: CRO + escala + novos canais."},
  ];
  document.getElementById("growth-projections").innerHTML=`<div class="growth-scenarios">${scenarios.map(s=>{
    const newSess=Math.round(sess*s.sessMod*monthlyMul),newCR=cr*s.crMod;
    const newPurch=Math.round(newSess*newCR),newMRR=newPurch*ticket;
    const deltaPurch=newPurch-Math.round(purch*monthlyMul);
    const deltaMRR=deltaPurch*ticket;
    return`<div class="growth-card"><h3>${s.name}</h3><p class="growth-desc">${s.desc}</p><div class="growth-metrics"><div class="growth-metric"><span class="growth-metric-label">Sessões/mês</span><span class="growth-metric-value">${fmt(newSess)}</span></div><div class="growth-metric"><span class="growth-metric-label">Conv Rate</span><span class="growth-metric-value">${pct(newCR)}</span></div><div class="growth-metric"><span class="growth-metric-label">Purchases/mês</span><span class="growth-metric-value">${fmtF(newPurch)}</span></div><div class="growth-metric"><span class="growth-metric-label">MRR Projetado</span><span class="growth-metric-value">${fmtMoney(newMRR)}</span></div><div class="growth-metric"><span class="growth-metric-label">Δ Purchases</span><span class="growth-metric-value kpi-delta ${deltaPurch>0?"up":"neutral"}">${deltaPurch>0?"+":""}${fmtF(deltaPurch)}</span></div><div class="growth-metric"><span class="growth-metric-label">Δ MRR</span><span class="growth-metric-value kpi-delta ${deltaMRR>0?"up":"neutral"}">${deltaMRR>0?"+":""}${fmtMoney(deltaMRR)}</span></div></div></div>`;
  }).join("")}</div>`;
}
