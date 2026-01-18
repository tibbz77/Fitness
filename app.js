// PF Tracker v4 — templates for Week 1 & 2 with core, alternates, video links, copy-last, weight steppers
const APP_KEY = 'pftracker.v1';
const SETTINGS_KEY = 'pftracker.settings.v1';
const PR_KEY = 'pftracker.prs.v1';
const LAST_W_KEY = 'pftracker.lastweights.v1';
const VIDEO_MAP_KEY = 'pftracker.videomap.v1';

// Settings & persisted maps
let workouts = JSON.parse(localStorage.getItem(APP_KEY) || '[]');
let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{"units":"lb","videoChannel":""}');
let prs = JSON.parse(localStorage.getItem(PR_KEY) || '{}');
let lastWeights = JSON.parse(localStorage.getItem(LAST_W_KEY) || '{}');
let videoMap = JSON.parse(localStorage.getItem(VIDEO_MAP_KEY) || '{}');

// Build YouTube link from exercise name or use custom URL
function getVideoUrl(name){
  const key = (name||'').toLowerCase().trim();
  if(videoMap[key]) return videoMap[key];
  const qBase = key + ' proper form gym';
  const q = settings.videoChannel ? `${qBase} ${settings.videoChannel}` : qBase;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

// Two-week plan with primaries, alternates, and core integrated
// For each exercise: {name, sets, reps, alts:[...], core:true?}
const PLAN = [
  { id:'w1-pushA', name:'Week 1 – Push A', exercises:[
    {name:'Smith Machine Bench Press', sets:3, reps:'6–8', alts:['Machine Chest Press','Dumbbell Flat Press']},
    {name:'Seated Shoulder Press (Machine)', sets:3, reps:'8–10', alts:['Dumbbell Shoulder Press','Smith Machine Shoulder Press']},
    {name:'Incline Dumbbell Press', sets:3, reps:'8–10', alts:['Smith Machine Incline Press','Pec Deck + Pushups (superset)']},
    {name:'Cable Lateral Raise', sets:3, reps:'12–15', alts:['Dumbbell Lateral Raise']},
    {name:'Triceps Rope Pressdown', sets:3, reps:'12–15', alts:['Seated Dip Machine','Overhead Cable Extension']},
    // core
    {name:'Pallof Press', sets:3, reps:'12/side', alts:['Standing Band Anti-Rotation'], core:true},
    {name:'Decline Bench Crunch', sets:2, reps:'15', alts:['Ab Machine','Floor Crunch'], core:true},
  ]},
  { id:'w1-pullA', name:'Week 1 – Pull A', exercises:[
    {name:'Lat Pulldown', sets:4, reps:'8–10', alts:['Assisted Pull-Up Machine','Wide-Grip Pulldown']},
    {name:'Seated Cable Row', sets:3, reps:'8–12', alts:['Row Machine','Chest-Supported Row Machine']},
    {name:'Chest-Supported DB Row', sets:3, reps:'8–10', alts:['Smith Machine Bent Row']},
    {name:'Face Pull', sets:3, reps:'12–15', alts:['Rear Delt Fly Machine']},
    {name:'Machine Preacher Curl', sets:3, reps:'10–12', alts:['EZ-Bar Cable Curl','Cable Rope Curl']},
    // core
    {name:'Back Extension', sets:3, reps:'12–15', alts:['Roman Chair','Glute/Back Machine'], core:true},
    {name:'Deadbug', sets:2, reps:'10/side', alts:['Bird-Dog'], core:true},
  ]},
  { id:'w1-legsA', name:'Week 1 – Legs A', exercises:[
    {name:'Leg Press', sets:4, reps:'10', alts:['Leg Press (narrow stance)']},
    {name:'Hamstring Curl', sets:3, reps:'12', alts:['Lying Leg Curl']},
    {name:'Smith Machine Squat', sets:3, reps:'8–10', alts:['Leg Press (heavy)','Goblet Squat']},
    {name:'DB RDL', sets:3, reps:'8–10', alts:['Back Extension Machine']},
    {name:'Calf Raise', sets:3, reps:'12–15', alts:['Leg Press Calf Raises']},
    // core
    {name:'Hanging Knee Raise', sets:3, reps:'10–12', alts:['Captain’s Chair'], core:true},
    {name:'Cable Low-to-High Chop', sets:2, reps:'12/side', alts:['DB Woodchopper'], core:true},
  ]},
  { id:'w2-pushB', name:'Week 2 – Push B', exercises:[
    {name:'Dumbbell Flat Press', sets:3, reps:'10–12', alts:['Smith Machine Incline Press','Machine Chest Press']},
    {name:'Machine Chest Press', sets:3, reps:'12', alts:['Dumbbell Flat Press','Smith Machine Bench Press']},
    {name:'Cable High-to-Low Fly', sets:3, reps:'12–15', alts:['Pec Deck']},
    {name:'Machine Shoulder Press', sets:3, reps:'10–12', alts:['Dumbbell Shoulder Press']},
    {name:'Dumbbell Lateral Raise', sets:3, reps:'15', alts:['Cable Single-Arm Lateral']},
    // core
    {name:'Plank', sets:2, reps:'60 sec', alts:['High Plank'], core:true},
    {name:'Cable Crunch', sets:3, reps:'12–15', alts:['Ab Machine','Weighted Crunch'], core:true},
  ]},
  { id:'w2-pullB', name:'Week 2 – Pull B', exercises:[
    {name:'Close-Grip Lat Pulldown', sets:4, reps:'10–12', alts:['Wide-Grip Pulldown']},
    {name:'Chest-Supported Row Machine', sets:3, reps:'12', alts:['Seated Cable Row']},
    {name:'Straight-Arm Cable Pulldown', sets:3, reps:'12–15', alts:['Dumbbell Pullover']},
    {name:'Rear Delt Fly Machine', sets:3, reps:'15', alts:['Face Pull']},
    {name:'EZ-Bar Cable Curl', sets:3, reps:'12–15', alts:['Machine Biceps Curl','Incline DB Curl']},
    // core
    {name:'Side Plank', sets:2, reps:'30 sec/side', alts:['DB Suitcase Carry 30 sec/side'], core:true},
    {name:'Back Extension (slow)', sets:2, reps:'12', alts:['Reverse Hyper (if available)'], core:true},
  ]},
  { id:'w2-legsB', name:'Week 2 – Legs B', exercises:[
    {name:'Leg Extension', sets:3, reps:'12–15', alts:[]},
    {name:'Smith Machine Front Squat', sets:3, reps:'8–10', alts:['Hack Squat Machine (if available)','Goblet Squat']},
    {name:'Walking Lunges', sets:2, reps:'20 steps', alts:['Smith Split Squat']},
    {name:'Leg Press (Wide)', sets:3, reps:'12', alts:['Goblet Squat']},
    {name:'Hip Abductor Machine', sets:3, reps:'15–20', alts:['Cable Glute Kickback']},
    // core
    {name:'Ab Wheel', sets:2, reps:'8–10', alts:['Stability Ball Rollouts','Kneeling Cable Crunch'], core:true},
    {name:'Cable Anti-Lateral Bend', sets:2, reps:'12/side', alts:['DB Suitcase Hold 20–30 sec/side'], core:true},
  ]},
];

function $(sel){return document.querySelector(sel)}
function $all(sel){return Array.from(document.querySelectorAll(sel))}

// Tabs
$all('.tab').forEach(btn=>btn.addEventListener('click',()=>{
  $all('.tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const id = btn.dataset.tab;
  $all('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(`tab-${id}`).classList.add('active');
  if(id==='progress') renderProgress();
  if(id==='history') renderHistory();
  if(id==='settings') renderVideoMap();
}));

// Populate plan selector
const planSel = $('#planDay');
PLAN.forEach(d=>{ const opt = document.createElement('option'); opt.value = d.id; opt.textContent = d.name; planSel.appendChild(opt); });

// Default date today
$('#date').valueAsNumber = Date.now() - (new Date()).getTimezoneOffset()*60000;

// Build exercise block with alternates and video button
const exList = $('#exerciseList');
function buildExerciseBlock(ex){
  const wrap = document.createElement('div'); wrap.className='card exercise';
  const coreBadge = ex.core? '<span class="badge-core">Core</span>' : '';
  wrap.innerHTML = `
    <header>
      <div class="exercise-title">
        <input class="ex-name" value="${ex.name||''}" placeholder="Exercise name"/>
        ${coreBadge}
        <button class="video-btn" type="button">▶ Video</button>
      </div>
      <button class="ghost del-ex">Delete</button>
    </header>
    <div class="alts"></div>
    <div class="sets"></div>
    <div class="actions">
      <button class="ghost add-set">+ Set</button>
    </div>`;
  const altsDiv = wrap.querySelector('.alts');
  (ex.alts||[]).forEach(a=>{
    const b = document.createElement('button'); b.className='alt-btn'; b.textContent = a;
    b.addEventListener('click',()=>{ wrap.querySelector('.ex-name').value = a; });
    altsDiv.appendChild(b);
  });
  const setsDiv = wrap.querySelector('.sets');
  const defaultSets = ex.sets || 1;
  const lw = lastWeights[(ex.name||'').toLowerCase()] || '';
  for(let i=0;i<defaultSets;i++) addSetRow(setsDiv, ex.reps||10, lw);
  wrap.querySelector('.add-set').addEventListener('click',()=>addSetRow(setsDiv, ex.reps||10, lw));
  wrap.querySelector('.del-ex').addEventListener('click',()=>wrap.remove());
  const videoBtn = wrap.querySelector('.video-btn');
  const nameInput = wrap.querySelector('.ex-name');
  videoBtn.addEventListener('click',()=>{ const url = getVideoUrl(nameInput.value.trim()); window.open(url,'_blank'); });
  return wrap;
}
function addSetRow(setsDiv, reps, weight){
  const row = document.createElement('div'); row.className='set';
  row.innerHTML = `
    <input inputmode="decimal" class="reps" placeholder="Reps" value="${reps}"/>
    <div class="weightWrap">
      <input inputmode="decimal" class="weight" placeholder="Weight (${settings.units})" value="${weight}"/>
      <div class="stepper">
        <button class="step down" type="button">−</button>
        <span class="unit">${settings.units}</span>
        <button class="step up" type="button">+</button>
      </div>
    </div>
    <input inputmode="decimal" class="rpe" placeholder="RPE" />
    <button class="del">Remove</button>`;
  row.querySelector('.del').addEventListener('click',()=>row.remove());
  const wInput = row.querySelector('.weight');
  const step = settings.units==='kg'? 2.5 : 5;
  row.querySelector('.step.up').addEventListener('click',()=>{ const v=parseFloat(wInput.value)||0; wInput.value=(v+step).toString(); });
  row.querySelector('.step.down').addEventListener('click',()=>{ const v=parseFloat(wInput.value)||0; wInput.value=Math.max(0,v-step).toString(); });
  setsDiv.appendChild(row);
}

function loadPlanDay(dayId){
  exList.innerHTML='';
  const day = PLAN.find(d=>d.id===dayId); if(!day) return;
  day.exercises.forEach(ex=>exList.appendChild(buildExerciseBlock(ex)));
}

planSel.addEventListener('change',()=>loadPlanDay(planSel.value));
loadPlanDay(planSel.value || PLAN[0].id);

// Manual add exercise
$('#addExercise').addEventListener('click',()=>{ exList.appendChild(buildExerciseBlock({name:'', sets:1, reps:10, alts:[]})); });

// Copy last workout for this plan
$('#copyLast').addEventListener('click',()=>{
  const planId = planSel.value; if(!planId){ alert('Pick a plan day first.'); return; }
  const last = [...workouts].filter(w=>w.planId===planId).sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
  if(!last){ alert('No previous workout found for this plan.'); return; }
  // Rebuild UI from last entry
  exList.innerHTML='';
  last.exercises.forEach(e=>{
    const blk = buildExerciseBlock({name:e.name, sets:e.sets.length, reps:'', alts:[]});
    // Fill sets
    const setsDiv = blk.querySelector('.sets'); setsDiv.innerHTML='';
    e.sets.forEach(s=>{
      const row = document.createElement('div'); row.className='set';
      row.innerHTML = `
        <input inputmode="decimal" class="reps" placeholder="Reps" value="${s.reps}"/>
        <div class="weightWrap">
          <input inputmode="decimal" class="weight" placeholder="Weight (${settings.units})" value="${s.weight}"/>
          <div class="stepper">
            <button class="step down" type="button">−</button>
            <span class="unit">${settings.units}</span>
            <button class="step up" type="button">+</button>
          </div>
        </div>
        <input inputmode="decimal" class="rpe" placeholder="RPE" value="${s.rpe||''}"/>
        <button class="del">Remove</button>`;
      const wInput = row.querySelector('.weight');
      const step = settings.units==='kg'? 2.5 : 5;
      row.querySelector('.step.up').addEventListener('click',()=>{ const v=parseFloat(wInput.value)||0; wInput.value=(v+step).toString(); });
      row.querySelector('.step.down').addEventListener('click',()=>{ const v=parseFloat(wInput.value)||0; wInput.value=Math.max(0,v-step).toString(); });
      row.querySelector('.del').addEventListener('click',()=>row.remove());
      setsDiv.appendChild(row);
    });
    exList.appendChild(blk);
  });
  alert('Copied last workout ✅');
});

// Save workout
$('#saveWorkout').addEventListener('click',()=>{
  const date = $('#date').value || new Date().toISOString().slice(0,10);
  const planId = planSel.value;
  const notes = $('#notes').value.trim();
  const exercises = [];
  exList.querySelectorAll('.exercise').forEach(exEl=>{
    const name = exEl.querySelector('.ex-name').value.trim();
    const sets = [];
    exEl.querySelectorAll('.set').forEach(s=>{
      const reps = s.querySelector('.reps').value.trim();
      const weight = s.querySelector('.weight').value.trim();
      const rpe = s.querySelector('.rpe').value.trim();
      if(reps || weight || rpe) sets.push({reps, weight, rpe});
    });
    if(name && sets.length) exercises.push({name, sets});
  });
  if(!exercises.length){ alert('Add at least one exercise with sets.'); return; }
  const entry = { id: crypto.randomUUID(), date, planId, notes, units: settings.units, exercises };
  workouts.push(entry);
  localStorage.setItem(APP_KEY, JSON.stringify(workouts));
  // update last weights
  entry.exercises.forEach(e=>{
    let maxW = 0; e.sets.forEach(s=>{ const w = parseFloat((s.weight+'').replace(/[^0-9.]/g,''))||0; if(w>maxW) maxW = w; });
    if(maxW>0) lastWeights[e.name.toLowerCase()] = maxW;
  });
  localStorage.setItem(LAST_W_KEY, JSON.stringify(lastWeights));
  computePRs(entry);
  alert('Saved ✅');
  $('#notes').value='';
});

// History & filters
function renderHistory(){
  const c = $('#historyList'); c.innerHTML='';
  const from = $('#filterFrom').value? new Date($('#filterFrom').value): null;
  const to = $('#filterTo').value? new Date($('#filterTo').value): null;
  const txt = ($('#searchText').value||'').toLowerCase().trim();
  let list = [...workouts].sort((a,b)=>new Date(b.date)-new Date(a.date));
  list = list.filter(w=>{ const d=new Date(w.date); if(from && d<from) return false; if(to && d>to) return false; if(txt){ const hay=(w.notes||'')+' '+w.exercises.map(e=>e.name).join(' '); if(!hay.toLowerCase().includes(txt)) return false;} return true; });
  if(!list.length){ c.innerHTML='<p class="muted">No workouts match.</p>'; return; }
  list.forEach(w=>{
    const card=document.createElement('div'); card.className='card';
    const day = PLAN.find(d=>d.id===w.planId)?.name || 'Custom';
    card.innerHTML = `<h3>${w.date} — ${day}</h3>`;
    const ul = document.createElement('ul'); ul.className='list';
    w.exercises.forEach(e=>{
      const li=document.createElement('li');
      const setsTxt = e.sets.map((s,i)=>`S${i+1}:${s.reps}x${s.weight}${w.units}`).join('  ');
      li.textContent = `${e.name} — ${setsTxt}`; ul.appendChild(li);
    });
    if(w.notes){ const p=document.createElement('p'); p.style.color='#b6b6db'; p.textContent='Notes: '+w.notes; card.appendChild(p); }
    card.appendChild(ul); c.appendChild(card);
  });
}
$('#applyFilters').addEventListener('click',renderHistory);
$('#clearFilters').addEventListener('click',()=>{ $('#filterFrom').value=''; $('#filterTo').value=''; $('#searchText').value=''; renderHistory(); });

// Stats
function startOfWeek(d){ const x=new Date(d); const day=x.getUTCDay(); const diff=(day===0?6:day-1); x.setUTCDate(x.getUTCDate()-diff); x.setUTCHours(0,0,0,0); return x; }
function renderProgress(){
  const dates = new Set(workouts.map(w=>w.date)); let streak=0; let cursor=new Date(); cursor.setHours(0,0,0,0); while(dates.has(cursor.toISOString().slice(0,10))){ streak++; cursor.setDate(cursor.getDate()-1); }
  $('#streakStat').textContent = `${streak} day${streak===1?'':'s'}`;
  const now=new Date(); const weeks=[]; for(let i=5;i>=0;i--){ const dt=new Date(now); dt.setDate(dt.getDate()-i*7); const ws=startOfWeek(dt); const key=ws.toISOString().slice(0,10); const count=workouts.filter(w=>startOfWeek(w.date).toISOString().slice(0,10)===key).length; weeks.push({label:key.slice(5),count}); }
  $('#wkwStat').textContent = (weeks[5]?.count||0);
  const vol=[]; for(let i=5;i>=0;i--){ const dt=new Date(now); dt.setDate(dt.getDate()-i*7); const wkKey=startOfWeek(dt).toISOString().slice(0,10); let total=0; workouts.forEach(w=>{ const wk=startOfWeek(w.date).toISOString().slice(0,10); if(wk!==wkKey) return; w.exercises.forEach(e=>e.sets.forEach(s=>{ const r=parseFloat((s.reps+'').replace(/[^0-9.]/g,''))||0; const wt=parseFloat((s.weight+'').replace(/[^0-9.]/g,''))||0; total+=r*wt; })); }); vol.push({label:wkKey.slice(5), total}); }
  drawBarChart($('#volumeChart'), vol.map(v=>v.label), vol.map(v=>v.total));
  renderPRs();
}
function drawBarChart(canvas, labels, values){ const ctx=canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); const w=canvas.width,h=canvas.height,pad=28; const max=Math.max(10,...values); const bw=(w-pad*2)/values.length-8; ctx.fillStyle='#b6b6db'; ctx.font='12px system-ui'; ctx.strokeStyle='#333364'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(pad,pad); ctx.lineTo(pad,h-pad); ctx.lineTo(w-pad,h-pad); ctx.stroke(); values.forEach((v,i)=>{ const x=pad+i*(bw+8)+8; const y=h-pad-(v/max)*(h-pad*2); const barH=h-pad-y; const grad=ctx.createLinearGradient(0,y,0,y+barH); grad.addColorStop(0,'#6e46ff'); grad.addColorStop(1,'#5b2dd8'); ctx.fillStyle=grad; ctx.fillRect(x,y,bw,barH); ctx.fillStyle='#cfd0ff'; ctx.fillText(labels[i], x, h-pad+14); }); }

// PRs
function computePRs(entry){ entry.exercises.forEach(e=>{ e.sets.forEach(s=>{ const w=parseFloat((s.weight+'').replace(/[^0-9.]/g,''))||0; const r=parseFloat((s.reps+'').replace(/[^0-9.]/g,''))||0; const key=e.name.toLowerCase(); const score=w*(1+r/30); if(!prs[key] || score>prs[key].score){ prs[key]={name:e.name, units:entry.units, weight:w, reps:r, score, date:entry.date}; } }); }); localStorage.setItem(PR_KEY, JSON.stringify(prs)); }
function renderPRs(){ const ul=$('#prList'); ul.innerHTML=''; const items=Object.values(prs).sort((a,b)=>a.name.localeCompare(b.name)); if(!items.length){ ul.innerHTML='<li class="muted">No personal records yet.</li>'; return; } items.forEach(p=>{ const li=document.createElement('li'); li.textContent=`${p.name}: ${p.weight}${p.units} x ${p.reps}  (best ${p.date})`; ul.appendChild(li); }); }

// Units
$all('input[name="units"]').forEach(r=>{ if(r.value===settings.units) r.checked=true; r.addEventListener('change',()=>{ settings.units=r.value; localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); $all('.weight').forEach(i=>i.placeholder=`Weight (${settings.units})`); $all('.unit').forEach(u=>u.textContent=settings.units); }); });

// Video preferences UI
const videoChannelInput = $('#videoChannel'); videoChannelInput.value = settings.videoChannel || '';
videoChannelInput.addEventListener('change',()=>{ settings.videoChannel = videoChannelInput.value.trim(); localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); });
$('#vmAdd').addEventListener('click',()=>{ const n=$('#vmName').value.trim().toLowerCase(); const u=$('#vmUrl').value.trim(); if(!n||!u){ alert('Add both name and URL'); return;} videoMap[n]=u; localStorage.setItem(VIDEO_MAP_KEY, JSON.stringify(videoMap)); $('#vmName').value=''; $('#vmUrl').value=''; renderVideoMap(); });
function renderVideoMap(){ const ul=$('#vmList'); if(!ul) return; ul.innerHTML=''; Object.keys(videoMap).sort().forEach(k=>{ const li=document.createElement('li'); const del=document.createElement('button'); del.textContent='Delete'; del.className='ghost'; del.addEventListener('click',()=>{ delete videoMap[k]; localStorage.setItem(VIDEO_MAP_KEY, JSON.stringify(videoMap)); renderVideoMap(); }); li.innerHTML=`<strong>${k}</strong> → <span style="color:#9fd;">${videoMap[k]}</span>`; li.appendChild(del); ul.appendChild(li); }); if(!Object.keys(videoMap).length){ ul.innerHTML='<li class="muted">No custom links yet. Add one above.</li>'; } }
renderVideoMap();

// Export / Import / Reset
$('#exportData').addEventListener('click',()=>{ const blob=new Blob([JSON.stringify({workouts, settings, prs, lastWeights, videoMap},null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='pf-tracker-data.json'; a.click(); });
$('#importData').addEventListener('change',async(e)=>{ const file=e.target.files[0]; if(!file) return; const txt=await file.text(); try{ const data=JSON.parse(txt); if(data.workouts) {workouts=data.workouts; localStorage.setItem(APP_KEY, JSON.stringify(workouts));} if(data.settings){settings=data.settings; localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); videoChannelInput.value=settings.videoChannel||'';} if(data.prs){prs=data.prs; localStorage.setItem(PR_KEY, JSON.stringify(prs));} if(data.lastWeights){lastWeights=data.lastWeights; localStorage.setItem(LAST_W_KEY, JSON.stringify(lastWeights));} if(data.videoMap){videoMap=data.videoMap; localStorage.setItem(VIDEO_MAP_KEY, JSON.stringify(videoMap));} alert('Imported ✅'); renderHistory(); renderProgress(); renderVideoMap(); }catch(err){ alert('Invalid JSON'); } });
$('#resetData').addEventListener('click',()=>{ if(confirm('Delete all data? This cannot be undone.')){ workouts=[]; prs={}; lastWeights={}; videoMap={}; localStorage.removeItem(APP_KEY); localStorage.removeItem(PR_KEY); localStorage.removeItem(LAST_W_KEY); localStorage.removeItem(VIDEO_MAP_KEY); renderHistory(); renderProgress(); renderVideoMap(); alert('Data cleared'); } });

// A2HS helper
$('#addToHome').addEventListener('click',()=>{ alert('On iPhone: Share ▶︎ Add to Home Screen. Hosting over HTTPS enables full offline install.'); });

// SW
if('serviceWorker' in navigator){ window.addEventListener('load',()=>{ navigator.serviceWorker.register('service-worker.js').catch(()=>{}); }); }
