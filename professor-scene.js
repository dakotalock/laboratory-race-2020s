import {buildLLM} from './llm-avatar.js';
import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {celMaterial} from './cel-style.js';
export function buildProfessor(){
 const scene=new T.Scene();scene.background=new T.Color(0xbce9df);scene.fog=new T.Fog(0xbce9df,18,45);const camera=new T.PerspectiveCamera(37,1,.1,70);const group=new T.Group();scene.add(group);
 const mat=(c,r=.75)=>celMaterial({color:c});const skin=mat(0xf0c3a1),coat=mat(0xfff9e7),navy=mat(0x284257),hair=mat(0x493b31),shoe=mat(0x554c48),white=mat(0xffffff),ink=mat(0x243648),coral=mat(0xf28876),mint=mat(0x59bd9b),gold=mat(0xffd45f),blue=mat(0x74b7de);
 const mesh=(g,m,x,y,z,parent=group)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
 const ell=(m,x,y,z,sx,sy,sz,parent=group)=>{const o=mesh(new T.SphereGeometry(1,24,18),m,x,y,z,parent);o.scale.set(sx,sy,sz);return o;};
 const box=(m,x,y,z,w,h,d,parent=group)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z,parent);
 const tube=(points,r,m,parent=group)=>mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),24,r,7,false),m,0,0,0,parent);
 // Warm toy-like proportions, short brown side-parted hair, strong brows, navy tee and lab coat.
 const prof=new T.Group();group.add(prof);prof.visible=false;prof.position.x=-.38;
 for(const x of [-.25,.25]){ell(navy,x,.76,0,.21,.69,.23,prof);ell(shoe,x,.16,.15,.25,.17,.4,prof);}
 ell(coat,0,1.91,0,.65,.94,.35,prof);box(navy,0,2.12,.325,.57,1.2,.09,prof);for(const x of [-.36,.36]){const lapel=box(coat,x,2.38,.38,.24,.78,.11,prof);lapel.rotation.z=x>0?.22:-.22;box(coat,x,1.65,.33,.28,.29,.07,prof);}for(const y of [1.42,1.7,1.98])ell(ink,.08,y,.39,.035,.035,.02,prof);
 box(mint,-.43,2.35,.405,.22,.15,.025,prof);ell(skin,0,2.92,0,.23,.25,.23,prof);
 const head=new T.Group();head.position.y=3.48;prof.add(head);ell(skin,0,0,0,.58,.69,.49,head);ell(skin,0,-.36,.17,.43,.31,.37,head);for(const x of [-.58,.58]){ell(skin,x,-.04,0,.13,.21,.115,head);ell(coral,x,-.04,.08,.055,.12,.03,head);}
 const scalp=mesh(new T.SphereGeometry(.6,28,16,0,Math.PI*2,0,Math.PI*.5),hair,0,.27,-.02,head);scalp.scale.set(1,1.04,.86);
 for(let i=0;i<7;i++){const x=-.45+i*.14;const lock=ell(hair,x,.49+Math.sin(i*.43)*.09,.17,.18,.24,.32,head);lock.rotation.z=-.35;}
 for(const x of [-.24,.24]){ell(white,x,.06,.425,.17,.115,.07,head);ell(blue,x,.065,.484,.075,.08,.025,head);ell(ink,x,.066,.503,.036,.056,.018,head);ell(white,x-.016,.096,.518,.018,.021,.012,head);const brow=ell(hair,x,.26,.445,.195,.041,.055,head);brow.rotation.z=x>0?-.08:.08;}
 ell(skin,0,-.12,.51,.102,.17,.13,head);tube([[-.23,-.32,.46],[0,-.375,.51],[.23,-.32,.46]],.027,shoe,head);ell(white,0,-.345,.502,.15,.025,.015,head);for(const x of [-.36,.36])ell(coral,x,-.15,.398,.095,.055,.015,head);
 const left=new T.Group(),right=new T.Group();left.position.set(-.58,2.58,0);right.position.set(.58,2.58,0);prof.add(left,right);
 for(const arm of [left,right]){ell(coat,0,-.36,0,.22,.48,.24,arm);ell(skin,0,-.88,.01,.16,.23,.15,arm);for(let j=0;j<3;j++)ell(skin,-.075+j*.065,-1.06,.045,.04,.11,.05,arm);}left.rotation.z=-.15;right.rotation.z=.3;
 // Three deliberately original 'starter' compute capsules on a demonstration table.
 const table=new T.Group();table.position.set(1.35,0,.1);group.add(table);box(white,0,1.2,0,1.9,.18,1.1,table);for(const x of [-.7,.7])box(mint,x,.59,0,.12,1.1,.8,table);
 const capsules=[];for(let i=0;i<3;i++){const x=(i-1)*.57;const c=new T.Group();c.position.set(x,1.48,0);table.add(c);mesh(new T.CylinderGeometry(.23,.23,.35,6),[coral,blue,gold][i],0,0,0,c);box(white,0,0,.21,.18,.12,.03,c);capsules.push(c);}
 const bot=buildLLM();bot.scale.setScalar(.6);bot.position.set(.22,2.72,.28);scene.add(bot);
 // Bright laboratory stage, circular floor, shelves, seedlings and tall windows.
 mesh(new T.CylinderGeometry(5.1,5.3,.25,64),white,0,-.16,0);mesh(new T.CylinderGeometry(4.95,4.95,.04,64),mat(0x93ceb9),0,-.02,0);for(let x=-4;x<=4;x++)box(white,x,0,0,.018,.008,7.4);for(let z=-3;z<=3;z++)box(white,0,.001,z,8,.008,.018);
 box(white,0,2.7,-3.2,11,5.5,.3);for(const x of [-3.6,0,3.6]){box(blue,x,3.15,-3,2.6,3.15,.08);box(white,x,3.15,-2.93,.09,3.15,.09);box(white,x,3.15,-2.93,2.6,.08,.09);}
 for(const x of [-3.9,3.9]){mesh(new T.CylinderGeometry(.38,.3,.65,20),coral,x,.34,.6);for(let j=0;j<5;j++){const leaf=ell(mint,x+Math.sin(j)*.25,1+j*.075,.6+Math.cos(j)*.2,.17,.55,.14);leaf.rotation.z=Math.sin(j)*.7;}}
 for(const x of [-2.8,2.8]){box(white,x,1.2,-2.7,1.6,.16,.6);for(let i=0;i<5;i++){const book=box([gold,coral,mint,blue][i%4],x-.55+i*.22,1.48,-2.7,.16,.5,.37);book.rotation.z=(i%2)*.12;}}
 const sun=new T.DirectionalLight(0xfff0d8,2.0);sun.position.set(-3,8,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:.1,far:30});sun.shadow.normalBias=.035;scene.add(sun,new T.HemisphereLight(0xe7fcff,0x81b59e,.75));const rim=new T.DirectionalLight(0x9fcbff,.3);rim.position.set(5,4,-2);scene.add(rim);
 let previous=-1,shotTime=0;function update(t,step,aspect,layout=null){if(previous!==step){previous=step;shotTime=t;}const enter=Math.min(1,(t-shotTime)/1.2);const reveal=step>0;bot.visible=reveal;table.position.x=aspect<.5?.85:1.2;prof.position.y=Math.sin(t*1.5)*.025;head.rotation.y=Math.sin(t*.7)*.06;head.rotation.z=Math.sin(t*.9)*.025;right.rotation.z=step===0?2.25+Math.sin(t*4.5)*.22:.45+Math.sin(t*1.4)*.09;left.rotation.z=step===1?-.95+Math.sin(t)*.1:-.16;capsules.forEach((c,i)=>{c.rotation.y=t*.35;c.position.y=1.48+Math.sin(t*2+i)*.025;});const blink=Math.sin(t*1.8)> .994;head.scale.y=blink?.985:1;camera.aspect=aspect;camera.position.set((step===1?.55:0)+Math.sin(t*.15)*.06,3.05,aspect<.8?10.8:9.4);camera.lookAt(.25,aspect<.8&&step>=4&&step<=8?1.45:2.45,0);camera.updateProjectionMatrix();group.rotation.y=Math.sin(t*.12)*.035;
 // Project the illustrated palm into this camera, independently of stage sway.
 // Face the camera so the screen envelope remains stable through every shot.
 if(layout){
   camera.updateMatrixWorld();
   const depth=10,units=2*depth*Math.tan(T.MathUtils.degToRad(camera.fov/2))/layout.viewportHeight;
   const px=layout.x,py=layout.y+Math.sin(t*2)*layout.bob;
   const ray=new T.Vector3(px/layout.viewportWidth*2-1,1-py/layout.viewportHeight*2,.5).unproject(camera).sub(camera.position).normalize();
   const forward=camera.getWorldDirection(new T.Vector3());
   bot.scale.setScalar(layout.width*units/1.3);
   bot.position.copy(camera.position).addScaledVector(ray,depth/ray.dot(forward));
   bot.position.addScaledVector(new T.Vector3(0,1,0).applyQuaternion(camera.quaternion),-.155*bot.scale.x);
   bot.quaternion.copy(camera.quaternion);bot.rotateY(Math.sin(t*.65)*.2);
 }else{bot.visible=false;}
}
 update(0,0,1);return {scene,camera,update,bot};
}
