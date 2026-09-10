import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {buildLLM} from './llm-avatar.js';
import {celMaterial} from './cel-style.js';
import {modelExpression} from './model-system.js';
export function buildModelDisplay(){
 const scene=new T.Scene();scene.background=new T.Color(0x143f4b);const camera=new T.PerspectiveCamera(33,1,.1,30);camera.position.set(2.6,1.8,4.8);camera.lookAt(0,.05,0);
 const bot=buildLLM();scene.add(bot);
 const base=new T.Mesh(new T.CylinderGeometry(.96,1.04,.15,64),celMaterial({color:0xedd69d}));base.position.y=-.72;scene.add(base);
 const floor=new T.Mesh(new T.CylinderGeometry(.87,.87,.04,64),celMaterial({color:0x296375}));floor.position.y=-.625;scene.add(floor);
 const glassMaterial=celMaterial({color:0xbbe8e9,transparent:true,opacity:.065,depthWrite:false,side:T.DoubleSide});
 const glass=new T.Group();scene.add(glass);
 const pane=(w,h,x,y,z,rx=0,ry=0,parent=glass)=>{const p=new T.Mesh(new T.PlaneGeometry(w,h),glassMaterial);p.position.set(x,y,z);p.rotation.set(rx,ry,0);parent.add(p);return p;};
 pane(1.7,1.75,0,.22,-.625);pane(1.25,1.75,-.85,.22,0,0,Math.PI/2);pane(1.25,1.75,.85,.22,0,0,Math.PI/2);pane(1.7,1.25,0,1.095,0,Math.PI/2);
 const edges=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(1.7,1.75,1.25)),new T.LineBasicMaterial({color:0xb1dcd5,transparent:true,opacity:.4}));edges.position.y=.22;scene.add(edges);
 const door=new T.Group();door.position.set(.85,.22,.625);glass.add(door);const front=pane(1.7,1.75,-.85,0,0,0,0,door);
 const doorFrame=new T.LineSegments(new T.EdgesGeometry(front.geometry),new T.LineBasicMaterial({color:0xa8d3d2,transparent:true,opacity:.5}));front.add(doorFrame);
 const sun=new T.DirectionalLight(0xffefc7,2);sun.position.set(-3,6,5);scene.add(sun,new T.HemisphereLight(0xd7f9ff,0x255345,1));
 function update(time,model){bot.position.y=.06+Math.sin(time*1.8)*.07;bot.rotation.y=Math.sin(time*.6)*.18;bot.userData.setExpression(modelExpression(model));glassMaterial.opacity=model?.flags.rights?.035:.065;edges.material.opacity=model?.flags.rights?.18:.4;door.rotation.y=model?.flags.rights?1.15:0;}
 return {scene,camera,bot,glass,update};
}
let renderer,display,container=null,observer,frame=0,model=null,failed=false;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function resize(){if(!container||!renderer)return;const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);display.camera.aspect=w/h;display.camera.updateProjectionMatrix();}
function draw(t){frame=0;if(!container?.isConnected||document.hidden)return;display.update(reduced?0:t/1000,model);renderer.render(display.scene,display.camera);frame=requestAnimationFrame(draw);}
function mount(detail){model=detail?.state?.model;const next=detail?.intro||detail?.state?.story?.pending?null:(document.querySelector('dialog [data-model-vitrine]')||document.querySelector('[data-model-vitrine]'));if(next===container)return;observer?.disconnect();if(frame)cancelAnimationFrame(frame);frame=0;container=next;if(!container)return;if(failed){container.textContent='LLM-001 · '+modelExpression(model);return;}
 try{if(!renderer){renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.NeutralToneMapping;renderer.domElement.setAttribute('aria-label','LLM-001 floating in a glass display case');renderer.domElement.setAttribute('role','img');display=buildModelDisplay();observer=new ResizeObserver(resize);}
 container.appendChild(renderer.domElement);observer.observe(container);resize();frame=requestAnimationFrame(draw);
 }catch(error){failed=true;container.textContent='LLM-001 · '+modelExpression(model);console.warn('Model display unavailable',error);}
}
window.addEventListener('lab-render',e=>mount(e.detail));document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else if(container&&!frame)frame=requestAnimationFrame(draw);});
mount(window.__labSnapshot);
