import test from 'node:test';
import assert from 'node:assert/strict';
import {initial} from '../engine.js';
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
 assert.match(app.innerHTML,/Welcome to your extremely normal island/);assert.match(app.innerHTML,/&lt;Test &amp; Lab&gt;/);
 click('act','turn');assert.equal(state().month,0);
 click('story','next');click('story','next');click('story','choose','empire');assert.equal(state().cash,108);click('story','next');assert.equal(state().story.pending,null);assert.equal(state().model.pending.id,'hello');click('model','choice','0');click('model','dismiss');
 for(const id of ['research','people','world','council','model','campus']){click('act','tab',id);assert.ok(app.innerHTML.includes('class="main '+id));}
 click('act','turn');click('act','choice','2');click('model','choice','0');click('model','dismiss');click('act','turn');click('model','choice','0');click('model','dismiss');click('act','turn');assert.equal(state().story.pending.id,'q1');
 while(state().story.pending.page<state().story.pending.lines.length-1)click('story','next');click('story','choose','accord');click('story','next');click('model','choice','0');click('model','dismiss');
 click('act','menu');assert.match(app.innerHTML,/Island soundtrack/);click('act','story-archive');assert.match(app.innerHTML,/The ferry has shareholders/);click('act','close');
 click('act','professor');assert.match(app.innerHTML,/professor-intro/);click('intro','exit');assert.ok(!app.innerHTML.includes('professor-intro'));assert.equal(state().month,3);
});
