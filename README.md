# Laboratory Race 2020s

Satirical AI-lab ASI race sim. Play: https://laboratory-race-2020s.onrender.com

Co-created by Dakota Rain Lock & GPT Astra. Recovered from ChatGPT Sites; Three.js via jsDelivr CDN.

Run locally with `python -m http.server 8000`, then open `http://localhost:8000/?intro=1` to replay the introduction. No build step is required.

Graphics checks: `npm ci && npm test` (Node 20+). These check the animated starter's screen and palm clearance across phone, tablet, desktop, and landscape layouts, plus cel-material coverage and day/night state. The npm dependency is only for tests; the game continues to use the pinned CDN release.
