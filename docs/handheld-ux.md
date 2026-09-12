# Handheld menu pass

The campaign now uses a fixed viewport with a consistent resource header, department navigation, and month control. Each department exposes one task at a time instead of a scrolling list of everything the player can do.

- **Research:** choose a discipline, tap a numbered tier, inspect one dossier, and start research. Prerequisites live behind an explicit button and link directly to their dossiers. An Active project button returns to ongoing research. The seventh Architecture tier (ASI) remains reachable.
- **People:** Recruit and Build sections, with one specialist or facility and previous/next controls. Costs, salaries, effects, counts and action requirements remain visible.
- **Council:** Policies, Actions and Ledger sections. One policy family or executive action per page. The ledger contains recurring revenue, operating costs, runway and exposure.
- **Race:** Standings, World and History sections. World metrics and history entries use page controls.
- **Model:** the glass-case display is the home screen. Develop, Reviews, Rivals, History and Field guide open dedicated screens. Technology dossiers mirror the laboratory UI and keep Insight separate. Back returns to the display without forgetting the selected technology.
- **Office:** button grid for sound, help, archives, intro replay, credits and restart. Handbook and archives are paginated. Starting over still requires the existing confirmation.
- **Campus:** camera controls move behind a Camera button. The original 3D camera, scenery and department markers are retained.
- **Council briefings:** browse one response and its consequences at a time before committing. Browsing is free; unavailable responses remain inspectable. Model dilemmas retain their two-choice/swipe mechanic.

Navigation is transient UI state and is not stored in campaign saves. There are no gameplay or balance changes. An outstanding council briefing now also rejects background policy/navigation clicks, matching the model and story guards.

## Layout and accessibility

The screen reserves rows for the HUD and navigation, uses dynamic viewport height and safe-area insets, and gives content the remaining space. Menus have explicit Back/Close, visible page counts and native buttons. Focus is restored after ordinary actions; menu navigation focuses its heading. Camera gestures stay on the island. Browser zoom is not disabled.

Normal menus are designed around a single visible card. Only the active panel can overflow as an accessibility fallback on unusually short viewports, large text or long content; content is never silently cut off to force a fit. The professor introduction and Julian's established cinematic dialogue layout are retained. The model decision display gives up art height first on short screens.

## Validation and limits

Tests exercise every technology and prerequisite, all recruitment/building/policy/action pages, display/back navigation, archival text preservation, affordability, council response paging, background decision guards, and gameplay actions from the new menus. The existing model, story, music and graphics tests remain in the suite.

The cloud browser could not reach the local preview (`ERR_BLOCKED_BY_CLIENT`), so visual layout has not been verified in a browser. Before merging, check iPhone portrait at roughly 375×667 and 390×844 CSS pixels (including Safari's expanded toolbar), landscape, larger text, the ASI prerequisite page, long laboratory names, and model dilemmas with lengthy effects. This PR does not deploy the game.
