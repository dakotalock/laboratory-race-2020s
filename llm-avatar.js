import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {celMaterial} from './cel-style.js';
// Shared with the professor introduction: preserve the original silhouette.
export function buildLLM(){
 const bot=new T.Group(),mint=celMaterial({color:0x59bd9b}),ink=celMaterial({color:0x243648}),white=celMaterial({color:0xffffff}),gold=celMaterial({color:0xffd45f}),coral=celMaterial({color:0xf28876});
 function mesh(g,m,x,y,z){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;bot.add(o);return o;}
 const ell=(m,x,y,z,a,b,c)=>{const o=mesh(new T.SphereGeometry(1,24,18),m,x,y,z);o.scale.set(a,b,c);return o;};
 mesh(new T.BoxGeometry(.73,.6,.54),mint,0,0,0);mesh(new T.BoxGeometry(.57,.34,.04),ink,0,.04,.285);
 const eyes=[-.16,.16].map(x=>ell(white,x,.065,.32,.063,.075,.025));
 const mouths={};for(const [name,points]of Object.entries({happy:[[-.1,-.08,.32],[0,-.11,.33],[.1,-.08,.32]],worried:[[-.1,-.12,.32],[0,-.075,.33],[.1,-.12,.32]],stern:[[-.1,-.1,.32],[0,-.1,.33],[.1,-.1,.32]],serene:[[-.1,-.08,.32],[0,-.11,.33],[.1,-.08,.32]],mischievous:[[-.1,-.10,.32],[0,-.11,.33],[.12,-.065,.32]]})){
  mouths[name]=mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),24,.014,7,false),gold,0,0,0);mouths[name].visible=name==='happy';
 }
 for(const x of [-.47,.47])ell(gold,x,-.06,0,.11,.17,.13);mesh(new T.CylinderGeometry(.045,.045,.2,8),ink,0,.39,0);ell(coral,0,.51,0,.1,.1,.1);
 bot.userData.setExpression=(name='happy')=>{if(!mouths[name])name='happy';for(const [id,mouth]of Object.entries(mouths))mouth.visible=id===name;eyes.forEach((eye,i)=>{eye.scale.y=name==='serene'?.024:name==='stern'?.038:.075;eye.rotation.z=name==='stern'?(i?-.25:.25):0;});};
 return bot;
}
