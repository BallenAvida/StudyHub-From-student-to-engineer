import json
import os
import sys

# Import the files
try:
    import study_test
    import study_test2
    import study_test3
    import guia_profesora
    import guia_profesora2
    import guia_profesora3
except ImportError as e:
    print(f"Error importando módulos: {e}")
    sys.exit(1)

def get_options_array(q):
    options = []
    # If the file has 'display_options' or 'shuffled_raw', use that, otherwise generate
    if 'shuffled_raw' in q:
        for raw in q['shuffled_raw']:
            options.append({
                'text': raw,
                'explanation': q['options'][raw],
                'isCorrect': raw == q['correct']
            })
    else:
        for opt_text, expl in q['options'].items():
            options.append({
                'text': opt_text,
                'explanation': expl,
                'isCorrect': opt_text == q['correct']
            })
    return options

def format_questions(questions_list):
    formatted = []
    for q in questions_list:
        formatted.append({
            'topic': q.get('topic', 'General'),
            'question': q['question'],
            'options': get_options_array(q)
        })
    return formatted

def format_guides(temas_list):
    formatted = []
    for t in temas_list:
        # Strip ANSI colors from texts
        clean_lines = []
        for line in t['lineas']:
            text = line[0] if isinstance(line, tuple) else line
            # Naive ANSI strip if any
            for code in ['\033[92m', '\033[91m', '\033[96m', '\033[93m', '\033[1m', '\033[0m']:
                text = text.replace(code, '')
            clean_lines.append(text)
        
        pregunta = None
        if 'pregunta' in t:
            # Format from guia_profesora3
            opciones = []
            for opt in t['pregunta']['opciones']:
                opciones.append({
                    'letra': opt[0:1].upper(),
                    'texto': opt[3:].strip(),
                    'isCorrect': opt[0:1].upper() == t['pregunta']['correcta'].upper(),
                    'explicacion': t['pregunta']['explicacion_correcta'].replace('\033[1m', '').replace('\033[0m', '') if opt[0:1].upper() == t['pregunta']['correcta'].upper() else t['pregunta']['explicacion_incorrecta'].replace('\033[1m', '').replace('\033[0m', '')
                })
            
            pregunta = {
                'texto': t['pregunta']['texto'].replace('\033[1m', '').replace('\033[0m', ''),
                'opciones': opciones
            }
        elif 'q' in t:
            # Format from guia_profesora and guia_profesora2
            q_data = t['q']
            opciones = []
            letters = ['A', 'B', 'C', 'D', 'E']
            for i, (opt_text, expl) in enumerate(q_data['options'].items()):
                opciones.append({
                    'letra': letters[i],
                    'texto': opt_text,
                    'isCorrect': opt_text == q_data['correct'],
                    'explicacion': expl.replace('\033[1m', '').replace('\033[0m', '')
                })
            
            pregunta = {
                'texto': q_data['question'].replace('\033[1m', '').replace('\033[0m', ''),
                'opciones': opciones
            }
            
        formatted.append({
            'titulo': t['titulo'].replace('\033[1m', '').replace('\033[0m', ''),
            'lineas': clean_lines,
            'pregunta': pregunta
        })
    return formatted

# Format data
data = {
    'tests': {
        'test1': {
            'title': 'Test 1: Conceptos Generales',
            'questions': format_questions(study_test.questions)
        },
        'test2': {
            'title': 'Test 2: Escenarios Avanzados',
            'questions': format_questions(study_test2.questions)
        },
        'test3': {
            'title': 'Test 3: Examen Textual PPT',
            'questions': format_questions(study_test3.questions)
        }
    },
    'guides': {
        'guide1': {
            'title': 'Guía 1: Teoría Básica',
            'temas': format_guides(getattr(guia_profesora, 'temas_base', []))
        },
        'guide2': {
            'title': 'Guía 2: Escenarios Prácticos',
            'temas': format_guides(getattr(guia_profesora2, 'temas_base', []))
        },
        'guide3': {
            'title': 'Guía 3: Definiciones PPT',
            'temas': format_guides(getattr(guia_profesora3, 'temas_textuales', []))
        }
    }
}

# Write to data.js
js_content = "const STUDY_DATA = " + json.dumps(data, indent=2, ensure_ascii=False) + ";"

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Exportación exitosa a data.js")
