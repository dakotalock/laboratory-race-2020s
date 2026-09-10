import {handheldView,handleHandheld} from '../handheld-ui.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,nextMonth,buy,action,chooseResearch} from '../engine.js';
import {modelTechs,modelBranches} from '../model-tech.js';
import {ensureModel,developModel,advanceModel,ensureModelCard,resolveModelCard,dismissModelReceipt,reviewModel,modelExpression,modelReach,rivalModelProfiles} from '../model-system.js';
import {bindModelSwipes,modelDecisionView} from '../model-ui.js';
import {ensureStory,advanceStory} from '../story.js';
const copy=x=>JSON.parse(JSON.stringify(x));
function ready(){const s=initial();ensureModel(s);return s;}
function settle(s,i=0){ensureModelCard(s);if(s.model.pending){assert.ok(resolveModelCard(s,i));dismissModelReceipt(s);}}
function month(s){s.month++;advanceModel(s);}
test('independent Insight, one development slot, migration and protected pending decisions',()=>{
 const s=ready();s.cash=0;s.research=700;s.actions=0;assert.ok(developModel(s,'reason1'));assert.equal(s.model.insight,3);assert.equal(s.cash,0);assert.equal(s.research,700);assert.equal(s.actions,0);assert.equal(developModel(s,'computer1'),false);
 const before=copy(s);advanceModel(s);assert.deepEqual(s,before);month(s);assert.equal(s.model.insight,6);assert.equal(s.research,701);
 ensureModelCard(s);const snapshot=JSON.stringify(s.model.pending);assert.equal(JSON.stringify(ensureModelCard(copy(s))),snapshot);assert.equal(nextMonth(s),false);assert.equal(buy(s,'hire','researcher'),false);assert.equal(action(s,'fund'),false);assert.equal(chooseResearch(s,'product1'),false);assert.equal(developModel(s,'computer1'),false);
 assert.ok(resolveModelCard(s,0));const once=copy(s);assert.equal(resolveModelCard(s,0),false);assert.deepEqual(s,once);assert.equal(nextMonth(s),false);dismissModelReceipt(s);
 const old=initial();old.month=32;old.cash=71;ensureModel(old);advanceModel(old);assert.equal(old.model.insight,6);assert.equal(old.cash,71);
});
test('all 30 nodes form an acyclic prerequisite graph and every branch is reachable',()=>{
 assert.equal(modelTechs.length,30);const ids=new Set(modelTechs.map(t=>t.id));assert.equal(ids.size,30);
 function walk(id,stack=[]){assert.ok(!stack.includes(id),'cycle '+id);const t=modelTechs.find(t=>t.id===id);assert.ok(t);for(const req of t.req)walk(req,[...stack,id]);}
 for(const node of modelTechs)walk(node.id);
 for(const [branch]of modelBranches){const s=ready();s.model.insight=1000;function learn(id){if(s.model.done.includes(id))return;const t=modelTechs.find(t=>t.id===id);t.req.forEach(learn);assert.ok(developModel(s,id),id);month(s);}learn(branch+'5');assert.ok(s.model.done.includes(branch+'5'));}
});
test('rights plus high agency can produce citizenship without a rogue incident',()=>{
 const s=ready(),m=s.model;m.done=['society4'];Object.assign(m,{care:75,coherence:85,belonging:70,agency:85});m.seen=['hello'];assert.equal(ensureModelCard(s).id,'rights');assert.ok(resolveModelCard(s,0));dismissModelReceipt(s);assert.ok(m.milestones.includes('citizen'));assert.equal(modelExpression(m),'serene');month(s);ensureModelCard(s);assert.notEqual(m.pending.id,'rogue');assert.ok(s.welfare>65);
});
test('rogue incidents have recovery choices and review revokes dangerous powers',()=>{
 const s=ready(),m=s.model;m.done=['computer1','computer2','computer3','computer4','computer5'];Object.assign(m,{agency:90,coherence:20,care:30});m.flags={network:true,critical:true};assert.equal(ensureModelCard(s).id,'rogue');s.cash=0;assert.equal(resolveModelCard(s,0),false);assert.ok(resolveModelCard(s,1));dismissModelReceipt(s);assert.equal(m.flags.network,false);assert.equal(m.flags.critical,false);assert.ok(m.milestones.includes('rogue'));assert.equal(s.ending,null);
 m.flags={network:true,critical:true,arsenal:true,mandate:2};assert.ok(reviewModel(s,'revoke'));assert.equal(m.flags.arsenal,false);assert.equal(m.flags.mandate,0);
});
test('surveillance creates ongoing dystopian effects without making rights a hazard',()=>{
 const s=ready(),m=s.model;m.flags={surveillance:true,critical:true};m.care=25;const cash=s.cash,trust=s.trust;month(s);assert.ok(m.milestones.includes('dystopia'));assert.equal(s.cash,cash+2);assert.ok(s.trust<trust);assert.equal(m.insight,9);
});

test('each major ending is reachable through purchases and monthly choices, with save-safe epilogues',()=>{
 for(const target of ['utopia','dictator','catastrophe','salvation']){
  const s=ready();const goals=target==='utopia'||target==='dictator'?['reason5']:target==='catastrophe'?['computer5']:['computer5','interpret4'];
  const plan=[];function add(id){if(plan.includes(id))return;modelTechs.find(t=>t.id===id).req.forEach(add);plan.push(id);}goals.forEach(add);
  for(let i=0;i<70&&!s.ending;i++){
   ensureModelCard(s);if(s.model.pending){const id=s.model.pending.id;let choice=0;
    if(id==='constitution')choice=target==='dictator'?1:0;if(id==='arsenal')choice=target==='catastrophe'?1:0;
    if(['abundance','accession','escalation','rescue'].includes(id))choice=1;
    assert.ok(resolveModelCard(s,choice),target+' '+id);dismissModelReceipt(s);
   }
   if(s.ending)break;
   const next=plan.find(id=>!s.model.done.includes(id));if(next)developModel(s,next);else if(s.model.coherence<80)reviewModel(s,'evaluate');else if(s.model.care<80||s.model.belonging<75)reviewModel(s,'listen');
   month(s);
  }
  assert.equal(s.ending?.kind,'model-'+target,JSON.stringify({target,model:s.model}));assert.ok(s.month<60);const scene=ensureStory(s);assert.equal(scene.id,'finale');assert.ok(scene.lines.every(line=>typeof line==='string'));
  const reload=copy(s);while(reload.story.pending)assert.ok(advanceStory(reload));assert.equal(ensureStory(reload),null);
 }
});
test('catastrophe is never automatic: canceling the final authorization removes command',()=>{
 const s=ready();s.model.flags.arsenal=true;assert.equal(ensureModelCard(s).id,'escalation');assert.equal(s.ending,null);assert.match(modelDecisionView(s),/ENDS THIS CAMPAIGN/);resolveModelCard(s,0);dismissModelReceipt(s);assert.equal(s.model.flags.arsenal,false);assert.equal(s.ending,null);
});
test('horizontal swipes choose once; scrolling, short drags and pointer cancellation do not',()=>{
 const handlers={},chosen=[];bindModelSwipes({addEventListener:(k,f)=>handlers[k]=f},i=>chosen.push(i));const card={style:{},matches:()=>true};const e=(x,y)=>({target:{closest:()=>card},clientX:x,clientY:y,pointerId:1,button:0});
 handlers.pointerdown(e(100,100));handlers.pointermove(e(110,180));handlers.pointerup(e(210,190));assert.deepEqual(chosen,[]);
 handlers.pointerdown(e(100,100));handlers.pointerup(e(125,101));assert.deepEqual(chosen,[]);
 handlers.pointerdown(e(100,100));handlers.pointercancel();handlers.pointerup(e(210,100));assert.deepEqual(chosen,[]);
 handlers.pointerdown(e(100,100));handlers.pointerup(e(210,101));handlers.pointerup(e(210,101));assert.deepEqual(chosen,[1]);
 handlers.pointerdown(e(200,100));handlers.pointerup(e(90,101));assert.deepEqual(chosen,[1,0]);
 handlers.keydown({target:card,key:'ArrowLeft',preventDefault(){}});assert.deepEqual(chosen,[1,0,0]);
});
test('model menus expose independent budget, specimen, reviews and sourced development',()=>{
 const s=ready();let html=handheldView('model',s);for(const text of ['INSIGHT','Reviews','data-model-vitrine'])assert.ok(html.includes(text),text);
 handleHandheld('section','model:tree',s);html=handheldView('model',s);assert.ok(html.includes('Research note'));
 handleHandheld('page','model-reason:4',s);assert.ok(handheldView('model',s).includes('SPECULATIVE'));
 handleHandheld('section','model:rivals',s);assert.ok(handheldView('model',s).includes('Rival approaches'));
 handleHandheld('model-back','',s);assert.equal(modelReach(s.model),0);
});

test('rival specializations spend separate budgets and respect prerequisites',()=>{
 for(const month of [0,8,20,40,84])for(const rival of rivalModelProfiles(month)){
  assert.ok(rival.insight>=0);assert.ok(rival.done.length<=month+1);
  assert.equal(rival.insight+rival.done.reduce((n,id)=>n+modelTechs.find(t=>t.id===id).cost,0),6+month*3);
  rival.done.forEach((id,i)=>modelTechs.find(t=>t.id===id).req.forEach(req=>assert.ok(rival.done.slice(0,i).includes(req))));
 }
 const profiles=rivalModelProfiles(8);assert.equal(profiles[0].done[0],'computer1');assert.equal(profiles[1].done[0],'interpret1');assert.equal(profiles[2].done[0],'reason1');
});
