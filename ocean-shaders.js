// Keep geometry still at this camera scale: the old 15m tessellation aliased
// short waves. Analytical fragment normals carry continuous, detailed swells.
export const vertexWater = `varying vec3 vWorld;
void main(){vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`;
export const fragmentWater = `uniform float uTime;uniform float uNight;uniform vec3 uSun;varying vec3 vWorld;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
float detail(vec2 p){return noise(p)*.62+noise(p*2.07+vec2(13.,7.))*.26+noise(p*4.13)*.12;}
void main(){
 vec2 p=vWorld.xz;float t=uTime*.38;
 vec2 wind=vec2(.94,.342),crosswind=vec2(-.342,.94);
 float along=dot(p,wind),across=dot(p,crosswind);
 float warp=detail(p*.055+vec2(t*.08,-t*.03));
 float a=along*.31-t+warp*.7,b=dot(p,vec2(.63,-.777))*.19-t*.73;
 float c=dot(p,vec2(-.18,.984))*.53-t*1.17;
 vec2 slope=wind*cos(a)*.075+vec2(.63,-.777)*cos(b)*.047+vec2(-.18,.984)*cos(c)*.022;
 float distanceToEye=length(cameraPosition-vWorld);
 float fine=1.-smoothstep(65.,180.,distanceToEye);
 slope+=crosswind*(detail(vec2(along*.18-t*.4,across*.72+t*.2))-.5)*.05*fine;
 vec3 n=normalize(vec3(-slope.x,1.,-slope.y)),eye=normalize(cameraPosition-vWorld);
 float fresnel=.035+.40*pow(1.-max(dot(eye,n),0.),4.);
 float r=length(p/vec2(32.,23.)),angle=atan(p.y/23.,p.x/32.);
 float edge=1.+.06*sin(angle*7.)+.035*sin(angle*13.);
 float shore=r-edge*.89;
 float shallows=1.-smoothstep(.02,.28,shore);
 vec3 deep=mix(vec3(.016,.22,.34),vec3(.006,.027,.066),uNight);
 vec3 lagoon=mix(vec3(.035,.48,.46),vec3(.018,.115,.145),uNight);
 vec3 col=mix(deep,lagoon,shallows*.78);
 vec3 reflectedSky=mix(vec3(.33,.62,.68),vec3(.045,.09,.17),uNight);
 col=mix(col,reflectedSky,fresnel);
 col*=1.+(sin(a)*.028+sin(b)*.022+warp*.035)*(1.-uNight*.4);
 // Subtle glints, never a white disc painted onto the whole ocean.
 vec3 halfVector=normalize(eye+normalize(uSun));
 float glint=pow(max(dot(n,halfVector),0.),96.);
 col+=vec3(.32,.27,.15)*glint*.16*(1.-uNight);
 // One irregular surf ribbon hugs the actual waterline; no concentric comb.
 float surge=sin(t*.8+angle*3.)*.006+(detail(p*.22-t*.08)-.5)*.019;
 float foamDistance=abs(shore-.025-surge);
 float aa=max(fwidth(shore)*1.2,.0025);
 float surf=1.-smoothstep(.009,.018+aa,foamDistance);
 surf*=smoothstep(.23,.58,detail(p*.36+vec2(t*.13,-t*.09)));
 float offshore=smoothstep(.10,.22,shore);
 // Long, sparse wind streaks, broken by noise and faded before aliasing.
 float streak=detail(vec2(along*.075-t*.06,across*.9+warp*.6));
 float whitecap=smoothstep(.77,.86,streak)*smoothstep(.25,.8,sin(a))*.22*offshore*fine;
 vec3 foam=mix(vec3(.62,.83,.76),vec3(.10,.22,.26),uNight);
 col=mix(col,foam,clamp(surf*.68+whitecap,0.,.72));
 float haze=smoothstep(130.,520.,length(p));
 col=mix(col,reflectedSky,haze*.6);
 gl_FragColor=vec4(col,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
