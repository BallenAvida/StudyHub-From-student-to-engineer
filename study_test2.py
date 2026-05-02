import time
import sys
import random

GREEN = '\033[92m'
RED = '\033[91m'
CYAN = '\033[96m'
YELLOW = '\033[93m'
BOLD = '\033[1m'
RESET = '\033[0m'

questions = [
    # --- REQUERIMIENTOS Y STAKEHOLDERS AVANZADOS ---
    {
        'topic': 'Requerimientos Complejos (Clases 2 y 3)',
        'question': '[ESCENARIO] El Sponsor te exige que "la app no debe frustrar a los usuarios" como requisito inicial. ¿Cuál es el problema real con este requerimiento?',
        'correct': 'Es ambiguo y no es medible; debe ser traducido a una métrica verificable (ej: "la tarea debe completarse en 3 clics").',
        'options': {
            'Es un requerimiento funcional puro, pero le falta la firma técnica del desarrollador.': 'Falso. "No frustrar" no es una función (como "registrar usuario"), es una intención cualitativa abstracta.',
            'Es ambiguo y no es medible; debe ser traducido a una métrica verificable (ej: "la tarea debe completarse en 3 clics").': '¡CORRECTA! Un requisito no medible ni testeable es basura técnica. Tienes que pasarlo por la lupa de la "Especificación".',
            'Corresponde a una restricción legal, no a un requerimiento de calidad.': 'Falso. No hay ley estatal que pene la frustración del usuario en aplicaciones genéricas.',
            'Es un requerimiento perfectamente estructurado bajo formato ágil.': 'Falso. Ni en Cascada ni en Ágil se aceptan ambigüedades románticas sin criterios de aceptación métricos.'
        }
    },
    {
        'topic': 'Requerimientos Complejos (Clases 2 y 3)',
        'question': '[ESCENARIO] El equipo de Seguridad (Regulador) exige usar encriptación SHA-256 en las contraseñas, pero Marketing dice que los usuarios odian las contraseñas largas y quieren acceso con 4 dígitos. ¿Quién manda aquí?',
        'correct': 'El equipo de Seguridad, ya que las entidades regulatorias imponen restricciones legales/técnicas no negociables.',
        'options': {
            'Marketing, porque representan directamente el dolor del cliente final (Usuarios).': 'Falso. Marketing puede opinar, pero no puede saltarse la ley o los estándares corporativos inquebrantables de seguridad.',
            'El Product Owner por votación propia democrática con los desarrolladores.': 'Falso. La ley no se somete a votación de Scrum. Si el estándar exige SHA-256 por normativa, se hace.',
            'El equipo de Seguridad, ya que las entidades regulatorias imponen restricciones legales/técnicas no negociables.': '¡CORRECTA! [DATO CLAVE]: Los stakeholders regulatorios tienen el nivel más alto de poder. Un requerimiento legal o normativo aplasta cualquier queja de usabilidad.',
            'Se debe programar ambas versiones y lanzar un Test A/B para ver qué prefiere el público.': 'Falso. No vas a lanzar una versión insegura que viola normativas solo para probar cómo reacciona el público.'
        }
    },
    {
        'topic': 'Requerimientos Complejos (Clases 2 y 3)',
        'question': '[ESCENARIO] "El sistema debe integrarse obligatoriamente con el motor de pago Transbank existente de la empresa". Esto clasifica como:',
        'correct': 'Una Restricción Tecnológica / Requerimiento No Funcional de integración.',
        'options': {
            'Requerimiento Funcional de Cobro.': 'Falso. El "Cobro" es la función. "Usar Transbank obligatoriamente porque la empresa ya lo pagó" es una restricción tecnológica limitante.',
            'Regla de Negocio sobre descuentos.': 'Falso. Transbank no es una regla matemática de descuento (ej: "10% off a jubilados"), es una pasarela de infraestructura.',
            'Una Restricción Tecnológica / Requerimiento No Funcional de integración.': '¡CORRECTA! Te están cortando la libertad de elegir. Te obligan a integrar bajo un parámetro inamovible de arquitectura.',
            'Criterio de aceptación estético de la interfaz de pago.': 'Falso. Integrar motores financieros transaccionales requiere backend puro, no es un tema netamente de paletas estéticas.'
        }
    },
    # --- ROL DEL PRODUCT OWNER & SCRUM ---
    {
        'topic': 'Escenarios de Scrum y PO (Clases 6)',
        'question': '[ESCENARIO] El Gerente General llega furioso a mitad de un "Sprint" de 2 semanas y exige que los programadores dejen todo y agreguen un botón rojo urgente. ¿Qué debes hacer tú como Scrum Master?',
        'correct': 'Proteger al equipo, bloquear la interrupción, y derivar al Gerente a hablar con el Product Owner para el próximo Sprint.',
        'options': {
            'Obligar a los programadores a incluir el botón trabajando horas extra esa misma noche.': 'Falso. Destruyes el principio ágil de ritmo sostenible y rompes el cerco del Sprint Planning.',
            'Aceptar el cambio porque el Gerente General es el máximo nivel (Sponsor) y tiene la última palabra sobre el código diario.': 'Falso. El Sprint está sellado y blindado. Interrumpirlo causa caos técnico.',
            'Proteger al equipo, bloquear la interrupción, y derivar al Gerente a hablar con el Product Owner para el próximo Sprint.': '¡CORRECTA! [EL ESCUDO HUMANO]: La labor suprema del Scrum Master es proteger el foco del equipo y decirle amablemente "No" a las distracciones, guiándolas al PO.',
            'Cancelar el Sprint inmediatamente, borrar el código y hacer una nueva reunión de Planning.': 'Falso. Una aberración cancelar semanas de trabajo por un mero botón caprichoso no catastrófico.'
        }
    },
    {
        'topic': 'Escenarios de Scrum y PO (Clases 6)',
        'question': '[ESCENARIO] Eres el Product Owner. Tienes 2 Historias en el Backlog: A) Un nuevo filtro de búsqueda que traerá $1,000 extra al mes y cuesta 1 día de desarrollo. B) Un rediseño total que traerá $1,200 al mes pero cuesta 3 semanas. ¿Cuál priorizas y por qué?',
        'correct': 'La opción A, por su altísimo ROI (Retorno de Inversión) inmediato frente a un esfuerzo mínimo.',
        'options': {
            'La opción B, porque su valor monetario nominal final ($1,200) es mayor, demostrando visión a largo plazo.': 'Falso. Matemáticas de PO: Gastar 21 días (3 semanas) por $200 extras es pésimo negocio.',
            'La opción A, por su altísimo ROI (Retorno de Inversión) inmediato frente a un esfuerzo mínimo.': '¡CORRECTA! [LA MENTE DEL PO]: La priorización siempre cruza "Valor aportado vs Esfuerzo/Costo técnico". Entregas valor rápido (Quick Win).',
            'Ninguna, debes exigirle a Scrum Master que reduzca el tiempo de B a 1 día usando metodologías extremas.': 'Falso. El tiempo no se comprime mágicamente, el equipo técnico estima y el PO lo respeta.',
            'Debes obligatoriamente hacer ambas al mismo tiempo para maximizar ganancias corporativas.': 'Falso. Ágil promueve el trabajo enfocado y secuencial priorizado, la multitarea destruye la entrega temprana.'
        }
    },
    {
        'topic': 'Escenarios de Scrum y PO (Clases 6)',
        'question': '[CONCEPTUAL] ¿Qué es el "Product Backlog Refinement" (Refinamiento)?',
        'correct': 'La sesión donde el PO y el equipo limpian, aclaran, parten y estiman historias futuras para que estén listas antes de empezar a programarlas.',
        'options': {
            'La auditoría final de calidad (QA) antes de lanzar el producto al público.': 'Falso. Refinar no es testear. Refinar es preparar el terreno a futuro.',
            'La sesión diaria (Daily) donde se informan problemas y obstáculos.': 'Falso. La Daily evalúa el hoy (presente activo), el refinamiento mira el futuro (próximos Sprints).',
            'La sesión donde el PO y el equipo limpian, aclaran, parten y estiman historias futuras para que estén listas antes de empezar a programarlas.': '¡CORRECTA! Es "sacarle punta al lápiz". Asegurarse de que el requerimiento sea INVEST antes del siguiente Sprint Planning.',
            'El castigo o retrospectiva donde se revisan los errores humanos del equipo y se despiden elementos ineficientes.': 'Falso. Las Retrospectivas (Retros) son para mejorar procesos en confianza, no cacerías de brujas para despedir gente.'
        }
    },
    # --- CASOS DE USO E HISTORIAS (AVANZADO) ---
    {
        'topic': 'Historias de Usuario (Clase 7)',
        'question': '[ESCENARIO] Lees esta historia: "Como administrador, quiero mejorar la base de datos SQL para que los índices B-Tree se balanceen automáticamente." ¿Qué regla del modelo INVEST se rompe garrafalmente?',
        'correct': 'La "V" (Valuable) para el negocio o usuario final. Es una tarea técnica, no una historia de usuario real.',
        'options': {
            'La "T" (Testable), ya que las bases de datos no se pueden probar.': 'Falso. Las bases de datos claro que se testean con scripts y querys de rendimiento.',
            'La "N" (Negotiable), porque obliga a usar SQL y no permite otras bases de datos.': 'Falso. Aunque usar SQL podría ser poco negociable, el problema capital es su enfoque puramente sistémico interno.',
            'La "V" (Valuable) para el negocio o usuario final. Es una tarea técnica, no una historia de usuario real.': '¡CORRECTA! [TRAMPA DE PROFE]: El usuario "Administrador del software" no obtiene valor de los "Índices B-Tree". Las Historias de Usuario NO son instrucciones técnicas encubiertas para desarrolladores.',
            'La "I" (Independent), porque depende de que haya electricidad.': 'Falso. Justificación absurda académica de despiste.'
        }
    },
    {
        'topic': 'Historias de Usuario (Clase 7)',
        'question': '[ESCENARIO] Tienes un Caso de Uso base "Realizar Examen Médico". Si el paciente llega con temperatura muy alta, opcionalmente el sistema te pedirá "Registrar Fármaco Febrífugo". ¿Qué relación UML utilizarías para conectar estos dos casos?',
        'correct': '<<extend>>',
        'options': {
            '<<include>>': 'Falso. El "Include" es dictatorial y obligatorio. Significará que a TODOS los pacientes de la historia del hospital les darás fármacos de fiebre, sanos o enfermos.',
            '<<extend>>': '¡CORRECTA! Extensión de uso condicional. Ocurre SOLO si se cumple una condición excepcional o alternativa (ej: Si tiene fiebre alta).',
            'Una asociación simple cruzada entre dos Actores primarios.': 'Falso. Los Actores no se asocian a otros casos de uso ajenos sin pasar por la validación técnica del caso principal condicionado.',
            'Generalización UML del Caso de Uso.': 'Falso. Generalizar es "El Pago con Crédito hereda de Pago", no una condición de interrupción opcional.'
        }
    },
    {
        'topic': 'Historias de Usuario (Clase 7)',
        'question': '[CONCEPTUAL] Al reverso de una tarjeta de Historia de Usuario, o en el ticket digital, se deben anotar los "Criterios de Aceptación". Su objetivo técnico real es:',
        'correct': 'Definir el límite exacto de cuándo la historia se considera 100% terminada y lista (Done).',
        'options': {
            'Definir qué programador Junior o Senior debe ser asignado a la tarea.': 'Falso. La asignación de recursos humanos la decide el equipo técnico (Team), no el papel de los requerimientos.',
            'Anotar los códigos y algoritmos base que el desarrollador debe copiar y pegar.': 'Falso. Dictadura tecnológica inaceptable. El equipo decide CÓMO, la historia dicta QUÉ.',
            'Definir el límite exacto de cuándo la historia se considera 100% terminada y lista (Done).': '¡CORRECTA! [CLAVE QA]: El criterio de aceptación le dice al Tester: "Si cumple el Paso 1, 2 y 3, aprueba el ticket". Evita la ambigüedad del famoso "ya casi termino".',
            'Solicitar los permisos legales necesarios al Gobierno para operar el sistema en la nube.': 'Falso. Trámite legal que escapa al ticket funcional ágil del día a día.'
        }
    },
    # --- MODELADO BPMN AVANZADO ---
    {
        'topic': 'BPMN Avanzado (Clase 4)',
        'question': '[ESCENARIO BPMN] Estás modelando el proceso de un Banco. El cliente solicita un préstamo. Al mismo tiempo y en paralelo, el Departamento Legal revisa sus antecedentes penales y Riesgos revisa su Dicom. ¿Qué figura BPMN usas para dividir el flujo en estos dos caminos que ocurren obligatoriamente a la vez?',
        'correct': 'Compuerta Paralela (Gateway con un símbolo de "+")',
        'options': {
            'Compuerta Exclusiva (Gateway con una "X")': 'Falso. La X es "O eres blanco O eres negro" (mutuamente exclusivo). El enunciado dice que ambas cosas suceden obligatoriamente a la vez.',
            'Compuerta Paralela (Gateway con un símbolo de "+")': '¡CORRECTA! [TRAMPA VISUAL]: El "+" divide el camino para que ambos departamentos trabajen simultáneamente (en paralelo) y luego obligatoriamente se vuelve a juntar con otro "+" para continuar.',
            'Compuerta Inclusiva (Gateway con una "O" redonda interior)': 'Falso. La "O" significa que puede ser 1, 2 o las 3 cosas a la vez dependiendo de una condición. Pero aquí es tajante: "Al mismo tiempo ambas".',
            'Un Evento Intermedio de Temporizador Múltiple.': 'Falso. Un temporizador frena el proceso en base a tiempo o fechas (ej: esperar 3 días), no ramifica caminos paralelos de trabajo.'
        }
    },
    {
        'topic': 'BPMN Avanzado (Clase 4)',
        'question': '[ESCENARIO BPMN] En el flujo de "Preparar Pedido Delivery", la flecha de secuencia choca directamente con un rombo vacío, de ahí salen dos flechas: "Monto mayor a $50k" y "Monto menor a $50k". Solo puedes tomar un camino. Esta es una compuerta:',
        'correct': 'Exclusiva basada en datos (X)',
        'options': {
            'Exclusiva basada en datos (X)': '¡CORRECTA! Es la típica decisión binaria de IF-ELSE informático. Te vas por un tubo o por el otro excluyentemente según la data (Monto del total).',
            'Paralela (+)': 'Falso. Si usas paralela enviarías al cliente por los dos montos al mismo tiempo, fracturando la lógica universal matemática y estafándolo el doble.',
            'Evento de Inicio Múltiple': 'Falso. Solo inician instancias, no separan secuencias activas en pleno proceso medio.',
            'Colaboración Mixta con Pool': 'Falso. Mezcla absurda de términos sin sustento notacional.'
        }
    },
    {
        'topic': 'BPMN Avanzado (Clase 4)',
        'question': '[CONCEPTUAL] ¿Para qué sirve un "Subproceso" (la caja de Tarea que tiene un pequeño signo [+] en el centro inferior)?',
        'correct': 'Para agrupar actividades complejas en una sola caja superior y evitar que el diagrama principal quede visualmente ilegible.',
        'options': {
            'Para delegarle el control obligatoriamente al competidor directo de la empresa.': 'Falso. BPMN jamás modela a los enemigos del negocio como ejecutores de tus propios diagramas internos formales.',
            'Para agrupar actividades complejas en una sola caja superior y evitar que el diagrama principal quede visualmente ilegible.': '¡CORRECTA! Es un colapsable. [TIP]: En vez de dibujar los 20 pasos de "Hacer una Pizza" en el diagrama macro, pones una caja llamada "Cocinar[+]" y si alguien quiere, hace doble clic para ver el detalle en otro plano.',
            'Representa tareas que se deben ejecutar múltiples veces en bucle iterativo de for-loop.': 'Falso. Eso lo representa la "Loop Task" (tarea con flechita en rulo).',
            'Indicar que el proceso es ejecutado por un robot de Inteligencia Artificial automático sin humanos.': 'Falso. Eso recae en un tipo especial de Service Task o Script Task con forma de engranaje o tuerca.'
        }
    },
    {
        'topic': 'BPMN Avanzado (Clase 4)',
        'question': '[CONCEPTUAL] Estás modelando el Pool "Restaurante" y el Pool "Cliente hambriento". ¿Puedo trazar una flecha negra sólida de secuencia directa que salga de la cocina y entre al cuadro del cliente?',
        'correct': 'No. Entre Pools diferentes SOLO se pueden trazar flujos de mensaje (flecha punteada con sobre).',
        'options': {
            'Sí, siempre y cuando se le agregue un evento intermedio antes de chocar.': 'Falso. La notación es brutal y castiga esto; la flecha sólida es intransitiva fuera de los dominios privados de su propio Pool.',
            'No, porque el cliente en los modelos BPMN jamás puede interactuar activamente con la empresa, solo paga pasivamente en silencio.': 'Falso. El cliente sí interactúa pidiendo cosas y recibiendo platos, la trampa es visual/sintáctica.',
            'No. Entre Pools diferentes SOLO se pueden trazar flujos de mensaje (flecha punteada con sobre).': '¡CORRECTA! [EL ERROR MÁS COMÚN DEL MUNDO BPMN]: Si tu diagrama tiene una flecha negra cruzando de la piscina 1 a la piscina 2, tu profesor te va a reprobar automáticamente por falta sintáctica. Entre entidades distintas solo viajan correos/mensajes.',
            'Sí, la flecha sólida de secuencia es el método universal libre en la notación BPMN 2.0 y carece de reglas.': 'Falso. BPMN 2.0 es uno de los lenguajes más milimétricamente regulados a nivel global ISO.'
        }
    },
    # --- MODELO DE NEGOCIOS CANVAS ---
    {
        'topic': 'Business Model Canvas (Clase 7/11)',
        'question': '[CANVAS] Netflix empezó mandando DVDs físicos por correo postal a la casa. Hoy es 100% Streaming Digital mundial en Smart TVs. ¿Qué bloque(s) del BMC sufrió el cambio o "pivote" más drástico técnico-distributivo?',
        'correct': 'Canales (Channels) y Estructura de Costos',
        'options': {
            'Relación con los Clientes (Customer Relationships)': 'Falso. La relación sigue siendo de auto-servicio pasivo (Self-Service). Netflix no te llama por teléfono hoy ni te llamaba antes para hablar del DVD.',
            'Canales (Channels) y Estructura de Costos': '¡CORRECTA! Pasaron del "Canal Físico Postal de FedEx" al "Canal Digital de Internet / App". Y sus costos pasaron de bodegas/carteros a Servidores de Nube Global (AWS). ¡Ese es un pivote brutal orgánico!',
            'Segmento de Clientes (Customer Segments)': 'Falso. El cliente sigue siendo el mismo: gente en sus casas que quiere ver películas de sofá relajados.',
            'Únicamente el Flujo de Ingresos (Revenue Streams)': 'Falso. Sigue siendo una suscripción mensual, el modelo de cobro per se (la caja registradora mensual tarjeta) es la misma premisa.'
        }
    },
    {
        'topic': 'Business Model Canvas (Clase 7/11)',
        'question': '[CANVAS] "Otorgar soporte VIP personalizado 24/7 de forma humana a cuentas Premium". Este concepto va ubicado innegablemente en el bloque de:',
        'correct': 'Relaciones con los Clientes',
        'options': {
            'Canales (Channels)': 'Falso. El canal es "Teléfono" o "Chat", pero el TIPO de trato amigable VIP o robótico pasivo recae en Relación.',
            'Actividades Clave (Key Activities)': 'Falso. Si bien contestar es la actividad, el diseño del estrato "Trato VIP humano" está enfocado al mapeo frontal en Canvas.',
            'Relaciones con los Clientes': '¡CORRECTA! [LA DIFERENCIA]: Canal es el MEDIO (App Móvil). Relación es el TRATO (Comunidad, Autoservicio, Asistencia Personal, Robótica, Self-Service).',
            'Propuesta de Valor (Value Proposition)': 'Falso. La propuesta de valor principal no es contestarte el teléfono 24/7, la propuesta suele ser el núcleo (ej: "Sistema contable infalible en nube", y de plus, la relación amigable).'
        }
    },
    # --- FODA Y CAME AVANZADO ---
    {
        'topic': 'Estrategias FODA/CAME (Clase 11)',
        'question': '[ESCENARIO FODA] El mercado de los taxis está en declive por leyes duras contra contaminación (Amenaza Alta). Tu empresa de taxis tiene una flota antigua obsoleta y pocos fondos (Debilidad Severa). ¿Qué tipo de estrategia combinada "DA" dicta la supervivencia empresarial?',
        'correct': 'Estrategia de Supervivencia o Defensiva (DA): Reducir al máximo flotas, aliarse con la competencia local de inmediato o liquidar la empresa antes de la quiebra inminente.',
        'options': {
            'Estrategia de Crecimiento (FO): Comprar toda la competencia y monopolizar el sector urbano invirtiendo a préstamo en bancos y expandiéndose en publicidad nacional.': 'Falso. FO es usar dinero fuerte y mercado feliz para reventar el techo... tú tienes cajas vacías y la ley en tu contra, un préstamo FO te entierra.',
            'Estrategia de Supervivencia o Defensiva (DA): Reducir al máximo flotas, aliarse con la competencia local de inmediato o liquidar la empresa antes de la quiebra inminente.': '¡CORRECTA! Estrategia Defensiva: Juntar tu peor Debilidad con la peor Amenaza te arrincona contra el ring. Solo queda minimizar daños, vender activos, achicarse, o sobrevivir en modo bajo consumo aguantando el huracán.',
            'Estrategia de Reorientación (DO): Mantener las flotas y esperar pasivamente que el gobierno levante los fallos de las leyes ambientales con paciencia.': 'Falso. La reorientación exige pivotear aprovechando un hueco legal de oportunidad de mercado inexplorada superando debilidad técnica, la pasividad no funciona de estrategia de combate.',
            'Estrategia de Liderazgo (FA): Obligar a los pocos chóferes a realizar turnos de cuarenta horas con pagos inflados y precios de viaje cuádruples al cliente asumiendo superioridad elitista urbana.': 'Falso. Un choque financiero frontal de la nada que arruinaría toda empresa, nada que ver con Fortaleza ni Amenaza mitigada.'
        }
    },
    {
        'topic': 'Estrategias FODA/CAME (Clase 11)',
        'question': '[ESCENARIO CAME] En tu FODA encontraste la siguiente (O) Oportunidad: "Boom del teletrabajo dispara la venta de licencias VPN corporativas". Para aplicar la "E" (Explotar) del modelo CAME, debes:',
        'correct': 'Lanzar inmediatamente una campaña de ventas masiva y subir tus servidores para capturar obsesivamente ese nuevo flujo antes que otros competidores.',
        'options': {
            'Afrontar pacíficamente que el trabajo remoto es solo temporal y que invertir en VPN es demasiado Riesgo Cualitativo a largo plazo.': 'Falso. Eso es rendirse (y encima mezclas "Afrontar" (Amenazas) con "Oportunidades"). Las Oportunidades SE EXPLOTAN agresivamente.',
            'Corregir la política interna de la empresa para prohibir VPN entre empleados del sindicato por temas de ciberseguridad sindical.': 'Falso. Corregir se le hace a tus Debilidades internas, y esto es una oportunidad dorada de ventas externa y mercantil.',
            'Lanzar inmediatamente una campaña de ventas masiva y subir tus servidores para capturar obsesivamente ese nuevo flujo antes que otros competidores.': '¡CORRECTA! [EL MÚSCULO CAME]: Oportunidad = Explotar sin piedad. Le clavas colmillos comerciales, inviertes, creces rápido y facturas.',
            'Mantener tu catálogo de productos intacto sin realizar innovaciones por miedo a saturar el equipo técnico de Scrum.': 'Falso. Mantener aplica a tus propias Fortalezas que ya funcionan (M de CAME), aquí desaprovechaste la mina de oro global in situ.'
        }
    },
    {
        'topic': 'KPIs Avanzados (Clase 6)',
        'question': '[ESCENARIO KPI] El Gerente de e-Commerce impone el KPI: "Número de carritos de compra abandonados antes de pagar en la web". ¿De qué tipo corporativo es este indicador estratégico real?',
        'correct': 'Indicador de Ventas / Conversión',
        'options': {
            'Indicador de Finanzas Netas de Capital.': 'Falso. Financiero sería si estuvieras evaluando el flujo del dólar y su ROI; el carrito abandonado indica una traba de usuario en la pantalla que frena la venta pura.',
            'Indicador Técnico No Funcional / Infraestructura.': 'Falso. La gente no abandona el carrito siempre porque haya problemas del servidor, suele ser por gastos de envío ocultos o mal diseño visual del marketing en pantalla.',
            'Indicador de Ventas / Conversión': '¡CORRECTA! Todo lo relativo al embudo de clientes (Leads, Carritos, CTR de anuncios) ataca el motor directo del embudo comercial de Marketing-Ventas online cruzado.',
            'Métrica Operacional Administrativa': 'Falso. Operacional remite a "Cuántas zapatillas construyó la máquina hoy", no si la persona online se asustó con el pago al final.'
        }
    },
    {
        'topic': 'Metodologías y Gestión (Clase 2 y 11)',
        'question': '[CONCEPTUAL] Según los ciclos de vida del proyecto, un enfoque "Iterativo e Incremental" (como Ágil) asume desde el día uno que:',
        'correct': 'Los requerimientos del cliente van a mutar inevitablemente y entregar pedazos de software pequeños mes a mes permite cambiar el rumbo sin traumas financieros letales.',
        'options': {
            'Los requerimientos del cliente van a mutar inevitablemente y entregar pedazos de software pequeños mes a mes permite cambiar el rumbo sin traumas financieros letales.': '¡CORRECTA! [LA LEY DEL ÁGIL]: "El cliente no sabe lo que quiere hasta que se lo pones enfrente y lo usa". El modelo acepta el caos como ley física universal y se moldea mediante Sprints a iterar con él.',
            'Todos los requerimientos quedarán 100% tallados en piedra de forma inquebrantable tras firmar el Acta de Inicio Charter inicial formal al instante base.': 'Falso. Acabas de describir exactamente y puramente el enfoque tradicional CASCADA o Predictivo de los años 80 donde los cambios se castigaban duramente y paralizaban firmas.',
            'El Product Owner no existe y los programadores lideran gerencialmente el desarrollo caóticamente de manera aleatoria.': 'Falso. Ágil no es anarquía, de hecho es ultrarígido con las ceremonias y el Product Owner es quien manda la batuta ordenatoria de valor.',
            'El desarrollo debe obligatoriamente programarse solo en un ambiente de pruebas hasta que la fecha límite llegue.': 'Falso. Incremento significa que sacas a Producción real versiones betas y módulos usables reales desde la semana 3 en adelante periódicamente y constantes en el tiempo.'
        }
    },
    {
        'topic': 'Metodologías y Gestión (Clase 2 y 11)',
        'question': '[ESCENARIO] Se desató un virus que arruinó la granja de servidores de Amazon, tirando el sistema. Como Gerente de Proyecto de TI, aplicas el Plan de Respuestas a Riesgos. Usar la "Base de Datos Secundaria de Respaldo Físico Offline en Europa" corresponde a la táctica de Respuesta Estratégica Riesgo Negativo llamada:',
        'correct': 'Mitigación de Riesgos',
        'options': {
            'Evitar Riesgos': 'Falso. Para evitarlo tendrías que haber sacado mágicamente los datos antes de que el virus tocara, garantizando a cero el daño. Aquí el golpe ya ocurrió, los servidores se tumbaron de frente y el virus aniquiló Amazon original.',
            'Transferir Riesgos': 'Falso. Transferir es pagarle una póliza de seguro multimillonaria a una empresa en Londres para que si te hackean ellos asuman la deuda penal, aquí usaste tus propios respaldos para defenderte operativamente y continuar andando mermado temporalmente pero vivo aún.',
            'Mitigación de Riesgos': '¡CORRECTA! Mitigar: "Tomar una acción anticipada a la fecha de crisis que reduzca la gravedad del dolor si estalla la bomba en plena guerra informático". Al tener respaldo, la empresa sobrevive y el daño se alivia, amortigua el infarto letal del cierre empresarial absoluto natural.',
            'Aceptación Pasiva de Riesgos': 'Falso. Pasivo es sentarse a llorar viendo cómo el virus te borra la base sin tocar botones o encomendarte netamente a la santísima providencia divina para no perder capital de forma mágica.'
        }
    }
]

# Añadiré unas genéricas para llegar a las 30 de forma rápida pero que refuercen temas:
# Para el caso, usaremos estas 20 (multiplicamos para rellenar si es necesario, pero las mantendré puras para asegurar calidad).
# Generaré 10 más puramente teóricas y engañosas.

preguntas_extra = [
    {
        'topic': 'Historias de Usuario / INVEST (Clase 7)',
        'question': 'Dentro de INVEST, una Historia "Pequeña" (Small) significa que:',
        'correct': 'Su tamaño es lo suficientemente reducido como para ser completada dentro de un solo Sprint.',
        'options': {
            'Debe tener menos de 10 líneas de código Java.': 'Falso.',
            'Debe requerir poca atención del Product Owner.': 'Falso.',
            'Su tamaño es lo suficientemente reducido como para ser completada dentro de un solo Sprint.': '¡CORRECTA! Si es tan inmensa que toma 2 meses, se llama "Épica" y debes cortarla en historias más pequeñas obligatoriamente.',
            'Debe ocupar poca memoria RAM en el servidor.': 'Falso.'
        }
    },
    {
        'topic': 'BPMN Avanzado (Clase 4)',
        'question': 'El evento intermedio que tiene un pequeño sobre BLANCO en el centro pegado a la línea indica:',
        'correct': 'Recepción (Catching) de un mensaje que detiene el flujo hasta que el mensaje llegue.',
        'options': {
            'Recepción (Catching) de un mensaje que detiene el flujo hasta que el mensaje llegue.': '¡CORRECTA! Sobre en blanco atrapa (Catch). Sobre rellenado negro envía (Throw).',
            'Envío inmediato a un servidor externo de correo.': 'Falso.',
            'Comienzo absoluto del diagrama sin excepciones lógicas.': 'Falso.',
            'Bucle repetitivo (Loop) condicionado por datos for-each.': 'Falso.'
        }
    },
    {
        'topic': 'BPMN Avanzado (Clase 4)',
        'question': 'Si veo un evento intermedio con un RELOJ de arena/reloj analógico, este detiene la secuencia por:',
        'correct': 'Condición de tiempo programada, como esperar 2 horas o esperar a fin de mes.',
        'options': {
            'Decisión gerencial arbitraria humana obligatoria.': 'Falso.',
            'Condición de tiempo programada, como esperar 2 horas o esperar a fin de mes.': '¡CORRECTA! El "Timer Event" automatiza demoras (Ej: "Esperar a las 00:00 hrs" para cerrar caja bancaria automatizada).',
            'Pausa de sistema por saturación de CPU o red colapsada.': 'Falso.',
            'Error en la base de datos de datos transaccionales históricos.': 'Falso.'
        }
    },
    {
        'topic': 'Stakeholders y Análisis (Clase 3)',
        'question': '¿Qué objetivo primario tiene graficar la matriz "Poder vs Interés" con los Stakeholders?',
        'correct': 'Clasificar quién requiere atención inmediata (Ej: Poder Alto / Interés Alto) vs quién solo necesita ser informado esporádicamente.',
        'options': {
            'Definir los sueldos en dólares que ganarán en la empresa a nivel gerencial.': 'Falso.',
            'Clasificar quién requiere atención inmediata (Ej: Poder Alto / Interés Alto) vs quién solo necesita ser informado esporádicamente.': '¡CORRECTA! Te salva la vida política. A los Alto-Alto hay que gestionarlos de cerca, y a los Bajo-Bajo solo monitorearlos de lejos para no perder el tiempo productivo inútilmente en charlas intrascendentes.',
            'Dictaminar el tiempo de desarrollo de programación estricta.': 'Falso.',
            'Encontrar bugs en el código de forma visual.': 'Falso.'
        }
    },
    {
        'topic': 'Requerimientos (Clase 2)',
        'question': 'Las "Reglas de Negocio" son:',
        'correct': 'Políticas, leyes, condiciones y normativas de la propia empresa que el sistema debe acatar forzosamente.',
        'options': {
            'Decisiones de arquitectura técnica de software.': 'Falso.',
            'Políticas, leyes, condiciones y normativas de la propia empresa que el sistema debe acatar forzosamente.': '¡CORRECTA! Ej: "Todo cliente VIP tiene 5% de descuento". No es un botón visual de interfaz de UI general funcional clásico superficial (requerimiento), es una regla dura matemática y corporativa subyacente impuesta obligatoria.',
            'Los lenguajes de programación obligados.': 'Falso.',
            'Las ceremonias de Scrum como el Daily o Planning obligatorias semanales.': 'Falso.'
        }
    },
    {
        'topic': 'KPIs y Métricas (Clase 6)',
        'question': 'En el embudo de Marketing Digital, el "CAC (Costo de Adquisición de Cliente)" indica:',
        'correct': 'Cuánto dinero en publicidad u horas-hombre gasta la empresa para que UNA persona nueva termine comprando el producto.',
        'options': {
            'Cuánto dinero le cobras al cliente mensualmente.': 'Falso.',
            'Cuánto dinero en publicidad u horas-hombre gasta la empresa para que UNA persona nueva termine comprando el producto.': '¡CORRECTA! Métrica vital. Si tu software vale $10 pero te cuesta $50 en anuncios de Facebook conseguir a ese cliente, tu CAC es ruin y estás quebrando financieramente en caída libre absoluta inevitable in situ.',
            'El costo de arrendar los servidores en Amazon AWS para todo el año calendario.': 'Falso.',
            'El salario del departamento técnico de desarrollo sumado a los bonos productivos trimestrales inamovibles.': 'Falso.'
        }
    },
    {
        'topic': 'Casos de Uso (Clase 7)',
        'question': 'El flujo base principal o "Happy Path" (Camino Feliz) en la redacción tabular de un Caso de Uso describe:',
        'correct': 'La ruta óptima y perfecta donde no hay errores, el usuario ingresa sus datos y logra su meta a la primera sin contratiempos de excepciones de caídas ni alertas de fallos.',
        'options': {
            'El camino que el tester de QA debe intentar romper obligatoriamente agresivo a nivel extremo de hackers internacionales.': 'Falso.',
            'Los flujos de excepción donde el usuario ingresa mal la contraseña de manera obligatoria y cíclica para medir retenciones.': 'Falso.',
            'La ruta óptima y perfecta donde no hay errores, el usuario ingresa sus datos y logra su meta a la primera sin contratiempos de excepciones de caídas ni alertas de fallos.': '¡CORRECTA! Es el flujo ideal primario, el "Deber Ser" si todo fluye bien 100% como se concibió en los manuales perfectos académicos base y diseños.',
            'La arquitectura de programación más económica en código y tiempo logístico.': 'Falso.'
        }
    },
    {
        'topic': 'Gestión de Proyecto (Clase 11)',
        'question': '¿Qué es el "Alcance" (Scope) de un proyecto de Software en su etapa de Planificación?',
        'correct': 'Los límites absolutos: qué funcionalidades exactas están incluidas dentro de la billetera y tiempo a entregar, y qué está excluido explícitamente.',
        'options': {
            'El dinero total que se gastará.': 'Falso.',
            'Los límites absolutos: qué funcionalidades exactas están incluidas dentro de la billetera y tiempo a entregar, y qué está excluido explícitamente.': '¡CORRECTA! El Alcance es la muralla protectora de un Jefe de Proyecto real. "Haremos la Casa con 2 Baños, NO haremos piscina, ni terraza, ni patio extra ni luces led inteligentes. Fírmalo.".',
            'El número de programadores asignados al inicio.': 'Falso.',
            'El diagrama técnico de los módulos internos.': 'Falso.'
        }
    },
    {
        'topic': 'Metodologías Ágiles (Clase 6)',
        'question': 'La filosofía "KISS (Keep It Simple, Stupid)" en ingeniería y diseño ágil se refiere a:',
        'correct': 'La simplicidad como un objetivo de diseño clave; evitar añadir complejidad innecesaria a los sistemas para que sean mantenibles.',
        'options': {
            'Una falta de respeto para el cliente si no entiende el código del desarrollador.': 'Falso.',
            'Comprar siempre las licencias de software más baratas.': 'Falso.',
            'La simplicidad como un objetivo de diseño clave; evitar añadir complejidad innecesaria a los sistemas para que sean mantenibles.': '¡CORRECTA! El código sobreingeniado falla y es imposible de leer o actualizar. Mantenerlo simple e iterar salva vidas tecnológicas.',
            'Rechazar requerimientos funcionales constantemente.': 'Falso.'
        }
    },
    {
        'topic': 'FODA / CAME (Clase 11)',
        'question': 'Al realizar CAME, la "M" (Mantener) recae sobre:',
        'correct': 'Las Fortalezas (ej: Si tienes un equipo de excelencia, debes mantenerlos felices, subir sus sueldos y asegurar su permanencia laboral activa productiva leal).',
        'options': {
            'Las Debilidades (mantener la mala infraestructura para no gastar).': 'Falso.',
            'Las Amenazas (mantener la vista en el horizonte a ver qué sucede con paciencia inactiva natural).': 'Falso.',
            'Las Fortalezas (ej: Si tienes un equipo de excelencia, debes mantenerlos felices, subir sus sueldos y asegurar su permanencia laboral activa productiva leal).': '¡CORRECTA! Las Fortalezas no se tocan, se "Mantienen" y se cuidan como hueso santo porque te dan la ventaja competitiva global dura de la empresa principal.',
            'Las Oportunidades (mantener contacto con clientes a futuro dudoso lejano).': 'Falso.'
        }
    }
]

questions.extend(preguntas_extra)

def format_mixed_question(q):
    """
    Toma la estructura de la prueba, desordena opciones.
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

def run_quiz():
    print(f"\\n{BOLD}{CYAN}" + "="*80)
    print(" 🚀 MEGA TEST 2: ESCENARIOS AVANZADOS Y TRAMPAS SITUACIONALES 🚀 ")
    print("="*80 + f"{RESET}\\n")
    print("¡Sube el nivel! Este Test número 2 simula preguntas complejas, largas y ")
    print("enfocadas en trampas de análisis (Escenarios de casos reales).")
    print("\\nEscribe 'Q' para salir en cualquier momento.\\n")
    
    score = 0
    random.shuffle(questions)
    
    topics_tracking = {}
    for q in questions:
         top = q['topic']
         if top not in topics_tracking:
             topics_tracking[top] = {'total': 0, 'correct': 0}
         topics_tracking[top]['total'] += 1
         
    for idx, raw_q in enumerate(questions, 1):
        q = format_mixed_question(raw_q)
        if ']' in q['question']:
            q_tag, solo_q = q['question'].split(']', 1)
            print(f"\\n{BOLD}{YELLOW}{idx}. {q_tag}]{RESET} {solo_q.strip()}")
        else:
            print(f"\\n{BOLD}{YELLOW}{idx}. {q['question']}{RESET}")
        
        for opt in q['display_options']:
            print(f"   {opt}")
        
        while True:
            ans = input(f"\\n{BOLD}Tu respuesta (A,B,C,D o Q): {RESET}").strip().upper()
            if ans == 'Q':
                print(f"{CYAN}¡Saliendo! Terminaste con puntaje de {score}/{idx-1}{RESET}")
                sys.exit(0)
            if ans in ['A', 'B', 'C', 'D']:
                break
            print(f"{RED}Por favor, ingresa una letra válida.{RESET}")
            
        topic = q['topic']
        if ans == q['correct_letter']:
            print(f"{GREEN}{BOLD}✅ ¡CORRECTO! Magistral.{RESET}")
            score += 1
            topics_tracking[topic]['correct'] += 1
        else:
            print(f"{RED}{BOLD}❌ INCORRECTO. La verdadera y brutal respuesta era la {q['correct_letter']}.{RESET}")
            
        print(f"\\n{CYAN}>> Desglose Técnico Profesional:{RESET}")
        for i, letra in enumerate(['A', 'B', 'C', 'D']):
             raw = q['shuffled_raw'][i]
             exp = q['options'][raw]
             if letra == ans:
                  print(f"   👉 {BOLD}{letra}){RESET} {exp}")
             else:
                  print(f"      {BOLD}{letra}){RESET} {exp}")
        
        input(f"\\n{BOLD}[Presiona Enter para avanzar la tortura...]{RESET}")

    # ===== FIN =====
    print(f"\\n{BOLD}{CYAN}" + "="*80)
    print(f"🎉 TEST 2 COMPLETADO CON ÉXITO 🎉")
    print(f"Tu puntaje es: {score}/{len(questions)} ({(score/len(questions))*100:.1f}%)")
    
    print(f"\\n{BOLD}📊 DIAGNÓSTICO MATRICIAL:{RESET}")
    weak_topics = []
    for topic, stats in topics_tracking.items():
         percentage = (stats['correct'] / stats['total']) * 100
         color_stat = GREEN if percentage >= 80 else YELLOW if percentage >= 50 else RED
         print(f" - {topic}: {color_stat}{stats['correct']}/{stats['total']} ({percentage:.0f}%){RESET}")
         if percentage < 80:
              weak_topics.append(topic)
              
    if weak_topics:
         print(f"\\n{BOLD}⚠️ Refuerza intensivamente: {RED}{', '.join(weak_topics)}{RESET}.")
         
    print(f"{BOLD}{CYAN}" + "="*80 + f"{RESET}\\n")
    print(f"\\n{BOLD}¡Te veo en guia_profesora2.py para repasar estas caídas garrafales!{RESET}\\n")

if __name__ == '__main__':
    try:
        run_quiz()
    except KeyboardInterrupt:
         pass
