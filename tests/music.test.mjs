import test from 'node:test';
import assert from 'node:assert/strict';
import {createSoundtrack,scores} from '../music.js';
function harness(){let blocked=true,hidden=false;const timers=new Map(),notes=[];let id=0;
 const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},cancelScheduledValues(){},setTargetAtTime(){}});
 const context={state:'suspended',currentTime:0,destination:{},async resume(){if(blocked)throw Error('gesture required');this.state='running';},createGain:()=>({gain:param(),connect(){},disconnect(){}}),createOscillator:()=>{const o={frequency:{value:0},connect(){},disconnect(){},start(t){notes.push({t,hz:this.frequency.value});},stop(){}};return o;}};
 const player=createSoundtrack({createContext:()=>context,setTimer:fn=>{timers.set(++id,fn);return id;},clearTimer:id=>timers.delete(id),hidden:()=>hidden});
 return {player,context,timers,notes,allow(){blocked=false;},hide(v){hidden=v;}};
}
test('blocked autoplay unlocks once, switches tracks, mutes and pauses in background',async()=>{
 const h=harness();h.player.activate('intro',true);await h.player.unlock();assert.equal(h.notes.length,0);
 h.allow();await h.player.unlock();assert.equal(h.timers.size,1);assert.ok(h.notes.length>0);
 await Promise.all([h.player.unlock(),h.player.unlock()]);assert.equal(h.timers.size,1);
 h.player.activate('intro',false);h.player.activate('island',true);await h.player.unlock();assert.equal(h.timers.size,1);assert.equal(h.player.state().track,'island');
 h.player.enable(false);const n=h.notes.length;await h.player.unlock();assert.equal(h.timers.size,0);assert.equal(h.notes.length,n);
 h.player.activate('intro',true);await h.player.unlock();assert.equal(h.notes.length,n);
 h.player.enable(true);await h.player.unlock();assert.equal(h.timers.size,1);
 h.hide(true);h.player.refresh();assert.equal(h.timers.size,0);h.hide(false);h.player.refresh();await h.player.unlock();assert.equal(h.timers.size,1);
 h.player.enable(false);
});
test('island score has a distinct A/B melody and valid finite pitches',()=>{
 assert.equal(scores.island.melody.length,128);assert.notDeepEqual(scores.island.melody.slice(0,64),scores.island.melody.slice(64));
 for(const score of Object.values(scores))for(const note of score.melody)assert.ok(Number.isFinite(note)&&note>=0&&note<=100);
});
