import {effect,log} from './engine.js';
import {chapters} from './story-chapters.js';
const routes=['commons','empire','accord'];
const routeNames={commons:'THE COMMONS',empire:'THE EMPIRE',accord:'THE ACCORD'};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function storyRoute(s){
 const scores={...s.story.scores};
 scores.commons+=(s.policies.purpose==='public'?2:0)+(s.policies.release==='open'?1:0);
 scores.empire+=(s.policies.purpose==='profit'?2:0)+(s.policies.pace==='sprint'?1:0);
 scores.accord+=(s.policies.pace==='careful'?2:0)+(s.safety>=65?1:0);
 return routes.reduce((best,r)=>scores[r]>scores[best]?r:best,routes[0]);
}
const followup={commons:'The residents now have a funded voice in the project. Julian has started attending meetings where he cannot buy the deciding vote.',empire:'The commercial team gets its mandate. Julian’s next board pack is thicker; the section on who can say no is thinner.',accord:'Independent reviewers now have a role in the project. Julian acquires another calendar invite and, reluctantly, a little hope.'};
function choices(names,q){return routes.map((route,i)=>({id:route,name:names[i],
 effect:i===0?{cash:-4,trust:3,equality:4,welfare:2}:i===1?{cash:8,research:6,equality:-3,risk:2}:{safety:4,gov:3,research:-4},
 consequence:i===0?'−$4M · +3 trust · +4 prosperity · +2 welfare':i===1?'+$8M · +6 research · −3 prosperity · +2 exposure':'+4 safety · +3 relations · −4 research',
 reply:followup[route],
 // Annual promises produce later receipts, even after a route change.
 delay:q>0&&q%4===0?(i===0?{in:2,text:'LIGHTHOUSE’s public dividend returned investment to the island.',effect:{equality:3,trust:2}}:i===1?{in:2,text:'LIGHTHOUSE’s exclusive terms prompted a public challenge.',effect:{trust:-4,gov:-2}}:{in:2,text:'The independent LIGHTHOUSE review reduced deployment exposure.',effect:{risk:-3,safety:2}}):null
}));}
function arrival(s){return {id:'arrival',title:s.month?'A familiar island. A new visitor.':'Welcome to your extremely normal island',route:storyRoute(s),page:0,
 lines:[s.month?`Director, Julian Vale. Your investor liaison. I have reviewed ${s.month} months of ${s.name}’s history. I see the spreadsheets have already developed a plot.`:`Welcome to ${s.name}. I’m Julian Vale, your investor liaison. Technically I represent the board. Spiritually, I represent the last person who read the insurance policy.`,
 'We bought an island to think freely. The island came with a town, a hospital and a ferry captain who does not accept “exponential growth” as a departure time.',
 'Our engineers call their local infrastructure pilot LIGHTHOUSE. Power, ferries, emergency services. A modest first step toward improving the world, or acquiring it. Before I tell the board: who are we building this for?'],
 choices:choices(['The people who live with it','The company taking the risk','An independent public compact'],0)};}
function chapter(s){const q=Math.min(27,Math.max(1,Math.floor(s.month/3))),[title,premise,variants,names]=chapters[q-1],route=storyRoute(s);
 const earlier=s.story.history.find(h=>h.id===`q${q-4}`)||s.story.history.at(-1);
 const callback=earlier?.choice?`You previously chose “${earlier.choice}”. ${earlier.reply}`:'Our arrival promises are now meeting their natural predator: actual decisions.';
 const status=s.cash<20?'Also, our runway is short. The good news is that the financial projections have stopped requiring a second page.':s.safety+10<s.cap?'Our safety work is behind capability. I would prefer the phrase “move fast and break things” to remain metaphorical.':s.trust<30?'The public does not trust us. We could buy a friendlier logo, or become a company that deserves one.':s.rivals.some(r=>r.progress>80)?'A rival is close to the threshold. The clock is real. So are the people standing beneath it.':s.policies.energy==='clean'?'The island is still paying for cleaner power. The environment remains scandalously absent from our shareholder register.':'The town has noticed the energy bill. Apparently externalities keep insisting on living somewhere.';
 return {id:`q${q}`,q,title,route,page:0,lines:[premise,variants[routes.indexOf(route)],callback,status],choices:choices(names,q)};
}
function finale(s){const route=storyRoute(s),kind=s.ending.kind;
 const opening={asi:'The threshold is behind us. Julian stands on the dock, holding a folio he has finally stopped pretending contains the whole future.',rival:'The news arrives from another lab. Someone else crossed first. Julian closes the race tracker. The town still needs its ferry.',bankrupt:'The accounts have reached zero. Julian has personally come to help box up the office. For once, the exit strategy involves actual cardboard.',shutdown:'The government has revoked the license. Julian leaves his visitor badge on the table. It is a small object for such a large failure.',time:'The decade ends. No one here crossed the final threshold. Julian has stopped calling every ordinary sunrise a missed milestone.'}[kind];
 const legacy={commons:'You gave people a stake and a voice. Some promises survived because they belonged to more than one founder. That may be the most durable thing we built.',empire:'We built a powerful company. Some people gained choices; others became dependent on ours. I signed those papers too. The valuation cannot tell us whether it was worth it.',accord:'We built ways to question power before trusting it. They were slow, imperfect and occasionally embarrassing. I hope whoever comes next keeps them.'}[route];
 const verdict=s.safety<45?'Our safeguards were not ready. We owe people an honest account of that, however impressive the engineering.':s.equality<40?'The gains remained concentrated. We should say who was left outside before we call this abundance.':s.safety>=70&&s.equality>=65?'The safeguards and shared benefits are real achievements. They do not guarantee the future. They give it somewhere better to begin.':'The result is mixed. Good choices matter. So does repairing what the other choices damaged.';
 return {id:'finale',title:'The things that remain',route,page:0,lines:[opening,legacy,verdict,'I was going to ask what we do next quarter. Let’s start with tomorrow.'],choices:[]};
}
// Snapshot the whole scene so reloading mid-dialogue cannot reroll its branch.
export function ensureStory(s){
 if(!s.story)s.story={version:1,scores:{commons:0,empire:0,accord:0},history:[],pending:null,nextMonth:(Math.floor(s.month/3)+1)*3,arrived:false,finalSeen:false};
 const st=s.story;
 if(st.pending)return st.pending;
 if(s.ending){if(!st.finalSeen)st.pending=finale(s);return st.pending;}
 if(s.pending!==null)return null;
 if(!st.arrived)st.pending=arrival(s);
 else if(s.month>=st.nextMonth)st.pending=chapter(s);
 return st.pending;
}
export function advanceStory(s){const p=s.story?.pending;if(!p)return false;
 if(p.response||p.page>=p.lines.length-1&&!p.choices.length){
  if(p.id==='finale')s.story.finalSeen=true;
  else {s.story.arrived=true;s.story.nextMonth=(Math.floor(s.month/3)+1)*3;}
  s.story.pending=null;return true;
 }
 if(p.page<p.lines.length-1){p.page++;return true;}return false;
}
export function chooseStory(s,id){const p=s.story?.pending;if(!p||p.response||p.page!==p.lines.length-1||s.ending)return false;
 const c=p.choices.find(c=>c.id===id);if(!c||s.cash+(c.effect.cash||0)<0)return false;
 effect(s,c.effect);s.story.scores[id]+=3;
 if(c.delay)s.delayed.push({...c.delay,due:s.month+c.delay.in});
 const receipt={id:p.id,month:s.month,title:p.title,route:p.route,choice:c.name,reply:c.reply};
 s.story.history.push(receipt);log(s,`LIGHTHOUSE — ${p.title}: ${c.name}.`);
 p.response=c.reply+(c.delay?` ${c.delay.in} months from now, this commitment will have another consequence.`:'')+' I’ll meet with you again in three months. Try to keep the island on the map until then.';
 return true;
}
export function storyMarkup(s){const p=s.story.pending,choicePage=!p.response&&p.page===p.lines.length-1&&p.choices.length;
 return `<dialog class="story-dialog" aria-labelledby="story-title"><div class="story-shade"></div><div class="story-top"><span>LIGHTHOUSE / ${p.id==='arrival'?'PROLOGUE':p.id==='finale'?'EPILOGUE':'CHAPTER '+p.q}<b>${routeNames[p.route]}</b></span><button data-act="music" aria-label="Toggle gameplay music">♫ Music</button></div><img class="story-portrait" src="assets/julian-vale.webp" alt="Julian Vale, your wry investor liaison in a teal suit"><section class="story-card"><div class="story-speaker">JULIAN VALE <span>INVESTOR LIAISON</span></div><h2 id="story-title">${escape(p.title)}</h2><p class="story-line" aria-live="polite">${escape(p.response||p.lines[p.page])}</p>${choicePage?`<div class="story-choices">${p.choices.map(c=>`<button data-story="choose" data-id="${c.id}" ${s.cash+(c.effect.cash||0)<0?'disabled':''}><strong>${escape(c.name)}</strong><small>${escape(c.consequence)}${s.cash+(c.effect.cash||0)<0?' · Insufficient funds':''}</small></button>`).join('')}</div>`:''}<footer><small>${choicePage?'Story decisions use no management actions':p.response?'YOUR DECISION IS RECORDED':`${p.page+1} / ${p.lines.length}`}</small>${!choicePage?`<button data-story="next">${p.response?'Back to the island':p.id==='finale'&&p.page===p.lines.length-1?'See your legacy':'Continue'} <b>▼</b></button>`:''}</footer></section></dialog>`;
}
export function storyArchive(s){return (s.story?.history||[]).map(h=>`<article class="history-line"><time>Month ${h.month}</time><div><strong>${escape(h.title)}</strong><p>${escape(h.choice)}</p><small>${escape(h.reply)}</small></div></article>`).join('')||'<p>Your LIGHTHOUSE story begins on the island.</p>';}
