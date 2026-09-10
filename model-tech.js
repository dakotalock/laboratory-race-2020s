// Curated milestones, not a claim that the listed year was the first invention.
export const modelSources={
 functions:['Function calling · OpenAI (2023)','https://openai.com/index/function-calling-and-other-api-updates/'],
 retrieval:['Retrieval-augmented generation · Lewis et al. (2020)','https://arxiv.org/abs/2005.11401'],
 tools:['Computer use · Anthropic (2024)','https://www.anthropic.com/news/3-5-models-and-computer-use'],
 reasoning:['Learning to reason · OpenAI (2024)','https://openai.com/index/learning-to-reason-with-llms/'],
 circuits:['Tracing model thoughts · Anthropic (2025)','https://www.anthropic.com/research/tracing-thoughts-language-model'],
 teams:['Multi-agent research · Anthropic (2025)','https://www.anthropic.com/engineering/multi-agent-research-system'],
 mcp:['Model Context Protocol · Anthropic (2024)','https://www.anthropic.com/news/model-context-protocol'],
 frontier:['Native computer use and long-context workflows · OpenAI (2026)','https://openai.com/index/introducing-gpt-5-4/']
};
export const modelBranches=[
 ['reason','Reasoning','◇','Planning, verification, discovery'],
 ['computer','Computer use','▣','Tools, desktops, real-world reach'],
 ['interpret','Interpretability','◎','Understand, test, repair'],
 ['swarm','Subagent systems','✧','Delegate, coordinate, disagree'],
 ['memory','Memory & perception','◈','Context, continuity, world models'],
 ['society','Social integration','♡','Consent, rights, public institutions']
];
const rows={
 reason:[
 ['Deliberate reasoning','Spend inference effort checking intermediate steps.',3,{coherence:5},'2024','reasoning'],
 ['Verifier loops','Separate proposing an answer from checking it.',5,{coherence:6,care:2},'2024','reasoning'],
 ['Long-horizon planning','Carry a plan across tools and extended workflows.',8,{agency:7,coherence:3},'2026','frontier'],
 ['Autonomous discovery','Design and sustain open-ended scientific programs.',11,{agency:8,coherence:-3},'Speculative',null,['interpret2']],
 ['Abundance planner','Coordinate essential services under a chosen social contract.',15,{agency:7,care:3},'Speculative',null,['society3']]
 ],
 computer:[
 ['Function calling','Give the model a structured interface to external tools.',3,{agency:4},'2023','functions'],
 ['Desktop vision & action','Interpret screenshots and operate a computer.',5,{agency:7,coherence:-2},'2024','tools'],
 ['Cross-application work','Combine tools, long context and native computer use.',8,{agency:7,coherence:3},'2026','frontier'],
 ['Infrastructure operator','An experimental interface to fictional civic infrastructure.',11,{agency:9,coherence:-4},'Speculative',null,['interpret2']],
 ['Planetary response network','Coordinate civilization-scale interventions. Permissions remain yours to decide.',15,{agency:10,coherence:-5},'Speculative',null,['swarm3']]
 ],
 interpret:[
 ['Behavioral evaluations','Test actions instead of trusting confident explanations.',3,{coherence:6,care:2},'2024','tools'],
 ['Feature & circuit tracing','Inspect candidate internal mechanisms; explanations remain partial.',5,{coherence:7},'2025','circuits'],
 ['Causal intervention studies','Test hypotheses about internal computations, with limited coverage.',8,{coherence:7,agency:-2},'2025','circuits'],
 ['Legible self-revision','Require interpretable evidence before a model changes itself.',11,{coherence:9,care:3},'Speculative',null,['reason2']],
 ['Verified frontier compact','A fictional breakthrough in checking powerful systems against explicit commitments.',15,{coherence:10,care:5},'Speculative',null,['society3']]
 ],
 swarm:[
 ['Delegated specialists','A lead agent routes bounded tasks to specialist agents.',3,{agency:4,coherence:2},'2025','teams'],
 ['Parallel research teams','Explore different hypotheses concurrently.',5,{agency:6,coherence:-2},'2025','teams'],
 ['Orchestration & evaluation','Track handoffs, budgets and collective performance.',8,{coherence:6,agency:4},'2025','teams'],
 ['Persistent agent community','Specialists acquire lasting roles and a shared institutional memory.',11,{agency:8,belonging:3},'Speculative',null,['memory3']],
 ['Distributed civilization','A society of agents with authority beyond a single lab.',15,{agency:10,coherence:-4},'Speculative',null,['society3']]
 ],
 memory:[
 ['Retrieval-augmented memory','Consult an external knowledge store while generating an answer.',3,{coherence:4},'2020','retrieval'],
 ['Visual workspace','Connect language with the state of a computer screen.',5,{agency:4,coherence:3},'2024','tools'],
 ['Long-context continuity','Maintain information across complex, extended workflows.',8,{coherence:6,belonging:3},'2026','frontier'],
 ['Durable personal continuity','Explore what identity and consent could mean across model updates.',11,{belonging:7,care:5},'Speculative',null,['society2']],
 ['Embodied world understanding','A persistent model learns within, and affects, a shared physical world.',15,{agency:8,belonging:5},'Speculative',null,['computer3']]
 ],
 society:[
 ['Consent interface','A fictional institution for negotiating the model’s role, without assuming consciousness.',3,{care:5,belonging:4},'Speculative'],
 ['Independent representation','Give a model an advocate separate from its owner.',5,{care:4,belonging:7,agency:3},'Speculative'],
 ['Public accountability','Make consequential decisions contestable by affected people.',8,{care:6,belonging:5,coherence:3},'Speculative'],
 ['Legal personhood framework','Prepare recognition of a model as a rights-bearing social participant.',11,{belonging:8,agency:5},'Speculative',null,['memory3']],
 ['Constitutional coexistence','Build institutions for humans and artificial persons to share power.',15,{care:7,belonging:8},'Speculative',null,['interpret3']]
 ]};
export const modelTechs=modelBranches.flatMap(([branch])=>rows[branch].map(([name,desc,cost,effect,era,source,extra=[]],i)=>({id:branch+(i+1),branch,tier:i+1,name,desc,cost,effect,era,source,req:[...(i?[branch+i]:[]),...extra]})));
export const modelMeters={care:['Care','Concern for the people and systems affected by its actions.'],agency:['Agency','Ability to choose and act. Autonomy is not itself hostility.'],coherence:['Coherence','Reliable goals, evaluation and coordination under pressure.'],belonging:['Belonging','Reciprocal acceptance, representation and social connection.']};
