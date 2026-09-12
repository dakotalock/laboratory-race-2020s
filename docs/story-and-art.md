# LIGHTHOUSE: first story draft

Julian Vale is a fictional investor liaison. Professor Sam remains first. Fresh campaigns then enter the island with no Julian or LLM dialogue until the player ends month one. Julian’s first check-in is followed by visits at months 4, 7, and every three months through month 82. Existing saves retain in-progress scenes and their established quarterly cadence; late arrivals receive a catch-up without a backlog; campaign completion always receives a separate epilogue before the scorecard.

The Commons, Empire and Accord paths combine accumulated story choices with operating policies. Every quarter has three authored scene variants. Earlier decisions, current safety gaps, runway, public trust, energy policy and rival progress affect dialogue. Choices change campaign resources without consuming management actions. Annual decisions add delayed consequences to the existing event queue. The decision archive is available in the director’s office.

Scenes are saved as snapshots, including the current page and response. A choice can only apply once. The game pauses management while a scene is open. Ordinary council dilemmas retain their existing schedule and take priority. Branching is deterministic and does not consume the simulation’s random seed.

## Music

Original synthesized composition, **An Extremely Normal Island**: two 64-step themes, arpeggio accompaniment and a bass line. One scheduler/context serves it and the preserved professor melody. A persistent music preference, first-gesture unlock, visibility handling and explicit track transitions prevent stacked playback. Music and sound effects have separate controls.

## Graphics

The ocean uses analytic fragment normals, several directional swells, warped noise, restrained specular reflection, irregular shoreline surf and distant-detail fading. The surface mesh is a plane; wave detail no longer depends on coarse tessellation. The Helix subtitle wraps within its bubble.

## Portrait provenance

Production asset: `assets/julian-vale.webp`, 720 × 1080 with alpha. Generated using the built-in image-generation tool, then resized and encoded as WebP with alpha preserved. Sam’s existing portrait is unchanged.

Prompt:

> Use case: illustration-story. Create a professional premium Japanese RPG dialogue portrait for an original satirical strategy game, Laboratory Race 2020s. Character: Julian Vale, fictional male venture-capital investor liaison, age about 40, attractive angular face, olive skin, swept-back dark hair with a little silver at temples, expressive hazel eyes, one slightly raised eyebrow, a knowing warm amused smile. Immaculate dark teal suit, cream open-collar shirt, tiny coral pocket square, gold watch. Holding a slim closed cream financial folio under one arm; other hand open in conversational gesture near chest. He radiates charming confidence and exhausted competence, rather than evil. Exceptionally polished anime illustration, precise fine ink lines, sophisticated cel shading with painterly detail in hair and fabric, realistic adult proportions, like a beautifully rendered Persona dialogue portrait. Full head through upper thighs, centered, all hair and both elbows comfortably inside frame. Transparent background with actual alpha, no scenery, no lettering, no logos, no border, no drop shadow. Portrait aspect 2:3. Strong readable silhouette at phone sizes. This is a production character cutout asset, not a screenshot or mockup.

## Validation

`npm test` exercises projected starter clearance, cel-material coverage, application flow, all quarterly story variants, save/reload idempotence, affordability, early endings, migration and music lifecycle. These are source/runtime checks, not a claim of browser visual validation. Review the ocean at close and overview distances, day/night and Battery modes, and the cutscene cards on a small phone before final visual sign-off.
