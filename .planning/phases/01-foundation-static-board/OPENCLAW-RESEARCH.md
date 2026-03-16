# OpenClaw Integration Research — Chess-Poker Task Manager

**Researched:** 2026-02-17
**Domain:** OpenClaw AI agent framework + React/Zustand browser app integration
**Confidence:** MEDIUM (OpenClaw docs verified via WebFetch; integration patterns cross-verified via multiple sources)

---

## Summary

OpenClaw is a self-hosted AI agent gateway that bridges messaging platforms (WhatsApp, Telegram, Discord, iMessage, etc.) with AI coding agents. It is NOT a browser SDK, not a React library, and not a task management framework. It is a local Node.js process running on your machine that listens for messages and drives an AI agent to take actions on your behalf.

Integrating OpenClaw with the Chess-Poker Task Manager is technically feasible via its webhook system and a thin HTTP API layer added to the app. The primary value proposition is natural language task management via messaging apps: you text your WhatsApp "add a task: write annual review, IC=2 AA=1 OV=2 RS=3 RV=2" and OpenClaw's agent parses the request, calculates the score, classifies it as Poker (10 total), and POSTs it to your running app.

However, this integration requires: running OpenClaw as a persistent background process, adding a local HTTP server to the currently server-less React app, and writing a custom skill. The complexity is moderate for an already-technical user. The benefit is high if you frequently create/manage tasks from mobile devices or want ambient AI scoring assistance.

**Primary recommendation:** Add OpenClaw integration as an optional future phase (Phase 4 or 5), after core CRUD and drag-and-drop are working. The integration is cleanest when built on top of a functioning app with stable task operations.

---

## What is OpenClaw

OpenClaw is a **self-hosted AI assistant gateway** created by Peter Steinberger, released under MIT license. It went from zero to the most-starred GitHub project in under three months (late 2025 to February 2026), before Steinberger announced he was joining OpenAI and transferring the project to an open-source foundation.

### What it actually is

- A **Node.js process** (requires Node 22+) that runs on your local machine (Mac, Linux, Raspberry Pi, cloud VPS)
- Acts as a hub between messaging platforms and AI models (Claude, GPT-4, Gemini, etc.)
- You configure it once, then text it from your phone via WhatsApp/Telegram/Discord/etc.
- The agent can use tools: web search, browser automation, shell commands, file system access, HTTP calls

### What it is NOT

- Not a React library or browser SDK
- Not a hosted service (it runs on YOUR machine)
- Not a database or state management layer
- Not designed to be embedded inside a web app

### Key capabilities relevant to this project

| Capability | What it means |
|------------|---------------|
| Webhook endpoints | External systems (including your React app) can trigger the agent via HTTP POST |
| Skills system | Custom markdown-based "skills" teach the agent to call your APIs |
| Browser automation | Agent can navigate web apps using Chrome DevTools Protocol |
| Natural language | User texts in plain English; agent interprets and acts |
| Persistent local process | Always on, accessible from phone messaging apps |

**Sources:**
- https://docs.openclaw.ai/ (official documentation, verified via WebFetch)
- https://github.com/openclaw/openclaw (GitHub README, verified via WebFetch)
- https://ppaolo.substack.com/p/openclaw-system-architecture-overview (architecture deep-dive)

---

## Integration Architecture

There are three viable architecture patterns for connecting OpenClaw to the Chess-Poker Task Manager. They differ fundamentally in WHERE the boundary sits.

### Pattern A: OpenClaw → HTTP API → React App (RECOMMENDED)

```
You (phone)
    |
    | text via WhatsApp/Telegram
    v
OpenClaw Gateway (localhost:18789)
    |
    | AI agent parses intent, calls skill
    v
Custom OpenClaw Skill (SKILL.md)
    |
    | HTTP POST to local API server
    v
Express/Hono server (localhost:3001)
    |
    | writes to shared file or calls Zustand store via API
    v
Chess-Poker React App (localhost:5173)
    |
    | reads from localStorage / polling
    v
Board updates
```

**Key requirement:** The React app currently has NO backend. You need to add a thin local HTTP server that exposes the Zustand store's `addTask`, `updateTask`, `moveTask`, `deleteTask` operations as REST endpoints. This server reads/writes `localStorage` indirectly — or more practically, manages a shared JSON file that the React app also reads.

**Complexity:** Medium. Requires writing ~100 lines of Express/Hono code plus a SKILL.md.

---

### Pattern B: React App → OpenClaw Webhook (REVERSE DIRECTION)

```
Chess-Poker React App
    |
    | user clicks "Analyze task with AI"
    v
POST http://localhost:18789/hooks/agent
    |
    | OpenClaw agent wakes, analyzes task
    | suggests dimension scores, returns JSON
    v
React App receives response
    |
    | updates UI with suggested scores
```

**What this enables:** In-app "AI scoring assistant" button. User fills in task title/description, clicks "Score with AI", OpenClaw agent analyzes and suggests IC/AA/OV/RS/RV scores.

**Key requirement:** OpenClaw must be running locally. The webhook endpoint (`/hooks/agent`) runs an agent turn asynchronously (returns `202 Accepted`). You'd need either polling or a callback mechanism to get results back.

**Complexity:** Medium-Low for triggering. Medium-High for getting results back to the UI (need a callback/polling mechanism since the agent runs async).

---

### Pattern C: Browser Automation (LOW VALUE)

OpenClaw's browser tool can control Chrome via CDP and interact with web UIs directly. In theory, the agent could navigate to `localhost:5173` and click around to create tasks.

**Why this is bad for this use case:**
- Fragile: UI changes break automation
- Slow: full browser round-trip for every operation
- Unnecessary: direct HTTP API is far cleaner
- Overkill: designed for sites without APIs (airlines, forms, etc.)

**Verdict:** Do not use browser automation when you control the app's code.

---

## Integration Points — Specific Features

### 1. Natural Language Task Creation (HIGH VALUE)

**What it does:** Text "add a task: write annual review" from WhatsApp. OpenClaw agent interprets the intent, asks clarifying questions about IC/AA/OV/RS/RV scores (or guesses from context), then POSTs to your app's API.

**What your app needs:**
```javascript
// New endpoint: POST /api/tasks
// Accepts task data, calls addTask() from taskStore logic
app.post('/api/tasks', (req, res) => {
  const { title, description, scores } = req.body
  // Re-use existing classifier logic
  const total = getTotalScore(scores)
  const classification = classifyTask(total)
  // Write to shared tasks.json that React app also reads
  ...
})
```

**OpenClaw skill (SKILL.md):**
```markdown
---
name: chess-poker-task
description: Add, update, or query tasks in the Chess-Poker Task Manager
---

## Adding a Task

When the user wants to add a task, collect:
- title (required)
- description (optional)
- IC score 1-3: Information Completeness
- AA score 1-3: Action Ambiguity
- OV score 1-3: Outcome Visibility
- RS score 1-3: Relationship Sensitivity
- RV score 1-3: Relationship Value

Then POST to http://localhost:3001/api/tasks with JSON body.
```

**Confidence:** HIGH — this is OpenClaw's primary use case pattern.

---

### 2. AI-Assisted Dimension Scoring (HIGH VALUE)

**What it does:** User describes a task in plain English ("I need to have a difficult conversation with my manager about promotion timeline"). OpenClaw agent analyzes it and suggests IC/AA/OV/RS/RV scores with reasoning.

**How it works:** Either via the skill (OpenClaw calls your local API), or via reverse webhook trigger from the React app.

**What your app gets:** Suggested scores JSON:
```json
{
  "scores": { "IC": 1, "AA": 2, "OV": 1, "RS": 3, "RV": 3 },
  "totalScore": 10,
  "classification": "hybrid",
  "reasoning": {
    "IC": "Low information — outcome uncertain",
    "RS": "High sensitivity — career-affecting relationship"
  }
}
```

**Confidence:** MEDIUM — requires prompt engineering to make the agent score consistently. The 5-dimension framework is your own; the agent needs explicit instructions.

---

### 3. Task Status Updates via Messaging (MEDIUM VALUE)

**What it does:** Text "move 'annual review' to in-progress" from Telegram. Agent finds the task by title, calls `PUT /api/tasks/:id/column`.

**Complexity:** Requires fuzzy matching on task titles. Agent would need to list tasks first, find the best match, then update.

**Confidence:** MEDIUM — technically straightforward but UX depends on prompt quality.

---

### 4. Daily Briefing / Summary (MEDIUM VALUE)

**What it does:** Scheduled cron trigger (OpenClaw's built-in cron) sends you a morning summary: "You have 3 Chess tasks in Review, 1 Poker task overdue since last week."

**Requires:** Read endpoint on your API (`GET /api/tasks`), plus OpenClaw cron configuration.

**Confidence:** HIGH for the cron mechanism; MEDIUM for making the summary useful.

---

### 5. Context-Aware Triage (LOW-MEDIUM VALUE)

**What it does:** Describe your day's challenges in a morning message; agent analyzes your current board state and suggests which tasks to prioritize based on Chess/Hybrid/Poker theory.

**Complexity:** High — requires the agent to deeply understand your framework's philosophy, not just call APIs.

**Confidence:** LOW — depends heavily on prompt quality and model capability.

---

## Implementation Approach

### Step 1: Add a Local API Server to the React App

The React app needs to expose its task operations over HTTP. Since it currently uses `localStorage`, the cleanest approach is a small persistence layer using a JSON file that both the API server and the React app can read.

**Option A: Shared JSON file**
- API server writes to `~/.chess-poker/tasks.json`
- React app reads from that file (via `fetch('/api/tasks')` through Vite proxy) instead of localStorage
- Cleanest for OpenClaw integration
- Requires migrating away from localStorage

**Option B: Keep localStorage, add API server as pass-through**
- API server calls `localStorage` via headless browser (awkward)
- NOT recommended — localStorage is browser-only

**Option C: localStorage + polling**
- React app writes to localStorage (unchanged)
- API server writes to `localStorage` via `node-localstorage` with shared file path
- Fragile; different storage instances won't sync between browser and server

**Best path: Option A.** Migrate persistence to a JSON file via the API server. The React app calls its own API (`/api/tasks`) instead of localStorage directly. Vite's `server.proxy` routes `/api` to the local Express server during development.

**Estimated effort:** 2-3 hours for the API server and persistence migration.

---

### Step 2: Install and Configure OpenClaw

```bash
npm install -g openclaw
openclaw setup  # 5-minute guided wizard
```

Configure in `~/.openclaw/openclaw.json`:
- Set your Anthropic API key (or OpenAI key)
- Connect one messaging channel (WhatsApp or Telegram recommended)
- Enable webhooks with a token

---

### Step 3: Write the Chess-Poker Skill

Create `~/.openclaw/workspace/skills/chess-poker/SKILL.md`:

```markdown
---
name: chess-poker
description: Manage tasks in the Chess-Poker Task Manager running on localhost:3001
---

## Context

The Chess-Poker Task Manager classifies tasks into lanes based on 5 dimensions:
- IC (Information Completeness): 1=low to 3=high
- AA (Action Ambiguity): 1=high ambiguity to 3=clear
- OV (Outcome Visibility): 1=unclear to 3=certain
- RS (Relationship Sensitivity): 1=low to 3=high
- RV (Relationship Value): 1=low to 3=high

Total score determines lane:
- 5-7: Chess (deterministic, execute with velocity)
- 8-10: Hybrid (mixed signals, decompose and sequence)
- 11-15: Poker (relationship-driven, time carefully)

## Add a Task

Collect title, optional description, and 5 dimension scores (each 1-3).
POST to http://localhost:3001/api/tasks:
{
  "title": "...",
  "description": "...",
  "scores": { "IC": N, "AA": N, "OV": N, "RS": N, "RV": N }
}

## List Tasks

GET http://localhost:3001/api/tasks
Returns array of tasks with their classification and current column.

## Score a Task (AI Analysis)

When the user describes a task without scores, analyze the description and suggest scores.
Return your reasoning for each dimension before suggesting the final scores.
```

---

### Step 4: Configure Reverse Webhook (Optional)

For in-app "Score with AI" button, call from React:

```javascript
// In React component
async function scoreWithAI(taskDescription) {
  const res = await fetch('http://localhost:18789/hooks/agent', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Score this task using Chess-Poker dimensions: "${taskDescription}"`,
      sessionKey: 'chess-poker-scorer'
    })
  })
  // Returns 202 Accepted — agent runs async
  // Poll GET /api/scoring-results/:requestId or use webhook callback
}
```

**Note:** The async nature of agent execution means you need a callback mechanism. Simplest approach: poll a results endpoint every 2 seconds for up to 30 seconds.

**Harder approach (not needed for v1):** OpenClaw can POST results back to your app via a configured delivery channel.

---

## Feasibility Assessment

### Technical Feasibility: HIGH

OpenClaw's architecture is well-suited for this integration:
- Webhook endpoints are clearly documented and work
- Skills system is straightforward (markdown files, not code)
- The agent can make HTTP calls to localhost
- Community has built similar integrations (see openclaw_react_board on GitHub)

### Complexity: MEDIUM

| Component | Effort | Blocker? |
|-----------|--------|---------|
| Install OpenClaw | 30 min | No |
| Add API server to React app | 2-3 hours | No, but requires architectural change |
| Migrate localStorage to JSON file | 1-2 hours | No |
| Write chess-poker SKILL.md | 1 hour | No |
| Test natural language task creation | 1 hour | No |
| In-app AI scoring button | 3-4 hours | Async complexity |

**Total: approximately 8-11 hours of focused work.**

### Operational Requirements

OpenClaw requires:
- Your machine is on and OpenClaw process is running when you want to use it
- Your local dev server (`npm run dev`) is running for the React app
- For mobile messaging to work: OpenClaw needs to be accessible, which means either your machine is always on or you deploy it to a VPS

**Honest assessment:** For a purely personal local tool, this is fine — you're already at your computer when using the board. For "message from anywhere" mobile use, you need a always-on machine or VPS.

### Benefit Assessment

| Use Case | Value | Frequency |
|----------|-------|-----------|
| Natural language task creation from phone | HIGH | Daily |
| AI-assisted dimension scoring | HIGH | Per task |
| Morning task briefing | MEDIUM | Daily |
| Status updates via messaging | MEDIUM | Occasional |
| In-app AI scoring button | MEDIUM | Per task |

### Risks

1. **OpenClaw future uncertainty (HIGH):** Steinberger announced joining OpenAI on February 14, 2026 and the project moving to a foundation. The project is MIT-licensed and community-driven, so it will continue, but pace/direction may shift. Risk: LOW for near-term use; MEDIUM for long-term dependency.

2. **Always-on requirement:** If your machine sleeps, OpenClaw stops. Use case is limited to desk-adjacent use unless you add a VPS.

3. **Async response complexity:** The agent does not respond synchronously. For in-app use (React calling OpenClaw), you need polling or callback infrastructure. This adds complexity.

4. **Prompt reliability:** AI scoring of tasks can be inconsistent. The same task description may get different scores across runs. This is a fundamental LLM limitation, not an OpenClaw issue.

5. **No official React SDK:** There is no official `@openclaw/react` package. Integration is via plain HTTP. (LOW risk — HTTP is trivial in React.)

---

## Recommendations

### Do this: Add OpenClaw as Phase 4 (after core CRUD + drag-and-drop)

The integration is genuinely valuable and feasible. The right sequence:

1. **Phase 1:** Foundation + static board (current phase)
2. **Phase 2:** Task CRUD with full form + scoring UI
3. **Phase 3:** Drag-and-drop + persistence (localStorage or JSON file)
4. **Phase 4:** OpenClaw integration — API server + skill + natural language input

**Why Phase 4 specifically:** The API server you add for OpenClaw will also require migrating persistence away from raw localStorage. That's a significant architectural change that's cleaner to do after the core app is working end-to-end. Don't introduce that complexity into the foundation phase.

### The minimum valuable integration

If you want the highest-value/lowest-complexity starting point:

1. Add a simple Express server (50 lines) with `POST /api/tasks` that writes to `tasks.json`
2. Modify React app to load tasks from `tasks.json` via API instead of localStorage
3. Write `chess-poker/SKILL.md` (30 lines of markdown)
4. Install OpenClaw, connect WhatsApp or Telegram
5. Text "add task: write annual review" and watch it appear in the board

That's the 80% of value for 20% of effort.

### Don't do this: In-app AI scoring button (for now)

The reverse webhook (React app → OpenClaw → async response → React app) is technically possible but adds polling/callback complexity that isn't worth the effort in early phases. Natural language task creation from messaging apps is a better starting point. Add the in-app button later if messaging feels too indirect.

### Don't do this: Browser automation

OpenClaw's browser tool exists for sites you don't control. Your own app has an API. Use the API.

---

## Key OpenClaw Facts for Planning

| Fact | Confidence | Source |
|------|-----------|--------|
| OpenClaw runs as local Node.js process on port 18789 | HIGH | Official docs |
| Webhook endpoint: POST /hooks/agent returns 202 Async | HIGH | Official docs |
| Skills defined in SKILL.md with YAML frontmatter | HIGH | Official docs + GitHub skills repo |
| Agent can make HTTP calls to localhost from skills | HIGH | ClawHub guide + community examples |
| No official React/browser SDK | HIGH | npm search + docs |
| Skills inject as XML into agent system prompt | HIGH | DeepWiki docs |
| Project transferred to foundation Feb 2026 | HIGH | Multiple news sources |
| No built-in webhook deduplication or retry queue | HIGH | Hookdeck analysis |
| Community has built React kanban + OpenClaw (openclaw_react_board) | MEDIUM | GitHub search |
| Browser automation can interact with localhost apps | MEDIUM | Documentation + blog posts |

---

## Sources

### Primary (HIGH confidence — directly fetched)
- [OpenClaw Official Documentation](https://docs.openclaw.ai/) — architecture, webhook endpoints, skills system
- [OpenClaw GitHub README](https://github.com/openclaw/openclaw) — architecture overview, integration points
- [OpenClaw Webhook Documentation](https://docs.openclaw.ai/automation/webhook) — endpoint specs, auth, response codes
- [OpenClaw Skills Documentation](https://docs.openclaw.ai/tools/skills) — SKILL.md format, frontmatter fields, loading system
- [OpenClaw Skills System (DeepWiki)](https://deepwiki.com/openclaw/openclaw/6.4-skills-system) — skills system technical spec

### Secondary (MEDIUM confidence — fetched + cross-referenced)
- [OpenClaw Architecture Overview (ppaolo.substack.com)](https://ppaolo.substack.com/p/openclaw-system-architecture-overview) — hub-and-spoke architecture details
- [OpenClaw Custom API Integration Guide (LumaDock)](https://lumadock.com/tutorials/openclaw-custom-api-integration-guide) — skill format, HTTP integration
- [OpenClaw React Board (GitHub)](https://github.com/AlexPEClub/openclaw_react_board) — community React kanban + OpenClaw example
- [Mission Control Dashboard (GitHub)](https://github.com/manish-raana/openclaw-mission-control) — webhook event architecture example
- [OpenClaw Skills Marketplace (DigitalApplied)](https://www.digitalapplied.com/blog/clawhub-skills-marketplace-developer-guide-2026) — claw.json format, skill capabilities

### Tertiary (MEDIUM-LOW — single source, informative)
- [Using Hookdeck with OpenClaw](https://hookdeck.com/webhooks/platforms/using-hookdeck-with-openclaw-reliable-webhooks-for-your-ai-agent) — reliability analysis of webhook system
- [OpenClaw Review 2026 (hackceleration.com)](https://hackceleration.com/openclaw-review/) — real-world usage assessment
- [Moltbot API Integration Guide](https://www.clawd-bot.app/articles/clawdbot-api-integration/) — React/HTTP client integration patterns

---

## Metadata

**Confidence breakdown:**
- What OpenClaw is: HIGH — official docs verified
- Webhook API specs: HIGH — official docs, endpoint details verified
- Skills system: HIGH — official docs + multiple community sources
- React integration pattern: MEDIUM — community examples, no official React SDK
- Feasibility estimate: MEDIUM — based on architecture understanding, no hands-on testing
- Effort estimate: LOW-MEDIUM — rough estimates based on comparable integration complexity

**Research date:** 2026-02-17
**Valid until:** 2026-03-17 (30 days — OpenClaw is evolving fast; re-verify before starting Phase 4)

**Critical caveat:** OpenClaw's transfer to a foundation is recent (Feb 14, 2026). The project is MIT-licensed and will continue, but API surface and documentation may shift. Verify current state before starting implementation.
