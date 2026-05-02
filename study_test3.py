import sys
import random

GREEN = '\033[92m'
RED = '\033[91m'
CYAN = '\033[96m'
YELLOW = '\033[93m'
BOLD = '\033[1m'
RESET = '\033[0m'

questions = [
    {
        'topic': 'Requerimientos (PPT 2 y 3)',
        'question': 'Según los PPTs, ¿cuál es la etapa donde "se recopila información de los usuarios y clientes mediante entrevistas, encuestas y observación"?',
        'correct': 'Obtención (Elicitación)',
        'options': {
            'Análisis': 'Falso. El análisis revisa la información para detectar inconsistencias.',
            'Obtención (Elicitación)': '¡CORRECTA! Textual del PPT: Obtención (Elicitación): Se recopila información de los usuarios mediante entrevistas y encuestas.',
            'Validación': 'Falso. La validación confirma con los usuarios.',
            'Especificación': 'Falso. Especificar es documentar de manera clara y estructurada.'
        }
    },
    {
        'topic': 'Requerimientos (PPT 2 y 3)',
        'question': 'Los requerimientos funcionales se definen textualmente como:',
        'correct': 'Los que describen QUÉ hace el sistema (acciones, servicios, funciones visibles).',
        'options': {
            'Los que describen CÓMO funciona el sistema (calidad, rendimiento).': 'Falso. Eso corresponde a los requerimientos No Funcionales.',
            'Los que describen QUÉ hace el sistema (acciones, servicios, funciones visibles).': '¡CORRECTA! Textual del PPT 3: "Funcionales: Describen qué hace el sistema".',
            'Los que restringen las metodologías de programación.': 'Falso.',
            'Los que definen el ciclo de vida de Scrum.': 'Falso.'
        }
    },
    {
        'topic': 'Requerimientos (PPT 2 y 3)',
        'question': '"El sistema debe responder en menos de 2 segundos". Este es un claro ejemplo de:',
        'correct': 'Requerimiento No Funcional.',
        'options': {
            'Requerimiento Funcional.': 'Falso. No es una función visible de acción, es una métrica de rendimiento.',
            'Regla de Negocio.': 'Falso.',
            'Requerimiento No Funcional.': '¡CORRECTA! Textual del PPT: "No funcionales describen CÓMO funciona el sistema (calidad, rendimiento... Ejemplo: El sistema debe responder en menos de 2 segundos)".',
            'Criterio de Scrum.': 'Falso.'
        }
    },
    {
        'topic': 'BPMN (PPT 4)',
        'question': 'En notación BPMN, la "Compuerta Exclusiva (X)" indica que:',
        'correct': 'Solo una ruta se ejecuta.',
        'options': {
            'Todas las rutas se ejecutan al mismo tiempo.': 'Falso. Eso es la Compuerta Paralela (+).',
            'Una o más rutas se ejecutan.': 'Falso. Eso es la Compuerta Inclusiva (O).',
            'Solo una ruta se ejecuta.': '¡CORRECTA! Textual del PPT 4: "Exclusiva (X): solo una ruta se ejecuta".',
            'El proceso se detiene obligatoriamente.': 'Falso.'
        }
    },
    {
        'topic': 'BPMN (PPT 4)',
        'question': 'En notación BPMN, la "Compuerta Inclusiva (O)" indica que:',
        'correct': 'Una o más rutas se ejecutan si cumplen la condición.',
        'options': {
            'Todas las rutas se ejecutan al mismo tiempo obligatoriamente.': 'Falso. Eso es la Compuerta Paralela (+).',
            'Una o más rutas se ejecutan si cumplen la condición.': '¡CORRECTA! Textual del PPT 4: "Compuerta Inclusiva (O): Una o más rutas se ejecutan si cumplen la condición".',
            'Solo una ruta se ejecuta.': 'Falso. Esa es la Exclusiva (X).',
            'Representa el fin de un proceso.': 'Falso. El fin lo marca un círculo rojo.'
        }
    },
    {
        'topic': 'BPMN (PPT 4)',
        'question': 'En BPMN, el símbolo para representar la comunicación entre participantes externos (ej. cliente y empresa) es:',
        'correct': 'Flecha punteada con sobre (Flujo de Mensaje).',
        'options': {
            'Flecha sólida (Flujo de Secuencia).': 'Falso. Esa conecta elementos en orden de ejecución dentro del mismo proceso.',
            'Línea simple.': 'Falso.',
            'Flecha punteada con sobre (Flujo de Mensaje).': '¡CORRECTA! Textual del PPT 4: "Flujo de Mensaje: Flecha punteada con sobre. Representa comunicación entre participantes".',
            'Rectángulo punteado (Grupo).': 'Falso.'
        }
    },
    {
        'topic': 'BPMN (PPT 4)',
        'question': '¿Qué hace la herramienta "Grupo" (Rectángulo punteado) en BPMN?',
        'correct': 'Agrupa elementos relacionados sin afectar el flujo.',
        'options': {
            'Termina el proceso por un error fatal.': 'Falso. Eso es el Evento de Fin de Error.',
            'Agrupa elementos relacionados sin afectar el flujo.': '¡CORRECTA! Textual del PPT 4: "Grupo (Rectángulo punteado). Función: Agrupa elementos relacionados sin afectar el flujo".',
            'Detiene el diagrama por 24 horas.': 'Falso.',
            'Guarda datos en la base de datos de manera persistente.': 'Falso. Eso lo hace el Almacén de Datos (Cilindro).'
        }
    },
    {
        'topic': 'Mejora Continua y KPIs (PPT 6)',
        'question': '¿Qué significan las siglas del Ciclo PDCA en la mejora continua?',
        'correct': 'Planificar (Plan), Ejecutar (Do), Verificar (Check), Actuar (Act).',
        'options': {
            'Proceso, Desarrollo, Control, Análisis.': 'Falso.',
            'Planificar (Plan), Ejecutar (Do), Verificar (Check), Actuar (Act).': '¡CORRECTA! Textual del PPT 6: "Ciclo PDCA: Planificar -> Ejecutar -> Verificar -> Actuar".',
            'Programa, Diseñar, Codificar, Aplicar.': 'Falso.',
            'Probar, Documentar, Conectar, Adaptar.': 'Falso.'
        }
    },
    {
        'topic': 'Mejora Continua y KPIs (PPT 6)',
        'question': 'Según los PPTs, ¿cuál de las siguientes es una DIFERENCIA CLAVE entre una Métrica y un KPI?',
        'correct': 'No toda métrica es estratégica; el KPI sí lo es.',
        'options': {
            'La métrica siempre se mide en dólares y el KPI en porcentajes.': 'Falso.',
            'No toda métrica es estratégica; el KPI sí lo es.': '¡CORRECTA! Textual del PPT 6: "Diferencia entre métrica y KPI: no toda métrica es estratégica. Ejemplo: número de llamadas (métrica) vs tiempo de respuesta (KPI)".',
            'El KPI se usa en Cascada y las métricas en Ágil.': 'Falso.',
            'Las métricas son exclusivas de finanzas.': 'Falso.'
        }
    },
    {
        'topic': 'Mejora Continua y KPIs (PPT 6)',
        'question': '¿Qué significa el acrónimo SMART para definir un buen KPI?',
        'correct': 'Específico, Medible, Alcanzable, Relevante, Temporal.',
        'options': {
            'Simple, Múltiple, Analítico, Rápido, Teórico.': 'Falso.',
            'Específico, Medible, Alcanzable, Relevante, Temporal.': '¡CORRECTA! Textual del PPT 6: "Características de un buen KPI (SMART): Específico, Medible, Alcanzable, Relevante, Temporal".',
            'Sistema, Medición, Actividad, Recursos, Tecnología.': 'Falso.',
            'Seguro, Mantenible, Ágil, Rentable, Trazable.': 'Falso.'
        }
    },
    {
        'topic': 'Scrum (PPT 6)',
        'question': 'En Scrum, ¿cuál es el evento donde "el equipo decide qué funcionalidades desarrollará en el próximo sprint"?',
        'correct': 'Sprint Planning.',
        'options': {
            'Daily Scrum.': 'Falso. Es una reunión diaria de 15 minutos para ajustar el trabajo.',
            'Sprint Planning.': '¡CORRECTA! Textual del PPT 6: "Sprint Planning: El equipo decide qué funcionalidades desarrollará en el próximo sprint".',
            'Sprint Review.': 'Falso. En esta se muestra lo desarrollado al final del sprint.',
            'Sprint Retrospective.': 'Falso. Esta es para reflexionar sobre cómo mejorar procesos.'
        }
    },
    {
        'topic': 'Casos de Uso (PPT 7)',
        'question': 'En la notación UML de Casos de Uso, la relación <<include>> significa que:',
        'correct': 'Un caso de uso siempre invoca otro obligatoriamente.',
        'options': {
            'Un caso de uso siempre invoca otro obligatoriamente.': '¡CORRECTA! Textual del PPT 7: "<<include>>: un caso de uso siempre invoca otro".',
            'Un caso de uso opcionalmente amplía otro.': 'Falso. Esa es la relación <<extend>>.',
            'Hay comunicación externa con el cliente.': 'Falso.',
            'El proceso ha llegado a un fin con error.': 'Falso.'
        }
    },
    {
        'topic': 'Casos de Uso (PPT 7)',
        'question': '¿Cuál es la diferencia entre los Casos de uso de Negocio y los de Sistema?',
        'correct': 'Negocio se centra en las metas de la empresa; Sistema detalla interacciones técnicas.',
        'options': {
            'Negocio es solo para gerentes; Sistema es solo para programadores.': 'Falso.',
            'Negocio usa óvalos; Sistema usa rectángulos.': 'Falso.',
            'Negocio se centra en las metas de la empresa; Sistema detalla interacciones técnicas.': '¡CORRECTA! Textual del PPT 7: "Casos de uso de negocio: Se centran en las metas de la empresa. Casos de uso de sistema: Detallan las interacciones técnicas de los usuarios".',
            'Negocio se hace en Cascada y Sistema se hace en Ágil.': 'Falso.'
        }
    },
    {
        'topic': 'Casos de Uso (PPT 7)',
        'question': 'En UML de Casos de Uso, el "Actor" se dibuja como:',
        'correct': 'Figura de persona (stickman).',
        'options': {
            'Un cilindro de base de datos.': 'Falso.',
            'Un óvalo con un nombre.': 'Falso. El óvalo representa la funcionalidad (el caso de uso en sí).',
            'Figura de persona (stickman).': '¡CORRECTA! Textual del PPT 7: "Actor: figura de persona (stickman)".',
            'Un rectángulo punteado.': 'Falso.'
        }
    },
    {
        'topic': 'Historias de Usuario (PPT 7)',
        'question': '¿Cuál es el formato estándar y textual enseñado en el PPT para una Historia de Usuario?',
        'correct': '"Como [rol], quiero [funcionalidad] para [beneficio]."',
        'options': {
            '"Si [acción], entonces el sistema debe [reacción]."': 'Falso. Eso es un escenario de prueba BDD.',
            '"Como [rol], quiero [funcionalidad] para [beneficio]."': '¡CORRECTA! Textual del PPT 7: Formato Clásico: COMO: [Rol], QUIERO: [Acción o funcionalidad], PARA: [Beneficio o valor].',
            '"El sistema deberá permitir [acción] usando [herramienta]."': 'Falso.',
            '"Yo quiero [funcionalidad] para que el [equipo de desarrollo] lo programe en [X tiempo]."': 'Falso.'
        }
    },
    {
        'topic': 'Historias de Usuario (PPT 7)',
        'question': 'En el acrónimo INVEST para Historias de Usuario, la "I" y la "V" significan respectivamente:',
        'correct': 'Independiente y Valiosa.',
        'options': {
            'Inclusiva y Verificable.': 'Falso.',
            'Independiente y Valiosa.': '¡CORRECTA! Textual del PPT 7: "I: Independiente (no debe depender de otras historias). V: Valiosa (Debe aportar beneficio al cliente)".',
            'Iterativa y Visual.': 'Falso.',
            'Intuitiva y Validada.': 'Falso.'
        }
    },
    {
        'topic': 'Gestión de Proyectos (PPT 11)',
        'question': 'Textualmente del PPT 11, la Gestión de Proyectos se define como la disciplina de:',
        'correct': 'Planificar, ejecutar y controlar tareas y recursos para alcanzar objetivos (SMART) dentro de un tiempo y presupuesto definidos.',
        'options': {
            'Programar código fuente en iteraciones cortas.': 'Falso. Eso es desarrollo de software ágil.',
            'Identificar errores en la fase de Testing.': 'Falso. Eso es aseguramiento de calidad (QA).',
            'Planificar, ejecutar y controlar tareas y recursos para alcanzar objetivos (SMART) dentro de un tiempo y presupuesto definidos.': '¡CORRECTA! Textual del PPT 11: "La gestión de proyectos es la disciplina de planificar, ejecutar y controlar tareas y recursos para alcanzar objetivos específicos (SMART) dentro de un tiempo y presupuesto definidos".',
            'Diseñar las bases de datos para un nuevo sistema.': 'Falso.'
        }
    },
    {
        'topic': 'Gestión de Proyectos (PPT 11)',
        'question': 'Según las 5 Fases del Ciclo de Vida del Proyecto, ¿en qué fase se crea el "Acta de Constitución" (Project Charter)?',
        'correct': 'En la Fase de Inicio.',
        'options': {
            'En la Fase de Planificación.': 'Falso. La planificación define el cronograma y presupuesto (Gantt).',
            'En la Fase de Ejecución.': 'Falso.',
            'En la Fase de Inicio.': '¡CORRECTA! Textual del PPT 11: "Inicio: Se define el propósito... Se crea el Acta de Constitución (Project Charter)".',
            'En la Fase de Cierre.': 'Falso.'
        }
    },
    {
        'topic': 'Gestión de Proyectos (PPT 11)',
        'question': 'Según el Ciclo de Vida del Proyecto, la Fase de Ejecución se caracteriza porque:',
        'correct': 'El equipo realiza las tareas asignadas para crear los entregables y es donde se consume la mayor cantidad de recursos.',
        'options': {
            'Se define el propósito y la justificación.': 'Falso. Eso ocurre en el Inicio.',
            'Se elabora la Carta Gantt y el presupuesto.': 'Falso. Eso es en Planificación.',
            'Se documentan las lecciones aprendidas.': 'Falso. Eso es en el Cierre.',
            'El equipo realiza las tareas asignadas para crear los entregables y es donde se consume la mayor cantidad de recursos.': '¡CORRECTA! Textual del PPT 11: "Ejecución: El equipo realiza las tareas asignadas para crear los entregables. Es la fase donde se consume la mayor cantidad de recursos".'
        }
    },
    {
        'topic': 'Análisis FODA (PPT 11)',
        'question': 'Dentro del FODA, ¿a qué categoría corresponden las Variables Internas?',
        'correct': 'A las Fortalezas y Debilidades.',
        'options': {
            'A las Oportunidades y Amenazas.': 'Falso. Esas son Variables Externas.',
            'A las Fortalezas y Debilidades.': '¡CORRECTA! Textual del PPT 11: "Variables internas: Fortalezas (positivas) y Debilidades (negativas)".',
            'A las Oportunidades y Debilidades.': 'Falso.',
            'Al CAME.': 'Falso.'
        }
    },
    {
        'topic': 'Análisis CAME (PPT 11)',
        'question': 'El análisis CAME es el paso siguiente al FODA. Según el acrónimo enseñado, ¿qué significan sus siglas?',
        'correct': 'Corregir, Afrontar, Mantener, Explotar.',
        'options': {
            'Controlar, Analizar, Mejorar, Ejecutar.': 'Falso.',
            'Corregir, Afrontar, Mantener, Explotar.': '¡CORRECTA! Textual del PPT 11: "Corregir (debilidades), Afrontar (amenazas), Mantener (fortalezas), Explotar (oportunidades)".',
            'Cuestionar, Anticipar, Minimizar, Expandir.': 'Falso.',
            'Crear, Adaptar, Modificar, Evaluar.': 'Falso.'
        }
    },
    {
        'topic': 'Análisis FODA/CAME (PPT 11)',
        'question': 'Al cruzar las variables en la matriz para diseñar estrategias, la Estrategia "DO" consiste en:',
        'correct': 'Superar debilidades aprovechando oportunidades.',
        'options': {
            'Minimizar debilidades y evitar amenazas.': 'Falso. Esa es la Estrategia DA (Debilidades - Amenazas).',
            'Usar fortalezas para enfrentar amenazas.': 'Falso. Esa es la Estrategia FA (Fortalezas - Amenazas).',
            'Superar debilidades aprovechando oportunidades.': '¡CORRECTA! Textual del PPT 11: "DO: Superar debilidades aprovechando oportunidades".',
            'Usar fortalezas para aprovechar oportunidades.': 'Falso. Esa es la Estrategia FO.'
        }
    },
    {
        'topic': 'Roles Scrum (PPT 2 y 3)',
        'question': '¿Qué nombre recibe el Stakeholder que "Asegura que el equipo siga las prácticas ágiles y elimina impedimentos"?',
        'correct': 'Scrum Master.',
        'options': {
            'Product Owner.': 'Falso. El PO prioriza el backlog y actúa como enlace principal.',
            'Gerente de Proyecto.': 'Falso.',
            'Scrum Master.': '¡CORRECTA! Textual del PPT 3: "Scrum Master: Asegura que el equipo siga las prácticas ágiles y elimina impedimentos".',
            'Equipo de Desarrollo.': 'Falso. Ellos son los profesionales que realizan el trabajo técnico.'
        }
    },
    {
        'topic': 'Roles Scrum (PPT 2 y 3)',
        'question': '¿Qué nombre recibe el Stakeholder que "Define las funcionalidades del software, prioriza el backlog y actúa como enlace principal entre usuarios y equipo técnico"?',
        'correct': 'Product Owner.',
        'options': {
            'Patrocinador del Proyecto.': 'Falso. El patrocinador pone el dinero y dirección estratégica.',
            'Gerente de Proyecto (Project Manager).': 'Falso. El PM planifica, gestiona riesgos y plazos.',
            'Product Owner.': '¡CORRECTA! Textual del PPT 3: "Product Owner: Define las funcionalidades, prioriza el backlog y actúa como enlace".',
            'Scrum Master.': 'Falso.'
        }
    },
    {
        'topic': 'Gestión de Riesgos (PPT 11)',
        'question': '¿Qué es el "Análisis Cuantitativo" de riesgos?',
        'correct': 'El uso de datos numéricos para proyectar costos o retrasos específicos.',
        'options': {
            'La clasificación rápida como "Alto", "Medio" o "Bajo".': 'Falso. Eso es Análisis Cualitativo.',
            'El uso de datos numéricos para proyectar costos o retrasos específicos.': '¡CORRECTA! Textual del PPT 11: "Cuantitativo: Uso de datos numéricos para proyectar costos o retrasos específicos".',
            'La lluvia de ideas con expertos.': 'Falso. Eso es parte de la "Identificación".',
            'La definición de las acciones a tomar si ocurre el riesgo.': 'Falso. Eso es "Planificación de Respuesta".'
        }
    }
]

def format_mixed_question(q):
    raw_texts = list(q['options'].keys())
    random.shuffle(raw_texts)
    
    letters = ['A', 'B', 'C', 'D']
    display_options = []
    correct_letter = ''
    
    for i, raw in enumerate(raw_texts):
        display_options.append(f"{letters[i]}) {raw}")
        if raw == q['correct']:
            correct_letter = letters[i]
            
    q['display_options'] = display_options
    q['correct_letter'] = correct_letter
    q['shuffled_raw'] = raw_texts
    return q

def run_quiz():
    print(f"\\n{BOLD}{CYAN}" + "="*80)
    print(" 📖 TEST 3: EXAMEN 100% TEXTUAL Y TEÓRICO (PPTs) 📖 ")
    print(f"                       25 PREGUNTAS                       ")
    print("="*80 + f"{RESET}\\n")
    print("Este test consta de preguntas extraídas textualmente de los apuntes.")
    print("Ideal para pruebas muy enfocadas en memorización y conceptos académicos puros.")
    print("\\nEscribe 'Q' para salir en cualquier momento.\\n")
    
    score = 0
    random.shuffle(questions)
    
    for idx, raw_q in enumerate(questions, 1):
        q = format_mixed_question(raw_q)
        print(f"\\n{BOLD}{YELLOW}{idx}. [{q['topic']}] {q['question']}{RESET}")
        
        for opt in q['display_options']:
            print(f"   {opt}")
        
        while True:
            ans = input(f"\\n{BOLD}Tu respuesta (A,B,C,D o Q): {RESET}").strip().upper()
            if ans == 'Q':
                print(f"{CYAN}Saliendo. Puntaje actual: {score}/{idx-1}{RESET}")
                sys.exit(0)
            if ans in ['A', 'B', 'C', 'D']:
                break
            print(f"{RED}Por favor, ingresa A, B, C o D.{RESET}")
            
        if ans == q['correct_letter']:
            print(f"{GREEN}{BOLD}✅ ¡CORRECTO!{RESET}")
            score += 1
        else:
            print(f"{RED}{BOLD}❌ INCORRECTO. La respuesta textual era la {q['correct_letter']}.{RESET}")
            
        print(f"\\n{CYAN}Explicación del PPT:{RESET}")
        for i, letra in enumerate(['A', 'B', 'C', 'D']):
             raw = q['shuffled_raw'][i]
             exp = q['options'][raw]
             if letra == ans:
                  print(f"   👉 {BOLD}{letra}){RESET} {exp}")
             else:
                  print(f"      {BOLD}{letra}){RESET} {exp}")
        
        input(f"\\n{BOLD}[Presiona Enter para avanzar...]{RESET}")

    print(f"\\n{BOLD}{CYAN}" + "="*80)
    print(f"🎉 TEST 3 COMPLETADO 🎉")
    print(f"Puntaje Textual: {score}/{len(questions)} ({(score/len(questions))*100:.1f}%)")
    print(f"{BOLD}{CYAN}" + "="*80 + f"{RESET}\\n")
    print("Repasa con guia_profesora3.py si tienes dudas. ¡Mucho éxito en la prueba real!")

if __name__ == '__main__':
    try:
        run_quiz()
    except KeyboardInterrupt:
        pass
