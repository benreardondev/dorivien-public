const qs=s=>document.querySelector(s),qsa=s=>[...document.querySelectorAll(s)];
const menuButton=qs('#menuButton'),mobileMenu=qs('#mobileMenu');
menuButton?.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
qsa('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
qsa('.reveal').forEach(el=>observer.observe(el));

let known={},history=[];
const chatBody=qs('#chatBody'),input=qs('#chatInput'),form=qs('#chatForm');
const initialMessage='Hi — I can help with HVAC questions, service requests, and getting the right details to the team. What can I help you with?';
function bubble(text,role,extra=''){const d=document.createElement('div');d.className=`bubble ${role} ${extra}`.trim();d.textContent=text;chatBody.appendChild(d);chatBody.scrollTop=chatBody.scrollHeight;return d}
function show(v){return v?String(v):'—'}
function updateLead(data={}){
 const l=data.lead||known||{};
 const map={leadIntent:data.intent||'Waiting for inquiry',leadName:l.name,leadContact:l.phone_or_email,leadAddress:l.service_address,leadService:l.service_type,leadUrgency:l.urgency,leadTime:l.preferred_time};
 Object.entries(map).forEach(([id,val])=>{const el=qs('#'+id);if(el)el.textContent=show(val)});
 const p=qs('#leadPriority');if(p)p.textContent=data.priority||l.urgency||'Normal';
 const n=qs('#leadNext');if(n)n.textContent=data.next_action||'Continue the conversation to build the handoff record.';
}
async function sendMessage(text){
 text=String(text||'').trim();if(!text)return;
 bubble(text,'user');history.push({role:'user',content:text});if(input)input.value='';
 const typing=bubble('Dorivien is responding…','assistant','typing');
 try{
  const r=await fetch('/api/respond',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:text,known,history:history.slice(-10)})});
  const data=await r.json();typing.remove();if(!r.ok)throw new Error(data.error||'Request failed');
  bubble(data.customer_reply||'Thanks — I can help with that.','assistant');
  known={...known,...Object.fromEntries(Object.entries(data.lead||{}).filter(([,v])=>v))};history.push({role:'assistant',content:data.customer_reply||''});
  const mode=qs('#chatMode');if(mode)mode.textContent=(data.mode||'demo').toUpperCase();updateLead(data);
 }catch(e){typing.remove();bubble('The demo is temporarily unavailable. Please try again in a moment.','assistant');}
}
form?.addEventListener('submit',e=>{e.preventDefault();sendMessage(input.value)});
qsa('[data-prompt]').forEach(b=>b.addEventListener('click',()=>sendMessage(b.dataset.prompt)));
qs('#resetDemo')?.addEventListener('click',()=>{known={};history=[];chatBody.innerHTML='';bubble(initialMessage,'assistant');updateLead({});const mode=qs('#chatMode');if(mode)mode.textContent='DEMO';input?.focus();});
fetch('/api/config').then(r=>r.json()).then(c=>{
 if(c.booking_url)qsa('[data-book]').forEach(a=>a.href=c.booking_url);
 const m=qs('#modeText');if(m)m.textContent=c.live_ai?'Live AI is connected to this demo.':'Interactive demo mode — live AI connects after the API key is added.';
 const cm=qs('#chatMode');if(cm)cm.textContent=c.live_ai?'LIVE AI':'DEMO'; const dn=qs('#demoCompanyName');if(dn&&c.business_name)dn.textContent=c.business_name;
}).catch(()=>{const m=qs('#modeText');if(m)m.textContent='Interactive demo mode.'});
