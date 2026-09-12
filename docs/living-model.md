# The living model: first gameplay pass

The **Model** tab is separate from institutional research. It adds 30 advances across six specializations: reasoning, computer use, interpretability, subagent systems, memory/perception, and social integration. A branch view presents prerequisite connections vertically for phones; cross-branch prerequisites link to the relevant branch.

## Independent progression

Each campaign starts this system with 6 Insight and gains 3 each month. An advance costs 3–15 Insight, and only one advance or model review is allowed each month. Insight cannot be bought with capital, laboratory research, or management actions. Existing saves start at their current month with no retroactive windfall. Individual nodes change model traits, unlock contextual decisions, or contribute to the capabilities required by later outcomes.

Model traits are Care, Agency, Coherence and Belonging. Agency is not an evil meter; legal recognition is not a safety failure. Reliable, caring, autonomous models can become accepted citizens. Strongly controlled models can still be used for surveillance and authoritarian government. Traits are fictional abstractions and do not establish consciousness.

## Decisions and consequences

Each month brings one two-choice model decision, after any council and Julian scenes. Buttons, intentional horizontal swipes and keyboard arrows are supported. Vertical scrolling, short drags and canceled gestures do not commit. Immediate trait and campaign effects appear on the buttons. Both the question and its aftermath survive reloads; effects apply once.

The deck contains 102 authored ordinary/contextual cards (18 original plus 84 ungated monthly dilemmas) and five conditional crisis/finale cards. It covers external tool access, continuity, refusals, independent evaluation, social participation, agent handoffs, self-revision, representation, infrastructure, surveillance and strategic authority. Contextual cards require appropriate advances. Ordinary cards are never recycled: the scheduler takes an eligible unseen card, including the ungated deck when technology-specific material is unavailable. Even a lab that never upgrades has enough unique prompts for the full 84-month campaign. Every new dilemma has two distinct replies and model-trait consequences. Existing seen IDs and pending snapshots remain valid. Deferred special decisions can still return after three months: these are revisits to an unresolved crisis or settlement, not the ordinary monthly deck. The first model event is eligible only after the player ends month one; existing in-progress cards are preserved.

A model review consumes 3 Insight and the monthly development slot. Reviews can improve reliability, rebuild relationships, or revoke external and executive powers. A containment incident can be repaired or negotiated; it is not automatically a terminal loss.

### Campaign bridges

- A useful assistant banks 1 laboratory research per month while Care and Coherence remain sufficient.
- A recognized citizen adds 0.5 welfare and public trust per month while its rights remain recognized.
- A surveillance dystopia earns $2M/month at the cost of 2 trust and 1 prosperity, in addition to its initial institutional consequences.
- Model decisions and milestones appear in model history. Julian comments on legal recognition, strategic authority, permanent mandates, incidents and the model’s reliability.
- Model outcomes produce Julian epilogues and the campaign scorecard. Four additional terminal outcomes are a shared future, averting a global crisis, permanent machine rule and nuclear catastrophe. Positive outcomes require advanced research and supporting institutions. Dictatorship and nuclear catastrophe require an explicit authority grant and a later, clearly labeled final decision. No real-world weapon or external-system integration exists.

Rivals follow distinct authored development plans using their own Insight and one upgrade slot per month: Helix emphasizes computer use and subagents, Morrow interpretation and social integration, and Vanta reasoning and memory. Their plans resolve prerequisites and budgets independently of campaign cash. They provide a contrasting development trajectory and context for the shared-evaluation decision; they do not introduce a second ASI race timer.

## 3D display

The intro and specimen exhibit share `llm-avatar.js`, preserving the robot’s silhouette and palette. Five expressions reflect current state: happy, worried, stern, serene and mischievous. A transparent case surrounds the model; its front door opens after rights are recognized. One persistent exhibit renderer is reused across DOM updates and pauses when absent or hidden. The campus renderer pauses while the model section is active.

## Documented versus speculative

Historical labels identify selected documented milestones, not the first invention of an entire field or calendar restrictions on an alternate-history campaign. Source links appear on documented nodes. Institutional personhood, verified frontier compacts, civilization-scale agent communities and the far-future outcome systems are labeled **Speculative**.

Primary references checked for this pass:

- [Retrieval-augmented generation, Lewis et al. (2020)](https://arxiv.org/abs/2005.11401)
- [Function calling, OpenAI (2023)](https://openai.com/index/function-calling-and-other-api-updates/)
- [Reasoning models, OpenAI (2024)](https://openai.com/index/learning-to-reason-with-llms/)
- [Computer use, Anthropic (2024)](https://www.anthropic.com/news/3-5-models-and-computer-use)
- [Circuit tracing, Anthropic (2025)](https://www.anthropic.com/research/tracing-thoughts-language-model)
- [Multi-agent research, Anthropic (2025)](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Professional agents and native computer use, OpenAI (2026)](https://openai.com/index/introducing-gpt-5-4/)

The compact two-choice interaction is inspired by [Reigns](https://play.google.com/store/apps/details?id=com.devolver.reigns); characters, writing, art and game rules here are original.

## Validation and limits

Run `npm test`. Tests cover all branches and prerequisite acyclicity; independent budgets; monthly limits; legacy saves; decision snapshots and idempotence; citizenship with high autonomy; containment recovery; permission revocation; ongoing dystopian consequences; all four terminal paths through actual development purchases and monthly choices; Julian epilogues; swipe cancellation; and the existing application, music, starter-framing and story checks.

The terminal-path tests exercise model development without rival race pressure. They establish reachability, not a complete balance assessment of the combined campaign. Browser visual review and phone playtesting remain pending. Review all six navigation buttons, specimen framing, the open case, long dilemma text and the monthly sequence of council/story/model scenes before final visual sign-off.
