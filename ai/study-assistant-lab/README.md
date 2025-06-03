# Study Assistant Lab

This project provides tools for processing and analyzing study materials using AI.

## Project Structure

```
study-assistant-lab/
  ├─ README.md
  ├─ requirements.txt
  ├─ .env.example
  ├─ data/                # PDF storage directory
  ├─ scripts/
  │   ├─ 00_bootstrap.py
  │   ├─ 01_qna_assistant.py
  │   ├─ 02_generate_notes.py
  │   └─ 99_cleanup.py
  └─ tests/
      └─ test_notes_schema.py
```

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and fill in your environment variables:
```bash
cp .env.example .env
```

## Usage

1. Place your PDF files in the `data/` directory
2. Run the scripts in order:
   - `00_bootstrap.py`: Initial setup
   - `01_qna_assistant.py`: Question answering system
   - `02_generate_notes.py`: Generate study notes
   - `99_cleanup.py`: Cleanup temporary files 