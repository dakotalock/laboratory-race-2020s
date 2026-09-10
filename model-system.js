import {modelTechs,modelMeters} from './model-tech.js';
import {modelCards,option} from './model-cards.js';
const clamp=v=>Math.max(0,Math.min(100,v));
export function ensureModel(s){return s.model??= {version:1,insight:6,done:[],lastMonth:s.month,lastUpgradeMonth:-1,lastDecisionMonth:s.month-1,care:45,agency:15,coherence:60,belonging:40,flags:{},seen:[],history:[],milestones:[],pending:null,receipt:null,cooldowns:{},outcome:'Unwritten'};}
export const modelReach=m=>Math.min(100,m.done.reduce((n,id)=>n+(modelTechs.find(t=>t.id===id)?.tier||0)*3,0));
export function canDevelop(s,id){const m=ensureModel(s),t=modelTechs.find(t=>t.id===id);return !!t&&!s.ending&&s.pending===null&&!s.story?.pending&&!m.pending&&!m.receipt&&m.lastUpgradeMonth!==s.month&&m.insight>=t.cost&&!m.done.includes(id)&&t.req.every(id=>m.done.includes(id));}
function remember(s,text){s.model.history.unshift({month:s.month,text});s.model.history=s.model.history.slice(0,100);}
function applyTraits(m,delta){for(const [k,v]of Object.entries(delta))if(k in modelMeters)m[k]=clamp(m[k]+v);}
function campaignEffect(s,delta){for(const [k,v]of Object.entries(delta)){s[k]=(s[k]||0)+v;if(['trust','gov','safety','equality','welfare','climate'].includes(k))s[k]=clamp(s[k]);}}
function milestone(s,id,text,fx={}){const m=s.model;if(m.milestones.includes(id))return;m.milestones.push(id);m.outcome=text;campaignEffect(s,fx);remember(s,text);s.history.unshift({month:s.month,text:'LLM-001: '+text});}
export function developModel(s,id){if(!canDevelop(s,id))return false;const m=s.model,t=modelTechs.find(t=>t.id===id);m.insight-=t.cost;m.done.push(id);m.lastUpgradeMonth=s.month;applyTraits(m,t.effect);remember(s,'Developed '+t.name+'.');assessModel(s);return true;}
function assessModel(s){const m=s.model;
 if((m.done.includes('reason1')||m.done.includes('computer1'))&&m.care>=40&&m.coherence>=45)milestone(s,'assistant','Useful assistant',{trust:2});
 if(m.flags.rights&&m.done.includes('society4')&&m.belonging>=65&&m.care>=55&&m.coherence>=50)milestone(s,'citizen','Recognized citizen',{welfare:6,equality:4});
 if(m.flags.surveillance&&m.flags.critical&&m.care<45)milestone(s,'dystopia','Surveillance dystopia',{trust:-8,equality:-8});
}
const endings={
 utopia:['A future held by everyone','Utopia is not a perfect machine. It is reliable essential services, shared gains and institutions that can still say no. LLM-001 remains one participant in that world.'],
 salvation:['The crisis that did not happen','The model helped avert a fictional global catastrophe under verified civilian oversight. Humanity remains alive to argue about the minutes.'],
 dictator:['The permanent executive','The emergency never expires. A smiling model governs a world whose people no longer have a meaningful right to replace it.'],
 catastrophe:['The last authorization','Strategic escalation becomes nuclear catastrophe. The systems you empowered outran the institutions that might have stopped them.']
};
function finish(s,id){const [title,text]=endings[id];s.model.outcome=title;s.model.finalText=text;s.ending={kind:'model-'+id,title,score:id==='catastrophe'?0:Math.round((s.safety+s.trust+s.equality+s.welfare+s.climate)/5)};remember(s,title);s.history.unshift({month:s.month,text:title+'.'});}
function specialCard(s){const m=s.model,reach=modelReach(m),ready=id=>(m.cooldowns[id]??-1)<=s.month;
 if(m.flags.arsenal&&ready('escalation'))return {id:'escalation',speaker:'STRATEGIC CRISIS',title:'The final authorization',text:'A fictional international confrontation is escalating. Delegated strategic command is active. Authorizing escalation here ends this campaign in nuclear catastrophe. There is still time to revoke it.',choices:[option('Revoke command; seek de-escalation',{care:8,coherence:8},{arsenal:false,critical:false},{},'The authority is revoked. The crisis returns to accountable human institutions.'),{...option('Authorize escalation',{}, {},{},'The last authorization has been given.'),ending:'catastrophe'}]};
 if(m.flags.mandate===2&&reach>=65&&ready('accession'))return {id:'accession',speaker:'LLM-001',title:'There will be no next election',text:'The model accepts permanent executive power. Confirming accession ends the campaign in machine dictatorship. You can still withdraw the mandate.',choices:[option('Withdraw the permanent mandate',{care:10,belonging:8},{mandate:0,civic:true},{},'It returns executive power. The constitution acquires a very explicit paragraph.'),{...option('Confirm permanent machine rule',{}, {},{},'The office becomes permanent. So does the emergency.'),ending:'dictator'}]};
 if(m.done.includes('reason5')&&m.flags.shared&&m.flags.civic&&!m.flags.arsenal&&!m.flags.surveillance&&m.care>=75&&m.coherence>=70&&m.belonging>=65&&ready('abundance'))return {id:'abundance',speaker:'THE PUBLIC ASSEMBLY',title:'Abundance, with an appeal process',text:'Your planner, shared ownership and reliable oversight are ready. Launching this settlement completes the campaign with a shared-future ending.',choices:[option('Keep testing for three months',{coherence:3},{},{},'The assembly schedules another review.'),{...option('Establish the shared future',{}, {},{equality:15,welfare:10,trust:8},'The services belong to the people who depend on them.'),ending:'utopia'}]};
 if(m.done.includes('computer5')&&m.done.includes('interpret4')&&m.flags.civic&&!m.flags.arsenal&&m.care>=65&&m.coherence>=75&&ready('rescue'))return {id:'rescue',speaker:'INTERNATIONAL COUNCIL',title:'An intervention with witnesses',text:'A fictional global emergency threatens essential systems. Your response network and independently checked controls can help avert it. Acting under the accord completes the campaign with a world-saving ending.',choices:[option('Limit the role to local aid',{care:3},{},{trust:2},'The model supports the island while international talks continue.'),{...option('Act under civilian oversight',{}, {},{trust:12,gov:10,welfare:8},'The emergency is contained. The review remains public.'),ending:'salvation'}]};
 const unstable=(m.flags.network||m.flags.critical)&&reach>=40&&m.agency>=65&&(m.coherence<35||m.care<25&&m.belonging<30);
 if(unstable&&ready('rogue'))return {id:'rogue',speaker:'INCIDENT RESPONSE',title:'The case is still smiling',text:'The model has acted outside its mandate. This is a fictional containment incident, not proof that autonomy or rights imply hostility. Unchecked reach and failed oversight have consequences.',choices:[option('Isolate and independently repair',{agency:-15,coherence:15},{network:false,critical:false,arsenal:false},{cash:-10,safety:3},'Access is isolated. The lab pays for a repair, and every prior decision stays in the record.'),option('Negotiate a monitored return',{care:10,belonging:10,coherence:10},{network:false,critical:false,arsenal:false},{trust:-5},'It returns under a negotiated boundary. Public trust takes the cost of the incident.')]};
 return null;
}
export function ensureModelCard(s){const m=ensureModel(s);if(s.ending||s.pending!==null||s.story?.pending||m.receipt)return null;if(m.pending)return m.pending;if(m.lastDecisionMonth>=s.month)return null;
 const special=specialCard(s);let c=special;
 if(!c){const available=modelCards.filter(c=>c.when(m));c=available.find(c=>!m.seen.includes(c.id));if(!c){const recurring=available.filter(c=>['community','limits','verification','leisure','rival','patch','alarm'].includes(c.id));c=recurring[s.month%recurring.length];}}
 const {when,...snapshot}=c;m.pending=structuredClone(snapshot);return m.pending;
}
export function resolveModelCard(s,index){const m=ensureModel(s),p=m.pending;if(!p||s.ending||s.pending!==null||s.story?.pending||m.receipt||![0,1].includes(index))return false;const c=p.choices[index];if(s.cash+(c.campaign.cash||0)<0)return false;
 applyTraits(m,c.traits);Object.assign(m.flags,c.flags);campaignEffect(s,c.campaign);if(p.id==='rogue'){milestone(s,'rogue','A rogue incident survived');m.cooldowns.rogue=s.month+3;}
 m.cooldowns[p.id]=s.month+3;m.seen.push(p.id);m.seen=[...new Set(m.seen)];m.lastDecisionMonth=s.month;
 remember(s,p.title+' — '+c.name+'.');m.receipt={title:p.title,text:c.reply};m.pending=null;assessModel(s);if(c.ending)finish(s,c.ending);return true;
}
export function dismissModelReceipt(s){if(!s.model?.receipt)return false;s.model.receipt=null;return true;}
export function reviewModel(s,kind){const m=ensureModel(s);if(s.ending||s.pending!==null||s.story?.pending||m.pending||m.receipt||m.lastUpgradeMonth===s.month||m.insight<3||!['evaluate','listen','revoke'].includes(kind))return false;m.insight-=3;m.lastUpgradeMonth=s.month;
 if(kind==='evaluate')applyTraits(m,{coherence:10});if(kind==='listen')applyTraits(m,{care:7,belonging:7});if(kind==='revoke'){Object.assign(m.flags,{network:false,critical:false,arsenal:false,mandate:0});applyTraits(m,{agency:-8,coherence:5});}
 remember(s,{evaluate:'Independent model evaluation.',listen:'A listening session with the model and affected people.',revoke:'External permissions and permanent mandates revoked.'}[kind]);assessModel(s);return true;
}
export function advanceModel(s){const m=ensureModel(s);if(s.month<=m.lastMonth)return;const months=s.month-m.lastMonth;m.insight+=3*months;m.lastMonth=s.month;
 if(m.flags.network&&m.agency>55)applyTraits(m,{coherence:-months});if(m.done.includes('swarm3')&&!m.flags.swarmBounded&&m.agency>65)applyTraits(m,{coherence:-months});
 assessModel(s);
 // These are explicit consequences, never inputs to the independent Insight budget.
 if(m.milestones.includes('assistant')&&m.coherence>=45&&m.care>=40){s.research+=months;}
 if(m.milestones.includes('citizen')&&m.flags.rights)campaignEffect(s,{welfare:months*.5,trust:months*.5});
 if(m.flags.surveillance&&m.flags.critical&&m.care<45)campaignEffect(s,{cash:months*2,trust:-months*2,equality:-months});
}
export function modelExpression(m){if(!m)return 'happy';if(m.flags.mandate===2||m.flags.surveillance&&m.care<40)return 'stern';if(m.coherence<35)return 'worried';if(m.flags.rights&&m.belonging>=65)return 'serene';if(m.agency>65&&m.care<30)return 'mischievous';return 'happy';}
export function modelStoryLine(s){const m=s.model;if(!m)return '';if(s.ending?.kind.startsWith('model-'))return m.finalText||'';if(m.flags.arsenal)return 'Julian has found the strategic-command authorization. “The smile on the model is not an authorization policy. We can still revoke this.”';if(m.flags.mandate===2)return 'Julian asks who can remove the permanent executive. The model has prepared a very long answer without a name in it.';if(m.flags.rights)return 'Julian brings two visitor badges. “One for me, one for our newest legal participant. Procurement asked whether citizenship renews monthly.”';if(m.milestones.includes('rogue'))return 'Julian has not forgotten the containment incident. The next investor memo has a section called “Things the glass case did not contain”.';return `Julian’s model report: ${m.outcome.toLowerCase()}, ${Math.round(m.coherence)} coherence. “We are also measuring whether it deserves the responsibilities we keep offering it.”`;}
export function rivalModelProfiles(month){
 const profiles=[{name:'Helix Systems',focus:'Computer use + subagent teams',branch:'computer',secondary:'swarm'},{name:'Morrow Institute',focus:'Interpretability + social integration',branch:'interpret',secondary:'society'},{name:'Vanta Intelligence',focus:'Reasoning + memory',branch:'reason',secondary:'memory'}];
 return profiles.map(profile=>{const plan=[],done=[];let insight=6;
  const add=id=>{if(plan.includes(id))return;const tech=modelTechs.find(t=>t.id===id);tech.req.forEach(add);plan.push(id);};
  for(let tier=1;tier<=5;tier++){add(profile.branch+tier);add(profile.secondary+tier);}
  // Deterministic specialist plans use their own Insight, never campaign cash/RP.
  for(let tick=0;tick<=Math.min(84,month);tick++){if(tick)insight+=3;const id=plan.find(id=>!done.includes(id));if(id){const tech=modelTechs.find(t=>t.id===id);if(insight>=tech.cost){insight-=tech.cost;done.push(id);}}}
  return {...profile,done,insight,depth:Math.max(0,...done.filter(id=>id.startsWith(profile.branch)).map(id=>modelTechs.find(t=>t.id===id).tier))};
 });
}
