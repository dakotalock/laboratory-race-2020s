import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// One shared, unfiltered ramp: deliberate shadow, midtone and sunlight bands.
const ramp = new T.DataTexture(new Uint8Array([72, 155, 255]), 3, 1, T.RedFormat);
ramp.minFilter = ramp.magFilter = T.NearestFilter;
ramp.generateMipmaps = false;
ramp.needsUpdate = true;

export function celMaterial({roughness, metalness, ...options} = {}) {
  return new T.MeshToonMaterial({...options, gradientMap: ramp});
}

// Color contours work with merged geometry, animated instances and transparent
// panes without duplicating the campus or adding a second geometry render.
export const inkShader = {
  uniforms: {tDiffuse: {value: null}, resolution: {value: new T.Vector2(1, 1)}},
  vertexShader: `varying vec2 vUv;
    void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader: `uniform sampler2D tDiffuse;uniform vec2 resolution;varying vec2 vUv;
    vec3 sampleColor(vec2 offset){return sqrt(clamp(texture2D(tDiffuse,vUv+offset/resolution).rgb,0.,1.));}
    void main(){
      vec4 base=texture2D(tDiffuse,vUv);
      vec3 dx=sampleColor(vec2(1.,0.))-sampleColor(vec2(-1.,0.));
      vec3 dy=sampleColor(vec2(0.,1.))-sampleColor(vec2(0.,-1.));
      float edge=smoothstep(.16,.48,length(dx)+length(dy));
      vec3 ink=min(base.rgb,vec3(.025,.075,.085));
      gl_FragColor=vec4(mix(base.rgb,ink,edge*.62),base.a);
    }`
};
