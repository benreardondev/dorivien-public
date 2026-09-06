let known={},history=[];
const params=new URLSearchParams(location.search);
let company=(params.get('company')||'Demo HVAC Company').slice(0,80);
const accent=params.get('accent');
if(/^#[0-9a-f]{6}$/i.test(accent||''))document.documentElement.style.setProperty('--accent',accent);
const companyEl=document.getElementById('company');
if(companyEl)companyEl.textContent=company;
const b=document.getElementById('body'),f=document.getElementById('form'),i=document.getElementById('input');
function add(t,c){const d=document.createElement('div');d.className='msg '+c;d.textContent=t;b.appendChild(d);b.scrollTop=b.scrollHeight;return d}
fetch('/api/config').then(r=>r.json()).then(c=>{
  if(c.app_mode==='production'&&c.business_name){company=c.business_name.slice(0,80);if(companyEl)companyEl.textContent=company;}
}).catch(()=>{});
f.addEventListener('submit',async e=>{
  e.preventDefault();const m=i.value.trim();if(!m)return;add(m,'user');i.value='';history.push({role:'user',content:m});const t=add('Responding…','assistant typing');
  try{
    const r=await fetch('/api/respond',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:m,known,history:history.slice(-10)})});
    const d=await r.json();t.remove();if(!r.ok)throw new Error(d.error||'Request failed');add(d.customer_reply||'Thanks — I can help with that.','assistant');known={...known,...Object.fromEntries(Object.entries(d.lead||{}).filter(([,v])=>v))};history.push({role:'assistant',content:d.customer_reply||''});
  }catch{t.classList.remove('typing');t.textContent='The assistant is temporarily unavailable. Please try again.';}
});
