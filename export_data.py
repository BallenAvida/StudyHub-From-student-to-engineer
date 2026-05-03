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
        options = []
        raw_options = list(q['options'].keys())
        # We'll keep them in the order defined in the dictionary or original list
        # hub.js will shuffle them if needed, but for the export we just need the data
        correct_index = -1
        
        for i, opt_text in enumerate(raw_options):
            options.append({
                'text': opt_text,
                'explanation': q['options'][opt_text].replace('\033[1m', '').replace('\033[0m', '').replace('¡CORRECTA!', '✅').replace('Falso.', '❌')
            })
            if opt_text == q['correct']:
                correct_index = i
        
        formatted.append({
            'topic': q.get('topic', 'General'),
            'question': q['question'],
            'options': options,
            'correct': correct_index
        })
    return formatted

# Define the Course Pack
course_pack = {
    'id': 'analisis-negocios-aiep-2026',
    'title': 'Análisis de Sistemas y Negocios',
    'author': 'JP - Futuro Ingeniero NVIDIA',
    'description': 'Pack completo de estudio: Requerimientos, Stakeholders, BPMN, Agile y Gestión Estratégica.',
    'theme': {
        'primary': '#3b82f6',
        'background': 'rgba(59, 130, 246, 0.1)'
    },
    'modules': {
        'clase-2': {
            'title': 'Clase 2: Requerimientos',
            'questions': format_questions(study_test.questions[0:5]) # Primeras 5 son Clase 2
        },
        'clase-3': {
            'title': 'Clase 3: Stakeholders',
            'questions': format_questions(study_test.questions[5:10]) # Siguientes 5 son Clase 3
        },
        'clase-4': {
            'title': 'Clase 4: BPMN',
            'questions': format_questions(study_test.questions[10:16]) # Siguientes 6 son Clase 4
        },
        'clase-6': {
            'title': 'Clase 6: Agile y KPIs',
            'questions': format_questions(study_test.questions[16:21]) # Siguientes 5 son Clase 6
        },
        'clase-7': {
            'title': 'Clase 7: Casos de Uso',
            'questions': format_questions(study_test.questions[21:26]) # Siguientes 5 son Clase 7
        },
        'clase-11': {
            'title': 'Clase 11: Gestión y FODA',
            'questions': format_questions(study_test.questions[26:30]) # Siguientes 4 son Clase 11
        }
    }
}

# Write to course_data.json
with open('course_data.json', 'w', encoding='utf-8') as f:
    json.dump(course_pack, f, indent=2, ensure_ascii=False)

# Write to course_data.js (for local file protocol support)
js_content = "const DEFAULT_COURSE_PACK = " + json.dumps(course_pack, indent=2, ensure_ascii=False) + ";"
with open('course_data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Exportación exitosa a course_data.json y course_data.js")

