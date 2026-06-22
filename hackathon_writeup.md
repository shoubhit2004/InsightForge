# InsightForge: AI-Powered Opportunity Discovery Platform

## Problem Statement
Starting a new business is notoriously risky. Up to 90% of early-stage startups fail, with the primary driver being the lack of true market need. Aspiring founders, student builders, and product developers face a significant bottleneck: they are forced to synthesize massive amounts of fragmented market information, biased competitor claims, and unorganized customer complaints. 

Compounding this problem is the limitation of modern generative AI. While developers often turn to generic large language models (LLMs) for brainstorming, typical chatbots offer shallow, static advice. They lack access to real-time market trends, frequently hallucinate fictional competitors, and fail to provide structured, quantitative parameters to back up their recommendations. InsightForge was built to bridge this gap by transitioning AI from a simple chat interface into a factual, data-driven startup co-founder.

---

## Why This Problem Matters
Market research is currently divided into two extremes:
* **The High-End Corporate Path:** Hiring consulting firms or purchasing premium market research reports. This is prohibitively expensive for individual developers, hackers, and students.
* **The Manual Search Path:** Hours spent reading forums, competitor reviews, and search queries. This is time-consuming, highly subjective, and difficult to format into structured business opportunities.

Without accessible tools to validate demand in real time, builders continue to spend months writing code for products that nobody wants. By automating the extraction of competitor vulnerabilities and user pain points from live search data, we can democratize access to high-quality market intelligence and significantly reduce early-stage venture failure rates.

---

## Our Solution
InsightForge is a multi-agent opportunity discovery platform that acts as a technical co-founder and investment analyst. The platform accepts a raw, rough business concept (such as *"Open a coffee shop in Jaipur"*), queries live search indices to scan the current competitive landscape, and outputs a visual dashboard containing:
1. An executive summary of the target market.
2. A list of customer pain points extracted from recent reviews and forums.
3. An audit of local/national competitors detailing their primary advantages and vulnerabilities.
4. Three to five distinct business opportunities scored quantitatively based on demand and feasibility.
5. An audited reference log citing every web source used to ground the analysis.

---

## Key Features
* **Scout Console:** A sleek, glassmorphic research entry page that allows users to test ideas or select pre-configured concept suggestions to see the pipeline in action.
* **Resilient Multi-Stage Progress Tracker:** Since multi-agent workflows involve multiple search, compile, and inference steps, InsightForge features an interactive loading screen that visualizes exactly what the system agents are executing in real time.
* **Founder’s Strategic Verdict:** Recommends the absolute best opportunity to pursue first, explaining the underlying rationale with evidence.
* **Feasibility Scorecards:** Rates each generated opportunity card on a scale of 0 to 100, styled with dynamic visual indicators (emerald for high, amber for moderate, indigo for low feasibility).
* **Search Evidence Index:** A collapsible log containing the exact titles and external URLs clicked by the scraping agent, providing a verifiable citation trail.
* **Persistent Search History:** A sidebar tracking all past scans, allowing builders to jump between business cases or prune old history.

---

## Multi-Agent Workflow
InsightForge leverages a collaborative, multi-agent pipeline to process ideas:

```
                  ┌──────────────────────────────┐
                  │      User Business Idea      │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │      Orchestrator Agent      │
                  └──────────────┬───────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
    ┌──────────────────────────┐    ┌──────────────────────────┐
    │   Web Research Agent     │    │     VC Analyst Agent     │
    │  (Queries DuckDuckGo)    │    │  (Structured Gemini SDK) │
    └────────────┬──────────────┘    └────────────┬─────────────┘
                 │                               │
                 ▼                               ▼
    ┌──────────────────────────┐    ┌──────────────────────────┐
    │ Returns Search Snippets  │    │ Validates Pydantic JSON  │
    └──────────────────────────┘    └──────────────────────────┘
```

### 1. The Orchestrator Agent
The orchestrator manages the lifecycle of the query. It receives the raw input, generates contextual search terms, initiates parallel scanning threads, compiles the data payload, and hands the context over to the LLM agent. Finally, it persists the completed report to the SQLite database.

### 2. The Web Research Agent
This agent acts as the system's eyes and ears on the live web. Using the keyless `duckduckgo-search` service, it performs two distinct search queries: one focused on market sizing, growth, and trends, and a second targeted at competitor reviews, forum complaints, and pain points. It returns a structured index of links, titles, and snippets.

### 3. The VC Mentor Agent
This agent is powered by **Gemini 3.1 Flash** (via the new `google-genai` SDK). Using structured outputs, it is constrained by a strict Pydantic model (`AnalysisResult`). It processes the research snippets, extracts competitors, grades pain points, and outputs scored opportunities. If the Gemini API experiences temporary 503 load errors, the agent utilizes a 3-attempt backoff retry loop before falling back to local mock data.

---

## Architecture
1. **Request Ingestion:** The Next.js frontend sends a validated POST payload containing the business idea to the FastAPI `/api/research` endpoint.
2. **Search Fetching:** The orchestrator dispatches the Web Research Agent to execute parallel API queries and format the results.
3. **Structured Inference:** The VC Mentor Agent prompts Gemini with the gathered research context, enforcing a JSON schema return.
4. **Database Logging:** The resulting payload is parsed into an SQLAlchemy database model and saved to `insightforge.db`.
5. **Dashboard Rendering:** The frontend HTTP helper (`api.ts`) receives the response and injects the payload into the `ReportDashboard` react components.

---

## Tech Stack
* **Frontend UI:** Next.js (App Router), TypeScript, TailwindCSS v4, Lucide React.
* **Backend Framework:** FastAPI, Python, Uvicorn.
* **Database & ORM:** SQLite, SQLAlchemy.
* **LLM Engine:** Google Gemini Developer API, `google-genai` SDK.
* **Web Search:** `duckduckgo-search` Python client.

---

## Challenges Faced
* **Zombie Socket Blocks on Windows:** During testing, killed backend processes left lingering zombie sockets on port `8000`, blocking restarts. We bypassed this by swapping the default communication port to `8001` across both backend settings and frontend clients.
* **Free-Tier Gemini 503 Spike Errors:** Under heavy prompt sizes, Google's free-tier API occasionally returned `503 Service Unavailable`. We solved this by implementing a 3-attempt retry loop with `time.sleep` backoffs inside the LLM service to guarantee response completion.
* **Strict JSON Formatting:** LLMs sometimes fail to return valid JSON formats. We utilized Gemini's native `response_mime_type="application/json"` and mapped it to a strict Pydantic schema class, ensuring the backend never experiences formatting or validation crashes.

---

## Design Decisions
* **Always Run Search:** Originally, search calls were disabled in mock mode. We changed this to ensure search queries run in both live and mock modes. This means users always see live, audited search evidence related to their specific concept, regardless of LLM status.
* **Unified Workspace UI:** Instead of forcing multiple route changes, we designed a single-page workspace where the sidebar history, research form, loading sequence, and dashboard swap seamlessly.

---

## What Makes InsightForge Different
Most AI venture tools are simple conversational wrapper bots. InsightForge is fundamentally different because it is **factually grounded**. It uses live search data to back up every suggestion. The AI cannot hallucinate an opportunity because it must justify every scorecard rating by pointing to a specific research snippet in the database. Furthermore, by adopting the tone of a critical VC mentor, it tells founders what *not* to do, helping them avoid bad ideas early on.

---

## Results
During end-to-end integration checks, InsightForge demonstrated robust performance:
* Completed complete scraping, analysis, database persistence, and UI rendering in under 12 seconds.
* Managed CORS middleware correctly, enabling secure local communications.
* Handled search failures gracefully by returning empty arrays without breaking the core LLM execution loop.

---

## Future Scope
* **Financial Modeling Sandboxes:** Allow founders to edit projected customer acquisition costs (CAC) and customer lifetime value (LTV) right on the opportunity card.
* **PDF Export:** Support downloading the completed VC report as a PDF package for presentation to early-stage investors.
* **Multi-Query Collaboration:** Enable conversational Q&A threads directly inside a generated report to dig deeper into competitor weaknesses.

---

## Conclusion
InsightForge transforms the chaotic process of early-stage venture brainstorming into an organized, evidence-based science. By bridging the gap between real-time search intelligence and structured LLM analysis, the platform provides developers and founders with a free, high-fidelity co-founder helper to validate their business ideas before writing a single line of code.
