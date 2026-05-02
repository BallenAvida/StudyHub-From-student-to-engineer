# 📦 Course Pack Format Specification (v1)

The Study Hub Engine uses a standardized JSON format to ingest and render course content. This document defines the schema for creating compatible `.json` course files.

## Schema Overview

```json
{
  "id": "string (unique-id)",
  "title": "string (Course Name)",
  "theme": {
    "primary": "string (HEX color)",
    "background": "string (HEX color)"
  },
  "modules": {
    "module-id-1": {
      "title": "string (Module Title)",
      "questions": [
        {
          "topic": "string",
          "question": "string",
          "options": ["A", "B", "C", "D"],
          "correct": 0,
          "explanation": "string (Markdown supported)"
        }
      ]
    }
  },
  "explanations": {
    "PPT-Name": {
      "Slide-1": "string (Professor commentary)"
    }
  }
}
```

## Field Definitions

### `id`
A unique slug for the course (e.g., `aws-cloud-practitioner`). It is used as the key in local storage.

### `theme`
- **primary**: The main accent color for buttons, progress bars, and highlights.
- **background**: The background color for the course card and specific course views.

### `modules`
A dictionary of study modules. Currently, the engine renders these as interactive tests. Each module contains an array of `questions`.

### `questions`
- **topic**: Sub-category of the question.
- **options**: Array of strings. Use 4 options for consistency.
- **correct**: Zero-based index of the correct answer in the options array.
- **explanation**: Context provided after the user answers.

### `explanations`
Maps slide names to professor commentary. Used by the PPT Viewer module (Coming Soon in v0.3.0).
