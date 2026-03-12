// V6.2 — App Part 2: Sections 6-10

// === 6. Audience ===
function renderAudience(data){
  const tS=data.current.kpis.sessions,tP=data.current.kpis.purchases;
  const renderRows=(tbodyId,list,prevList)=>{
    document.getElementById(tbodyId).innerHTML=list.map(r=>{
      const p=prevList.find(x=>x.name===r.name)||r;
      return`<tr><td><strong>${r.name}</strong></td><td>${fmt(r.sessions)} ${tD(r.sessions,p.sessions)}</td><td>${fmtF(r.purchases)} ${tD(r.purchases,p.purchases)}</td><td>${fmtMoney(r.revenue)} ${tD(r.revenue,p.revenue)}</td><td>${pct(r.purchases/r.sessions)}</td><td>${pct1(r.sessions/tS)}</td><td>${pct1(r.purchases/tP)}</td></tr>`;
    }).join("");
  };
  renderRows("regions-tbody",data.current.regions,data.previous.regions);
  renderRows("cities-tbody",data.current.cities,data.previous.cities);
  const sortBy=(arr,fn,asc)=>[...arr].sort((a,b)=>asc?fn(a)-fn(b):fn(b)-fn(a));
  const cits=data.current.cities,regs=data.current.regions;
  const topRevC=sortBy(cits,c=>c.revenue).slice(0,5),flopRevC=sortBy(cits,c=>c.revenue,true).slice(0,5);
  const topShP=sortBy(regs,r=>r.purchases/tP).slice(0,5),flopShP=sortBy(regs,r=>r.purchases/tP,true).slice(0,5);
  const topCR=sortBy(cits,c=>c.purchases/c.sessions).slice(0,5),flopCR=sortBy(cits,c=>c.purchases/c.sessions,true).slice(0,5);
  document.getElementById("audience-topflop").innerHTML=`<div class="top-flop-grid">
    <div class="top-flop-card top"><h4>🏆 Top 5 Cidades (Receita)</h4><ol>${topRevC.map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)}</li>`).join("")}</ol><div class="tf-action"><strong>Ação:</strong> <em>Se</em> alocarmos budget incremental nestas praças, <em>então</em> esperamos escalar MRR com CAC já validado, <em>porque</em> receita alta indica product-market-fit B2C geográfico.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 Cidades (Receita)</h4><ol>${flopRevC.map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)}</li>`).join("")}</ol><div class="tf-action"><strong>Ação:</strong> <em>Se</em> testarmos criativos com prova social regional, <em>então</em> esperamos +15% de CR, <em>porque</em> baixa receita pode indicar falta de confiança na marca em mercados frios.</div></div>
    <div class="top-flop-card top"><h4>🏆 Top 5 Cidades (Conv Rate)</h4><ol>${topCR.map(c=>`<li>${c.name}: ${pct(c.purchases/c.sessions)}</li>`).join("")}</ol><div class="tf-action"><strong>Ação:</strong> Replicar messaging dessas praças em mercados similares via lookalike B2C.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 Cidades (Conv Rate)</h4><ol>${flopCR.map(c=>`<li>${c.name}: ${pct(c.purchases/c.sessions)}</li>`).join("")}</ol><div class="tf-action"><strong>Ação:</strong> <em>Se</em> reduzirmos budget nestas praças e redirecionarmos para Top, <em>então</em> esperamos +5% de ROAS, <em>porque</em> CR baixo indica fricção estrutural (logística? awareness?) difícil de resolver com ads.</div></div>
    <div class="top-flop-card top"><h4>🏆 Top 5 Estados (Share Compras)</h4><ol>${topShP.map(r=>`<li>${r.name}: ${pct1(r.purchases/tP)}</li>`).join("")}</ol><div class="tf-action"><strong>Ação:</strong> Consolidar como praças-âncora. Frete subsidiado e estoque local reduzem SLA e aumentam NPS B2C.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 Estados (Share Compras)</h4><ol>${flopShP.map(r=>`<li>${r.name}: ${pct1(r.purchases/tP)}</li>`).join("")}</ol><div class="tf-action"><strong>Ação:</strong> Tráfego sem conversão. Validar se o serviço Allu está disponível nestas praças antes de investir em awareness.</div></div>
  </div>`;
}

// === 7. Segments + Attribution ===
function renderSegments(data){
  const topCh=[...data.current.channels].sort((a,b)=>b.sessions-a.sessions)[0];
  const topDev=data.current.devices.sort((a,b)=>b.sessions-a.sessions)[0];
  const dur=fmtDur(data.current.kpis.avgDuration);
  const cr=pct(data.current.kpis.purchases/(data.current.kpis.sessions||1));
  const topCity=[...data.current.cities].sort((a,b)=>b.sessions-a.sessions)[0];
  const topProd=[...data.current.products].sort((a,b)=>b.purchases-a.purchases)[0];

  document.getElementById("customer-profile").innerHTML=`
    <h3>👤 Raio-X: Perfil Médio do Assinante Allu (B2C)</h3>
    <p>O assinante típico é um consumidor <strong>${topDev.name}</strong> (${pct1(topDev.sessions/data.current.kpis.sessions)} das sessões) de <strong>${topCity?.name||"SP"}</strong>, que chega via <strong>${topCh?.name||"meta"}</strong>. Navega por <strong>${dur}</strong> com engajamento de ${pct1(data.current.kpis.engagementRate)}, investigando preço-valor e reviews antes de converter a ${cr} de taxa.</p>
    <p><strong>Produto mais comprado:</strong> ${topProd?.name||"iPhone"} (${fmtF(topProd?.purchases||0)} compras). <strong>Jornada típica:</strong> Impactado por ad no feed → pesquisa branded no Google → acessa LP via direct → navega 2-3 produtos → hesita na etapa de dados financeiros. A <em>"Fricção de Confiança Financeira"</em> (análise de crédito/contrato) é a barreira emocional mais forte no B2C de assinaturas.</p>
    <p><strong>Insight:</strong> <em>Se</em> criarmos nutrição pós-primeiro-acesso (email + WhatsApp) com depoimentos de aprovação rápida, <em>então</em> esperamos recuperar 8% dos abandonadores, <em>porque</em> a hesitação B2C não é sobre o produto, mas sobre o processo de crédito.</p>`;

  // Attribution Paths
  const paths=data.current.attributionPaths||[];
  document.getElementById("attribution-tbody").innerHTML=paths.map((p,i)=>`<tr><td>${i+1}</td><td>${p.path}</td><td>${p.label}</td><td>${pct1(p.share)}</td><td>${pct(p.conv)}</td></tr>`).join("");
  const topPath=paths[0]||{label:"Social→Direct",share:0.28};
  document.getElementById("attribution-insight").innerHTML=`<p><strong>💡 Atribuição:</strong> O caminho <strong>${topPath.label}</strong> responde por ${pct1(topPath.share)} das conversões. Isso confirma que a jornada B2C da Allu é multi-touch: o primeiro clique (awareness) não converte sozinho — o consumidor precisa de 2-3 touchpoints antes da compra. <em>Se</em> otimizarmos os canais de "assist" (orgânico e email) que aparecem no meio do caminho, <em>então</em> esperamos +10% de conversões assistidas, <em>porque</em> eles são responsáveis por aquecer o lead entre o primeiro impacto e a decisão final.</p>`;

  // 8 Power Segments
  const segs=[
    {icon:"💳",title:"Abandonadores de Checkout Quente",def:"Preencheram até etapa de crédito e recuaram nos últimos 14d.",m:"Drop Shipping→Purchase",a:`<em>Se</em> enviarmos WhatsApp em 1h com "Sua aprovação está garantida", <em>então</em> recuperamos ~12%, <em>porque</em> a urgência + garantia eliminam a objeção principal do B2C.`},
    {icon:"🛒",title:"Multi-Cart Sem Decisão",def:"2+ SKUs no carrinho, sem início de checkout.",m:"Cart → Checkout Rate",a:`<em>Se</em> enviarmos email com bundle discount (ex: "iPhone + AirPods -15%"), <em>então</em> esperamos +20% de início de checkout, <em>porque</em> o desconto resolve paralisia de decisão.`},
    {icon:"📱",title:"Mobile High-Intent (iOS)",def:`Navegaram ${topProd?.name||"iPhone Pro Max"} 2x+ em 7 dias.`,m:"Recompra high-intent",a:`<em>Se</em> ativarmos retargeting Meta com oferta de 7 dias, <em>então</em> esperamos +25% de conversão, <em>porque</em> a intenção repetida no maior ticket confirma interesse real.`},
    {icon:"♻️",title:"Retornantes de Consideração",def:"3+ sessões em 14d sem compra.",m:"Conversão Lead Morno",a:`<em>Se</em> nutrirmos via email authority (reviews + comparativos), <em>então</em> esperamos converter 5% em 30d, <em>porque</em> a barreira B2C é confiança, não intenção.`},
    {icon:"🎮",title:"Gamers Night (Compra por Impulso)",def:"Busca PS5/console sexta 20h-23h via mobile.",m:"CR por impulso noturno",a:`<em>Se</em> programarmos ads "Jogue neste FDS — PS5 entregue amanhã", <em>então</em> esperamos +30% de CR nesse horário, <em>porque</em> o impulso noturno B2C responde a urgência e gratificação imediata.`},
    {icon:"🔄",title:"Comparadores Seriais de Preço",def:"Visitaram 5+ SKUs na mesma categoria sem adicionar ao carrinho.",m:"View Item → Cart Rate",a:`<em>Se</em> exibirmos tabela comparativa automática (preço, specs, parcela), <em>então</em> esperamos +18% de add-to-cart, <em>porque</em> a paralisia por excesso de opções é resolvida com comparação lado a lado.`},
    {icon:"📩",title:"Leads de Email com Alta Abertura",def:"Abriram 3+ emails em 30 dias, sem acessar o site.",m:"Email → Session Rate",a:`<em>Se</em> criarmos um CTA exclusivo "Oferta só para assinantes da newsletter", <em>então</em> esperamos +35% de CTR no email, <em>porque</em> exclusividade e escassez são os maiores drivers B2C.`},
    {icon:"🏙️",title:`Heavy Users de ${topCity?.name||"SP"}`,def:`Top 10% em tempo de sessão em ${topCity?.name||"SP"}, sem compra.`,m:"Session Duration → Purchase",a:`<em>Se</em> ativarmos popup de atendimento personalizado após 4min na LP, <em>então</em> esperamos +8% de conversão nesse segmento, <em>porque</em> tempo alto = intenção alta com objeção não resolvida.`},
  ];
  document.getElementById("segments-grid").innerHTML=segs.map(s=>`<div class="segment-card"><div class="segment-icon">${s.icon}</div><div class="segment-title">${s.title}</div><div class="segment-def">${s.def}</div><div class="segment-meta-item">📍 OMTM: ${s.m}</div><div class="segment-meta-item">🎯 ${s.a}</div></div>`).join("");
}

// === 8. Products + Categories ===
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
  const sortBy=(arr,fn,asc)=>[...arr].sort((a,b)=>asc?fn(a)-fn(b):fn(b)-fn(a));
  const prods=data.current.products,cats=data.current.categories;
  const tR=prods.reduce((s,p)=>s+p.revenue,0),tP=prods.reduce((s,p)=>s+p.purchases,0);
  const topR=sortBy(prods,c=>c.revenue).slice(0,5),flopR=sortBy(prods,c=>c.revenue,true).slice(0,5);
  const topCR=sortBy(prods,c=>c.purchases/(c.views||1)).slice(0,5),flopCR=sortBy(prods,c=>c.purchases/(c.views||1),true).slice(0,5);
  const catTR=cats.reduce((s,c)=>s+c.revenue,0),catTP=cats.reduce((s,c)=>s+c.purchases,0);
  const topCatCR=sortBy(cats,c=>c.purchases/(c.views||1)).slice(0,5),flopCatCR=sortBy(cats,c=>c.purchases/(c.views||1),true).slice(0,5);

  document.getElementById("products-topflop").innerHTML=`<div class="top-flop-grid">
    <div class="top-flop-card top"><h4>🏆 Top 5 Produtos (Receita)</h4><ol>${topR.map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)} (${pct1(c.revenue/tR)})</li>`).join("")}</ol><div class="tf-action"><em>Se</em> concentrarmos 70% do remarketing dinâmico nesses SKUs, <em>então</em> esperamos +12% de ROAS, <em>porque</em> são os cash cows B2C com CR validado.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 Produtos (Receita)</h4><ol>${flopR.map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)} (${pct1(c.revenue/tR)})</li>`).join("")}</ol><div class="tf-action">Avaliar se justificam vitrine. <em>Se</em> a margem não cobrir CAC, considerar bundling ou remoção do destaque.</div></div>
    <div class="top-flop-card top"><h4>🏆 Top 5 Produtos (Conv Rate)</h4><ol>${topCR.map(c=>`<li>${c.name}: ${pct(c.purchases/(c.views||1))}</li>`).join("")}</ol><div class="tf-action"><em>Se</em> aumentarmos a visibilidade (share de views) desses produtos, <em>então</em> esperamos mais conversões com menos budget, <em>porque</em> o CR alto indica que quem vê, compra.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop 5 Produtos (Conv Rate)</h4><ol>${flopCR.map(c=>`<li>${c.name}: ${pct(c.purchases/(c.views||1))}</li>`).join("")}</ol><div class="tf-action"><em>Se</em> revisarmos a PDP (imagens, reviews, pricing) desses SKUs, <em>então</em> esperamos +15% de CR, <em>porque</em> CR baixo com views altas indica que a página não está convertendo intenção em ação.</div></div>
  </div>`;

  document.getElementById("categories-topflop").innerHTML=`<div class="top-flop-grid">
    <div class="top-flop-card top"><h4>🏆 Top Categorias (Receita)</h4><ol>${sortBy(cats,c=>c.revenue).slice(0,5).map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)} (${pct1(c.revenue/catTR)})</li>`).join("")}</ol><div class="tf-action">Fortalecer storytelling e posicionamento dessa categoria — é o carro-chefe B2C.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop Categorias (Receita)</h4><ol>${sortBy(cats,c=>c.revenue,true).slice(0,5).map(c=>`<li>${c.name}: ${fmtMoney(c.revenue)} (${pct1(c.revenue/catTR)})</li>`).join("")}</ol><div class="tf-action"><em>Se</em> criarmos LPs dedicadas por categoria com USPs B2C, <em>então</em> esperamos +20% de CR, <em>porque</em> a LP genérica dilui a proposta de valor.</div></div>
    <div class="top-flop-card top"><h4>🏆 Top Categorias (Conv Rate)</h4><ol>${topCatCR.map(c=>`<li>${c.name}: ${pct(c.purchases/(c.views||1))}</li>`).join("")}</ol><div class="tf-action">Escalar budget nessas categorias — o CR alto indica demanda qualificada.</div></div>
    <div class="top-flop-card flop"><h4>⚠️ Flop Categorias (Conv Rate)</h4><ol>${flopCatCR.map(c=>`<li>${c.name}: ${pct(c.purchases/(c.views||1))}</li>`).join("")}</ol><div class="tf-action"><em>Se</em> reposicionarmos como "complementares" em bundles, <em>então</em> esperamos +25% de vendas, <em>porque</em> sozinhas não geram demanda B2C suficiente.</div></div>
  </div>`;
}

// === 9. ICE Matrix ===
function renderICE(data){
  const f=data.current.funnel,ticket=390;
  const siToPur=f.purchase/(f.add_shipping_info||1),atcToChk=f.begin_checkout/(f.add_to_cart||1);
  const actions=[
    {a:"Carrossel Top Sellers above-the-fold",omtm:"View Item Rate",i:8,c:7,e:9,mrr:Math.round(f.page_view*0.07*0.03*ticket)},
    {a:"Widget Simulação de Parcela no Cart",omtm:"Cart→Checkout Rate",i:9,c:8,e:7,mrr:Math.round(f.add_to_cart*0.15*0.5*ticket)},
    {a:"Pré-qualificação de crédito (API)",omtm:"Purchase Rate",i:9,c:6,e:4,mrr:Math.round(f.add_shipping_info*0.2*0.8*ticket)},
    {a:"Checkout Express (Apple/Google Pay)",omtm:"Mobile CR",i:8,c:9,e:6,mrr:Math.round(data.current.devices[0].sessions*0.0008*ticket)},
    {a:"Auto-fill CEP via GPS",omtm:"Shipping Completion",i:6,c:8,e:8,mrr:Math.round(f.add_personal_info*0.15*0.3*ticket)},
    {a:"WhatsApp Recovery (1h pós-abandono)",omtm:"Checkout Recovery",i:9,c:7,e:8,mrr:Math.round(f.add_shipping_info*0.12*ticket)},
    {a:"Retargeting Meta High-Intent (7d)",omtm:"Retorno + Purchase",i:7,c:8,e:9,mrr:Math.round(data.current.kpis.sessions*0.01*0.25*ticket)},
    {a:"Email Bundle Discount (Multi-Cart)",omtm:"Cart→Checkout",i:7,c:7,e:9,mrr:Math.round(f.add_to_cart*0.05*0.2*ticket)},
    {a:"LCP Optimization (WebP+CDN)",omtm:"Bounce Rate Mobile",i:6,c:9,e:8,mrr:Math.round(data.current.devices[0].sessions*0.04*0.005*ticket)},
    {a:"Nutrição Email pós-primeiro-acesso",omtm:"Lead Morno→Purchase",i:7,c:6,e:7,mrr:Math.round(data.current.kpis.sessions*0.05*0.05*ticket)},
  ].map(x=>({...x,ice:x.i*x.c*x.e})).sort((a,b)=>b.ice-a.ice);

  document.getElementById("ice-intro").innerHTML=`<p><strong>📊 Método ICE:</strong> Cada ação é pontuada de 1-10 em <strong>Impacto</strong> (potencial de resultado), <strong>Confiança</strong> (certeza baseada em dados) e <strong>Facilidade</strong> (esforço de implementação). O score ICE = I × C × E ordena a prioridade de execução. Valores de MRR projetados com ticket de R$${ticket}.</p>`;
  document.getElementById("ice-tbody").innerHTML=actions.map((a,i)=>`<tr><td>${i+1}</td><td><strong>${a.a}</strong></td><td>${a.omtm}</td><td>${a.i}/10</td><td>${a.c}/10</td><td>${a.e}/10</td><td><strong>${a.ice}</strong></td><td>${fmtMoney(a.mrr)}/mês</td></tr>`).join("");
}

// === 10. Growth Projections ===
function renderGrowth(data){
  const cr=data.current.kpis.purchases/(data.current.kpis.sessions||1);
  const rev=data.current.kpis.revenue;const sess=data.current.kpis.sessions;const purch=data.current.kpis.purchases;
  const ticket=390;const days=data.days||30;const monthlyMul=30/days;
  const scenarios=[
    {name:"🔴 Cenário Conservador (+5% CR)",crMod:1.05,sessMod:1.0,desc:"Mantemos o tráfego atual e melhoramos o CR em 5% com otimizações de UX (checkout express, auto-fill)."},
    {name:"🟡 Cenário Moderado (+10% CR, +10% Sessões)",crMod:1.10,sessMod:1.10,desc:"Combinamos otimizações de CRO com aumento moderado de budget em canais validados (Google CPC + Email)."},
    {name:"🟢 Cenário Agressivo (+20% CR, +20% Sessões)",crMod:1.20,sessMod:1.20,desc:"Full throttle: CRO completo + escala de budget + ativação de novos canais (Email, WhatsApp, Retargeting)."},
  ];
  document.getElementById("growth-projections").innerHTML=`<div class="growth-scenarios">${scenarios.map(s=>{
    const newSess=Math.round(sess*s.sessMod*monthlyMul);
    const newCR=cr*s.crMod;
    const newPurch=Math.round(newSess*newCR);
    const newMRR=newPurch*ticket;
    const newRev=Math.round(rev*s.sessMod*s.crMod*monthlyMul);
    const deltaPurch=newPurch-Math.round(purch*monthlyMul);
    const deltaMRR=deltaPurch*ticket;
    return`<div class="growth-card"><h3>${s.name}</h3><p class="growth-desc">${s.desc}</p><div class="growth-metrics"><div class="growth-metric"><span class="growth-metric-label">Sessões/mês</span><span class="growth-metric-value">${fmt(newSess)}</span></div><div class="growth-metric"><span class="growth-metric-label">Conv Rate</span><span class="growth-metric-value">${pct(newCR)}</span></div><div class="growth-metric"><span class="growth-metric-label">Purchases/mês</span><span class="growth-metric-value">${fmtF(newPurch)}</span></div><div class="growth-metric"><span class="growth-metric-label">MRR Projetado</span><span class="growth-metric-value">${fmtMoney(newMRR)}</span></div><div class="growth-metric"><span class="growth-metric-label">Δ Purchases</span><span class="growth-metric-value kpi-delta ${deltaPurch>0?"up":"neutral"}">${deltaPurch>0?"+":""}${fmtF(deltaPurch)}</span></div><div class="growth-metric"><span class="growth-metric-label">Δ MRR</span><span class="growth-metric-value kpi-delta ${deltaMRR>0?"up":"neutral"}">${deltaMRR>0?"+":""}${fmtMoney(deltaMRR)}</span></div></div></div>`;
  }).join("")}</div>`;
}
