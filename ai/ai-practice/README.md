# OpenAI Practice Lab

A comprehensive 2-hour hands-on learning experience with OpenAI's Assistant API, featuring structured outputs, RAG with built-in `file_search`, and practical Python implementations.

## Quick Start

1. **Clone and setup**:

   ```bash
   git clone <your-repo-url>
   cd openai-practice-lab
   pip install -r requirements.txt
   ```

2. **Configure API access**:

   ```bash
   cp .env.example .env
   # Edit .env with your OPENAI_API_KEY
   ```

3. **Run the labs**:
   ```bash
   python scripts/00_init_assistant.py      # Bootstrap assistant
   python scripts/01_responses_api.py       # Threads → Runs → streaming
   python scripts/02_structured_output.py   # JSON-mode + function tools
   python scripts/03_rag_file_search.py     # End-to-end RAG
   python scripts/99_cleanup.py            # Clean up resources
   ```

## Repository Structure

```
openai-practice-lab/
│
├─ README.md              # This file - Quick-start & roadmap
├─ requirements.txt       # openai>=1.83.0, python-dotenv, pydantic, pytest
├─ .env.example           # OPENAI_API_KEY, OPENAI_ORG (optional)
│
├─ scripts/
│   ├─ 00_init_assistant.py      # Helper: creates or updates one reusable assistant
│   ├─ 01_responses_api.py       # Walk-through of Threads → Runs → streaming
│   ├─ 02_structured_output.py   # JSON-mode + function tools demo
│   ├─ 03_rag_file_search.py     # End-to-end RAG with `file_search`
│   └─ 99_cleanup.py            # Delete test threads, files, runs
│
├─ data/                         # Sample PDFs / Markdown to upload
│
└─ tests/
    └─ test_runs.py              # pytest sanity checks (<5 min)
```

## 2-Hour Learning Roadmap

| Time    | Action                                                    |
| ------- | --------------------------------------------------------- |
| 0-10    | Clone repo, `pip install -r requirements.txt`, set `.env` |
| 10-30   | Run **00** + **01** (Responses API basics)                |
| 30-50   | Run **02** (Structured Outputs)                           |
| 50-80   | Run **03** (file_search RAG)                              |
| 80-100  | Explore run logs, check `tests/`, tweak prompts           |
| 100-120 | Read linked docs or extend scripts (e.g., add web search) |

## Lab Modules

### 00 — Assistant Bootstrap (5 min)

Creates a reusable assistant with `file_search` capabilities and stores the `ASSISTANT_ID` locally.

### 01 — Responses API Lab (≈ 20 min)

- Create threads and append messages
- Start runs with polling and streaming
- Demonstrate tool calls with built-in tools
- Download output files and log metrics

### 02 — Structured Output Lab (≈ 20 min)

- Guarantee JSON output matching Pydantic models
- Compare JSON-mode vs function tools with `"strict": True`
- Parse and validate structured responses
- Unit testing for reliability

### 03 — RAG via `file_search` Lab (≈ 30 min)

- Upload documents for knowledge retrieval
- Attach files to assistant's vector store
- Query with automatic `file_search` invocation
- Inspect citations and chunk references
- Multi-file retrieval demonstration

### 99 — Cleanup (1 min)

Remove temporary resources to avoid quota bloat.

## Key External References

- **OpenAI Python SDK v1.83.0**: [GitHub Releases](https://github.com/openai/openai-python/releases)
- **Responses API Reference**: https://platform.openai.com/docs/api-reference/responses
- **Structured Output Guide**: https://platform.openai.com/docs/guides/structured-output
- **File Search Tool**: https://platform.openai.com/docs/tools/file-search

## Testing

Run the test suite to verify everything works:

```bash
pytest tests/ -v
```

## Tips

- Keep total file uploads < 100 MB to stay within free quota
- Each script includes inline documentation links for deeper learning
- All examples are production-ready and can be extended for real applications
- Use `python scripts/99_cleanup.py` regularly to manage resources

## Requirements

- Python 3.8+
- OpenAI API key with sufficient credits
- Internet connection for API calls

---

**Everything can be run with** `python scripts/XX_script_name.py` — no Jupyter needed!
