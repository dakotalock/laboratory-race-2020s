// Original scores. One clock and one context for both scenes; no layered loops.
const introMelody=[72,76,79,76,74,77,81,79,76,79,84,83,81,79,77,74,72,76,79,84,83,79,76,74,77,81,79,77,76,74,72,67];
const islandA=[72,0,76,79,81,79,76,74,72,76,79,84,83,79,76,0,74,77,81,84,83,81,77,74,71,74,79,81,79,77,74,0,72,76,79,76,81,0,79,76,77,81,84,86,84,81,77,0,76,79,84,83,81,79,76,74,72,0,67,71,72,0,0,0];
const islandB=[84,83,81,79,76,0,79,81,84,0,83,81,79,76,74,0,81,79,77,74,77,0,81,84,83,81,79,77,74,0,71,0,76,79,81,84,88,86,84,81,84,81,77,74,77,81,79,0,76,74,72,71,69,72,74,71,72,76,79,84,79,76,72,0];
export const scores={intro:{step:.23,melody:introMelody,roots:[48,53,57,55]},island:{step:.205,melody:[...islandA,...islandB],roots:[48,57,53,55,48,53,57,55]}};
export function createSoundtrack({createContext,setTimer=setInterval,clearTimer=clearInterval,hidden=()=>false,onChange=()=>{}}){
 let audio=null,master=null,timer=null,track=null,enabled=true,index=0,next=0;
 const voices=new Set();
 function state(){return {track,enabled,playing:!!timer&&audio?.state==='running'&&!hidden()};}
 function notify(){onChange(state());}
 function stop(){if(timer!==null)clearTimer(timer);timer=null;for(const v of voices){try{v.stop(audio.currentTime+.025);}catch{}}voices.clear();if(master){master.gain.cancelScheduledValues(audio.currentTime);master.gain.setTargetAtTime(0,audio.currentTime,.01);}notify();}
 function note(midi,volume,duration,type,when){if(!midi)return;const osc=audio.createOscillator(),gain=audio.createGain();osc.type=type;osc.frequency.value=440*2**((midi-69)/12);gain.gain.setValueAtTime(0,when);gain.gain.linearRampToValueAtTime(volume,when+.012);gain.gain.exponentialRampToValueAtTime(.0001,when+duration);osc.connect(gain);gain.connect(master);voices.add(osc);osc.onended=()=>{voices.delete(osc);osc.disconnect();gain.disconnect();};osc.start(when);osc.stop(when+duration+.025);}
 function tick(){if(!enabled||!track||hidden()||audio.state!=='running')return;
  const score=scores[track];if(next<audio.currentTime-.2)next=audio.currentTime+.025;
  while(next<audio.currentTime+.12){const i=index++%score.melody.length,root=score.roots[Math.floor(i/(track==='intro'?8:16))%score.roots.length];
   note(score.melody[i],track==='intro'?.023:.021,score.step*.78,'triangle',next);
   if(track==='intro')note(root,.014,.22,'sine',next);
   else {if(i%2===0)note(root+(i%4===2?7:0),.017,.29,'triangle',next);note(root+24+[0,4,7,4][i%4],.005,.11,'square',next);if(i%4===2)note(91,.003,.035,'triangle',next);}
   next+=score.step;
  }
 }
 async function unlock(){if(!enabled||!track||hidden())return;try{if(!audio){audio=createContext();master=audio.createGain();master.gain.value=0;master.connect(audio.destination);}if(audio.state!=='running')await audio.resume();if(!enabled||!track||hidden()||audio.state!=='running'||timer!==null)return;master.gain.setTargetAtTime(1,audio.currentTime,.04);next=audio.currentTime+.04;tick();timer=setTimer(tick,50);notify();}catch{notify();}}
 return {state,unlock,refresh(){if(hidden())stop();else unlock();},activate(name,active){if(active&&track!==name){stop();track=name;index=0;unlock();}else if(!active&&track===name){stop();track=null;}notify();},enable(on){enabled=!!on;if(!enabled)stop();else unlock();notify();}};
}
let preference=true;try{preference=localStorage.getItem('laboratory-music-v1')!=='off';}catch{}
const listeners=new Set();
const player=createSoundtrack({createContext:()=>new (window.AudioContext||window.webkitAudioContext)(),hidden:()=>typeof document!=='undefined'&&document.hidden,onChange:s=>listeners.forEach(fn=>fn(s))});
player.enable(preference);
export const musicEnabled=()=>player.state().enabled;
export const activateMusic=(name,active)=>player.activate(name,active);
export function setMusicEnabled(on){try{localStorage.setItem('laboratory-music-v1',on?'on':'off');}catch{}player.enable(on);}
export function onMusicChange(fn){listeners.add(fn);fn(player.state());}
if(typeof document!=='undefined'){
 const unlock=e=>{if(e.target.closest?.('[data-intro="sound"],[data-act="music"]'))return;player.unlock();};
 for(const event of ['pointerdown','keydown','click'])document.addEventListener(event,unlock,{capture:true,passive:true});
 document.addEventListener('visibilitychange',()=>player.refresh());
 window.addEventListener('pagehide',()=>player.activate(player.state().track,false));
 window.addEventListener('pageshow',()=>window.dispatchEvent(new Event('music-resync')));
}
