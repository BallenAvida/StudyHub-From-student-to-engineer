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
    q_mixed = format_mixed_question(question_data.copy())

    type_text("\\n💬👩‍🏫 PROFESORA DANIELA: ¡Prueba sorpresa! Lee despacio, que esta viene con trampa situacional:", color=CYAN)
    time.sleep(0.5)
    print(f"\\n{BOLD}{YELLOW}{q_mixed['question']}{RESET}")
    for opt in q_mixed['display_options']:
        print(f"   {opt}")
    
    while True:
        ans = input(f"\\n{BOLD}Tu respuesta (A, B, C o D): {RESET}").strip().upper()
        if ans == 'Q':
             print(f"{CYAN}¡Saliendo de la clase exprés!{RESET}")
             sys.exit(0)
        
        if ans not in ['A', 'B', 'C', 'D']:
             print(f"{RED}Ingresa A, B, C o D. ¡No te me distraigas!{RESET}")
             continue
             
        if ans == q_mixed['correct_letter']:
             type_text(f"\\n{BOLD}✅ ¡Excelente! Veo que estudiaste los casos difíciles.{RESET}", color=GREEN)
        else:
             type_text(f"\\n{BOLD}❌ ¡Caíste redondito! La verdadera era la {q_mixed['correct_letter']}.{RESET}", color=RED)
             
        print(f"\\n{CYAN}>> Desglose y Justificación de cada opción:{RESET}")
        for i, letra in enumerate(['A', 'B', 'C', 'D']):
             raw = q_mixed['shuffled_raw'][i]
             exp = q_mixed['options'][raw]
             if letra == ans:
                  print(f"   👉 {BOLD}{letra}){RESET} {exp}")
             else:
                  print(f"      {BOLD}{letra}){RESET} {exp}")
                  
        if ans == q_mixed['correct_letter']:
             input(f"\\n{BOLD}[Presiona Enter para avanzar de tema...]{RESET}")
             clear_screen()
             break
        else:
             print(f"\\n{YELLOW}Vuelve a leer mi justificación y piénsalo otra vez. Intenta de nuevo:{RESET}")

temas_base = [
    {
        'titulo': "📚 TEMA: REQUERIMIENTOS Y CONFLICTOS",
        'lineas': [
            ("🔸 Ambigüedad Letal: Si un requisito dice 'El sistema no debe frustrar al usuario', es basura técnica. Todo requerimiento DEBE ser medible (ej: 'cargar en 2 seg').", RESET),
            ("   👉 [Tip de Profe]: Lo que no se puede probar (testear) o medir en QA, no existe en la ingeniería.", CYAN),
            ("🔸 La Ley Manda: Si Seguridad / Legal / Gobierno te exige usar un cifrado o regla específica, ellos APLASTAN cualquier requerimiento de Marketing.", RESET),
            ("🔸 Restricciones Tecnológicas: Si el jefe te obliga a integrarte con una base de datos antiquísima que él ya pagó, eso no es un requerimiento funcional. Es una 'Restricción Tecnológica' dura y No Funcional.", RESET),
            ("\\n" + "—" * 60, YELLOW),
            ("📖 REGLA DE ORO:", CYAN),
            ("   📌 Todo lo que te límite usar ciertas tecnologías, servidores, o pasarelas ya existentes es un RNF de Integración.", CYAN)
        ],
        'q': {
            'question': '[ESCENARIO] "El sistema debe integrarse obligatoriamente con el motor de pago Transbank existente de la empresa". Esto clasifica como:',
            'correct': 'Una Restricción Tecnológica / Requerimiento No Funcional de integración.',
            'options': {
                'Requerimiento Funcional de Cobro.': 'Falso. El "Cobro" genérico es la función. "Transbank obligatoriamente porque ya está pagado" es una cadena que te limita la arquitectura técnica.',
                'Regla de Negocio sobre descuentos.': 'Falso. Las pasarelas de pago son infraestructuras, no reglas lógicas de descuento porcentual.',
                'Una Restricción Tecnológica / Requerimiento No Funcional de integración.': '¡CORRECTA! Siempre que te corten las alas de programador y te impongan software legacy o de la empresa, es una Restricción de Arquitectura (RNF).',
                'Criterio de aceptación estético de la interfaz de pago.': 'Falso. Es 100% backend e infraestructura corporativa.'
            }
        }
    },
    {
        'titulo': "📚 TEMA: LA BATALLA DEL PRODUCT OWNER",
        'lineas': [
            ("🔸 El Protector: El Scrum Master no escribe código. Su tarea es ser un escudo. Si el Gerente entra gritando pidiendo cambios a mitad del Sprint, el SM lo detiene.", RESET),
            ("🔸 El ROI (Retorno sobre Inversión): Como Product Owner, siempre, pero SIEMPRE, priorizas lo que da más dinero o valor rápido en relación al esfuerzo. Los Quick Wins.", RESET),
            ("   👉 [Ejemplo Práctico]: Un filtro que cuesta 1 día y te da $1,000 va muchísimo antes que un rediseño que cuesta 1 mes y da $1,200.", CYAN),
            ("🔸 Refinamiento (Refinement): La reunión vital donde tú (el PO) le sacas brillo, cortas y aclaras las historias para dejarlas listas antes de que el equipo comience a trabajar.", RESET),
            ("\\n" + "—" * 60, YELLOW),
            ("📖 GLOSARIO DE GUERRA:", CYAN),
            ("   📌 Sprint: La iteración ininterrumpible y sagrada donde el equipo desarrolla (1 a 4 semanas).", CYAN),
            ("   📌 Quick Win: Victoria rápida. Alto valor comercial con bajísimo esfuerzo de programación.", CYAN)
        ],
        'q': {
            'question': '[ESCENARIO] El Gerente General llega furioso a mitad de un "Sprint" y exige que dejen todo para agregar un botón urgente. ¿Qué debes hacer como Scrum Master?',
            'correct': 'Proteger al equipo, bloquear la interrupción, y derivar al Gerente a hablar con el Product Owner para el próximo Sprint.',
            'options': {
                'Obligar a los programadores a incluir el botón trabajando horas extra.': 'Falso. Eso rompe la motivación y el ritmo sostenible dictado por el Manifiesto Ágil.',
                'Aceptar el cambio porque el Gerente General tiene la última palabra sobre el código.': 'Falso. En Scrum puro el Sprint Scope es sagrado; el jefe máximo deberá esperar a que termine.',
                'Proteger al equipo, bloquear la interrupción, y derivar al Gerente a hablar con el Product Owner para el próximo Sprint.': '¡CORRECTA! El SM es un guardián y un facilitador. El PO es el único que puede negociar con el Gerente General los dólares futuros.',
                'Cancelar el Sprint inmediatamente y borrar el código.': 'Falso. Hacer eso por un capricho es quemar dinero de la empresa de forma irracional.'
            }
        }
    },
    {
        'titulo': "📚 TEMA: MODELADO BPMN: TRAMPAS VISUALES",
        'lineas': [
            ("🔸 Cuidado con la Flecha: NUNCA cruces una flecha sólida (negra) entre dos piscinas (Pools) distintas. ¡Falta eliminatoria! Entre empresas diferentes sólo viajan Mensajes (Flecha punteada con sobre).", RESET),
            ("🔸 La Compuerta Paralela (+): Cuando dos o más departamentos (Ej: Legal y Riesgos) deben trabajar AL MISMO TIEMPO y ambas acciones son obligatorias simultáneas.", RESET),
            ("🔸 El Subproceso [+]: Esa cajita con un [+] abajo sirve para ocultar basura. Esconder 20 pasos de una 'Cocina' en una sola tarea limpia, para que tu jefe no se maree leyendo.", RESET),
            ("🔸 Eventos de Tiempo: Un reloj de arena en el circulito detiene todo el flujo hasta que pase un tiempo X (ej: 'Esperar a fin de mes').", RESET),
            ("\\n" + "—" * 60, YELLOW),
            ("📖 TRAMPA MORTAL DE PRUEBA:", CYAN),
            ("   📌 Compuerta Exclusiva (X o Vacía) = Te vas por un tubo O por el otro, excluyentemente.", CYAN),
            ("   📌 Compuerta Paralela (+) = Te vas por los dos tubos OBLIGATORIAMENTE Y A LA VEZ.", CYAN)
        ],
        'q': {
            'question': '[ESCENARIO BPMN] El cliente solicita un préstamo. Al mismo tiempo y obligatoriamente en paralelo, Legal revisa penales y Riesgos revisa el Dicom. ¿Qué figura BPMN usas para dividir el flujo en estos dos caminos?',
            'correct': 'Compuerta Paralela (Gateway con un símbolo de "+")',
            'options': {
                'Compuerta Exclusiva (Gateway con una "X")': 'Falso. Con la X evaluarías a Legal O a Riesgos, pero no a los dos. Y te pedían hacer ambas simultáneas.',
                'Compuerta Paralela (Gateway con un símbolo de "+")': '¡CORRECTA! El "+" fuerza a que los "hilos de trabajo" se dividan y ambos departamentos empiecen a transpirar a la vez.',
                'Compuerta Inclusiva (Gateway con una "O" redonda interior)': 'Falso. Esa compuerta evalúa y podría dejar a Riesgos afuera. La Paralela NO perdona a nadie, todos trabajan.',
                'Un Evento Intermedio de Temporizador Múltiple.': 'Falso. El reloj temporizador se usa para pausas temporales, no bifurcaciones.'
            }
        }
    },
    {
        'titulo': "📚 TEMA: BUSINESS MODEL CANVAS AVANZADO",
        'lineas': [
            ("🔸 Pivote Violento: Netflix de DVD's físicos a Streaming. ¿Qué cambió? ¡Los Canales (ahora internet) y su Estructura de Costos (ahora pagan Amazon AWS)!.", RESET),
            ("   👉 [Tip de Profe]: El Modelo de Ingresos suele ser el mismo (suscripción mensual), pero cómo te entregan el valor (Canal) explota y cambia.", CYAN),
            ("🔸 Canales vs Relación: El Canal es el MEDIO físico o digital (Aplicación, Tienda Física, Delivery). La Relación es CÓMO te trato por ese medio (Premium, Auto-servicio, Comunidad amigable).", RESET),
            ("🔸 Cuidado: Poner 'Inteligencia Artificial' en el bloque de Socios Clave es un error si lo desarrollas internamente. Socios son proveedores TERCEROS indispensables (ej: OpenAI).", RESET),
            ("\\n" + "—" * 60, YELLOW),
            ("📖 CONSEJO ESTRATÉGICO:", CYAN),
            ("   📌 Siempre pregúntate: ¿Esto es lo QUE hago (Propuesta), a QUIÉN se lo doy (Segmento) o CÓMO lo entrego (Canal)?", CYAN)
        ],
        'q': {
            'question': '[CANVAS] Netflix empezó mandando DVDs por correo. Hoy es 100% Streaming Digital mundial. ¿Qué bloque del BMC sufrió el "pivote" (cambio) distribucional más drástico?',
            'correct': 'Canales (Channels) y Estructura de Costos',
            'options': {
                'Relación con los Clientes (Customer Relationships)': 'Falso. Sigue siendo Auto-Servicio. Ellos no te llamaban antes para saludarte y tampoco lo hacen ahora.',
                'Canales (Channels) y Estructura de Costos': '¡CORRECTA! Netflix cambió completamente el "Tubo" de distribución (de FedEx a Internet de Fibra). Y sus costos pasaron de CDs de plástico a Granjas de Servidores brutales.',
                'Segmento de Clientes (Customer Segments)': 'Falso. Sigue apuntando al mismo nicho: Gente cómoda que quiere entretenimiento en el sillón de su casa.',
                'Únicamente el Flujo de Ingresos (Revenue Streams)': 'Falso. El Revenue (forma de ganar plata) se mantuvo casi intacto: te cobraban una suscripción plana al mes.'
            }
        }
    },
    {
        'titulo': "📚 TEMA: FODA Y CAME EXTREMO",
        'lineas': [
            ("🔸 Afrontar o Mitigar: Si hay una Amenaza externa brutal (Ej: Leyes anticontaminación), usas CAME para AFRONTAR. Y en gestión de riesgos, a esto se le llama 'Mitigación de Riesgos'.", RESET),
            ("🔸 Explotar la Oportunidad: Cuando ves una mina de oro en el FODA (Oportunidad externa), aplicas la letra E del CAME: ¡Explotas obsesivamente invirtiendo para capturarla antes que el enemigo!", RESET),
            ("🔸 Mantener la Fortaleza: Si tienes programadores nivel Senior increíbles (Fortaleza), los 'Mantienes' felices con bonos para no perder esa superioridad dura.", RESET),
            ("   👉 [Tip de Profe]: La técnica 'DA' (Debilidad vs Amenaza) es la de SUPERVIVENCIA. Cuando todo arde y estás endeudado, solo tratas de sobrevivir al huracán reduciéndote.", CYAN),
            ("\\n" + "—" * 60, YELLOW),
            ("📖 RESUMEN EJECUTIVO:", CYAN),
            ("   📌 C.A.M.E: Corregir (Debilidades), Afrontar (Amenazas), Mantener (Fortalezas), Explotar (Oportunidades).", CYAN)
        ],
        'q': {
            'question': '[ESCENARIO CAME] En tu FODA encontraste esta (O) Oportunidad: "Boom mundial del teletrabajo". Para aplicar la "E" (Explotar) del modelo CAME, tú debes:',
            'correct': 'Lanzar inmediatamente una campaña de ventas agresiva y subir tus servidores para capturar obsesivamente ese nuevo flujo antes que tus rivales.',
            'options': {
                'Afrontar pacíficamente que el trabajo remoto es solo temporal.': 'Falso. Rendirse y pasividad no existe en la E de Explotar las Oportunidades. Además mezclaste (A)frontar.',
                'Corregir la política interna de la empresa para prohibir VPN entre empleados del sindicato.': 'Falso. (C)orregir ataca tus Debilidades internas, y aquí estamos lidiando con oportunidades jugosas.',
                'Lanzar inmediatamente una campaña de ventas agresiva y subir tus servidores para capturar obsesivamente ese nuevo flujo antes que tus rivales.': '¡CORRECTA! Oportunidad = Ataque. Pones plata de inversión para dominar el nicho vacante rápidamente.',
                'Mantener tu catálogo de productos intacto sin realizar innovaciones.': 'Falso. Las innovaciones se deben ejecutar. Mantener intacto y sin tocar aplica solo a tus Fortalezas internas maduras.'
            }
        }
    }
]

def main():
    clear_screen()
    
    type_text("👩‍🏫 ¡Segunda ronda obligatoria! MÓDULO EXPERTO", color=CYAN)
    type_text("Este nivel es más complejo porque cruza conceptos. Te presentaré")
    type_text("situaciones de empresas y quiero que te pongas en los zapatos")
    type_text("del Gerente o Analista a cargo.")
    type_text(f"{BOLD}¡Concéntrate! Las trampas aquí son de vida real.\\n{RESET}")
    
    input(f"{BOLD}[Presiona Enter para iniciar el Módulo Experto...]{RESET}")
    clear_screen()

    random.shuffle(temas_base)

    for i, tema in enumerate(temas_base, 1):
        header = f"{tema['titulo']} (Módulo {i}/5)"
        type_text(header, color=YELLOW)
        print("—" * 60)
        
        for txt, color in tema['lineas']:
             type_text(txt, color=color)
             
        ask_question(tema['q'])

    # --- TEMA EXTRA ---
    type_text("📚 MÓDULO FINAL: RECOMENDACIÓN DE ESTUDIO", color=YELLOW)
    print("—" * 60)
    type_text("Si pasaste este módulo, te felicito. Ya puedes ir a dar el study_test2.py")
    type_text("Las preguntas 31 y 32 de la primera guía siguen vigentes como ejercicios mentales")
    type_text("imprescindibles.")
    
    type_text("\\n👩‍🏫 ¡Listo! Mis respetos.", color=CYAN)
    type_text(f"{BOLD}Ahora ve a la consola, ejecuta 'python study_test2.py' y demuéstrame que puedes sacar el 100%.{RESET}", color=GREEN)
    print("\\n")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\\n\\n{CYAN}Clase suspendida. ¡No olvides repasar!{RESET}")
