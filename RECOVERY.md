# Recovery inventory — Laboratory Race 2020s

Recovered from the live site on 2026-09-10 using the already-authenticated Chrome session. The game loaded successfully at `https://laboratory-race-2020s.dakota-lock.chatgpt.site/`; no additional site login was required.

## App source and HTML

- `recovered/app.js` — 25.5 KiB
- `recovered/campus-3d.js` — 9.5 KiB
- `recovered/engine.js` — 21.2 KiB
- `recovered/graphics.css` — 13.7 KiB
- `recovered/index.html` — 2.0 KiB
- `recovered/intro.css` — 8.0 KiB
- `recovered/intro.js` — 6.9 KiB
- `recovered/professor-scene.js` — 6.1 KiB
- `recovered/style.css` — 29.7 KiB
- `recovered/world.js` — 23.5 KiB

## Three.js/vendor source used by the app

- `recovered/vendor/addons/controls/OrbitControls.js` — 37.8 KiB
- `recovered/vendor/addons/environments/RoomEnvironment.js` — 4.8 KiB
- `recovered/vendor/addons/postprocessing/EffectComposer.js` — 8.3 KiB
- `recovered/vendor/addons/postprocessing/MaskPass.js` — 4.6 KiB
- `recovered/vendor/addons/postprocessing/OutputPass.js` — 4.0 KiB
- `recovered/vendor/addons/postprocessing/Pass.js` — 4.1 KiB
- `recovered/vendor/addons/postprocessing/RenderPass.js` — 4.0 KiB
- `recovered/vendor/addons/postprocessing/ShaderPass.js` — 3.2 KiB
- `recovered/vendor/addons/postprocessing/UnrealBloomPass.js` — 14.1 KiB
- `recovered/vendor/addons/shaders/CopyShader.js` — 0.7 KiB
- `recovered/vendor/addons/shaders/LuminosityHighPassShader.js` — 1.3 KiB
- `recovered/vendor/addons/shaders/OutputShader.js` — 1.8 KiB
- `recovered/vendor/addons/utils/BufferGeometryUtils.js` — 34.7 KiB
- `recovered/vendor/three.core.js` — 1.34 MiB
- `recovered/vendor/three.module.js` — 589.0 KiB

## Images and fonts

- `recovered/assets/campus.webp` — 583.0 KiB
- `recovered/assets/professor-sam-altman.webp` — 196.0 KiB

- `recovered/fonts/fonts.css` — 13.9 KiB
- `recovered/fonts/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2` — 36.1 KiB
- `recovered/fonts/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu6-K6h9Q.woff2` — 17.8 KiB
- `recovered/fonts/xn7gYHE41ni1AdIRggOxSuXd.woff2` — 14.2 KiB
- `recovered/fonts/xn7gYHE41ni1AdIRggSxSuXd.woff2` — 9.2 KiB
- `recovered/fonts/xn7gYHE41ni1AdIRggexSg.woff2` — 24.3 KiB
- `recovered/fonts/xn7gYHE41ni1AdIRggixSuXd.woff2` — 8.3 KiB
- `recovered/fonts/xn7gYHE41ni1AdIRggmxSuXd.woff2` — 14.8 KiB
- `recovered/fonts/xn7gYHE41ni1AdIRggqxSuXd.woff2` — 2.5 KiB

## Source maps

I probed the corresponding `.map` URLs for the app and vendor JavaScript/CSS. The server returned the site's 2,083-byte HTML shell for each probe rather than a source-map JSON payload. Those fallback responses were retained under `recovered/**/*.map` for traceability, but **no usable source maps were present**.

Retained fallback probes:
- `recovered/app.js.map` — 2.0 KiB
- `recovered/campus-3d.js.map` — 2.0 KiB
- `recovered/engine.js.map` — 2.0 KiB
- `recovered/graphics.css.map` — 2.0 KiB
- `recovered/intro.css.map` — 2.0 KiB
- `recovered/intro.js.map` — 2.0 KiB
- `recovered/professor-scene.js.map` — 2.0 KiB
- `recovered/style.css.map` — 2.0 KiB
- `recovered/vendor/addons/controls/OrbitControls.js.map` — 2.0 KiB
- `recovered/vendor/addons/environments/RoomEnvironment.js.map` — 2.0 KiB
- `recovered/vendor/addons/postprocessing/EffectComposer.js.map` — 2.0 KiB
- `recovered/vendor/addons/postprocessing/MaskPass.js.map` — 2.0 KiB
- `recovered/vendor/addons/postprocessing/OutputPass.js.map` — 2.0 KiB
- `recovered/vendor/addons/postprocessing/Pass.js.map` — 2.0 KiB
- `recovered/vendor/addons/postprocessing/RenderPass.js.map` — 2.0 KiB
- `recovered/vendor/addons/postprocessing/ShaderPass.js.map` — 2.0 KiB
- `recovered/vendor/addons/postprocessing/UnrealBloomPass.js.map` — 2.0 KiB
- `recovered/vendor/addons/shaders/CopyShader.js.map` — 2.0 KiB
- `recovered/vendor/addons/shaders/LuminosityHighPassShader.js.map` — 2.0 KiB
- `recovered/vendor/addons/shaders/OutputShader.js.map` — 2.0 KiB
- `recovered/vendor/addons/utils/BufferGeometryUtils.js.map` — 2.0 KiB
- `recovered/vendor/three.core.js.map` — 2.0 KiB
- `recovered/vendor/three.module.js.map` — 2.0 KiB
- `recovered/world.js.map` — 2.0 KiB

## Site editor/export check

ChatGPT Sites was opened while signed in as Dakota Lock. `Laboratory Race 2020s` was present in the Sites list. Its editor exposed Visit, Share, Analytics, Settings, and an edit prompt; the More actions menu exposed Open site, Edit, Analytics, and Settings. Settings contained name/URL/sharing/environment-variable/delete controls. No Export, Download, Code, Open in Codex, or View files control was available, so no ZIP/source export was obtained.

## Notes

- The recoverable first-party app logic is in `recovered/app.js`, `intro.js`, `engine.js`, `campus-3d.js`, `world.js`, and `professor-scene.js`.
- CSS is in `recovered/style.css`, `graphics.css`, and `intro.css`.
- The 3D rendering dependency and postprocessing modules are retained under `recovered/vendor/`.
- Total retained files: 60; usable non-map files: 36.

## Observed first-party app URLs

From the browser's loaded-resource list:

- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/style.css`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/graphics.css`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/intro.css`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/app.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/intro.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/engine.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/campus-3d.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/world.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/professor-scene.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/assets/campus.webp`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/assets/professor-sam-altman.webp`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/three.module.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/three.core.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/addons/controls/OrbitControls.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/addons/postprocessing/EffectComposer.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/addons/postprocessing/RenderPass.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/addons/postprocessing/OutputPass.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/addons/postprocessing/UnrealBloomPass.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/addons/environments/RoomEnvironment.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/addons/utils/BufferGeometryUtils.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/addons/shaders/CopyShader.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/addons/shaders/OutputShader.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/addons/shaders/LuminosityHighPassShader.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/addons/postprocessing/ShaderPass.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/addons/postprocessing/MaskPass.js`
- `https://laboratory-race-2020s.dakota-lock.chatgpt.site/vendor/addons/postprocessing/Pass.js`

No JSON, WASM, GLB/GLTF, audio, or additional first-party image URL appeared in the loaded-resource list or in the recovered app references.
