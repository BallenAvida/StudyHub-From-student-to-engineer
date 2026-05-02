import time
import os
import sys

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

temas_textuales = [
    {
        'titulo': "📚 TEMA: REQUERIMIENTOS Y ROLES SCRUM (PPT 2 y 3)",
        'lineas': [
            ("🔸 Obtención (Elicitación): Se recopila información de los usuarios y clientes mediante entrevistas, encuestas, observación, etc.", RESET),
            ("🔸 Requerimientos funcionales: Describen QUÉ debe hacer el sistema (acciones, servicios o funciones visibles). Ejemplo: 'El sistema debe permitir registrar usuarios'.", CYAN),
            ("🔸 Requerimientos no funcionales: Describen CÓMO debe funcionar el sistema (calidad, rendimiento, seguridad). Ejemplo: 'El sistema debe responder en menos de 2 segundos'.", CYAN),
            ("🔸 Riesgos si no se definen bien: El sistema no satisface al cliente, costos adicionales, pérdida de tiempo.", RESET),
            ("🔸 Product Owner: Define las funcionalidades, prioriza el backlog y actúa como enlace principal entre clientes y equipo técnico.", CYAN),
            ("🔸 Scrum Master: Asegura que el equipo siga las prácticas ágiles y elimina impedimentos.", CYAN),
            ("🔸 Equipo de Desarrollo: Profesionales que realizan el trabajo técnico de crear el producto.", CYAN)
        ],
        'pregunta': {
            'texto': "¿Según los textos, si un usuario dice 'El sistema debe responder en menos de 2 segundos', qué tipo de requerimiento es?",
            'opciones': ['A) Requerimiento Funcional', 'B) Requerimiento No Funcional'],
            'correcta': 'B',
            'explicacion_correcta': "¡Exacto! El tiempo de respuesta es un requerimiento No Funcional (describe CÓMO funciona).",
            'explicacion_incorrecta': "Recuerda que los funcionales describen QUÉ hace (ej: registrar un usuario), no los tiempos ni rendimiento."
        }
    },
    {
        'titulo': "📚 TEMA: MODELADO BPMN Y SÍMBOLOS (PPT 4)",
        'lineas': [
            ("🔸 Evento de Inicio (Círculo Verde): Marca el comienzo del proceso.", RESET),
            ("🔸 Evento Intermedio (Círculo Doble): Ocurre entre el inicio y el fin del proceso.", RESET),
            ("🔸 Evento de Fin (Círculo Rojo): Indica el término del proceso.", RESET),
            ("🔸 Compuerta Exclusiva (X): Solo una ruta se ejecuta.", CYAN),
            ("🔸 Compuerta Paralela (+): Todas las rutas se ejecutan al mismo tiempo.", CYAN),
            ("🔸 Compuerta Inclusiva (O): Una o más rutas se ejecutan si cumplen la condición.", CYAN),
            ("🔸 Flujo de Secuencia (Flecha sólida): Conecta elementos del proceso en orden de ejecución.", RESET),
            ("🔸 Flujo de Mensaje (Flecha punteada con sobre): Representa comunicación entre participantes (ej. cliente y empresa).", RESET),
            ("🔸 Grupo (Rectángulo punteado): Agrupa elementos relacionados sin afectar el flujo.", CYAN)
        ],
        'pregunta': {
            'texto': "¿Qué tipo de flecha se debe usar si queremos representar un mensaje enviado de un Cliente a la Empresa en BPMN?",
            'opciones': ['A) Flecha sólida de secuencia', 'B) Flecha punteada con sobre'],
            'correcta': 'B',
            'explicacion_correcta': "¡Súper! La flecha punteada con sobre es el 'Flujo de Mensaje' usado para participantes externos.",
            'explicacion_incorrecta': "Ojo, la flecha sólida de secuencia solo conecta tareas internamente dentro del mismo proceso."
        }
    },
    {
        'titulo': "📚 TEMA: MEJORA CONTINUA Y KPIs (PPT 6)",
        'lineas': [
            ("🔸 Ciclo PDCA: Planificar (Plan) → Ejecutar (Do) → Verificar (Check) → Actuar (Act).", CYAN),
            ("🔸 Diferencia Métrica vs KPI: No toda métrica es estratégica. 'Número de llamadas' es métrica. 'Tiempo promedio de respuesta' es KPI.", CYAN),
            ("🔸 KPI SMART: Específico, Medible, Alcanzable, Relevante, Temporal.", CYAN),
            ("🔸 Sprints en Scrum: Iteraciones cortas (2 a 4 semanas).", RESET),
            ("🔸 Sprint Planning: El equipo decide qué funcionalidades desarrollará en el próximo sprint.", RESET),
            ("🔸 Daily Scrum: Reunión diaria de 15 minutos para ajustar el trabajo.", RESET),
            ("🔸 Sprint Review: Se muestra lo desarrollado y se recibe feedback.", RESET),
            ("🔸 Sprint Retrospective: El equipo reflexiona sobre cómo mejorar para la próxima iteración.", RESET)
        ],
        'pregunta': {
            'texto': "Si te preguntan qué evento sirve para que 'el equipo decida qué funcionalidades desarrollará en el próximo sprint', debes responder:",
            'opciones': ['A) Sprint Planning', 'B) Sprint Review'],
            'correcta': 'A',
            'explicacion_correcta': "¡Correcto! En la Planning se planifica el trabajo a futuro del sprint.",
            'explicacion_incorrecta': "Te confundiste con la Sprint Review, que ocurre al final para revisar y mostrar lo que ya se hizo."
        }
    },
    {
        'titulo': "📚 TEMA: CASOS DE USO E HISTORIAS DE USUARIO (PPT 7)",
        'lineas': [
            ("🔸 Caso de Uso: Técnica que describe cómo un usuario (actor) interactúa con un sistema para alcanzar un objetivo.", RESET),
            ("🔸 Casos de uso de Negocio: Se centran en las metas de la empresa.", CYAN),
            ("🔸 Casos de uso de Sistema: Detallan las interacciones técnicas de los usuarios con una parte específica del sistema.", CYAN),
            ("🔸 Notación UML: Actor (stickman), Caso de uso (óvalo con el nombre de la funcionalidad).", RESET),
            ("🔸 Relación <<include>>: Un caso de uso siempre invoca otro de manera obligatoria.", CYAN),
            ("🔸 Relación <<extend>>: Un caso de uso opcional que amplía otro.", CYAN),
            ("🔸 Historias de Usuario: Formato -> 'Como [rol], quiero [funcionalidad] para [beneficio]'.", RESET),
            ("🔸 El Método INVEST: Independiente, Negociable, Valiosa, Estimable, Small (Pequeña), Testable.", CYAN)
        ],
        'pregunta': {
            'texto': "En un diagrama, si la acción 'Validar Tarjeta' es obligatoria siempre que se ejecuta 'Pagar Compra', ¿qué relación usamos?",
            'opciones': ['A) Relación <<extend>>', 'B) Relación <<include>>'],
            'correcta': 'B',
            'explicacion_correcta': "¡Bien hecho! <<include>> significa que un caso invoca al otro siempre y obligatoriamente.",
            'explicacion_incorrecta': "No puede ser <<extend>> porque esa relación se usa solo para casos opcionales que a veces suceden."
        }
    },
    {
        'titulo': "📚 TEMA: GESTIÓN DE PROYECTOS, FODA Y CAME (PPT 11)",
        'lineas': [
            ("🔸 Gestión de Proyectos: Disciplina de planificar, ejecutar y controlar tareas para alcanzar objetivos SMART en tiempo y presupuesto.", CYAN),
            ("🔸 Fase de Inicio: Se define el propósito y se crea el Acta de Constitución (Project Charter).", RESET),
            ("🔸 Fase de Ejecución: El equipo realiza las tareas asignadas. Es la fase que consume la mayor cantidad de recursos.", RESET),
            ("🔸 Riesgos Cuantitativos: Uso de datos numéricos para proyectar costos o retrasos.", RESET),
            ("🔸 FODA - Variables Internas: Fortalezas (Positivas) y Debilidades (Negativas).", CYAN),
            ("🔸 FODA - Variables Externas: Oportunidades (Positivas) y Amenazas (Negativas).", CYAN),
            ("🔸 CAME (Corregir, Afrontar, Mantener, Explotar):", RESET),
            ("   - Estrategia FO: Usar fortalezas para aprovechar oportunidades.", RESET),
            ("   - Estrategia FA: Usar fortalezas para enfrentar amenazas.", RESET),
            ("   - Estrategia DO: Superar debilidades aprovechando oportunidades.", RESET),
            ("   - Estrategia DA: Minimizar debilidades y evitar amenazas.", RESET)
        ],
        'pregunta': {
            'texto': "En el análisis CAME de tu PPT, la estrategia 'DO' nos dice textualmente que debemos:",
            'opciones': ['A) Minimizar debilidades y evitar amenazas', 'B) Superar debilidades aprovechando oportunidades'],
            'correcta': 'B',
            'explicacion_correcta': "¡Eso es! DO significa (Debilidades - Oportunidades): Superar debilidades aprovechando oportunidades.",
            'explicacion_incorrecta': "La opción que elegiste corresponde a DA (Debilidades - Amenazas)."
        }
    }
]

def main():
    clear_screen()
    
    type_text("👩‍🏫 ¡Hola de nuevo! Soy la Profesora Daniela.", color=CYAN)
    type_text("He expandido esta guía para cubrir aún más definiciones exactas de tus PPTs.")
    type_text("Además, le agregué pequeñas preguntas de verificación al final de cada tema, ¡igual que en la Guía 1!")
    type_text(f"{BOLD}Si memorizas y entiendes esto, ¡tendrás la nota máxima asegurada!\\n{RESET}")
    
    input(f"{BOLD}[Presiona Enter para repasar el material textual ampliado...]{RESET}")
    clear_screen()

    for i, tema in enumerate(temas_textuales, 1):
        type_text(f"{tema['titulo']} (Módulo {i}/{len(temas_textuales)})", color=YELLOW)
        print("—" * 60)
        
        for txt, color in tema['lineas']:
             type_text(txt, color=color)
             
        # Pregunta interactiva
        print("\\n" + "—" * 60)
        type_text("👩‍🏫 Pregunta rápida para comprobar si entendiste:", color=CYAN)
        print(f"{BOLD}{tema['pregunta']['texto']}{RESET}")
        for opt in tema['pregunta']['opciones']:
            print(f"   {opt}")
            
        while True:
            ans = input(f"\\n{BOLD}Tu respuesta (A o B): {RESET}").strip().upper()
            if ans in ['A', 'B']:
                break
            print(f"{RED}Por favor, ingresa A o B.{RESET}")
            
        if ans == tema['pregunta']['correcta']:
            print(f"{GREEN}{BOLD}✅ ¡Muy bien! {tema['pregunta']['explicacion_correcta']}{RESET}")
        else:
            print(f"{RED}{BOLD}❌ Cuidado. {tema['pregunta']['explicacion_incorrecta']}{RESET}")

        input(f"\\n{BOLD}[Presiona Enter para continuar...]{RESET}")
        clear_screen()

    type_text("📚 RESUMEN EXTENDIDO FINALIZADO", color=YELLOW)
    print("—" * 60)
    type_text("Ya cubrimos todos los detalles literales de las diapositivas.")
    type_text("El test 3 también ha crecido a 25 preguntas para que el número quede perfecto.")
    
    type_text("\\n👩‍🏫 ¡Mucho éxito estudiando! Ejecuta 'python study_test3.py'", color=GREEN)
    print("\\n")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\\n\\n{CYAN}Clase suspendida. ¡A repasar!{RESET}")
