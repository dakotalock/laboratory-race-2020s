import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,events} from '../engine.js';
test('app flow: saved island, story dialogue, quarterly trigger, menus, intro replay',async()=>{
 const data=new Map([['laboratory-race-2020s-v1',JSON.stringify(initial('<Test & Lab>'))],['professor-intro-seen-v1','1'],['laboratory-music-v1','off']]);
 const handlers={};const app={innerHTML:'',addEventListener(name,fn){(handlers[name]??=[]).push(fn);}};
 const fake={showModal(){},addEventListener(){},focus(){},remove(){},scrollTop:0,scrollIntoView(){}};
 globalThis.localStorage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 globalThis.document={hidden:false,addEventListener(){},querySelectorAll:()=>[],querySelector:s=>s==='#app'?app:s==='dialog'&&app.innerHTML.includes('<dialog')?fake:s==='.view-scroll'?fake:null,createElement:()=>({setAttribute(){},remove(){}}),body:{append(){},classList:{toggle(){},remove(){},add(){}}}};
 globalThis.window={matchMedia:()=>({matches:true}),addEventListener(){}};
 await import('../app.js');
 const state=()=>JSON.parse(data.get('laboratory-race-2020s-v1'));
 function click(kind,value,id){const element={disabled:false,dataset:{[kind]:value,id}};for(const fn of handlers.click)fn({target:{closest:selector=>selector===`[data-${kind}]`?element:null}});assert.ok(!app.innerHTML.includes('undefined'));}
 assert.match(app.innerHTML,/&lt;Test &amp; Lab&gt;/);assert.equal(state().story.pending,null);assert.equal(state().model.pending,null);assert.ok(!app.innerHTML.includes('<dialog'));
 const beforeBrowse=state();
 click('act','tab','people');click('ui','section','people:buildings');click('ui','page','buildings:3');assert.match(app.innerHTML,/Clean power campus/);assert.equal(state().actions,beforeBrowse.actions);assert.equal(state().cash,beforeBrowse.cash);
 click('act','tab','research');click('ui','research-jump','asi');assert.match(app.innerHTML,/Artificial superintelligence/);click('ui','info','');assert.match(app.innerHTML,/data-id="science6"/);click('ui','research-jump','science6');assert.match(app.innerHTML,/Recursive improvement/);
 click('act','tab','model');click('ui','section','model:reviews');assert.match(app.innerHTML,/Independent evaluation/);click('ui','model-back','');assert.match(app.innerHTML,/data-model-vitrine/);
 click('act','tab','people');click('ui','section','people:team');click('ui','page','staff:0');const oldStaff=state().staff.researcher;click('act','hire','researcher');assert.equal(state().staff.researcher,oldStaff+1);assert.equal(state().actions,beforeBrowse.actions-1);
 for(const id of ['research','people','world','council','model','campus']){click('act','tab',id);assert.ok(app.innerHTML.includes('class="main '+id));}
 click('act','turn');assert.equal(state().month,1);const briefing=state();click('ui','page','event-'+briefing.pending+':2');assert.ok(app.innerHTML.includes(events[briefing.pending].choices[2].name));click('act','policy','pace:sprint');assert.equal(state().policies.pace,briefing.policies.pace);click('act','choice','2');
 assert.equal(state().story.pending.id,'arrival');assert.match(app.innerHTML,/first monthly check-in/);click('act','turn');assert.equal(state().month,1);
 click('story','next');click('story','next');const beforeArrival=state().cash;click('story','choose','empire');assert.equal(state().cash,beforeArrival+8);click('story','next');assert.equal(state().story.pending,null);assert.equal(state().model.pending.id,'hello');click('model','choice','0');click('model','dismiss');assert.equal(state().story.nextMonth,4);
 for(let month=2;month<=4;month++){click('act','turn');if(state().pending!==null)click('act','choice','2');if(month<4){assert.equal(state().story.pending,null);click('model','choice','0');click('model','dismiss');}}
 assert.equal(state().story.pending.id,'q1');
 while(state().story.pending.page<state().story.pending.lines.length-1)click('story','next');click('story','choose','accord');click('story','next');click('model','choice','0');click('model','dismiss');
 click('act','menu');assert.match(app.innerHTML,/Island soundtrack/);click('act','story-archive');assert.match(app.innerHTML,/The ferry has shareholders/);click('act','close');
 click('act','professor');assert.match(app.innerHTML,/professor-intro/);click('intro','exit');assert.ok(!app.innerHTML.includes('professor-intro'));assert.equal(state().month,4);
 click('act','new');assert.match(app.innerHTML,/professor-intro/);click('intro','finish');assert.equal(state().month,0);assert.equal(state().story.pending,null);assert.equal(state().model.pending,null);assert.ok(!app.innerHTML.includes('<dialog'));
});
