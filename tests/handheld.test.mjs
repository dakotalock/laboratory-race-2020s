import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,techs,roles,buildings,policies} from '../engine.js';
import {modelTechs} from '../model-tech.js';
import {ensureModel} from '../model-system.js';
import {handheldView,handheldModal,handheldEvent,handleHandheld,splitText,ui} from '../handheld-ui.js';
const state=()=>{const s=initial('A <very> long & ambitious laboratory');ensureModel(s);return s;};
test('all laboratory and model technologies have a single dossier and reachable prerequisite links',()=>{
 const s=state();
 for(const [area,list,prefix] of [['research',techs,'research'],['model',modelTechs,'model']]){
  if(area==='model')handleHandheld('section','model:tree',s);
  for(const t of list){handleHandheld(prefix+'-jump',t.id,s);let html=handheldView(area,s);
   assert.ok(html.includes(`<h2>${t.name.replaceAll('&','&amp;')}</h2>`),t.id);
   assert.equal((html.match(/<article class="hh-card"/g)||[]).length,1);
   assert.ok(!html.includes('view-scroll'));
   if(t.req.length){handleHandheld('info','',s);html=handheldView(area,s);for(const id of t.req)assert.ok(html.includes(`data-id="${id}"`),id);handleHandheld(prefix+'-jump',t.req[0],s);assert.ok(handheldView(area,s).includes(list.find(x=>x.id===t.req[0]).name.replaceAll('&','&amp;')));}
  }
 }
});
test('recruitment, facilities, policies and executive actions are paged without losing options',()=>{
 const s=state();for(const [section,key,list] of [['team','staff',roles],['buildings','buildings',buildings]]){
  handleHandheld('section','people:'+section,s);for(let i=0;i<list.length;i++){handleHandheld('page',key+':'+i,s);const html=handheldView('people',s);assert.ok(html.includes(list[i].name));assert.equal((html.match(/data-act="(?:hire|build)"/g)||[]).length,1);}
 }
 handleHandheld('section','council:policies',s);for(let i=0;i<Object.keys(policies).length;i++){handleHandheld('page','policy:'+i,s);const key=Object.keys(policies)[i],html=handheldView('council',s);for(const [id] of policies[key])assert.ok(html.includes(`data-id="${key}:${id}"`));}
 handleHandheld('section','council:actions',s);for(let i=0;i<6;i++){handleHandheld('page','executive:'+i,s);assert.equal((handheldView('council',s).match(/data-act="executive"/g)||[]).length,1);}
 s.actions=0;assert.match(handheldView('people',s),/data-act="build"[^>]*disabled/);
});
test('model navigation returns to display, remembers the selected tier, and inspection spends nothing',()=>{
 const s=state(),before=JSON.stringify(s);handleHandheld('section','model:tree',s);handleHandheld('model-jump','computer3',s);handleHandheld('picker','model',s);
 assert.ok(handheldView('model',s).includes('data-ui="model-branch"'));
 handleHandheld('model-back','',s);assert.ok(handheldView('model',s).includes('Cross-application work'));
 handleHandheld('model-back','',s);assert.ok(handheldView('model',s).includes('data-model-vitrine'));
 handleHandheld('section','model:tree',s);assert.ok(handheldView('model',s).includes('Cross-application work'));assert.equal(JSON.stringify(s),before);
});
test('archives and guide use bounded pages, preserve complete text and escape user strings',()=>{
 const s=state(),text=Array.from({length:180},(_,i)=>'word'+i).join(' ');const pages=splitText(text);assert.equal(pages.join(' '),text);assert.ok(pages.every(p=>p.length<=300));
 s.history=[{month:0,text:'<script> & '+text}];handleHandheld('page','journal:0',s);let html=handheldModal('journal',s);assert.ok(html.includes('&lt;script&gt; &amp;'));assert.ok(!html.includes('word179'));
 handleHandheld('page','journal:999',s);html=handheldModal('journal',s);assert.ok(html.includes('word179'));assert.match(html,/disabled[^>]*aria-label="Next item"/);
 for(let i=0;i<7;i++){handleHandheld('page','help:'+i,s);assert.equal((handheldModal('help',s).match(/<article class="hh-card"/g)||[]).length,1);}
});
test('council briefing previews each response without committing or changing campaign state',()=>{
 const s=state();s.pending=0;const before=JSON.stringify(s);for(let i=0;i<3;i++){handleHandheld('page','event-0:'+i,s);const html=handheldEvent(s);assert.equal((html.match(/data-act="choice"/g)||[]).length,1);assert.ok(html.includes(`data-id="${i}"`));}assert.equal(JSON.stringify(s),before);
 s.cash=0;handleHandheld('page','event-0:0',s);assert.match(handheldEvent(s),/data-act="choice"[^>]*disabled/);
});
