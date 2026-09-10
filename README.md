# Laboratory Race 2020s

Turn-based strategy sim: run a frontier AI lab from 2023 and race rivals to ASI.

Recovered from the live ChatGPT Site (`laboratory-race-2020s.dakota-lock.chatgpt.site`) on 2026-09-10 so we can keep iterating outside Astra's usage limit.

## Run locally

```bash
cd /workspace/laboratory-race-2020s
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## First-party source

- `app.js` — UI shell, tabs, saves
- `engine.js` — economy, research, rivals, events
- `world.js` — content data
- `intro.js` — onboarding / professor intro
- `campus-3d.js` / `professor-scene.js` — Three.js scenes
- `style.css` / `graphics.css` / `intro.css`

Co-created by Dakota Rain Lock and GPT Astra.
