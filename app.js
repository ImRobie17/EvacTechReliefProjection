/*
 * EvacTech-inspired Relief Projection: STANDALONE DEMO ONLY.
 * No API, no database, no Laravel/PHP, no local storage, no live EvacTech integration.
 * All displayed names/records are synthetic. Rules are illustrative, NOT official DSWD allocations.
 */
'use strict';

const ICONS = {
  building:'<rect x="4" y="4" width="16" height="17" rx="1"/><path d="M9 21v-4h6v4M8 8h1m6 0h1M8 12h1m6 0h1M3 21h18"/>',
  people:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.3a4 4 0 0 1 0 7.4M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  cube:'<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 5v10l9 5 9-5V7M12 12v10"/>',
  download:'<path d="M12 3v12m0 0 5-5m-5 5-5-5M4 17v4h16v-4"/>',
  sliders:'<path d="M4 7h16M7 12h10m-7 5h4"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
  left:'<path d="m14 7-5 5 5 5M9 12h12"/>',
  right:'<path d="m10 7 5 5-5 5M15 12H3"/>',
  map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6ZM9 3v15m6-12v15"/>',
  home:'<path d="m3 10 9-7 9 7v11H3V10ZM9 21v-8h6v8"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  file:'<path d="M6 2h9l5 5v15H6zM14 2v6h6M10 12v6m4-3v3m4-5v5"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m17-9h3m-1.5-1.5v3M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  close:'<path d="M5 5l14 14M19 5 5 19"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  baby:'<circle cx="12" cy="8" r="4"/><path d="M6 20a6 6 0 0 1 12 0M9 3c2 0 3 1 3 2"/>',
  elderly:'<circle cx="12" cy="4" r="2"/><path d="m12 7-4 5 4 3 3-4m-7 1-3 8m7-5v6m3-10 5 9"/>',
  access:'<circle cx="12" cy="4" r="2"/><circle cx="11" cy="17" r="5"/><path d="M12 7v5h6m-6 0-4 2m9 5h4"/>',
  heartPlus:'<path d="M20.8 4.7a5.3 5.3 0 0 0-7.5 0L12 6l-1.3-1.3a5.3 5.3 0 0 0-7.5 7.5L12 21l8.8-8.8a5.3 5.3 0 0 0 0-7.5Z"/>',
  chevron:'<path d="m7 10 5 5 5-5"/>',
  spark:'<path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z"/>'
};
const icon = (name,size=20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.info}</svg>`;
const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nf = n => Number(n).toLocaleString('en-PH');
const shelterDefs = [
  {id:'pagcor',name:'PAGCOR Evacuation Center',barangay:'Banay-Banay',households:30,ffp:50,vulnerable:12},
  {id:'banlic',name:'Banlic Elementary School',barangay:'Banlic',households:45,ffp:55,vulnerable:16},
  {id:'casile',name:'Casile Covered Court',barangay:'Casile',households:28,ffp:30,vulnerable:8},
  {id:'bigaa',name:'Bigaa Covered Court',barangay:'Bigaa',households:52,ffp:60,vulnerable:14},
  {id:'marinig',name:'Marinig Barangay Hall',barangay:'Marinig',households:20,ffp:22,vulnerable:3},
  {id:'sala',name:'Sala Elementary School',barangay:'Sala',households:38,ffp:46,vulnerable:6}
];
const sampleHeads = ['Dela Cruz, Juan','Santos, Maria','Reyes, Ana','Garcia, Leo','Bautista, Mila','Mendoza, Jose'];
const surnames = ['Ramos','Flores','Castillo','Torres','Navarro','Cruz','Villanueva','Lopez','Mercado','Rivera','Gonzales','Domingo','Alvarez','Aquino','Pascual','Ortiz'];
const names = ['Andrea','Miguel','Rosa','Daniel','Elena','Marco','Jasmine','Paolo','Carla','Rafael','Nina','Alex'];
const TYPES = ['infant','toddler','senior','pwd','pregnant','lactating'];
function makePerson(age, vuln=null){return {age, vuln: vuln ? [vuln] : []};}
function seedMembers(count,i){
  const ages = [31+(i%15),29+(i%11),10+(i%7),6+(i%5),14+(i%4),23+(i%12),8,42,19,52,25,12,4];
  return Array.from({length:count},(_,j)=>makePerson(ages[j%ages.length]));
}
function addVulnerability(hh,type){
  const age = {infant:.25,toddler:1.5,senior:71,pwd:40,pregnant:28,lactating:29}[type];
  const idx = hh.members.findIndex(m => m.vuln.length===0);
  if(idx === -1) return;
  hh.members[idx] = makePerson(age,type);
}
function generateHouseholds(shelter,si,startingId){
  const fixed = si === 0 ? [7,5,9,12,3,6] : [];
  const sizes = Array.from({length:shelter.households},(_,i)=>i<fixed.length ? fixed[i] : 2+((i*7+si*3)%4));
  let deficit = shelter.ffp - sizes.reduce((a,n)=>a+Math.ceil(n/5),0);
  // Each added household above 5 adds a single whole FFP, matching the design's city totals.
  for(let i=fixed.length;i<sizes.length && deficit>0;i++){
    sizes[i] = 6 + ((i*3+si)%4);
    deficit--;
  }
  if(deficit !== 0) throw Error('Invalid demo shelter totals');
  const households = sizes.map((size,i)=>({
    id:`HH-${startingId+i}`,head:si===0 && i<sampleHeads.length ? sampleHeads[i] : `${surnames[(startingId+i)%surnames.length]}, ${names[(i*3+si)%names.length]}`,
    shelterId:shelter.id,members:seedMembers(size,i+si*13)
  }));
  let placed = 0;
  if(si===0){
    const samples = [['infant','senior'],['toddler'],['pwd'],['pregnant'],['senior'],['infant']];
    samples.forEach((types,i)=>types.forEach(t=>{addVulnerability(households[i],t);placed++;}));
  }
  for(let j=placed;j<shelter.vulnerable;j++){
    const start = si===0 ? 6 : 0;
    const idx = start + ((j-placed)*3 % (households.length-start));
    addVulnerability(households[idx],TYPES[(j+si*2)%TYPES.length]);
  }
  return households;
}
let nextHH = 1234;
const shelters = shelterDefs.map((s,i)=>{
  const households=generateHouseholds(s,i,nextHH);nextHH+=s.households;
  return {...s,households};
});
const rulesInitial = [
  {id:'diapers',item:'Baby diapers',category:'infant',match:'infant',basis:'person',rate:2,unit:'packs',indicator:'Infant / diaper-use profile',note:'Confirm diaper size and actual usage',verify:false,enabled:true},
  {id:'wipes',item:'Baby wipes',category:'infant',match:'infant',basis:'person',rate:2,unit:'packs',indicator:'Infant / caregiver hygiene',note:'Confirm usage',verify:false,enabled:true},
  {id:'baby-kit',item:'Baby hygiene kit',category:'infant',match:'infant',basis:'household',rate:1,unit:'kit',indicator:'Household with infant',note:'Verify kit contents',verify:false,enabled:true},
  {id:'toddler-wipes',item:'Toddler hygiene supplies',category:'infant',match:'toddler',basis:'person',rate:1,unit:'kits',indicator:'Toddler profile',note:'Confirm age and needs',verify:false,enabled:true},
  {id:'formula',item:'Infant feeding assessment',category:'infant',match:'infant',basis:'assessment',rate:0,unit:'',indicator:'Infant / feeding assessment required',note:'Do not automatically assign formula',verify:true,enabled:true},
  {id:'senior-kit',item:'Senior hygiene kit',category:'senior',match:'senior',basis:'person',rate:1,unit:'kit',indicator:'Senior citizen (60+)',note:'Confirm suitability and need',verify:false,enabled:true},
  {id:'senior-sleep',item:'Sleeping kit',category:'senior',match:'senior',basis:'household',rate:1,unit:'kit',indicator:'Household with senior citizen',note:'Confirm existing kit and needs',verify:false,enabled:true},
  {id:'mobility',item:'Mobility assistance assessment',category:'senior',match:'senior',basis:'assessment',rate:0,unit:'',indicator:'Senior / mobility review',note:'Individual assessment required',verify:true,enabled:true},
  {id:'pwd-kit',item:'Accessible hygiene kit',category:'disability',match:'pwd',basis:'person',rate:1,unit:'kit',indicator:'Person with disability',note:'Assess type of assistance required',verify:false,enabled:true},
  {id:'assistive',item:'Assistive device assessment',category:'disability',match:'pwd',basis:'assessment',rate:0,unit:'',indicator:'PWD / device need assessment',note:'Device type and quantity not auto-predicted',verify:true,enabled:true},
  {id:'maternity',item:'Maternity kit',category:'maternal',match:'pregnant',basis:'person',rate:1,unit:'kit',indicator:'Pregnant individual',note:'Confirm needs and eligibility',verify:false,enabled:true},
  {id:'lactating',item:'Maternal hygiene kit',category:'maternal',match:'lactating',basis:'person',rate:1,unit:'kit',indicator:'Lactating individual',note:'Assess breastfeeding support',verify:false,enabled:true}
];
const categories = [
  {id:'infant',name:'Infant & toddler',short:'Infant & toddler',card:'Infant & toddler',icon:'baby',className:'pink'},
  {id:'senior',name:'Senior citizen',short:'Senior citizen',card:'Senior citizen',icon:'elderly',className:'orange'},
  {id:'disability',name:'Disability support',short:'Disability support',card:'Disability support',icon:'access',className:'green'},
  {id:'maternal',name:'Other / maternal',short:'Other / maternal',card:'Other / maternal',icon:'heartPlus',className:'purple'}
];
const state = {
  view:'overview', shelterId:'pagcor', mode:'all',days:2,citySearch:'',barangay:'all',householdSearch:'',householdPage:1,
  expanded:null,specialMode:'item',category:'infant',specialSearch:'',selectedHH:null,showRules:false,
  rules:rulesInitial.map(r=>({...r}))
};
const app=document.getElementById('app');
let toastTimeout;
function toast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('visible'),3000);}
const packsFor = hh => {
  const eligible = hh.members.filter(p => state.mode==='all' || p.age>0.5).length;
  return {eligible,excluded:hh.members.length-eligible,perPeriod:Math.ceil(eligible/5),packs:Math.ceil(eligible/5)*Math.ceil(state.days/2)};
};
const specialFor = hh => state.rules.filter(r=>r.enabled).flatMap(r=>{
  const count=hh.members.filter(p=>p.vuln.includes(r.match)).length;
  if(!count)return [];
  return [{rule:r,household:hh,qty:r.verify?null:(r.basis==='household'?r.rate:count*r.rate),count,status:r.verify?'Verify first':'Pending'}];
});
const shelterProjection = shelter => {
  const ffp=shelter.households.reduce((sum,h)=>sum+packsFor(h).packs,0);
  const vulnerable=shelter.households.reduce((sum,h)=>sum+h.members.filter(m=>m.vuln.length).length,0);
  const recs=shelter.households.flatMap(specialFor);
  const specialUnits=recs.reduce((sum,r)=>sum+(r.qty||0),0);
  return {ffp,vulnerable,recs,specialUnits};
};
const cityProjection = () => shelters.reduce((acc,s)=>{
  const p=shelterProjection(s);acc.ffp+=p.ffp;acc.vulnerable+=p.vulnerable;acc.households+=s.households.length;acc.specialUnits+=p.specialUnits;return acc;
},{ffp:0,vulnerable:0,households:0,specialUnits:0});
const groupAges = hh => {
  const x=[0,0,0,0,0,0,0];
  hh.members.forEach(p=>{
    const a=p.age;
    const col=a<=.5?0:a<3?1:a<6?2:a<13?3:a<18?4:a<60?5:6;
    x[col]++;
  });return x;
};
const vulnerabilityLabel = t => ({infant:'infant',toddler:'toddler',senior:'senior citizen',pwd:'PWD',pregnant:'pregnant member',lactating:'lactating mother'})[t];
function householdIndicators(h){
  const c={};h.members.forEach(m=>m.vuln.forEach(t=>c[t]=(c[t]||0)+1));
  return Object.entries(c).map(([t,n])=>`${n} ${vulnerabilityLabel(t)}${n>1?'s':''}`).join(' · ')||'No vulnerable group flagged';
}
function nav(){
 const items=[['Dashboard','grid'],['Evacuation Shelters','home'],['Evacuee Profiles','people'],['Relief Distribution','cube'],['Relief Projection','cube'],['System Reports','file'],['User Management','users']];
 return `<aside class="sidebar"><div class="brand"><div class="brand-mark" aria-hidden="true">✚</div><div class="brand-name">Evac<span>Tech</span></div></div><div class="user-meta">CSWD Office<b>Demo Staff</b><span class="demo-flag">${icon('spark',12)} STANDALONE DEMO</span></div><nav class="sidebar-nav" aria-label="Demo navigation">${items.map(([label,ico])=>`<button class="nav-link ${label==='Relief Projection'?'active':''}" data-action="nav" data-target="${esc(label)}" ${label==='Relief Projection'?'aria-current="page"':''}>${icon(ico)}<span>${esc(label)}</span></button>`).join('')}</nav><div class="sidebar-foot">STATIC HTML + CSS + JAVASCRIPT<br/>Synthetic data · Not connected to EvacTech</div></aside>`;
}
function headerActions(){return `<div class="actions"><button class="btn" data-action="export">${icon('download')} Export projection</button><button class="btn" data-action="rules">${icon('sliders')} Rules</button></div>`;}
function notice(){return `<div class="notice">${icon('info',17)}<span><strong>Planning preview only.</strong> Validate household needs before creating any actual special relief request. All data in this demo is fictional.</span></div>`;}
function settingsBar(){return `<div class="controls"><div class="controls-left"><span class="field-name">FFP counting mode</span><div class="segmented" role="group" aria-label="FFP calculation mode"><button class="segment ${state.mode==='all'?'selected':''}" data-action="mode" data-value="all" aria-pressed="${state.mode==='all'}">Include all members</button><button class="segment ${state.mode==='exclude'?'selected':''}" data-action="mode" data-value="exclude" aria-pressed="${state.mode==='exclude'}">Exclude infants (0–6 mo.)</button></div></div><div class="controls-left"><label class="field-name" for="days-select">Planning period</label><select class="select" id="days-select" data-field="days">${[2,3,4,6,7,14].map(d=>`<option value="${d}" ${state.days===d?'selected':''}>${d} day${d===1?'':'s'}</option>`).join('')}</select><span class="inline-note">Conservative 2-day supply per FFP</span></div></div>`;}
function stat(label,num,sub,ico){return `<div class="stat-card"><div class="stat-icon">${icon(ico)}</div><div class="stat-content"><div class="stat-label">${label}</div><div class="stat-value">${nf(num)}</div><div class="stat-hint">${sub}</div></div></div>`;}
function renderOverview(){
 const city=cityProjection();
 const options=[...new Set(shelters.map(s=>s.barangay))];
 const filtered=shelters.filter(s=>(state.barangay==='all'||s.barangay===state.barangay) && `${s.name} ${s.barangay}`.toLowerCase().includes(state.citySearch.toLowerCase()));
 return `<div class="eyebrow">RELIEF MANAGEMENT / City-Wide Overview</div><div class="topline"><div><h1 class="page-title">Shelter Relief Projection</h1><p class="subtitle">Plan family food packs and possible special items using household profiles. No requests are created here.</p></div>${headerActions()}</div>${notice()}${settingsBar()}
 <section class="stats-grid" aria-label="City-wide projection statistics">
 ${stat('Shelters monitored',shelters.length,'Across Cabuyao','building')}
 ${stat('Registered households',city.households,'In listed shelters','people')}
 ${stat('Vulnerable individuals',city.vulnerable,'Unique flagged individuals','heart')}
 ${stat('Possible Family Food Packs Needed',city.ffp,`${state.days}-day planning period`,'cube')}
 </section>
 <section class="panel" aria-labelledby="shelter-list-title"><div class="panel-header"><div><h2 id="shelter-list-title">Shelter list</h2><p>Review projections by shelter. Figures are computed from synthetic household records.</p></div><div class="filter-group"><input id="city-search" type="search" placeholder="Search shelters..." aria-label="Search shelters" value="${esc(state.citySearch)}"/><select id="barangay-filter" class="select" data-field="barangay" aria-label="Filter barangays"><option value="all">All barangays</option>${options.map(o=>`<option ${state.barangay===o?'selected':''} value="${esc(o)}">${esc(o)}</option>`).join('')}</select></div></div><div class="data-table-wrap overview-table-wrap"><table class="table overview-table"><thead><tr><th>BARANGAY</th><th>SHELTER NAME</th><th class="center">HOUSEHOLDS</th><th class="center">Family Food Pack</th><th class="center">Vulnerable Individuals</th><th class="center">Special Item Units*</th><th class="right">ACTION</th></tr></thead><tbody>${filtered.length?filtered.map(s=>{
 const p=shelterProjection(s);return `<tr><td data-label="Barangay"><b>${esc(s.barangay)}</b></td><td data-label="Shelter name" class="name-cell">${esc(s.name)}</td><td data-label="Households" class="number">${s.households.length}</td><td data-label="Family food packs" class="number accent-number">${p.ffp}</td><td data-label="Vulnerable individuals" class="number">${p.vulnerable}</td><td data-label="Suggested special items" class="number">${p.specialUnits}</td><td data-label="Details" class="action-cell"><button class="btn sm subtle" data-action="view" data-id="${s.id}">View projection ${icon('right',13)}</button></td></tr>`;
 }).join(''):'<tr><td colspan="7" class="empty">No shelters match your search.</td></tr>'}</tbody></table></div><div class="panel-footer"><span>Showing ${filtered.length} of ${shelters.length} shelters</span><span>*Suggested, unverified quantities only; assessments excluded</span></div></section>
 <div class="overview-bottom"><section class="mini-panel"><h3>How the food-pack estimate works</h3><p>FFPs are pre-packed. One sealed pack is assigned per group of up to five counted household members for each two-day supply period. Round up <b>per household</b>, then sum across shelters.</p><div class="resource-tags"><span class="resource-tag">1 FFP / up to 5 people</span><span class="resource-tag">2-day baseline</span><span class="resource-tag">${state.mode==='all'?'All members included':'Infants 0–6 months excluded'}</span><span class="resource-tag">No stock movement</span></div></section>
 <section class="mini-panel"><h3>Potential special-item units</h3><p><b>${nf(city.specialUnits)}</b> illustrative units across the city, from active vulnerability-based suggestions. Items requiring individual assessment have no automatic quantity.</p><div class="legend-items"><span class="pill">Suggestions only</span><span class="pill amber">Confirm actual need</span></div></section></div>
 <div class="footer-disclaimer">Academic UI showcase using fabricated records. DSWD-related item labels are examples; the mock projection is not an official CSWD/DSWD allocation.</div>`;
}
function ffpRows(s){
 const term=state.householdSearch.trim().toLowerCase();const households=s.households.filter(h=>`${h.id} ${h.head}`.toLowerCase().includes(term));
 const limit=8,pages=Math.max(1,Math.ceil(households.length/limit)),page=Math.max(1,Math.min(state.householdPage,pages));
 const shown=households.slice((page-1)*limit,page*limit);
 return `<div class="data-table-wrap"><table class="table"><thead><tr><th>Household ID</th><th>Household Head</th><th>Infant<br/>(0–6 mo.)</th><th>Toddler<br/>(7 mo.–2 yrs)</th><th>Pre-school<br/>(3–5 yrs)</th><th>School Age<br/>(6–12 yrs)</th><th>Teen<br/>(13–17 yrs)</th><th>Adult<br/>(18–59 yrs)</th><th>Senior Citizen<br/>(60+ yrs)</th><th>Total</th><th>Needed FFP</th><th>Explain</th></tr></thead><tbody>${shown.length?shown.map(h=>{
 const ages=groupAges(h),p=packsFor(h),expanded=state.expanded===h.id;
 return `<tr><td>${esc(h.id)}</td><td>${esc(h.head)}</td>${ages.map(a=>`<td>${a}</td>`).join('')}<td class="needed">${h.members.length}</td><td class="needed">${p.packs}</td><td><button class="inline-link" data-action="expand" data-id="${h.id}" aria-expanded="${expanded}">${expanded?'Hide':'Why?'}</button></td></tr>${expanded?`<tr><td class="row-explain" colspan="12"><b>${esc(h.id)} calculation:</b> ${h.members.length} registered members ${state.mode==='exclude'?`− ${p.excluded} infant(s) aged 0–6 months`:'(everyone included)'} = <b>${p.eligible} counted</b>. CEILING(${p.eligible} ÷ 5) = <b>${p.perPeriod} FFP(s) per 2-day period</b> × CEILING(${state.days} ÷ 2) = <b>${p.packs} FFP(s)</b>. ${p.eligible===0?'Staff review required because counted members are zero.':''}</td></tr>`:''}`;
 }).join(''):'<tr><td class="empty" colspan="12">No matching households.</td></tr>'}</tbody></table></div>
 <div class="panel-footer"><span>Showing ${shown.length} of ${households.length} households · Rounded individually before totaling</span><div class="pagination"><button class="pagebtn" data-action="page" data-value="${page-1}" ${page<=1?'disabled':''}>← Previous</button>${Array.from({length:pages},(_,i)=>i+1).filter(n=>n===1||n===pages||Math.abs(n-page)<=1).map((n,i,all)=>`${i && n-all[i-1]>1?'<span>…</span>':''}<button class="pagebtn ${n===page?'current':''}" data-action="page" data-value="${n}">${n}</button>`).join('')}<button class="pagebtn" data-action="page" data-value="${page+1}" ${page>=pages?'disabled':''}>Next →</button></div></div>`;
}
function specialCategoryCards(recs){return categories.map(c=>{
 const n=recs.filter(r=>r.rule.category===c.id).reduce((a,r)=>a+(r.qty||0),0);
 return `<button class="category-card ${state.category===c.id && state.specialMode==='item'?'is-selected':''}" data-action="category" data-value="${c.id}"><div class="category-icon ${c.className}">${icon(c.icon,24)}</div><div><div class="category-name">${c.card}</div><div class="category-value">${nf(n)}</div><div class="category-hint">Potential item units</div></div></button>`;
 }).join('');}
function aggregateRecommendations(recs,category){
 const x=new Map();
 for(const rec of recs.filter(r=>r.rule.category===category)){
  const k=rec.rule.id;
  if(!x.has(k))x.set(k,{rule:rec.rule,households:new Set(),qty:0,verification:false});
  const row=x.get(k);row.households.add(rec.household.id);row.qty+=(rec.qty||0);row.verification ||= rec.rule.verify;
 }
 return [...x.values()];
}
function specialByItem(recs){
 const category=categories.find(c=>c.id===state.category);
 const rows=aggregateRecommendations(recs,state.category);
 return `<div class="category-tabs" role="group" aria-label="Filter special items">${categories.map(c=>`<button data-action="category" data-value="${c.id}" class="${state.category===c.id?'selected':''}">${esc(c.name)}</button>`).join('')}</div><section class="panel"><div class="panel-header"><div><h2>${esc(category.name)} · projected items</h2><p>Household profile indicators determine possible assistance, not confirmed demand.</p></div><span class="pill amber">Suggestions, not requests</span></div><div class="data-table-wrap"><table class="table special-table"><thead><tr><th>RELIEF ITEM</th><th>PROFILE INDICATOR</th><th class="center">HOUSEHOLDS</th><th class="center">QTY</th><th>UNIT</th><th class="center">VALIDATION</th></tr></thead><tbody>${rows.length?rows.map(r=>`<tr><td class="name-cell">${esc(r.rule.item)}</td><td>${esc(r.rule.indicator)}</td><td class="number">${r.households.size}</td><td class="number accent-number">${r.verification?'—':nf(r.qty)}</td><td>${esc(r.rule.unit||'Assessment')}</td><td class="center">${r.verification?'<span class="badge-verify">Verify first</span>':'<span class="badge-pending">Pending</span>'}</td></tr>`).join(''):'<tr><td colspan="6" class="empty">No projected items in this category. Turn on the corresponding rules to see suggestions.</td></tr>'}</tbody></table></div><div class="panel-footer">${rows.length} item types · “Verify first” items have no automated quantity</div></section>`;
}
function recommendationsForHousehold(h){
 const recs=specialFor(h);
 return `<div class="recommendations"><div class="recommendation-name">${esc(h.id)} · ${esc(h.head)}</div><div class="mini-label">HOUSEHOLD PROFILE</div><div class="profile-tags">${householdIndicators(h).split(' · ').map((s,i)=>`<span class="pill ${i%2?'amber':''}">${esc(s)}</span>`).join('')}</div><h3 style="font-size:14px;margin:0 0 14px">Recommended special items</h3><div class="rec-grid">${recs.length?recs.map(r=>`<div class="rec-card"><strong>${esc(r.rule.item)}</strong><div class="rec-bottom"><span>${esc(r.rule.note)}</span><em class="${r.rule.verify?'verify':''}">${r.rule.verify?'Verify first':nf(r.qty)+' '+esc(r.rule.unit)}</em></div></div>`).join(''):'<div class="empty-state">No active suggestions for this household.</div>'}</div></div>`;
}
function specialByHousehold(s){
 const term=state.specialSearch.trim().toLowerCase();
 const rows=s.households.filter(h=>specialFor(h).length>0 && `${h.id} ${h.head} ${householdIndicators(h)}`.toLowerCase().includes(term));
 const selected=rows.find(h=>h.id===state.selectedHH)||rows[0];
 return `<section class="panel"><div class="panel-header"><div><h2>Household-based recommendations</h2><p>Select a household to see exactly which profile indicators triggered each suggestion.</p></div><div class="filter-group"><input id="special-search" type="search" value="${esc(state.specialSearch)}" placeholder="Search household ID or head" aria-label="Search special recommendations"/></div></div><div class="data-table-wrap"><table class="table special-table"><thead><tr><th>HOUSEHOLD ID</th><th>HOUSEHOLD HEAD</th><th>PROFILE INDICATORS</th><th>SUGGESTED ITEM TYPES</th><th class="center">STATUS</th><th>ACTION</th></tr></thead><tbody>${rows.length?rows.map(h=>{
 const rec=specialFor(h),isSelected=selected && h.id===selected.id;
 return `<tr class="household-row ${isSelected?'active':''}" data-action="household" data-id="${h.id}"><td>${esc(h.id)}</td><td>${esc(h.head)}</td><td>${esc(householdIndicators(h))}</td><td>${esc([...new Set(rec.map(r=>r.rule.item))].slice(0,3).join(', '))}${rec.length>3?'…':''}</td><td class="center"><span class="badge-verify">${rec.some(r=>r.rule.verify)?'Needs review':'Pending'}</span></td><td><button class="btn sm subtle" data-action="household" data-id="${h.id}">View</button></td></tr>`;
 }).join(''):'<tr><td colspan="6" class="empty">No matching households with recommendations.</td></tr>'}</tbody></table></div><div class="panel-footer">Showing ${rows.length} households with one or more potential special needs</div>${selected?recommendationsForHousehold(selected):''}</section>`;
}
function renderDetails(){
 const s=shelters.find(s=>s.id===state.shelterId)||shelters[0],p=shelterProjection(s);
 const c=cityProjection();
 return `<div class="eyebrow">RELIEF MANAGEMENT / SHELTER</div><div class="topline"><div><h1 class="page-title">${esc(s.name)}</h1><p class="subtitle">Brgy. ${esc(s.barangay)} · Projection based on ${s.households.length} registered households</p></div><div class="actions"><button class="btn" data-action="back">${icon('left')} Back to shelters</button>${headerActions()}</div></div>
 <section class="shelter-profile"><div class="shelter-intro"><div class="stat-icon">${icon('building',24)}</div><div><div class="smallcaps">SHELTER PROFILE</div><h2>${esc(s.name)}</h2><div class="shelter-location">⌖ Brgy. ${esc(s.barangay)}, Cabuyao City</div></div></div><div class="profile-numbers"><div class="profile-count"><small>Households</small><strong>${s.households.length}</strong></div><div class="profile-count"><small>Projected Family Food<br/>Packs Needed</small><strong>${p.ffp}</strong></div><div class="profile-count"><small>Vulnerable Individuals</small><strong>${p.vulnerable}</strong></div></div></section>
 <div class="detail-tabs"><button class="btn active-tab" data-action="jump" data-id="food-section">${icon('cube',17)} Food pack breakdown</button><button class="btn" data-action="jump" data-id="special-section">${icon('heart',17)} Special item projection</button></div>
 ${settingsBar()}
 <section id="food-section"><div class="section-head"><div><h2>Food Packs Per Household Breakdown</h2><p>Per-household rounding explains the shelter's FFP total.</p></div><div class="filter-group"><input id="household-search" type="search" placeholder="Search Household ID or Head" aria-label="Search food pack households" value="${esc(state.householdSearch)}"/></div></div><div class="panel wide-panel">${ffpRows(s)}</div>
 <div class="recipe-panel"><h3>Inside a reference Family Food Pack</h3><div class="recipe-contents"><span>Rice · 6 kg</span><span>Canned tuna flakes · 4 cans</span><span>Canned corned beef · 4 cans</span><span>Canned sardines · 2 cans</span><span>Instant coffee · 5 sachets</span><span>Chocolate malt drink · 5 sachets</span></div><p class="foot-note">Reference composition for presentation only. EvacTech projects <b>sealed food packs</b>, not individual ingredient stocks. Drinking water is separately supplied; it is not counted as part of the standard FFP here. Check local packaging for changes.</p></div></section>
 <section id="special-section"><div class="special-title"><h2>Possible Special Items Needed</h2><span class="meta-pill">${icon('info',14)} Planning suggestions only</span></div>${notice()}<div class="special-summary">${specialCategoryCards(p.recs)}</div><div class="switcher" role="group" aria-label="Special item view"><button class="${state.specialMode==='item'?'selected':''}" data-action="specialMode" data-value="item" aria-pressed="${state.specialMode==='item'}">By relief item</button><button class="${state.specialMode==='household'?'selected':''}" data-action="specialMode" data-value="household" aria-pressed="${state.specialMode==='household'}">By household</button></div>${state.specialMode==='item'?specialByItem(p.recs):specialByHousehold(s)}</section>
 <div class="info-box">All projections use <b>${state.mode==='all'?'all members':'members excluding infants aged 0–6 months'}</b> for FFP counts over <b>${state.days} days</b>. Vulnerability suggestions always consider the entire household profile, even when infants are excluded from the food-pack calculation. ${s.name} represents ${Math.round(p.ffp/Math.max(1,c.ffp)*100)}% of the city’s projected FFPs.</div><div class="footer-disclaimer">Dummy records and rule estimates only. No requests are created and no inventory is modified.</div>`;
}
function rulesModal(){return !state.showRules?'':`<div class="modal-backdrop" data-action="overlay"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="rules-title"><div class="modal-head"><div><h2 id="rules-title">Special Relief Suggestion Rules</h2><p>Test hypothetical item rates for this session only. These are not DSWD prescribed allocation quantities.</p></div><button class="btn icon-only" data-action="closeRules" aria-label="Close rules">${icon('close')}</button></div><div class="modal-body"><div class="info-box"><b>How this works:</b> If a household matches a profile indicator, a rule estimates units per eligible person or per eligible household. Assessment-only rules deliberately produce no quantity. All outputs require human validation.</div><div class="rule-list">${state.rules.map(r=>`<div class="rule-line"><input class="rule-toggle" aria-label="Enable ${esc(r.item)}" type="checkbox" data-rule="${r.id}" ${r.enabled?'checked':''}/><div><b>${esc(r.item)}</b><div class="rule-desc">${esc(r.indicator)} · ${r.basis==='person'?'Per eligible person':r.basis==='household'?'Per eligible household':'Assessment only'}</div></div>${r.verify?'<span class="unit">Review only</span>':`<input type="number" class="rule-rate" aria-label="Quantity rate for ${esc(r.item)}" data-rule="${r.id}" min="1" max="20" step="1" value="${r.rate}"/>`}<span class="unit">${esc(r.unit||'No qty')}</span></div>`).join('')}</div></div><div class="modal-footer"><button class="btn" data-action="resetRules">Reset demo rules</button><button class="btn primary" data-action="closeRules">${icon('check')} Apply and close</button></div></section></div>`;}
function paint(){
 // Preserve text-field focus and caret while filtering immediately.
 const prev=document.activeElement;
 const fieldId=prev && prev.id;
 let selection=null;
 try {if(prev && typeof prev.selectionStart==='number')selection=[prev.selectionStart,prev.selectionEnd];}catch(_){}
 app.innerHTML=`<div class="app">${nav()}<main class="content">${state.view==='overview'?renderOverview():renderDetails()}</main>${rulesModal()}</div>`;
 if(fieldId){const next=document.getElementById(fieldId);if(next){next.focus({preventScroll:true});if(selection)try{next.setSelectionRange(...selection);}catch(_){}}}
}
function csvEscape(v){return `"${String(v??'').replace(/"/g,'""')}"`;}
function exportCSV(){
 let rows,filename;
 const mode=state.mode==='all'?'All members':'Exclude infants (0-6 months)';
 if(state.view==='overview'){
  rows=[['Shelter Relief Projection — DEMO DATA'],['Planning days',state.days],['Counting mode',mode],[],['Barangay','Shelter','Households','FFP required','Vulnerable individuals','Suggested item units']];
  shelters.forEach(s=>{const p=shelterProjection(s);rows.push([s.barangay,s.name,s.households.length,p.ffp,p.vulnerable,p.specialUnits]);});
  const c=cityProjection();rows.push(['TOTAL','',c.households,c.ffp,c.vulnerable,c.specialUnits]);filename='shelter-projection-city-demo.csv';
 } else {
  const s=shelters.find(s=>s.id===state.shelterId);
  rows=[['Shelter Projection — DEMO DATA'],['Shelter',s.name],['Planning days',state.days],['Counting mode',mode],[],['Household ID','Head','Members','Counted members','Excluded infants','FFP per 2-day period','Projected FFP','Vulnerability indicators']];
  s.households.forEach(h=>{const p=packsFor(h);rows.push([h.id,h.head,h.members.length,p.eligible,p.excluded,p.perPeriod,p.packs,householdIndicators(h)]);});
  rows.push([],['Special item suggestions: review before any real request'],['Household ID','Item','Profile condition','Estimated quantity','Unit','Validation']);
  s.households.flatMap(specialFor).forEach(r=>rows.push([r.household.id,r.rule.item,r.rule.indicator,r.qty??'Needs assessment',r.rule.unit,r.status]));
  filename=`shelter-projection-${s.id}-demo.csv`;
 }
 const csv='\ufeff'+rows.map(row=>row.map(csvEscape).join(',')).join('\r\n');
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('CSV file exported with demo projection data.');
}
function switchView(view,id){state.view=view;if(id)state.shelterId=id;state.householdSearch='';state.specialSearch='';state.householdPage=1;state.selectedHH=null;state.expanded=null;paint();window.scrollTo({top:0,behavior:'instant'});}
document.addEventListener('click',event=>{
 const target=event.target.closest('[data-action]');if(!target)return;
 const {action,id,value}=target.dataset;
 if(action==='overlay' && event.target!==target)return;
 switch(action){
  case 'nav':if(target.dataset.target==='Relief Projection')switchView('overview');else toast('Only Relief Projection is interactive in this standalone demo.');break;
  case 'view':switchView('details',id);break;
  case 'back':switchView('overview');break;
  case 'export':exportCSV();break;
  case 'rules':state.showRules=true;paint();break;
  case 'closeRules':case 'overlay':state.showRules=false;paint();break;
  case 'mode':state.mode=value;state.householdPage=1;paint();break;
  case 'page':state.householdPage=Number(value);paint();break;
  case 'expand':state.expanded=state.expanded===id?null:id;paint();break;
  case 'specialMode':state.specialMode=value;paint();break;
  case 'category':state.category=value;state.specialMode='item';paint();break;
  case 'household':state.selectedHH=id;paint();break;
  case 'resetRules':state.rules=rulesInitial.map(r=>({...r}));paint();toast('Illustrative rules reset.');break;
  case 'jump':document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});break;
 }
});
document.addEventListener('input',event=>{
 const id=event.target.id;
 if(id==='city-search'){state.citySearch=event.target.value;paint();}
 if(id==='household-search'){state.householdSearch=event.target.value;state.householdPage=1;paint();}
 if(id==='special-search'){state.specialSearch=event.target.value;paint();}
});
document.addEventListener('change',event=>{
 const el=event.target;
 if(el.dataset.field==='days'){state.days=Number(el.value);paint();}
 if(el.dataset.field==='barangay'){state.barangay=el.value;paint();}
 if(el.classList.contains('rule-toggle')){const rule=state.rules.find(r=>r.id===el.dataset.rule);if(rule)rule.enabled=el.checked;paint();}
 if(el.classList.contains('rule-rate')){const rule=state.rules.find(r=>r.id===el.dataset.rule);if(rule)rule.rate=Math.max(1,Math.min(20,Number(el.value)||1));paint();}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape' && state.showRules){state.showRules=false;paint();}});
paint();
// Test helper for automated smoke tests (does not affect the displayed UI).
window.__reliefDemo={shelters,state,cityProjection,shelterProjection,packsFor,specialFor};
