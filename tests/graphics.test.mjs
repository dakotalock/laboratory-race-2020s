import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {starterLayout} from '../starter-layout.js';
import {buildProfessor} from '../professor-scene.js';
import {buildWorld} from '../world.js';

test('starter animation stays above the illustrated fingers and inside the viewport', () => {
  const {bot, scene, camera, update} = buildProfessor();
  const point = new T.Vector3();
  for (const [width, height] of [[320,568],[375,667],[393,706],[430,932],[768,1024],[1440,900],[844,390]]) {
    for (const step of [1,2,3,4,8,9]) {
      const mobile=width<=760, short=height<=690, choices=step>=4&&step<=8;
      const top=mobile?(short?(choices?89:96):(choices?105:113)):30;
      const bottom=mobile&&choices?(short?280:265):145;
      const portraitWidth=mobile?Math.min(short?(choices?240:270):(choices?285:315),width*(short?(choices?.69:.75):(choices?.75:.83))):455;
      const left=width/2-(mobile?(short?(choices?152:164):(choices?170:185)):335);
      const rect={left,top,width:portraitWidth,height:height-top-bottom};
      const layout={...starterLayout(rect,{width,height},mobile),viewportWidth:width,viewportHeight:height};
      // Traverse actual vertices, not just the robot origin or its resting pose.
      for(let t=0;t<32;t+=.5){
        update(t,step,width/height,layout);scene.updateMatrixWorld(true);
        let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
        bot.traverse(mesh=>{
          if(!mesh.isMesh)return;
          const positions=mesh.geometry.attributes.position;
          for(let i=0;i<positions.count;i++){
            point.fromBufferAttribute(positions,i).applyMatrix4(mesh.matrixWorld).project(camera);
            const x=(point.x+1)*width/2,y=(1-point.y)*height/2;
            minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
          }
        });
        const context=`${width}x${height}, step ${step}, t=${t}`;
        assert.ok(minX>6&&maxX<width-6,`ears clip: ${context}`);
        assert.ok(minY>=layout.top&&maxY<=layout.bottom,`flight envelope exceeded: ${context}`);
        assert.ok(maxY<layout.handTop-9,`hand clearance: ${context}`);
      }
    }
  }
});

test('every solid 3D mesh uses cel bands, including instances and expansions', () => {
  const world=buildWorld(), professor=buildProfessor();
  for(const scene of [world.scene,professor.scene])scene.traverse(mesh=>{
    if(!mesh.isMesh)return;
    for(const material of [].concat(mesh.material)){
      assert.ok(material.isMeshToonMaterial||material.isShaderMaterial,material.type);
      if(material.isMeshToonMaterial){
        assert.equal(material.gradientMap.magFilter,T.NearestFilter);
        assert.equal(material.gradientMap.image.width,3);
      }
    }
  });
  for(const night of [0,.5,1]){
    world.update(12,night,{buildings:{cluster:2,garden:1}});
    assert.equal(world.water.material.uniforms.uNight.value,night);
    assert.equal(world.sky.material.uniforms.uNight.value,night);
    assert.equal(world.expansions.cluster.filter(x=>x.visible).length,2);
    assert.equal(world.expansions.garden.filter(x=>x.visible).length,1);
  }
});
