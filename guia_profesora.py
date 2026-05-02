import time
import os
import sys
import random

# Definición de colores ANSI
GREEN = '\033[92m'
RED = '\033[91m'
CYAN = '\033[96m'
YELLOW = '\033[93m'
BOLD = '\033[1m'
RESET = '\033[0m'

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def type_text(text, speed=0.010, color=RESET):
    print(color, end='', flush=True)
    for char in text:
        print(char, end='', flush=True)
        time.sleep(speed)
    print(RESET)

def format_mixed_question(q):
    """
    Mezcla internamente las alternativas (texto plano), asignándoles nuevas 
    letras dinámicas y preservando el diccionario de justificaciones.
    """
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

def ask_question(question_data):
    # Mezclamos las alternativas
    q_mixed = format_mixed_question(question_data.copy())

    type_text("\n💬👩‍🏫 PROFESORA DANIELA: ¡Tiempo de prueba exprés! Responde esta pregunta nivel 'Prueba Real':", color=CYAN)
    time.sleep(0.5)
    print(f"\n{BOLD}{YELLOW}{q_mixed['question']}{RESET}")
    for opt in q_mixed['display_options']:
        print(f"   {opt}")
    
    while True:
        ans = input(f"\n{BOLD}Tu respuesta (A, B, C o D): {RESET}").strip().upper()
        if ans == 'Q':
             print(f"{CYAN}¡Saliendo de la clase!{RESET}")
             sys.exit(0)
        
        if ans not in ['A', 'B', 'C', 'D']:
             print(f"{RED}Por favor presta atención e ingresa sólo A, B, C o D.{RESET}")
             continue
             
        if ans == q_mixed['correct_letter']:
             type_text(f"\n{BOLD}✅ ¡Totalmente correcto! Muy bien analizado.{RESET}", color=GREEN)
        else:
             type_text(f"\n{BOLD}❌ ¡Ay, no! Caíste en la trampa. La verdadera era la {q_mixed['correct_letter']}.{RESET}", color=RED)
             
        # IMPRESIÓN DEL DESGLOSE UNO POR UNO
        print(f"\n{CYAN}>> Desglose y Justificación:{RESET}")
        for i, letra in enumerate(['A', 'B', 'C', 'D']):
             raw = q_mixed['shuffled_raw'][i]
             exp = q_mixed['options'][raw]
             if letra == ans:
                  # Se destaca con manito la letreó que eligió (sea correcta o equivocada)
                  print(f"   👉 {BOLD}{letra}){RESET} {exp}")
             else:
                  print(f"      {BOLD}{letra}){RESET} {exp}")
                  
        if ans == q_mixed['correct_letter']:
             input(f"\n{BOLD}[Presiona Enter para avanzar al siguiente tema...]{RESET}")
             clear_screen()
             break
        else:
             print(f"\n{YELLOW}Lee nuevamente el texto, presta atención a mis justificaciones y vuelve a intentarlo...{RESET}")

temas_base = [
    {
        'titulo': "📚 TEMA: REQUERIMIENTOS Y ESTRUCTURA",
        'lineas': [
            ("🔸 Definición Mística: Un 'Sistema' es más que código y servidores. Es un conjunto de hardware, software, personas, procedimientos y datos.", RESET),
            ("   👉 [Tip de Profe]: Piensa que sin las PERSONAS que lo operan o los PROCEDIMIENTOS (reglas de la empresa), el código solo es texto muerto.", CYAN),
            ("🔸 ¿Para qué hacemos Requerimientos?: Su propósito central es comunicar de manera *precisa* qué se espera del sistema entre el cliente, usuarios y desarrolladores.", RESET),
            ("🔸 Las Fases: Sus 4 fases son Obtención, Análisis, Especificación y Validación. Ojo con la trampa de siempre: ¡La 'Programación / Implementación' NO es una fase de los requerimientos!", RESET),
            ("🔸 Riesgo Inminente: Si defines mal esto al inicio, en etapas avanzadas se generarán altísimos costos adicionales por cambios tardíos.", RESET),
            ("   👉 [Ejemplo Práctico]: Es como construir una casa. Si no dices que quieres 3 baños al principio (requerimiento), instalar cañerías cuando la casa ya está construida te costará una fortuna.", CYAN),
            ("🔸 Funcional vs No Funcional: Si te dicen 'El sistema debe responder en menos de 2 segundos', eso NO describe qué hace, sino CÓMO o BAJO QUÉ CONDICIONES lo hace: Requerimiento No Funcional.", RESET),
            ("\n" + "—" * 60, YELLOW),
            ("📖 GLOSARIO DE TÉRMINOS Y SIGLAS:", CYAN),
            ("   📌 UI: User Interface (Interfaz de Usuario). Habitualmente referida en requerimientos visuales.", CYAN),
            ("   📌 QA: Quality Assurance (Aseguramiento de Calidad / Pruebas de software).", CYAN)
        ],
        'q': {
            'question': '¿Cuál es el propósito principal de los requerimientos de software?',
            'correct': 'Comunicar de manera precisa qué se espera del sistema entre cliente, usuarios y desarrolladores.',
            'options': {
                'Definir la arquitectura técnica interna del sistema computacional.': 'Falso. Entrar al diseño de la arquitectura sucede mucho más adelante, no en la fase germinal de requisitos.',
                'Comunicar de manera precisa qué se espera del sistema entre cliente, usuarios y desarrolladores.': '¡CORRECTA! El objetivo base es lograr un entendimiento mutuo formal de QUÉ debe hacerse.',
                'Especificar exclusivamente el lenguaje de programación y la base de datos a utilizar.': 'Falso. Proponer usar "Python" o "SQL" es trabajo técnico de implementación, los requerimientos no entran ahí.',
                'Establecer el diseño gráfico, los colores y la navegabilidad de la interfaz.': 'Falso. La interfaz y las paletas de colores pertenecen al trabajo estético de diseño gráfico formal.'
            }
        }
    },
    {
        'titulo': "📚 TEMA: STAKEHOLDERS (PARTES INTERESADAS)",
        'lineas': [
            ("🔸 Requerimientos Funcionales: Estos describen *qué* hace el sistema (acciones, servicios, funciones visibles para el usuario). Ej: 'El sistema debe enviar un correo electrónico'.", RESET),
            ("🔸 Problemática Social: Un sistema de salud pública o educación inclusiva ataca una problemática netamente 'Social'.", RESET),
            ("🔸 El Product Owner: Quien define las funcionalidades del software y prioriza lo que se debe hacer. Es vital como enlace principal, la voz del cliente.", RESET),
            ("   👉 [Tip de Profe]: Imagínatelo como el director de la orquesta, si él no dice qué tocar y cuándo, los programadores (ni el Project Manager) sabrán qué es lo importante.", CYAN),
            ("🔸 El Patrocinador del Proyecto: Proporciona financiación, recursos y dirección estratégica.", RESET),
            ("   👉 [Ejemplo Práctico]: Es el inversionista millonario de la película. No sabe echar código, pero sin su plata no hay proyecto.", CYAN),
            ("🔸 Entidades Regulatorias: No desarrollan código, no te lo pagan, pero dictan estándares éticos y obligatorios (como cumplir la ley de datos).", RESET),
            ("\n" + "—" * 60, YELLOW),
            ("📖 GLOSARIO DE ROLES Y SIGLAS:", CYAN),
            ("   📌 PO: Product Owner (Dueño del Producto). El representante del corporativo y la voz del negocio en metodologías ágiles Scrum.", CYAN),
            ("   📌 PM: Project Manager (Gerente del Proyecto). El jefe que vela por los recursos y control de riesgos y tiempo.", CYAN),
            ("   📌 Stakeholder: Literal en español significa Parte Interesada (Cualquier individuo/grupo impactado por el sistema).", CYAN)
        ],
        'q': {
            'question': 'En un proyecto, ¿qué rol "define las funcionalidades del software, prioriza el backlog y actúa como enlace principal"?',
            'correct': 'Dueño del Producto (Product Owner)',
            'options': {
                'Patrocinador del Proyecto (Sponsor)': 'Falso. El Patrocinador da la plata, él no define la lista de los botones que el software va a tener en su menú.',
                'Gerente de Proyecto (Project Manager)': 'Falso. El Gerente maneja el calendario y al equipo. Él no es dueño analítico del "Negocio o Producto".',
                'Dueño del Producto (Product Owner)': '¡CORRECTA! El PO lidera la lista de requerimientos (Backlog) actuando como la Mente Maestra centralizada del cliente.',
                'Analista de Sistemas': 'Falso. El Analista disecciona sistemas en pedacitos pero es un intermediario que asiste y acata al dueño (Product Owner).'
            }
        }
    },
    {
        'titulo': "📚 TEMA: MODELADO BPMN",
        'lineas': [
            ("🔸 ¿Qué es BPMN?: Es un lenguaje *gráfico estandarizado* para modelar/representar procesos de negocio en diagramas de flujo.", RESET),
            ("🔸 Diagramas de colaboración: Si tu diagrama muestra interacciones entre dos participantes (empresa vs cliente), estamos hablando de un diagrama de colaboración.", RESET),
            ("🔸 [ SIMBOLOGÍA QUE ENTRARÁ SÍ O SÍ EN LA PRUEBA ]:", RESET),
            ("   👉 El Círculo Verde (fino): Es el 'Evento de Inicio', marca dónde comienza el proceso.", RESET),
            ("   👉 El Rombo (Compuerta): Controla el flujo. Parte el camino en dos según decisiones lógicas (¿Pagó? Sí -> Enviar / No -> Bloquear).", RESET),
            ("   👉 El Cilindro: Siempre representa almacenamiento de información persistente (Bases de Datos).", RESET),
            ("   👉 Flecha punteada con un sobre (Flujo de Mensaje): Representa comunicación e intercambio entre participantes distintos.", RESET),
            ("\n" + "—" * 60, YELLOW),
            ("📖 GLOSARIO DE MODELADO Y SIGLAS:", CYAN),
            ("   📌 BPMN: Business Process Model and Notation (Modelo y Notación de Procesos de Negocio). Es por definición un lenguaje visual gráfico mundial.", CYAN),
            ("   📌 DB / BD: Data Base / Base de Datos. Gráficamente asociado en todo los lenguajes a un Cilindro Tridimensional.", CYAN)
        ],
        'q': {
            'question': 'En BPMN, el círculo verde con un borde fino tiene como función:',
            'correct': 'Marcar el comienzo (Evento de Inicio) del proceso.',
            'options': {
                'Aprobar una decisión para poder iterar una tarea repetitiva.': 'Falso. Dividir lógica la hace el rombo amarrilo (Gateway). Y un loop (repetitivo) lleva una flecha circular anexa.',
                'Marcar el comienzo (Evento de Inicio) del proceso.': '¡CORRECTA! Círculo de línea delgada es START. Círculo de línea gruesa es STOP (Fin).',
                'Representar un mensaje obligatorio de un participante externo.': 'Falso. Un mensaje o carta lleva un gatillador Start modificado con un icono de sobre de correo.',
                'Iniciar de inmediato la creación de una base de datos.': 'Falso. Las base de datos se plasman gráficamente usando el típico Cilindro tridimensional.'
            }
        }
    },
    {
        'titulo': "📚 TEMA: AGILE Y MEJORA CONTINUA",
        'lineas': [
            ("🔸 Ciclo PDCA: Apréndete el orden: Planificar → Ejecutar → Verificar → Actuar.", RESET),
            ("   👉 [Ejemplo Práctico]: Planeas un pastel (Planificar), lo cocinas (Ejecutar), lo pruebas y ves que le falta azúcar (Verificar), modificas tu receta (Actuar).", CYAN),
            ("🔸 Programación e Integración: En metodologías XP, si probamos e integramos código muchas veces al día, aplicamos 'Integración continua'.", RESET),
            ("🔸 KPIs Medibles: Un KPI 'Medible' significa estrictamente que logras cuantificarlo objetivamente: en números concretos o porcentajes.", RESET),
            ("🔸 Diferencia Métrica vs KPI: Toda métrica NO es estratégica. Puedes medir el nivel de café consumido (métrica), pero no define el negocio. El KPI sí es el indicador *CLAVE* de éxito.", RESET),
            ("🔸 El margen de ganancia o el ROI son clásicos KPIs de naturaleza Financiera.", RESET),
            ("\n" + "—" * 60, YELLOW),
            ("📖 GLOSARIO ÁGIL Y FINANCIERO:", CYAN),
            ("   📌 PDCA: Plan, Do, Check, Act (Planificar, Ejecutar, Verificar, Actuar). Acrónimo clásico de Edwards Deming.", CYAN),
            ("   📌 XP: Extreme Programming (Programación Extrema). Metodología ágil parecida a Scrum, pero enfocada 100% agresivamente a la escritura de código iterativa.", CYAN),
            ("   📌 KPI: Key Performance Indicator (Indicador Clave de Rendimiento). Un indicador macro que decide si la empresa gana o pierde la competencia.", CYAN),
            ("   📌 ROI: Return On Investment (Retorno de Inversión). El margen entre lo que inviertes en software vs la ganancia que esto te produce.", CYAN)
        ],
        'q': {
            'question': 'Según se explica en las clases, ¿cuál es la diferencia clave entre una métrica y un KPI?',
            'correct': 'Toda métrica NO es estratégica; el KPI es un tipo de métrica CLAVE que sí mide el éxito del negocio.',
            'options': {
                'Las métricas solo aplican a infraestructura TI y los KPIs a las gerencias.': 'Falso. Invento teórico. Puedes medir cuántos almuerzos comen las gerencias y será solo una métrica estúpida pero sin impacto TI.',
                'Los KPIs evalúan aspectos abstractos cualitativos mientras las métricas evalúan bases de datos.': 'Falso. ¡Error inmenso! Tanto una métrica como un KPI son inamoviblemente numéricos y cuantitativos/estadísticos.',
                'Toda métrica es estratégica en el negocio, independientemente del contexto.': 'Falso. Totalmente incorrecto. "Métrica = Pasos que das hacia la puerta" es inútil para invertir corporativamente.',
                'Toda métrica NO es estratégica; el KPI es un tipo de métrica CLAVE que sí mide el éxito del negocio.': '¡CORRECTA! KPI presupone literalmente e imperativamente la palabra (Key = Clave/Vital). Es de vida o muerte para los accionistas.'
            }
        }
    },
    {
        'titulo': "📚 TEMA: CASOS DE USO E HISTORIAS DE USUARIO",
        'lineas': [
            ("🔸 ¿Qué es un Caso de Uso?: Es una técnica de modelado que te describe *paso a paso* cómo un usuario interactúa con un sistema para alcanzar un fin valioso.", RESET),
            ("🔸 Relación <<include>>: En diagrama UML, si un caso básico se relaciona con otro mediante <<include>>, invoca OBLIGATORIAMENTE al otro. (Ej: 'Pagar Carrito' invoca 'Validar Tarjeta').", RESET),
            ("🔸 Casos de uso de sistema: Son los que detallan las interacciones técnicas concretas y respuestas de interfaces con piezas del sistema.", RESET),
            ("🔸 Historia de Usuario: 'Como [Rol], quiero [funcionalidad] para...'. Termina siempre explicando el Beneficio, valor organizacional o meta que se busca obtener.", RESET),
            ("🔸 INVEST: La letra 'E' significa que la historia debe ser 'Estimable' (saber cuánto esfuerzo tomará).", RESET),
            ("\n" + "—" * 60, YELLOW),
            ("📖 GLOSARIO DE HISTORIAS DE USUARIO Y MODELADO:", CYAN),
            ("   📌 UML: Unified Modeling Language (Lenguaje Unificado de Modelado). Sirve para usar los diagramas del famoso 'Caso de Uso'.", CYAN),
            ("   📌 CU / UC: Caso de Uso / Use Case.", CYAN),
            ("   📌 INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable. Son las 6 obligaciones que debe cumplir toda Historia de Usuario para considerarse de buena calidad.", CYAN)
        ],
        'q': {
            'question': '¿Qué es un Caso de Uso?',
            'correct': 'Una técnica de modelado que describe, paso a paso, cómo un usuario interactúa con un sistema para alcanzar un fin.',
            'options': {
                'Una representación visual del flujo de datos interno entre los servidores del sistema.': 'Falso. Flujo de red pura es muy TI/Arquitectura; el CU humaniza las interacciones que un cajero o actor físico sufre con el sistema.',
                'Un registro minucioso de todas las clases y métodos utilizados en lenguaje Java.': 'Falso. De nuevo, es abstracción orientada al actor vivo de negocios, no al programador backend que invoca lenguajes de Java.',
                'Una técnica de modelado que describe, paso a paso, cómo un usuario interactúa con un sistema para alcanzar un fin.': '¡CORRECTA! Resume las respuestas e interacciones para llegar a una meta final deseada.',
                'Un documento legal de cumplimiento para ser presentado a reguladores externos.': 'Falso. Un caso de uso es meramente diagramático interno, llevarle burbujas dibujadas a un fiscal legal en tribunales no tiene alcance.'
            }
        }
    },
    {
        'titulo': "📚 TEMA: GESTIÓN DE PROYECTO Y FODA",
        'lineas': [
            ("🔸 El Acta de Constitución: Ocurre en la fase de 'Inicio' (la que aprueba y justifica todo).", RESET),
            ("🔸 Riesgos Cualitativos: Clasificas tus riesgos usando palabras o etiquetas como 'Alto', 'Medio', o 'Bajo' (No números reales financieros, por eso es cualitativo).", RESET),
            ("🔸 Estrategias en FODA: 'FA' significa utilizar explícitamente y enfocar tus (F)ortalezas internas para poder enfrentar las (A)menazas externas.", RESET),
            ("🔸 El paso siguiente del FODA: El análisis 'CAME'. Es recomendado para aterrizarlos a nivel estratégico en acciones concretas (Corregir, Afrontar, Mantener, Explotar).", RESET),
            ("\n" + "—" * 60, YELLOW),
            ("📖 GLOSARIO GENERAL Y EJECUTIVO:", CYAN),
            ("   📌 Charter: Nombre oficial en inglés del 'Acta de Constitución' del Proyecto (Fase de Inicio).", CYAN),
            ("   📌 FODA / SWOT: Fortalezas, Oportunidades, Debilidades, Amenazas. (Fotografía estática temporal del entorno de la organización que permite diagnosticar).", CYAN),
            ("   📌 CAME: Corregir (Debilidades), Afrontar (Amenazas), Mantener (Fortalezas), Explotar (Oportunidades).", CYAN)
        ],
        'q': {
            'question': 'Una vez documentado el listado FODA, ¿qué técnica se recomienda usar como "paso siguiente" para aterrizarlos en acciones concretas y ejecutables?',
            'correct': 'Análisis CAME (Corregir, Afrontar, Mantener y Explotar).',
            'options': {
                'Documentar los requerimientos No Funcionales del proyecto.': 'Falso. Eso recae sobre el levantamiento informático con el cliente, no entra en el marco estricto del planeamiento corporativo comercial inmediato.',
                'Diagramación general BPMN enfocada en Riesgos.': 'Falso. Aunque en etapas lejanas modeles flujos con riesgos anexos, no es la "consecuencia" formal corporativa de hacer el 4-cuadrante FODA.',
                'Análisis CAME (Corregir, Afrontar, Mantener y Explotar).': '¡CORRECTA! Luego de mapearlos mentalmente (FODA), toca ejercerlos pasionalmente accionando con verbos directos C.A.M.E',
                'Empleo de diagramas relacionales UML <<include>>': 'Falso. UML es puro desarrollo de software y no pinta absolutamente en la fase administrativa de Gerencia de Matriz corporativa.'
            }
        }
    }
]

def main():
    clear_screen()
    
    type_text("👩‍🏫 ¡Bienvenido a nuestra clase final OBLIGATORIA Y TOTALMENTE ALEATORIA!", color=CYAN)
    type_text("Cada vez que entres aquí, mis lecciones se desordenarán.")
    type_text("Te daré las claves para que no caigas en los distractores de los profesores y")
    type_text("al final, te haré resolver una pregunta evaluando TU JUSTIFICACIÓN a prueba de errores.")
    type_text(f"{BOLD}¡Ponte cómodo y tómate tu tiempo para leer!\n{RESET}")
    
    input(f"{BOLD}[Presiona Enter para dar inicio a la primera lección...]{RESET}")
    clear_screen()

    # Mezclar el orden global de los temas a mostrar
    random.shuffle(temas_base)

    for i, tema in enumerate(temas_base, 1):
        # Se imprime el título del tema 
        header = f"{tema['titulo']} (Módulo {i}/6)"
        type_text(header, color=YELLOW)
        print("—" * 60)
        
        for txt, color in tema['lineas']:
             type_text(txt, color=color)
             
        ask_question(tema['q'])

    # --- TEMA EXTRA ---
    type_text("📚 MÓDULO FINAL FIJO: AVANCE PRÓXIMA CLASE Y DESARROLLO", color=YELLOW)
    print("—" * 60)
    type_text("Para tu examen final que está en study_test.py, te preparé dos pruebas definitivas, la 31 y la 32.")
    type_text("🔸 Pregunta 31 (Comodín): Un concepto Ágil profundo de la especialidad Scrum.")
    type_text("   👉 [Tip Inédito de Profe]: Scrum tiene una ceremonia indispensable llamada 'Daily Stand-up'. Es una reunión de máximo 15 minutos exactos que hacen los programadores todos los días de pie, a veces rotando una pelota, para asegurarse rápido de que nadie está bloqueado en el proyecto.", color=CYAN)
    type_text("🔸 Pregunta 32 (Desarrollo Verbal): Una prueba que rompe el límite del test de alternativas.")
    type_text(f"\n{BOLD}{GREEN}💡 PAUTA DE RESPUESTA ESPERADA PARA LA PREGUNTA 32 (¡ATENCIÓN A ESTO!):{RESET}")
    type_text("Si te piden los 3 primeros pasos como PO fundando una app de Ambulancias (Uber de rescate), esto es lo que debes contestar para sacar la nota máxima:", color=CYAN)
    type_text("   1. IDENTIFICACIÓN DE STAKEHOLDERS (Matriz Poder/Interés): Antes de tirar 1 línea de código, debo mapear a las entidades Regulatorias (Ministerio de Salud/Gobierno), porque ellos tienen el 'poder de veto' de clausurar la app si vulnero protocolos clínicos. Ellos van primero en prioridad de atención.")
    type_text("   2. LEVANTAMIENTO DE REQUERIMIENTOS NO FUNCIONALES (RNF): Al ser una app de urgencias, la disponibilidad del servidor (99.9% uptime), la seguridad de datos médicos y los tiempos de latencia (menos de 1 seg) no son lujos 'deseables', son barreras de VIDA O MUERTE. Estos RNF gobernarán la arquitectura base.")
    type_text("   3. ANÁLISIS CUALITATIVO DE RIESGOS: Crear de inmediato un Plan de Mitigación y Respuestas. ¿Qué pasa si el GPS o el internet de la ambulancia se cae a medio trayecto? Debo diseñar un 'Plan B' (Radio/Llamada SOS offline) mitigante antes de pensar siquiera en los botones estéticos de la interfaz.")
    
    type_text("\n👩‍🏫 ¡Listo! Mis respetos académicos.", color=CYAN)
    type_text("Esta materia ya la tienes interiorizada en el cerebro y lista para la acción.")
    type_text(f"{BOLD}¡Éxito en tu estudio! Ya tienes el comodín y la clave secreta de la Pregunta 32.{RESET}", color=GREEN)
    print("\n")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{CYAN}Saliendo de la clase exprés. ¡Vuelve pronto!{RESET}")
