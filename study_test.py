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
    {
        'topic': 'Requerimientos (Clase 2)',
        'question': '[PPT SEGUNDA CLASE, Diapositiva 3] ¿Cuál es el propósito principal de los requerimientos de software?',
        'correct': 'Comunicar de manera precisa qué se espera del sistema entre cliente, usuarios y desarrolladores.',
        'options': {
            'Definir la arquitectura técnica interna del sistema computacional.': 'Falso. Entrar al diseño de la arquitectura y la ingeniería técnica ocurre mucho después, no en la fase inicial de requisitos.',
            'Comunicar de manera precisa qué se espera del sistema entre cliente, usuarios y desarrolladores.': '¡CORRECTA! El objetivo fundacional es lograr un contrato y entendimiento claro de QUÉ debe hacerse antes de tirar código. [DATO CLAVE]: Imagina los requerimientos como el puente de traducción entre el mundo corporativo y el mundo de TI.',
            'Especificar exclusivamente el lenguaje de programación y la base de datos a utilizar.': 'Falso. Definir Python o SQL es trabajo de implementación/desarrollo, lo cual está vetado en la redacción de requerimientos puros funcionales.',
            'Establecer el diseño gráfico, los colores y la navegabilidad de la interfaz.': 'Falso. Aunque una UI puede derivar en requerimientos, "colores y diseño gráfico" es un objetivo netamente de diseño visual, no el propósito principal del negocio.'
        }
    },
    {
        'topic': 'Requerimientos (Clase 2)',
        'question': '[PPT SEGUNDA CLASE, Diapositiva 7] "El sistema debe responder en menos de 2 segundos" es un ejemplo de:',
        'correct': 'Requerimiento No Funcional',
        'options': {
            'Requerimiento Funcional': 'Falso. Los funcionales determinan QUÉ hace el sistema (ej: "Mandar email", "Cobrar tarjeta"), no CÓMO lo hace.',
            'Requerimiento de Arquitectura': 'Falso. No existe oficialmente en nuestra materia bajo ese título. Podría ser una decisión de arquitectura, pero el término real del levantamiento es No Funcional.',
            'Requerimiento No Funcional': '¡CORRECTA! Porque restringe CÓMO debe operar o la CALIDAD bajo la cual opera. [TRAMPA CLÁSICA DE EXAMEN]: Siempre que veas una métrica referida a rendimiento (tiempo, segundos), seguridad o disponibilidad, márcala inmediatamente como No Funcional. Son las restricciones del sistema.',
            'Requerimiento de Hardware': 'Falso. Si te dijeran "Debe usar un servidor AWS" sí, pero solo limitar "tiempo" no asume específicamente la compra de un hardware físico.'
        }
    },
    {
        'topic': 'Requerimientos (Clase 2)',
        'question': '[PPT SEGUNDA CLASE, Diapositiva 7] ¿Cuál de las siguientes fases NO pertenece al proceso formal de requerimientos?',
        'correct': 'Programación / Implementación',
        'options': {
            'Programación / Implementación': '¡CORRECTA! La escritura de código jamás ocurre durante el ciclo de requerimientos. [OJO]: Muchos profesores ponían esta alternativa para cazar giles. Echar código es de la fase de Desarrollo.',
            'Análisis': 'Falso. El Análisis SÍ es una fase indispensable donde desmenuzas e interpretas lo que quiere el cliente.',
            'Obtención (Elicitación)': 'Falso. La elicitación (levantamiento mediante entrevistas) SÍ es la fase vital número uno para obtener la información.',
            'Validación': 'Falso. La Validación SÍ es la última fase de los requerimientos, donde logras que el cliente apruebe y firme.'
        }
    },
    {
        'topic': 'Requerimientos (Clase 2)',
        'question': '[PPT SEGUNDA CLASE, Diapositiva 8] Según los riesgos expuestos de no definir bien los requerimientos, ¿qué sucede en etapas avanzadas?',
        'correct': 'Se generan altos costos adicionales por cambios tardíos en la programación.',
        'options': {
            'El proyecto debe obligatoriamente cambiar su tecnología base.': 'Falso. Te puedes haber equivocado en un formulario y no por eso vas a cambiar The Python a Java entero.',
            'Se elimina la necesidad de realizar pruebas de calidad de software.': 'Falso. Al contrario, un pésimo requerimiento vuelve locos a los QA porque no saben qué parámetros probar.',
            'El equipo técnico debe asumir el rol del Product Owner.': 'Falso. Un programador jamás asumirá formal y éticamente el peso del Product Owner (Cliente).',
            'Se generan altos costos adicionales por cambios tardíos en la programación.': '¡CORRECTA! [DATO CLAVE]: La curva de Boehm dice "Un bug arreglado en etapa de requerimientos cuesta $1 USD, pero si lo arreglas cuando el software ya está en producción cuesta $10.000 USD".'
        }
    },
    {
        'topic': 'Requerimientos (Clase 2)',
        'question': '[PPT SEGUNDA CLASE, Diapositiva 4] Según la clase, ¿cómo se define un "Sistema"?',
        'correct': 'Conjunto de hardware, software, personas, procedimientos y datos.',
        'options': {
            'Un software operativo diseñado exclusivamente para la gestión en la nube.': 'Falso. ¿Y si es un sistema gigantesco sin conexión a internet naval? La "nube" no es requisito de un sistema natural.',
            'Conjunto de hardware, software, personas, procedimientos y datos.': '¡CORRECTA! Es un conglomerado integral. [TIP]: ¡Jamás te olvides de la palabra PERSONAS y PROCEDIMIENTOS! Un computador muy caro es basura si no tiene una persona que lo sepa usar usando normas.',
            'La combinación de servidores físicos y el código backend automatizado.': 'Falso. Faltan las Personas y los Procesos. Esa es una visión netamente ingenieril solitaria.',
            'Un modelo de arquitectura de software para acelerar bases de datos.': 'Falso. Eso es simplemente ingeniería técnica de rendimiento, no la definición conceptual de Sistema Organizacional.'
        }
    },
    {
        'topic': 'Stakeholders (Clase 3)',
        'question': '[PPT TERCERA CLASE, Diapositiva 4] Los requerimientos que describen qué hace el sistema (acciones, servicios, funciones visibles) se denominan:',
        'correct': 'Requerimientos Funcionales',
        'options': {
            'Requerimientos de Calidad': 'Falso. La calidad de uso alude a normas y métricas (No Funcional).',
            'Requerimientos de Dominio': 'Falso. Los de dominio refieren a reglas jurídicas u operativas de un nicho específico (ej. "Toda receta debe llevar firma médica").',
            'Requerimientos Funcionales': '¡CORRECTA! [MEMORIZA]: "Todo lo que el sistema HACE proactivamente o procesa operativamente". Si puedes dibujarlo en un botón ("Registrar", "Calcular", "Aprobar"), es Funcional.',
            'Requerimientos No Funcionales': 'Falso. Si habla de funciones operativas directas, no es restrictivo.'
        }
    },
    {
        'topic': 'Stakeholders (Clase 3)',
        'question': '[PPT TERCERA CLASE, Diapositiva 7] Según las problemáticas organizacionales, un sistema de salud o educación inclusiva corresponde a una problemática de tipo:',
        'correct': 'Social',
        'options': {
            'Gubernamental': 'Falso. Aunque sea ejecutado por el Estado, el *foco de impacto* principal es en la gente.',
            'Tecnológica': 'Falso. Problemática tecnológica sería "los servidores del hospital se caen a mediodía".',
            'Social': '¡CORRECTA! La inclusión, equidad, educación pública atacan de lleno una carencia *Social* en las comunidades.',
            'Operativa': 'Falso. Una problemática operativa referiría a "El médico se demora 15 minutos solo en llenar el formulario".'
        }
    },
    {
        'topic': 'Stakeholders (Clase 3)',
        'question': '[PPT TERCERA CLASE, Diapositiva 8] En un proyecto, ¿qué rol "define las funcionalidades del software, prioriza el backlog y actúa como enlace principal"?',
        'correct': 'Dueño del Producto (Product Owner)',
        'options': {
            'Patrocinador del Proyecto (Sponsor)': 'Falso. El Patrocinador da la plata, él no define la lista de requerimientos técnicos microscópicos.',
            'Gerente de Proyecto (Project Manager)': 'Falso. El Gerente maneja presupuesto, tiempos y riesgos. Él controla CÓMO vamos, pero no prioriza QUÉ vamos a construir y qué botón importa más.',
            'Dueño del Producto (Product Owner)': '¡CORRECTA! Él es la Mente Maestra Central (Representante exclusivo del negocio) que dicta prioridades.',
            'Analista de Sistemas': 'Falso. El Analista disecciona en requisitos técnicos, apoya la labor, pero no aprueba prioridades de negocio ni decide por sí solo qué va primero.'
        }
    },
    {
        'topic': 'Stakeholders (Clase 3)',
        'question': '[PPT TERCERA CLASE, Diapositiva 8] ¿Qué stakeholder proporciona financiación, recursos y dirección estratégica?',
        'correct': 'Patrocinador del Proyecto (Sponsor)',
        'options': {
            'Scrum Master': 'Falso. El Scrum Master remueve impedimentos organizacionales. No tiene la chequera mágica.',
            'Gerente de TI (IT Manager)': 'Falso. Dirige la infraestructura de servidores de la compañía (depende del dinero gerencial).',
            'Entidad Regulatoria': 'Falso. Los reguladores dictan la ley (Ministerios, Senadores, Auditoras), jamás financian sistemas privados.',
            'Patrocinador del Proyecto (Sponsor)': '¡CORRECTA! Director, Alta Gerencia o Inversionista de la película. [TIP]: En la matriz de Impacto vs Interés, este es el tipo al que TIENES QUE TENER CONTENTO todo el día porque apaga el sistema de 1 click.'
        }
    },
    {
        'topic': 'Stakeholders (Clase 3)',
        'question': '[PPT TERCERA CLASE, Diapositiva 9] Son entidades externas que NO desarrollan el software ni proveen fondos, pero dictan estándares legales o éticos obligatorios:',
        'correct': 'Entidades Regulatorias',
        'options': {
            'Entidades Regulatorias': '¡CORRECTA! [DATO CLAVE]: ¡Nunca los subestimes! Las entidades regulatorias no ponen plata, pero tienen el "Súper Poder" jurídico de cancelar y multar todo tu proyecto si vulneras una sola norma sobre protección de datos personales.',
            'Auditores de Desarrollo Agil': 'Falso. Una consultora ágil cobra por sus servicios; si son privados y voluntarios, no calzan aquí.',
            'Usuarios Finales Avanzados': 'Falso. Ellos consumen el producto pero no tienen potestad legal para cerrar y auditar obligatoriamente a tu empresa.',
            'Consultores Externos de Software': 'Falso. Intervienen activamente en tu código, cobrando sueldos como externos comerciales temporales.'
        }
    },
    {
        'topic': 'BPMN (Clase 4)',
        'question': '[PPT CUARTA CLASE, Diapositiva 4] ¿Qué es BPMN?',
        'correct': 'Un lenguaje gráfico estandarizado para representar procesos de negocio en diagramas de flujo.',
        'options': {
            'Un protocolo de seguridad para resguardar la información en la nube.': 'Falso. No tiene ninguna relación con encriptación, protocolos IP o la nube informátia.',
            'Un lenguaje gráfico estandarizado para representar procesos de negocio en diagramas de flujo.': '¡CORRECTA! Business Process Model and Notation. Un diagrama de flujos puramente universal y normado globalmente.',
            'Una metodología de levantamiento de requerimientos basada en entrevistas ágiles.': 'Falso. Es estricto. BPMN no es una "metodología de entrevista", es el resultado *gráfico* final del proceso que ya conoces.',
            'Un estándar estricto para modelar datos en una base relacional SQL.': 'Falso. Modelar bases de datos recae sobre Diagramas Entidad-Relación o diagramas de UML enfocados en objetos.'
        }
    },
    {
        'topic': 'BPMN (Clase 4)',
        'question': '[PPT CUARTA CLASE, Diapositiva 6] En BPMN, ¿qué diagrama representa la interacción entre dos o más participantes (ej. empresa y cliente)?',
        'correct': 'Diagramas de colaboración',
        'options': {
            'Diagramas de coreografía': 'Falso. Coreografías apuntan a las redes abstractas y de intercambio genéricas, no es la definición convencional clásica.',
            'Diagramas de procesos privados': 'Falso. Privado significa 1 solo Pool (piscina) sin mostrar a factores externos ni interactuar hacia extraños.',
            'Diagramas de colaboración': '¡CORRECTA! [REGLA DE MEMORIA CLÁSICA]: Acuérdate de la palabra "Colaboración = Varios Pools (Piscinas) interactuando mediantes líneas punteadas". "Privado = 1 único Pool triste y solo".',
            'Diagramas de Casos de Uso': 'Falso. Estamos hablando de BPMN (cajitas y flechas). Caso de Uso ocupa Stickmans de palitos (UML).'
        }
    },
    {
        'topic': 'BPMN (Clase 4)',
        'question': '[PPT CUARTA CLASE, Diapositiva 10] En BPMN, el círculo verde con un borde fino tiene como función:',
        'correct': 'Marcar el comienzo (Evento de Inicio) del proceso.',
        'options': {
            'Aprobar una decisión para poder iterar una tarea repetitiva.': 'Falso. Las tareas repetitivas se manejan en las mismas cajas de tarea agregándoles una flechita de loop inferior.',
            'Marcar el comienzo (Evento de Inicio) del proceso.': '¡CORRECTA! Círculo de línea fina/delgada indica START. (Dato pro: Círculo de bordes gruesos y rojo designa "El FIN" absoluto).',
            'Representar un mensaje obligatorio de un participante externo.': 'Falso. Para eso el Círculo verde llevaría internamente el símbolo gráfico de un *Sobre/Carta de Papel*.',
            'Iniciar de inmediato la creación de una base de datos.': 'Falso. Eso lo representa el clásico rombo computacional o cilindro.'
        }
    },
    {
        'topic': 'BPMN (Clase 4)',
        'question': '[PPT CUARTA CLASE, Diapositiva 11] En BPMN, ¿qué símbolo controla el flujo del proceso según condiciones o decisiones lógicas?',
        'correct': 'Rombo (Compuerta / Gateway)',
        'options': {
            'Evento intermedio de temporizador': 'Falso. Simboliza una espera pasiva inevitable (ej: "Espera 24 horas" con el dibujo de relojito). Cero bifurcaciones de lógica.',
            'Actividad de subproceso': 'Falso. La cajita de tarea más un símbolo de [+] que agrupa etapas internas, pero no rompe flechas lógicas.',
            'Rombo (Compuerta / Gateway)': '¡CORRECTA! El símbolo más importante del mundo informático. Representa las temidas preguntas existenciales del diagrama (Si X, entonces A. Si NO X, entonces B).',
            'Flecha de mensaje': 'Falso. Solo traslada de un pool hacia el otro pool un aviso pasivo.'
        }
    },
    {
        'topic': 'BPMN (Clase 4)',
        'question': '[PPT CUARTA CLASE, Diapositiva 14] En BPMN, ¿qué función cumple el símbolo del "Cilindro"?',
        'correct': 'Almacenamiento persistente de información (Base de datos).',
        'options': {
            'Almacenamiento persistente de información (Base de datos).': '¡CORRECTA! Dato universal de la computación comercial: toda cosa graficable que parezca disco duro cilíndrico refiere a "Data Storage / Persistencia".',
            'Interacción manual obligatoria del usuario con el sistema.': 'Falso. Una tarea interactiva recae y lleva el sticker chiquito del actor vivo (un humano).',
            'Retraso o pausa temporal dictada por una compuerta.': 'Falso. No tiene correlación con temporizadores.',
            'Procesamiento de información en un servidor externo.': 'Falso. Sería Service Task con símbolo de rueda.'
        }
    },
    {
        'topic': 'BPMN (Clase 4)',
        'question': '[PPT CUARTA CLASE, Diapositiva 16] Una flecha punteada con un sobre (Flujo de Mensaje) representa típicamente:',
        'correct': 'Comunicación e intercambio de mensajes entre participantes distintos.',
        'options': {
            'Un flujo de secuencia especial con prioridad crítica.': 'Falso. Modificador que pertenece a metodologías sin estándar.',
            'Transferencia interna dentro del mismo pool o departamento.': 'Falso. ¡TRAMPA VITAL! Las flechas punteadas con sobre NO pueden nunca moverse bajo la misma piscina organizativa; comunican cosas ajenas (Ej: Tienda vs Banco).',
            'Una asociación hacia un sistema de almacenamiento de datos.': 'Falso. Para almacenamiento se usan líneas sólidas hacia el cilindro.',
            'Comunicación e intercambio de mensajes entre participantes distintos.': '¡CORRECTA! Siempre apuntan viajando desde el ecosistema tu empresa y saltan el muro para chocar con tus clientes u organizaciones terceras extrañas.'
        }
    },
    {
        'topic': 'Agile y KPIs (Clase 6)',
        'question': '[PPT SEXTA CLASE, Diapositiva 5] ¿Cuáles son las 4 etapas del Ciclo PDCA para la mejora continua?',
        'correct': 'Planificar → Ejecutar → Verificar → Actuar',
        'options': {
            'Planificar → Ejecutar → Verificar → Actuar': '¡CORRECTA! El Método Clásico de Deming. [TIPS DE MEMORIA]: P (Plan - Pensar), D (Do - Hacer el pan), C (Check - Revisar que el pan no quemó), A (Act - Modificar receta de mañana).',
            'Programar → Desarrollar → Comprobar → Aprobar': 'Falso. Engaño semántico. Es cíclico de mejora calidad, no ciclo de vida de desarrollo de software básico.',
            'Planificar → Diseñar → Construir → Ajustar': 'Falso. Mezcla con metodologías iterativas sin seguir el canon Deming del PDCA real.',
            'Priorizar → Desarrollar → Corregir → Avanzar': 'Falso. Trampa.'
        }
    },
    {
        'topic': 'Agile y KPIs (Clase 6)',
        'question': '[PPT SEXTA CLASE, Diapositiva 10] En la metodología XP (Extreme Programming), la práctica donde "el código se prueba y se integra varias veces al día" se denomina:',
        'correct': 'Integración continua (Continuous Integration)',
        'options': {
            'Programación en parejas (Pair Programming)': 'Falso. Es el acto de sentar a dos tipos en un teclado y mirarse a los ojos dictándose de forma obligatoria.',
            'Refactorización (Refactoring)': 'Falso. Modificar código subyacente para mejorarlo sin asestar daños visuales.',
            'Integración continua (Continuous Integration)': '¡CORRECTA! Filosofía pilar de DevOps. Enviar tu código 15 veces al día asegurando que pruebas atajen desastres si tumbas algo.',
            'Cliente In-Situ (On-site Customer)': 'Falso. El cliente es secuestrado dentro del laboratorio para dar Okays instantáneos presenciales.'
        }
    },
    {
        'topic': 'Agile y KPIs (Clase 6)',
        'question': '[PPT SEXTA CLASE, Diapositiva 13] Una de las características de un buen KPI es que sea "Medible", esto significa concretamente que:',
        'correct': 'Logra cuantificarse objetivamente en números, promedios o porcentajes.',
        'options': {
            'Se puede recolectar su dato en menos de una hora.': 'Falso. Algunos KPIs se miden mensualmente como la fuga de clientes general bancaria. Aún medible, aunque tome tiempo y espera inamovible.',
            'Evalúa el rendimiento de los empleados a final de año de manera cualitativa.': 'Falso. Un reporte tipo "es re buen tipo" apela a sentimientos subjetivos puros y cualitativos que evaden ser un KPI.',
            'Logra cuantificarse objetivamente en números, promedios o porcentajes.': '¡CORRECTA! Si no se puede meter puramente en una hoja de matemática financiera excel; entonces de plano ¡no sirve ni es confiable como KPI gerencial medible!',
            'Determina la duración exacta en la que un proyecto culminará.': 'Falso. Medir duración es el fin natural de cronogramas Gantt, el KPI aplica a retenciones, compras y desvíos.'
        }
    },
    {
        'topic': 'Agile y KPIs (Clase 6)',
        'question': '[PPT SEXTA CLASE, Diapositiva 16] Según se explica en las clases, ¿cuál es la diferencia clave entre una métrica y un KPI?',
        'correct': 'Toda métrica NO es estratégica; el KPI es un tipo de métrica CLAVE que sí mide el éxito del negocio.',
        'options': {
            'Las métricas solo aplican a infraestructura TI y los KPIs a las gerencias.': 'Falso. Tú como gerente podrías andar contando "cuántos lápices Bic existen" y sería una métrica inútil.',
            'Los KPIs evalúan aspectos abstractos cualitativos mientras las métricas evalúan bases de datos.': 'Falso. Ambos viven y mueren siendo elementos matemáticamente estadísticos duros (Base Cuantitativa).',
            'Toda métrica es estratégica en el negocio, independientemente del contexto.': 'Falso. Mentira radical corporativa. "Latidos por minuto del guardia de seguridad". Métrica brillante numéricamente, cero utilidad estratégica en software.',
            'Toda métrica NO es estratégica; el KPI es un tipo de métrica CLAVE que sí mide el éxito del negocio.': '¡CORRECTA! Las métricas te dicen si andas bien del corazón. Los KPIs te dicen si estás jugando bien los mundiales corporativos y generando millones de dólares de ganancia a tus superiores. Es el indicador final sagrado.'
        }
    },
    {
        'topic': 'Agile y KPIs (Clase 6)',
        'question': '[PPT SEXTA CLASE, Diapositiva 19] El margen de ganancia o el ROI (Retorno de Inversión) son perfectos ejemplos de KPIs de tipo:',
        'correct': 'Financieros',
        'options': {
            'Operativos': 'Falso. Operativo = Métrica productiva física, como autos construidos por mes o incidencias técnicas reparadas sin impacto.',
            'De gestión de clientes': 'Falso. Clientes = Referido por encuesta a tasas de satisfacción o quejas de la página online.',
            'Financieros': '¡CORRECTA! Flujo de capital puro. Si entra dinero y evalúas la relación dólar entrante vs inversión quemada inicial, es el terreno exclusivo puramente financiero matemático organizacional.',
            'De calidad del producto': 'Falso. Calidad evalúa pureza métrica de rechazo, tolerancias ISO aplicadas en bodega, o defectos pre-lanzamientos.'
        }
    },
    {
        'topic': 'Casos de Uso e Historias (Clase 7)',
        'question': '[PPT SEPTIMA CLASE, Diapositiva 4] Según la teoría, ¿qué es un Caso de Uso?',
        'correct': 'Una técnica de modelado que describe, paso a paso, cómo un usuario interactúa con un sistema para alcanzar un fin.',
        'options': {
            'Una representación visual del flujo de datos interno entre los servidores del sistema.': 'Falso. Sería diagramación pura nivel TI abstracto ajeno al ojo humano operario directo.',
            'Un registro minucioso de todas las clases y métodos utilizados en lenguaje Java.': 'Falso. Arquitectura y diagramación clásica formal de clases encapsuladas back-end ajenas totalmente.',
            'Una técnica de modelado que describe, paso a paso, cómo un usuario interactúa con un sistema para alcanzar un fin.': '¡CORRECTA! Actores, pasos de éxito lógico directo, escenarios amigables a la lectura administrativa humana con flujos lógicos palpables.',
            'Un documento legal de cumplimiento para ser presentado a reguladores externos.': 'Falso. Ni los jueces leen diagramas con "stickmans y circulitos" ovalados por un analista que detallan las pantallas.'
        }
    },
    {
        'topic': 'Casos de Uso e Historias (Clase 7)',
        'question': '[PPT SEPTIMA CLASE, Diapositiva 7] En diagrama UML, si un caso de uso se relaciona con otro mediante el estereotipo <<include>>, significa que:',
        'correct': 'Un caso de uso base siempre y de forma obligatoria transita/invoca a otro caso de uso.',
        'options': {
            'Un caso de uso es situacional y puede invocar a otro sólo si el usuario lo requiere.': 'Falso. Para eso recurriríamos al gran hermano <<extend>>, diseñado por la divina providencia de UML para casos raros u opcionales anexos exentos de obligatoriedad natural.',
            'El diagrama representa un caso de error donde el actor pierde su acceso.': 'Falso. Modelaciones de control exento fuera de flujos genéricos dependientes absolutos.',
            'Un caso de uso base siempre y de forma obligatoria transita/invoca a otro caso de uso.': '¡CORRECTA! [REGLA DE ORO UML]: "Include": dependencia vital que ineludiblemente jala la otra parte cada santa vez que lo uses (Ej: "Emitir compra" --> [include] --> "Rebajar stock y revisar tarjeta").',
            'El actor hereda temporalmente las restricciones y accesos de un administrador.': 'Falso. Intercalación y relaciones "generalizadas", donde un "Paciente VIP" hereda permisos "Paciente Base". Cero relación formal al include.'
        }
    },
    {
        'topic': 'Casos de Uso e Historias (Clase 7)',
        'question': '[PPT SEPTIMA CLASE, Diapositiva 10] Los Casos de Uso que detallan interacciones técnicas, pasos concretos y respuestas de interfaces con una parte específica del sistema, se denominan:',
        'correct': 'Casos de uso de sistema',
        'options': {
            'Casos de uso de negocio': 'Falso. Desvinculan explícitamente y globalizan el accionar prescindiendo absolutos sin alusión formal alguna a clics online y web interfaces.',
            'Casos de uso de sistema': '¡CORRECTA! El sistema web y los módulos específicos y directos dictan "Ingresa el Rut", "La intranet valida sus datos en 2 segundos".',
            'Casos de uso de validación analítica': 'Falso. Terminología y abstracciones ajenas formalmente dictaminadas por esta rama del aprendizaje de negocios puramente.',
            'Casos de uso relacionales UML': 'Falso. Combinación técnica extraña irreal cruzada entre bases datos.'
        }
    },
    {
        'topic': 'Casos de Uso e Historias (Clase 7)',
        'question': '[PPT SEPTIMA CLASE, Diapositiva 12] La estructura universal para redactar una Historia de Usuario dice: "Como [Rol], quiero [funcionalidad] para...". ¿Qué se estipula obligatoriamente en esa última sección [para...]? ',
        'correct': 'El beneficio, meta o valor organizacional que se busca obtener de dicha funcionalidad.',
        'options': {
            'La tecnología e infraestructura a usar en el desarrollo.': 'Falso. En marcos y dictámenes del Ágil puros se desaconseja letalmente dictarle tecnología a programadores, importa entregar el dolor general final o necesidad.',
            'El tiempo máximo estimado para terminar la programación ágil.': 'Falso. Esto entra y descansa sobre procesos estimatorios de cartas de póker donde cada persona asigna Story Points a votaciones plurales (Estimaciones).',
            'El criterio técnico de pruebas (QA) que los programadores verificarán.': 'Falso. Criterios (Given When Then) apoyan a los testers por fuera en el ticket, en una esquina libre; no caben nunca dentro del párrafo introductorio nominal de tres bloques principales exigidos.',
            'El beneficio, meta o valor organizacional que se busca obtener de dicha funcionalidad.': '¡CORRECTA! "... [para optimizar el 15% del tiempo procesal]". ¡Ahí está y radica verdaderamente el dolor capital! Todo sirve de valor base de validación y fin corporativo al usuario final natural.'
        }
    },
    {
        'topic': 'Casos de Uso e Historias (Clase 7)',
        'question': '[PPT SEPTIMA CLASE, Diapositiva 17] Para evitar crear malas historias de usuario, se utiliza el criterio de calidad INVEST. ¿Qué significa o qué evalúa la letra "E"?',
        'correct': 'Estimable (El equipo puede evaluar qué tiempo o esfuerzo tomará)',
        'options': {
            'Escrita (Written text)': 'Falso. Invocación de distractor clásico. Evidentes e inamovibles, van escritas.',
            'Escalable (Scalable)': 'Falso. Apunte conceptual meramente ingenieril de nube y servidores escalables al millar de demandas, pero la metodología INVEST exige en la historia de usuario otros focos de atención y valor inmediato real tangibles.',
            'Estimable (El equipo puede evaluar qué tiempo o esfuerzo tomará)': '¡CORRECTA! Todo el conjunto de programadores asume "Esto valdrá 2 horas, esto valdrá un mes de caos total, esto se puede picotear hoy". Estimación clara garantiza certeza e hitos de pago.',
            'Efectiva (Effective)': 'Falso. Típico engaño conceptual en test. INVEST las resume netamente en Independent, Negotiable, Valuable, Estimable, Small, Testable. Cero huecos de efectividad extra.'
        }
    },
    {
        'topic': 'Gestión y FODA (Clase 11)',
        'question': '[PPT CLASE 11, Diapositiva 4] Según las 5 Fases del Ciclo de Vida del Proyecto, ¿en cuál de ellas se aprueba justificadamente la idea y se redacta el "Acta de Constitución" (Charter)?',
        'correct': 'Inicio',
        'options': {
            'Planificación': 'Falso. Cuando pasas y logras el "Acta", entras de lleno legal y victorioso a esta etapa con tus directores con Gantt desglosados milimétricos en reuniones semanales densas formales.',
            'Inicio': '¡CORRECTA! Semilla original primogénita de los dueños, momento donde apruebas justificación capitalina. El "Inicio" engloba el acta oficial; sin ella y si saltas el paso formal la organización de tu proyecto será un rotundo desorden ilícito en gerencia corporativa de raíz.',
            'Ejecución': 'Falso. Significa programar concretando acciones con presupuestos consumiendo cajas y bolsillos operacionales. Es criminal y absurdo realizarla al primer respiro inicial puramente.',
            'Seguimiento y Control': 'Falso. Esto rige curvos visuales evaluados mes a mes, un auditoria sobre ruedas sobre un vehículo que al menos cuenta y ya transitó semanas de kilometraje reales de gestión.'
        }
    },
    {
        'topic': 'Gestión y FODA (Clase 11)',
        'question': '[PPT CLASE 11, Diapositiva 6] En la Gestión de Riesgos, cuando clasificas un problema anotándolo como riesgo de probabilidad "Alto", "Medio" o "Bajo", corresponde a la técnica de análisis:',
        'correct': 'Cualitativo',
        'options': {
            'Cuantitativo': 'Falso. Análisis que involucra dinero monetario financiero. Ej: [Si ocurre este incendio natural el hospital perderá 2,3 millones de euros anuales con seguridad del 40%].',
            'Predictivo Secuencial': 'Falso. Corresponde netamente al diseño integral y clásico del marco base Cascada del PMI/Gantt y un proceso de vida integral completo transaccional de obra, no a riesgos focalizados nominales in situ puntuales en una matriz temporal ligera.',
            'Cualitativo': '¡CORRECTA! Palabras base de lenguaje natural suave y de apreciación ("Grave", "Leve", "Muy alto", "Riesgoso emocional"). Es una evaluación intuitiva del "feeling" general base gerencial humana instintiva directa y eficiente en un minuto base.',
            'Histórico': 'Falso. Aunque analices caídas de meses anteriores del archivo duro (lo que es válido), la métrica nominal conceptual recae a otro departamento base estricto y analítico.'
        }
    },
    {
        'topic': 'Gestión y FODA (Clase 11)',
        'question': '[PPT CLASE 11, Diapositiva 8] Tras hacer tu análisis de cuadrantes FODA, diseñas una "Estrategia FA". Esto lógicamente significa:',
        'correct': 'Utilizar y enfocar tus Fortalezas internas para combatir o esquivar tus Amenazas externas.',
        'options': {
            'Fomentar Alianzas estratégicas con competidores locales.': 'Falso. Las uniones empresariales escapan diametralmente a acrónimos nominales clásicos "FODA", es un distractor netamente lexical semántico español de test universitario superficial.',
            'Usar Fortalezas internas para potenciar y aprovechar Oportunidades.': 'Falso. ¡CUIDADO! Cruzar internamente positivo (F) contra externo positivo (O) deviene dictaminantemente formal y lógica estricta a una Estrategia inamovible (FO), no (FA).',
            'Minimizar Debilidades internas y así evitar caer en Amenazas externas.': 'Falso. Aborda y defiende con escudos la parte interna peor capacitada organizativa en cara y al frente a crisis mundiales (Estrategia Defensiva natural pura extrema: DA).',
            'Utilizar y enfocar tus Fortalezas internas para combatir o esquivar tus Amenazas externas.': '¡CORRECTA! Agarras tus millones de tu excelente cultura laboral intachable de empleados de matriz base (Fortaleza), e inviertes esa muralla fortificada gruesa frente a la feroz inflación o a Apple intentando demolerte de mercado (Amenaza Exterior de Mercado Global inamovible).'
        }
    },
    {
        'topic': 'Gestión y FODA (Clase 11)',
        'question': '[PPT CLASE 11, Diapositiva 19] Una vez documentado el listado FODA, ¿qué técnica se recomienda usar como "paso siguiente" para aterrizarlos en acciones concretas y ejecutables?',
        'correct': 'Análisis CAME (Corregir, Afrontar, Mantener y Explotar).',
        'options': {
            'Documentar los requerimientos No Funcionales del proyecto.': 'Falso. Es totalmente micro y TI comparado a mandos analítico integrales gerenciales C-Levels.',
            'Diagramación general BPMN enfocada en Riesgos.': 'Falso. Te pondrás a realizar cuadritos procedimentales logísticos, perdiendo y desconociendo todo el nivel estratégico general superior.',
            'Análisis CAME (Corregir, Afrontar, Mantener y Explotar).': '¡CORRECTA! [REGLA ESTRATÉGICA]: El FODA se queda puramente en diagnosticar (pensar), pero CAME te exige actuar. Corregir (Debilidades), Afrontar (Amenazas), Mantener (Fortalezas) y Explotar (Oportunidades).',
            'Empleo de diagramas relacionales UML <<include>>': 'Falso. Es una locura y cruce académico espantoso ajeno al negocio llevar a Gerentes de Planificación Macroeconómica hacia análisis técnicos lógicos del backend transaccional de computación en diagramaciones de diseño relacional técnico de código.'
        }
    }
]

def format_mixed_question(q):
    """
    Toma la estructura de la prueba, desordena, saca ID transitoria efimera, 
    ajusta A B C D visual real time feedback
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
    print(f"\n{BOLD}{CYAN}" + "="*80)
    print(" 🎓 MEGA TEST DE ESTUDIO (MODO PROFESIONAL + EXPLICACIONES DETALLADAS) 🎓 ")
    print("="*80 + f"{RESET}\n")
    print("Las 30 preguntas iniciales aparecerán desordenadas. Además, en cada ejecución,")
    print("las alternativas cambiarán de posición. Luego de elegir tu opción, verás un desglose")
    print("EXHAUSTIVO línea por línea justificándote por qué cada alternativa era mala o buena.")
    print("\nEscribe 'Q' para salir en cualquier momento.\n")
    
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
        q_tag, solo_q = q['question'].split(']', 1)
        print(f"\n{BOLD}{YELLOW}{idx}. {q_tag}]{RESET} {solo_q.strip()}")
        
        for opt in q['display_options']:
            print(f"   {opt}")
        
        while True:
            ans = input(f"\n{BOLD}Tu respuesta (A,B,C,D o Q): {RESET}").strip().upper()
            if ans == 'Q':
                print(f"{CYAN}¡Saliendo! Terminaste con puntaje de {score}/{idx-1}{RESET}")
                sys.exit(0)
            if ans in ['A', 'B', 'C', 'D']:
                break
            print(f"{RED}Por favor, ingresa una letra válida.{RESET}")
            
        topic = q['topic']
        if ans == q['correct_letter']:
            print(f"{GREEN}{BOLD}✅ ¡CORRECTO!{RESET}")
            score += 1
            topics_tracking[topic]['correct'] += 1
        else:
            print(f"{RED}{BOLD}❌ INCORRECTO. La respuesta verdadera era la {q['correct_letter']}.{RESET}")
            
        print(f"\n{CYAN}>> Desglose de cada alternativa:{RESET}")
        for i, letra in enumerate(['A', 'B', 'C', 'D']):
             raw = q['shuffled_raw'][i]
             exp = q['options'][raw]
             if letra == ans:
                  # Se destaca con manito la letreó que eligió (sea correcta o equivocada)
                  print(f"   👉 {BOLD}{letra}){RESET} {exp}")
             else:
                  print(f"      {BOLD}{letra}){RESET} {exp}")
        
        input(f"\n{BOLD}[Presiona Enter para continuar...]{RESET}")

    # ===== FIN DE LAS 30 =====
    print(f"\n{BOLD}{CYAN}" + "="*80)
    print(f"🎉 TEST COMPLETADO 🎉")
    print(f"Tu puntaje final es: {score}/{len(questions)} ({(score/len(questions))*100:.1f}%)")
    
    print(f"\n{BOLD}📊 DIAGNÓSTICO FIN DE CURSO:{RESET}")
    weak_topics = []
    for topic, stats in topics_tracking.items():
         percentage = (stats['correct'] / stats['total']) * 100
         color_stat = GREEN if percentage >= 80 else YELLOW if percentage >= 50 else RED
         print(f" - {topic}: {color_stat}{stats['correct']}/{stats['total']} ({percentage:.0f}%){RESET}")
         if percentage < 80:
              weak_topics.append(topic)
              
    if weak_topics:
         print(f"\n{BOLD}👩‍🏫 Dificultad presente en: {RED}{', '.join(weak_topics)}{RESET}.")
         
    print(f"{BOLD}{CYAN}" + "="*80 + f"{RESET}\n")

    input(f"{BOLD}[Presiona Enter para revelar la Evaluación Final (Comodín + Desarrollo)...]{RESET}")

    # COMODÍN 31
    print(f"\n{BOLD}{YELLOW}" + "="*80)
    print(" 🌟 PREGUNTA 31: COMODÍN AVANZADO (NO RESTA PUNTOS) 🌟")
    print("="*80 + f"{RESET}\n")
    print(f"{BOLD}{YELLOW}31. En Scrum (Ágil), ¿cómo se denomina la breve ceremonia diaria, típicamente de no más de 15 minutos, donde el equipo sincroniza y menciona sus bloqueos?{RESET}")
    print("   A) Sprint Retrospective")
    print("   B) Daily Stand-up")
    print("   C) Backlog Refinement")
    print("   D) Sprint Planning")

    while True:
        ans31 = input(f"\n{BOLD}Tu respuesta (A, B, C o D): {RESET}").strip().upper()
        if ans31 in ['A', 'B', 'C', 'D']:
            break

    if ans31 == 'B':
        print(f"{GREEN}{BOLD}✅ ¡CORRECTO!{RESET}")
        print(f"{CYAN}>> Justificación: {RESET}La Daily Stand-up es para comunicar bloqueos y dura un máximo rígido de 15 min diarios.")
        score += 1
        print(f"\n{BOLD}{GREEN}⭐ NUEVO PUNTAJE: {score}/30! ⭐{RESET}")
    else:
         print(f"{YELLOW}{BOLD}❌ INCORRECTO. Era la B.{RESET}")
         print(f"{CYAN}>> Justificación: {RESET}A y D son antes/después del Sprint. B es diaria de 15 min. ¡Se mantiene tu nota original!")

    input(f"\n{BOLD}[Presiona Enter para cerrar el test de hoy...]{RESET}")
    
    print(f"\n{BOLD}{CYAN}" + "="*80)
    print(" 📝 PREGUNTA 32: DESARROLLO VERBAL (EVALUADA VÍA CHAT) 📝")
    print("="*80 + f"{RESET}\n")
    print("Copia la pregunta y sal a respondérmela personalmente en nuestro chat actual.\n")
    print(f"{BOLD}{YELLOW}PREGUNTA 32:{RESET}")
    print(f"Imagínate que te contrato como {BOLD}Product Owner{RESET} para fundar una App tipo Uber exclusiva para ambulancias de rescate. Basándote en lo aprendido de Requerimientos, Stakeholders y Análisis de Riesgos... ¿Cuáles serían exactamente tus {BOLD}primeros 3 pasos fundamentales{RESET} en tu primera semana de trabajo? ¡Redáctamelo explicativamente!")

if __name__ == '__main__':
    try:
        run_quiz()
    except KeyboardInterrupt:
         pass
