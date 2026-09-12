import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,nextMonth,resolve} from '../engine.js';
import {ensureModel,ensureModelCard,resolveModelCard,dismissModelReceipt} from '../model-system.js';
import {monthlyCards} from '../model-monthly.js';
import {modelCards} from '../model-cards.js';
import {modelTechs,modelMeters} from '../model-tech.js';
import {ensureStory,advanceStory,chooseStory} from '../story.js';
const copy=s=>JSON.parse(JSON.stringify(s));
test('84 individually authored dilemmas have distinct prompts, complete choices and actual trait effects',()=>{
 assert.equal(monthlyCards.length,84);
 for(const key of ['id','title','text'])assert.equal(new Set(monthlyCards.map(c=>c[key])).size,84,key);
 for(const c of monthlyCards){assert.ok(c.when({done:[]}));assert.ok(c.text.length>80&&c.text.length<360,c.id);assert.equal(c.choices.length,2);assert.notEqual(c.choices[0].name,c.choices[1].name);assert.notDeepEqual(c.choices[0].traits,c.choices[1].traits);
  for(const choice of c.choices){assert.ok(choice.reply.length>15);assert.ok(Object.keys(choice.traits).length);for(const [k,v]of Object.entries(choice.traits)){assert.ok(k in modelMeters);assert.ok(Number.isFinite(v));}assert.ok((choice.campaign.cash||0)>=0);}
 }
});
test('a lab with zero upgrades gets a unique dilemma in every campaign month, including after reload',()=>{
 let s=initial();ensureModel(s);const ids=new Set(),prompts=new Set();assert.equal(ensureModelCard(s),null);
 for(let month=1;month<=84;month++){s.month=month;const p=ensureModelCard(s);assert.ok(p,`month ${month}`);assert.ok(!ids.has(p.id),p.id);assert.ok(!prompts.has(p.text),p.title);ids.add(p.id);prompts.add(p.text);
  s=copy(s);assert.deepEqual(ensureModelCard(s),p);const before=s.model.care;assert.ok(resolveModelCard(s,month%2));const once=copy(s);assert.equal(resolveModelCard(s,month%2),false);assert.deepEqual(s,once);assert.ok(s.model.care>=0&&s.model.care<=100);dismissModelReceipt(s);assert.equal(ensureModelCard(s),null);s=copy(s);
 }
 assert.equal(ids.size,84);
});
test('technology unlocks still receive their unique events and an exhausted deck never falls back to repeats',()=>{
 const s=initial();s.month=17;const m=ensureModel(s);m.seen=modelCards.filter(c=>c.when(m)).map(c=>c.id);m.done=['computer1','computer2'];assert.equal(ensureModelCard(s).id,'desktop');resolveModelCard(s,0);dismissModelReceipt(s);s.month++;
 m.seen=[...modelCards,...monthlyCards].map(c=>c.id);assert.equal(ensureModelCard(s),null);
});
test('old saves with the repeated core events exhausted immediately receive unseen material',()=>{
 const s=initial();s.month=40;const m=ensureModel(s);m.lastDecisionMonth=39;m.seen=modelCards.filter(c=>c.when(m)).map(c=>c.id);const before={cash:s.cash,actions:s.actions,insight:m.insight};assert.equal(ensureModelCard(s).id,'monthly-01');assert.deepEqual({cash:s.cash,actions:s.actions,insight:m.insight},before);
 const pending=copy(s);pending.model.pending.choices[0].reply='A reply from the version that created this save.';assert.equal(ensureModelCard(pending).choices[0].reply,'A reply from the version that created this save.');
});
test('fresh campaigns enter the island, then first-month Julian and LLM, with quarterly follow-up at month four',()=>{
 const s=initial();assert.equal(ensureStory(s),null);assert.equal(ensureModelCard(s),null);assert.equal(s.story.pending,null);assert.ok(nextMonth(s));assert.equal(s.month,1);
 if(s.pending!==null)resolve(s,2);assert.equal(ensureStory(s).id,'arrival');assert.equal(ensureModelCard(s),null);
 while(s.story.pending.page<s.story.pending.lines.length-1)advanceStory(s);chooseStory(s,'accord');advanceStory(s);assert.equal(s.story.nextMonth,4);assert.equal(ensureModelCard(s).id,'hello');resolveModelCard(s,0);dismissModelReceipt(s);
 for(let month=2;month<=3;month++){s.month=month;assert.equal(ensureStory(s),null);assert.ok(ensureModelCard(s));resolveModelCard(s,0);dismissModelReceipt(s);}
 s.month=4;assert.equal(ensureStory(s).id,'q1');
});
test('existing mid-scene saves are not interrupted and legacy quarterly cadence stays intact',()=>{
 const s=initial();s.month=1;ensureStory(s);advanceStory(s);const pending=copy(s.story.pending);s.month=0;assert.deepEqual(ensureStory(s),pending);
 const old=initial();old.month=6;old.story={version:1,scores:{commons:0,empire:0,accord:0},history:[],pending:null,arrived:true,finalSeen:false,nextMonth:6};ensureStory(old);while(old.story.pending.page<old.story.pending.lines.length-1)advanceStory(old);chooseStory(old,'accord');advanceStory(old);assert.equal(old.story.nextMonth,9);
});
