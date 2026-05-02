import os
import json
import re

PPT_FILES = {
    "ppt2": {"name": "PPT Segunda Clase", "file": "PPT SEGUNDA CLASE.txt", "completo": "PPT SEGUNDA CLASE_COMPLETO.txt"},
    "ppt3": {"name": "PPT Tercera Clase", "file": "PPT TERCERA CLASE.txt", "completo": "PPT TERCERA CLASE_COMPLETO.txt"},
    "ppt4": {"name": "PPT Cuarta Clase", "file": "PPT CUARTA CLASE.txt", "completo": "PPT CUARTA CLASE_COMPLETO.txt"},
    "ppt6": {"name": "PPT Sexta Clase", "file": "PPT SEXTA CLASE.txt", "completo": "PPT SEXTA CLASE_COMPLETO.txt"},
    "ppt7": {"name": "PPT Septima Clase", "file": "PPT SEPTIMA CLASE.txt", "completo": "PPT SEPTIMA CLASE_COMPLETO.txt"},
    "ppt11": {"name": "PPT Clase 11", "file": "PPT CLASE 11.txt", "completo": "PPT CLASE 11_COMPLETO.txt"},
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MIN_SLIDE_LENGTH = 60  # If slide content is shorter than this, try to enrich it

def parse_simple_slides(filepath):
    """Parse the simple PPT txt with --- Slide N --- markers"""
    slides = {}
    current_slide_num = None
    current_lines = []

    with open(filepath, encoding='utf-8', errors='ignore') as f:
        for line in f:
            line = line.rstrip()
            match = re.match(r'--- Slide (\d+) ---', line)
            if match:
                if current_slide_num is not None and current_lines:
                    slides[current_slide_num] = " ".join(current_lines).strip()
                current_slide_num = int(match.group(1))
                current_lines = []
            elif current_slide_num is not None and line.strip():
                current_lines.append(line.strip())

    if current_slide_num is not None and current_lines:
        slides[current_slide_num] = " ".join(current_lines).strip()

    return slides

def parse_completo_comments(filepath):
    """Parse comments from the _COMPLETO.txt file which have rich teacher notes"""
    comments = []
    in_comments = False
    current_lines = []

    with open(filepath, encoding='utf-8', errors='ignore') as f:
        for line in f:
            line = line.rstrip()
            if '=== COMMENTS ===' in line:
                in_comments = True
                continue
            if in_comments:
                match = re.match(r'--- modernComment(\d+)\.xml ---', line)
                if match:
                    if current_lines:
                        comments.append(" ".join(current_lines).strip())
                    current_lines = []
                elif line.strip():
                    current_lines.append(line.strip())

    if current_lines:
        comments.append(" ".join(current_lines).strip())

    return comments

def parse_completo_notes(filepath):
    """Parse presenter notes from _COMPLETO.txt"""
    notes = {}
    in_notes = False
    current_slide = None
    current_lines = []

    with open(filepath, encoding='utf-8', errors='ignore') as f:
        for line in f:
            line = line.rstrip()
            if '=== PRESENTATION NOTES ===' in line:
                in_notes = True
                continue
            if in_notes:
                if '===' in line:
                    in_notes = False
                    break
                match = re.match(r'--- notesSlide(\d+)\.xml ---', line)
                if match:
                    if current_slide is not None and current_lines:
                        notes[current_slide] = " ".join(current_lines).strip()
                    current_slide = int(match.group(1))
                    current_lines = []
                elif current_slide is not None and line.strip() and line.strip() != '<#>':
                    current_lines.append(line.strip())

    if current_slide is not None and current_lines:
        notes[current_slide] = " ".join(current_lines).strip()

    return notes

def build_enriched_slides(simple_slides, notes, comments):
    """Build final slide list, enriching thin slides with notes or comments"""
    result = []
    comment_idx = 0

    for slide_num in sorted(simple_slides.keys()):
        content = simple_slides[slide_num]
        note = notes.get(slide_num, "")
        enriched = False

        # If the slide has very little content, try enriching it
        if len(content) < MIN_SLIDE_LENGTH:
            if note and len(note) > len(content):
                content = f"{content}\n\n[Notas de clase]: {note}"
                enriched = True
            elif comment_idx < len(comments) and len(comments[comment_idx]) > len(content):
                # Use next available comment as enrichment
                content = f"{content}\n\n[Detalle del docente]: {comments[comment_idx]}"
                comment_idx += 1
                enriched = True

        if not enriched and note and len(note) > 30:
            # Always append brief notes even if slide already has content
            # (skip generic "Se debe considerar" type notes)
            if "Se debe considerar" not in note and "minutos de la clase" not in note:
                content = content + f"\n\n[Nota]: {note}"

        result.append({"slide": slide_num, "content": content})

    return result

result = {}
for key, meta in PPT_FILES.items():
    filepath = os.path.join(BASE_DIR, meta["file"])
    completo_path = os.path.join(BASE_DIR, meta["completo"])

    if not os.path.exists(filepath):
        print(f"[ERROR] No encontrado: {filepath}")
        continue

    simple_slides = parse_simple_slides(filepath)
    notes = {}
    comments = []

    if os.path.exists(completo_path):
        notes = parse_completo_notes(completo_path)
        comments = parse_completo_comments(completo_path)
        print(f"  -> Notas: {len(notes)} | Comentarios: {len(comments)}")

    enriched_slides = build_enriched_slides(simple_slides, notes, comments)

    result[key] = {
        "title": meta["name"],
        "slides": enriched_slides
    }
    print(f"[OK] {meta['name']}: {len(enriched_slides)} diapositivas")

# Now re-read data.js and REPLACE the ppts section
data_js_path = os.path.join(BASE_DIR, "data.js")
with open(data_js_path, encoding='utf-8') as f:
    content = f.read()

ppts_json = json.dumps(result, ensure_ascii=False, indent=2)

# Remove existing ppts section and re-inject
# Find ",\n  "ppts": {" and remove from there to end
ppts_match = re.search(r',\s*"ppts":\s*\{', content)
if ppts_match:
    # Remove old ppts
    content_before = content[:ppts_match.start()]
    content_before = content_before.rstrip()
    new_content = content_before + f',\n  "ppts": {ppts_json}\n}};\n'
else:
    # Inject fresh
    last_close = content.rfind("};")
    before = content[:last_close].rstrip()
    new_content = before + f',\n  "ppts": {ppts_json}\n}};\n'

with open(data_js_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"\n[OK] data.js actualizado con {len(result)} PPTs enriquecidos.")
