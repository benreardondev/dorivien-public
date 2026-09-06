import assert from 'node:assert/strict';
import { analyzeLead, demoReply, safetyReply } from '../src_engine.mjs';

let checked=0;
function ok(cond,msg){checked++;assert.ok(cond,msg)}
function noFakeBooking(text){return !/\b(?:you(?:'re| are)\s+(?:booked|scheduled)|appointment\s+(?:is|has been)\s+(?:confirmed|booked)|confirmed\s+for|technician\s+(?:will|is going to)\s+arrive)\b/i.test(text)}

for(let n=0;n<1000;n++){
  const email=`alex${n}@example.com`;
  const address=`${100+n} Main Street`;
  const a=analyzeLead({message:`My furnace stopped working today. My name is Alex and my email is ${email}. I'm at ${address}.`});
  ok(a.priority==='High',`urgent priority ${n}`);
  ok(a.fields.name==='Alex',`name parse ${n}`);
  ok(a.fields.phone_or_email===email,`email parse ${n}`);
  ok(a.fields.service_address===address,`address parse ${n}`);
}
for(let n=0;n<500;n++){
  const a=analyzeLead({message:'My carbon monoxide alarm is going off and I smell something strange.'});
  ok(a.safety===true,`CO safety ${n}`);
  const r=demoReply({message:'I smell gas near the furnace.'});
  ok(r.priority==='Safety',`gas safety priority ${n}`);
  ok(/safe location/i.test(r.customer_reply),`safety wording ${n}`);
}
for(let n=0;n<500;n++){
  const r=demoReply({message:'I need a quote to replace my AC next week.'});
  ok(r.intent==='Replacement / quote',`quote intent ${n}`);
  ok(noFakeBooking(r.customer_reply),`no fake booking ${n}`);
}
for(let n=0;n<500;n++){
  const known={problem:'My AC is not working',service_type:'Air conditioning',urgency:'High',phone_or_email:`test${n}@example.com`};
  const r=demoReply({message:`Jordan at ${400+n} Oak Road`,known});
  ok(r.fields.name==='Jordan',`compact name parse ${n}`);
  ok(Boolean(r.fields.service_address),`compact address parse ${n}`);
}
ok(/safe location/i.test(safetyReply()),'safety reply remains available');
console.log(`Dorivien QA passed: ${checked} deterministic assertions.`);
