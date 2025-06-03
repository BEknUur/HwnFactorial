import os
import json
import pytest
from pydantic import BaseModel, Field, ValidationError

class Note(BaseModel):
    id: int              = Field(..., ge=1, le=10)
    heading: str         = Field(..., example="Mean Value Theorem")
    summary: str         = Field(..., max_length=150)
    page_ref: int | None = Field(None, description="Page number in source PDF")

@pytest.fixture
def exam_notes_path():
    root = os.path.dirname(__file__)
    return os.path.join(root, "../exam_notes.json")

def test_exam_notes_exist_and_valid_json(exam_notes_path):
    assert os.path.isfile(exam_notes_path), f"{exam_notes_path} не найден."

    with open(exam_notes_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    assert "notes" in data, "Ключ 'notes' отсутствует в JSON."
    notes = data["notes"]
    assert isinstance(notes, list), "'notes' должно быть списком."
    assert len(notes) == 10, f"Ожидалось 10 заметок, получено {len(notes)}."

    for idx, item in enumerate(notes, start=1):
        try:
            Note(**item)
        except ValidationError as e:
            pytest.fail(f"Ошибка валидации заметки #{idx}: {e}")

