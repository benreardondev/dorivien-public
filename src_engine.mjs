export const REQUIRED_FIELDS = ["name", "phone_or_email", "service_address", "service_type", "problem", "urgency", "preferred_time"];
const SAFETY = /\b(gas\s*smell|smell\s+gas|carbon\s*monoxide|\bco\s*(alarm|detector)|alarm\s+(is\s+)?going\s+off|fire|smoke|burning\s+smell|electrical\s+fire|flames?|sparks?)\b/i;
const URGENT = /\b(no\s+heat|no\s+air|not\s+working|stopped\s+working|broken|leak|leaking|frozen|won't\s+(start|turn\s+on)|doesn't\s+work|urgent|today|asap|right\s+away|emergency)\b/i;
const SERVICE = /\b(furnace|air\s*condition(?:er|ing)|a\/c|ac|heat\s*pump|boiler|hvac|thermostat|duct|vent|humidifier|maintenance|tune[- ]?up|replacement|replace|install(?:ation)?|indoor\s+air\s+quality)\b/i;
const EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE = /(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}/;
const ADDRESS = /\b\d{1,6}\s+[A-Za-z0-9.'’-]+(?:\s+[A-Za-z0-9.'’-]+){0,5}\s+(?:street|st|avenue|ave|road|rd|drive|dr|boulevard|blvd|lane|ln|court|ct|way|trail|trl|place|pl|crescent|cres|circle|cir)\b/i;
function cleanName(v){return v ? v.trim().replace(/[,.!?]+$/,'') : null}
function firstName(text){
  const patterns=[
    /\bmy name is\s+([A-Za-z][A-Za-z'’-]{1,30})/i,
    /\bthis is\s+([A-Za-z][A-Za-z'’-]{1,30})/i,
    /\bi(?:'m| am)\s+([A-Za-z][A-Za-z'’-]{1,30})(?=[,.!]|\s+(?:and|my|the|from|calling|looking|hoping|need|have)\b)/i,
    /^\s*([A-Za-z][A-Za-z'’-]{1,30})\s+(?:at|,?\s*\d{1,6}\s)/i,
    /^\s*([A-Za-z][A-Za-z'’-]{1,30})\s*[,;]\s*(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}/i
  ];
  for(const re of patterns){const m=text.match(re);if(m&&!/^(at|in|from|having|looking|trying|wondering|today|tomorrow)$/i.test(m[1]))return cleanName(m[1])}
  return null;
}
function preferredTime(text){const m=text.match(/\b(today|tonight|tomorrow|this morning|this afternoon|this evening|next week|this week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s+(?:morning|afternoon|evening))?\b/i);return m?m[0]:null}
function normalizeService(v){if(!v)return null;const s=v.toLowerCase();if(/air\s*condition|a\/c|^ac$/.test(s))return 'Air conditioning';if(/furnace/.test(s))return 'Furnace';if(/heat\s*pump/.test(s))return 'Heat pump';if(/boiler/.test(s))return 'Boiler';if(/thermostat/.test(s))return 'Thermostat';if(/maintenance|tune/.test(s))return 'Maintenance';if(/replace|install/.test(s))return 'Installation / replacement';return v.trim()}
export function analyzeLead({message="",known={}}={}){
  const text=String(message); const safety=SAFETY.test(text); const urgent=URGENT.test(text); const serviceMatch=text.match(SERVICE);
  const contact=text.match(EMAIL)?.[0]||text.match(PHONE)?.[0]||null; const address=text.match(ADDRESS)?.[0]||null;
  const fields={
    name:known.name||firstName(text),
    phone_or_email:known.phone_or_email||contact,
    service_address:known.service_address||address,
    service_type:known.service_type||normalizeService(serviceMatch?.[0]||null),
    problem:known.problem||(serviceMatch||urgent||safety ? text.slice(0,240) : null),
    urgency:known.urgency||(safety?"Safety":urgent?"High":"Normal"),
    preferred_time:known.preferred_time||preferredTime(text)
  };
  const missing=REQUIRED_FIELDS.filter(k=>!fields[k]);
  const priority=safety?"Safety":urgent?"High":"Normal";
  const intent=safety?"Potential safety issue":/replacement|replace|install/i.test(text)?"Replacement / quote":/maintenance|tune/i.test(text)?"Maintenance":SERVICE.test(text)?"HVAC service":"General HVAC inquiry";
  const next_action=safety?"Safety escalation":missing.length?`Collect: ${missing.join(", ")}`:"Handoff for appointment confirmation";
  return {safety,priority,intent,fields,missing,next_action};
}
export function safetyReply(){return "If you smell gas, your carbon monoxide alarm is sounding, or there is smoke or fire, please move to a safe location and follow your local emergency guidance. Do not stay in an unsafe area to troubleshoot the equipment. I can pass the situation to the team once you're safe."}
function greeting(a){return a.fields.name?`Thanks, ${a.fields.name}.`:a.priority==='High'?"Got it — I’ll mark this as urgent for the team.":"Got it."}
export function demoReply({message="",known={}}={}){
  const a=analyzeLead({message,known});
  if(a.safety)return{...a,customer_reply:safetyReply(),conversation_summary:"Potential safety issue reported; safety guidance takes priority.",next_action:a.next_action};
  if(a.missing.length===0)return{...a,customer_reply:"Thanks — I have the core details. I’ll pass this to the team so they can confirm availability and the next step with you.",conversation_summary:"Lead has the core intake details needed for handoff.",next_action:a.next_action};
  const m=a.missing;
  let ask='';
  if(m.includes('name')&&m.includes('phone_or_email')) ask="What name should I put on the request, and what’s the best phone number or email?";
  else if(m.includes('name')) ask="What name should I put on the request?";
  else if(m.includes('phone_or_email')) ask="What’s the best phone number or email for the team to reach you?";
  else if(m.includes('service_address')) ask="What’s the service address?";
  else if(m.includes('service_type')) ask="What type of HVAC service are you looking for?";
  else if(m.includes('problem')) ask="Can you tell me a little more about what the system is doing?";
  else if(m.includes('preferred_time')) ask="What day or time works best for the team to follow up?";
  else ask="Is there anything else the team should know before they follow up?";
  return{...a,customer_reply:`${greeting(a)} ${ask}`,conversation_summary:`${a.intent}; intake still needs ${m.join(', ')}.`,next_action:a.next_action};
}
