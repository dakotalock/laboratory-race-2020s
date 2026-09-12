import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,nextMonth,chooseResearch,buy,action,resolve,ending} from '../engine.js';
import {ensureStory,advanceStory,chooseStory,storyMarkup,storyRoute,storyArchive} from '../story.js';
import {chapters} from '../story-chapters.js';
const copy=s=>JSON.parse(JSON.stringify(s));
function toChoice(s){while(s.story.pending.page<s.story.pending.lines.length-1)assert.ok(advanceStory(s));}
function finish(s,route='commons'){toChoice(s);if(s.story.pending.choices.length)assert.ok(chooseStory(s,route));assert.ok(advanceStory(s));}

test('arrival freezes management, preserves pages on reload, and charges a choice exactly once',()=>{
 let s=initial('<img onerror="bad">');s.month=1;ensureStory(s);
 assert.equal(nextMonth(s),false);assert.equal(buy(s,'hire','researcher'),false);assert.equal(action(s,'fund'),false);assert.equal(chooseResearch(s,'product1'),false);
 assert.equal(chooseStory(s,'empire'),false);advanceStory(s);s=copy(s);assert.equal(ensureStory(s).page,1);
 assert.ok(!storyMarkup(s).includes('<img onerror'));
 toChoice(s);const before=copy(s);assert.ok(chooseStory(s,'commons'));assert.equal(s.cash,before.cash-4);assert.equal(s.actions,2);
 assert.equal(chooseStory(s,'commons'),false);s=copy(s);assert.ok(ensureStory(s).response);advanceStory(s);assert.equal(ensureStory(s),null);
 assert.equal(s.story.nextMonth,4);assert.ok(storyArchive(s).includes('The people who live with it'));
 assert.ok(nextMonth(s));assert.equal(s.month,2);if(s.pending!==null)resolve(s,2);assert.equal(ensureStory(s),null);
 nextMonth(s);if(s.pending!==null)resolve(s,2);assert.equal(ensureStory(s),null);nextMonth(s);if(s.pending!==null)resolve(s,2);assert.equal(ensureStory(s).id,'q1');
});

test('all 27 quarterly chapters have three distinct persistent branches and consequences',()=>{
 assert.equal(chapters.length,27);
 for(let q=1;q<=27;q++){
  const variants=new Set();
  for(const route of ['commons','empire','accord']){
   const s=initial();s.month=1;ensureStory(s);finish(s,route);s.month=q*3+1;s.cash=1000;s.story.scores[route]=100;
   const p=ensureStory(s);assert.equal(p.id,`q${q}`);assert.equal(p.route,route);variants.add(p.lines[1]);
   const frozen=JSON.stringify(p);assert.equal(JSON.stringify(ensureStory(copy(s))),frozen);
   toChoice(s);const before=copy(s);assert.ok(chooseStory(s,route));assert.notDeepEqual(s.story.scores,before.story.scores);assert.equal(s.actions,before.actions);
   if(q%4===0)assert.equal(s.delayed.at(-1).due,s.month+2);
   advanceStory(s);assert.equal(s.story.nextMonth,s.month+3);
  }
  assert.equal(variants.size,3,`chapter ${q}`);
 }
});

test('existing campaigns join now, do not queue a backlog, and can change direction',()=>{
 const s=initial();s.month=29;s.cash=77;s.pending=0;
 assert.equal(ensureStory(s),null);resolve(s,2);assert.equal(ensureStory(s).id,'arrival');assert.match(s.story.pending.lines[0],/29 months/);
 finish(s,'empire');assert.equal(s.cash,85);assert.equal(s.story.nextMonth,30);assert.equal(ensureStory(s),null);
 assert.equal(storyRoute(s),'empire');s.month=30;ensureStory(s);finish(s,'accord');s.month=33;ensureStory(s);finish(s,'accord');assert.equal(storyRoute(s),'accord');
});

test('unaffordable choices cannot charge money; alternatives remain available',()=>{
 const s=initial();s.month=1;s.cash=0;ensureStory(s);toChoice(s);assert.equal(chooseStory(s,'commons'),false);assert.equal(s.cash,0);assert.ok(chooseStory(s,'accord'));assert.equal(s.cash,0);
});

test('every campaign ending gets one route-aware epilogue before the scorecard',()=>{
 for(const kind of ['asi','rival','bankrupt','shutdown','time'])for(const route of ['commons','empire','accord']){
  const s=initial();s.month=1;ensureStory(s);finish(s,route);ending(s,kind);const p=ensureStory(s);assert.equal(p.id,'finale');assert.equal(p.route,route);assert.equal(chooseStory(s,'empire'),false);finish(s);assert.ok(s.story.finalSeen);assert.equal(ensureStory(copy(s)),null);
 }
});
