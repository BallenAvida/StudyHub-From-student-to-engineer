const STUDY_DATA = {
  "tests": {
    "test1": {
      "title": "Test 1: Conceptos Generales",
      "questions": [
        {
          "topic": "Requerimientos (Clase 2)",
          "question": "[PPT SEGUNDA CLASE, Diapositiva 3] ¿Cuál es el propósito principal de los requerimientos de software?",
          "options": [
            {
              "text": "Definir la arquitectura técnica interna del sistema computacional.",
              "explanation": "Falso. Entrar al diseño de la arquitectura y la ingeniería técnica ocurre mucho después, no en la fase inicial de requisitos.",
              "isCorrect": false
            },
            {
              "text": "Comunicar de manera precisa qué se espera del sistema entre cliente, usuarios y desarrolladores.",
              "explanation": "¡CORRECTA! El objetivo fundacional es lograr un contrato y entendimiento claro de QUÉ debe hacerse antes de tirar código. [DATO CLAVE]: Imagina los requerimientos como el puente de traducción entre el mundo corporativo y el mundo de TI.",
              "isCorrect": true
            },
            {
              "text": "Especificar exclusivamente el lenguaje de programación y la base de datos a utilizar.",
              "explanation": "Falso. Definir Python o SQL es trabajo de implementación/desarrollo, lo cual está vetado en la redacción de requerimientos puros funcionales.",
              "isCorrect": false
            },
            {
              "text": "Establecer el diseño gráfico, los colores y la navegabilidad de la interfaz.",
              "explanation": "Falso. Aunque una UI puede derivar en requerimientos, \"colores y diseño gráfico\" es un objetivo netamente de diseño visual, no el propósito principal del negocio.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Requerimientos (Clase 2)",
          "question": "[PPT SEGUNDA CLASE, Diapositiva 7] \"El sistema debe responder en menos de 2 segundos\" es un ejemplo de:",
          "options": [
            {
              "text": "Requerimiento Funcional",
              "explanation": "Falso. Los funcionales determinan QUÉ hace el sistema (ej: \"Mandar email\", \"Cobrar tarjeta\"), no CÓMO lo hace.",
              "isCorrect": false
            },
            {
              "text": "Requerimiento de Arquitectura",
              "explanation": "Falso. No existe oficialmente en nuestra materia bajo ese título. Podría ser una decisión de arquitectura, pero el término real del levantamiento es No Funcional.",
              "isCorrect": false
            },
            {
              "text": "Requerimiento No Funcional",
              "explanation": "¡CORRECTA! Porque restringe CÓMO debe operar o la CALIDAD bajo la cual opera. [TRAMPA CLÁSICA DE EXAMEN]: Siempre que veas una métrica referida a rendimiento (tiempo, segundos), seguridad o disponibilidad, márcala inmediatamente como No Funcional. Son las restricciones del sistema.",
              "isCorrect": true
            },
            {
              "text": "Requerimiento de Hardware",
              "explanation": "Falso. Si te dijeran \"Debe usar un servidor AWS\" sí, pero solo limitar \"tiempo\" no asume específicamente la compra de un hardware físico.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Requerimientos (Clase 2)",
          "question": "[PPT SEGUNDA CLASE, Diapositiva 7] ¿Cuál de las siguientes fases NO pertenece al proceso formal de requerimientos?",
          "options": [
            {
              "text": "Programación / Implementación",
              "explanation": "¡CORRECTA! La escritura de código jamás ocurre durante el ciclo de requerimientos. [OJO]: Muchos profesores ponían esta alternativa para cazar giles. Echar código es de la fase de Desarrollo.",
              "isCorrect": true
            },
            {
              "text": "Análisis",
              "explanation": "Falso. El Análisis SÍ es una fase indispensable donde desmenuzas e interpretas lo que quiere el cliente.",
              "isCorrect": false
            },
            {
              "text": "Obtención (Elicitación)",
              "explanation": "Falso. La elicitación (levantamiento mediante entrevistas) SÍ es la fase vital número uno para obtener la información.",
              "isCorrect": false
            },
            {
              "text": "Validación",
              "explanation": "Falso. La Validación SÍ es la última fase de los requerimientos, donde logras que el cliente apruebe y firme.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Requerimientos (Clase 2)",
          "question": "[PPT SEGUNDA CLASE, Diapositiva 8] Según los riesgos expuestos de no definir bien los requerimientos, ¿qué sucede en etapas avanzadas?",
          "options": [
            {
              "text": "El proyecto debe obligatoriamente cambiar su tecnología base.",
              "explanation": "Falso. Te puedes haber equivocado en un formulario y no por eso vas a cambiar The Python a Java entero.",
              "isCorrect": false
            },
            {
              "text": "Se elimina la necesidad de realizar pruebas de calidad de software.",
              "explanation": "Falso. Al contrario, un pésimo requerimiento vuelve locos a los QA porque no saben qué parámetros probar.",
              "isCorrect": false
            },
            {
              "text": "El equipo técnico debe asumir el rol del Product Owner.",
              "explanation": "Falso. Un programador jamás asumirá formal y éticamente el peso del Product Owner (Cliente).",
              "isCorrect": false
            },
            {
              "text": "Se generan altos costos adicionales por cambios tardíos en la programación.",
              "explanation": "¡CORRECTA! [DATO CLAVE]: La curva de Boehm dice \"Un bug arreglado en etapa de requerimientos cuesta $1 USD, pero si lo arreglas cuando el software ya está en producción cuesta $10.000 USD\".",
              "isCorrect": true
            }
          ]
        },
        {
          "topic": "Requerimientos (Clase 2)",
          "question": "[PPT SEGUNDA CLASE, Diapositiva 4] Según la clase, ¿cómo se define un \"Sistema\"?",
          "options": [
            {
              "text": "Un software operativo diseñado exclusivamente para la gestión en la nube.",
              "explanation": "Falso. ¿Y si es un sistema gigantesco sin conexión a internet naval? La \"nube\" no es requisito de un sistema natural.",
              "isCorrect": false
            },
            {
              "text": "Conjunto de hardware, software, personas, procedimientos y datos.",
              "explanation": "¡CORRECTA! Es un conglomerado integral. [TIP]: ¡Jamás te olvides de la palabra PERSONAS y PROCEDIMIENTOS! Un computador muy caro es basura si no tiene una persona que lo sepa usar usando normas.",
              "isCorrect": true
            },
            {
              "text": "La combinación de servidores físicos y el código backend automatizado.",
              "explanation": "Falso. Faltan las Personas y los Procesos. Esa es una visión netamente ingenieril solitaria.",
              "isCorrect": false
            },
            {
              "text": "Un modelo de arquitectura de software para acelerar bases de datos.",
              "explanation": "Falso. Eso es simplemente ingeniería técnica de rendimiento, no la definición conceptual de Sistema Organizacional.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Stakeholders (Clase 3)",
          "question": "[PPT TERCERA CLASE, Diapositiva 4] Los requerimientos que describen qué hace el sistema (acciones, servicios, funciones visibles) se denominan:",
          "options": [
            {
              "text": "Requerimientos de Calidad",
              "explanation": "Falso. La calidad de uso alude a normas y métricas (No Funcional).",
              "isCorrect": false
            },
            {
              "text": "Requerimientos de Dominio",
              "explanation": "Falso. Los de dominio refieren a reglas jurídicas u operativas de un nicho específico (ej. \"Toda receta debe llevar firma médica\").",
              "isCorrect": false
            },
            {
              "text": "Requerimientos Funcionales",
              "explanation": "¡CORRECTA! [MEMORIZA]: \"Todo lo que el sistema HACE proactivamente o procesa operativamente\". Si puedes dibujarlo en un botón (\"Registrar\", \"Calcular\", \"Aprobar\"), es Funcional.",
              "isCorrect": true
            },
            {
              "text": "Requerimientos No Funcionales",
              "explanation": "Falso. Si habla de funciones operativas directas, no es restrictivo.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Stakeholders (Clase 3)",
          "question": "[PPT TERCERA CLASE, Diapositiva 7] Según las problemáticas organizacionales, un sistema de salud o educación inclusiva corresponde a una problemática de tipo:",
          "options": [
            {
              "text": "Gubernamental",
              "explanation": "Falso. Aunque sea ejecutado por el Estado, el *foco de impacto* principal es en la gente.",
              "isCorrect": false
            },
            {
              "text": "Tecnológica",
              "explanation": "Falso. Problemática tecnológica sería \"los servidores del hospital se caen a mediodía\".",
              "isCorrect": false
            },
            {
              "text": "Social",
              "explanation": "¡CORRECTA! La inclusión, equidad, educación pública atacan de lleno una carencia *Social* en las comunidades.",
              "isCorrect": true
            },
            {
              "text": "Operativa",
              "explanation": "Falso. Una problemática operativa referiría a \"El médico se demora 15 minutos solo en llenar el formulario\".",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Stakeholders (Clase 3)",
          "question": "[PPT TERCERA CLASE, Diapositiva 8] En un proyecto, ¿qué rol \"define las funcionalidades del software, prioriza el backlog y actúa como enlace principal\"?",
          "options": [
            {
              "text": "Patrocinador del Proyecto (Sponsor)",
              "explanation": "Falso. El Patrocinador da la plata, él no define la lista de requerimientos técnicos microscópicos.",
              "isCorrect": false
            },
            {
              "text": "Gerente de Proyecto (Project Manager)",
              "explanation": "Falso. El Gerente maneja presupuesto, tiempos y riesgos. Él controla CÓMO vamos, pero no prioriza QUÉ vamos a construir y qué botón importa más.",
              "isCorrect": false
            },
            {
              "text": "Dueño del Producto (Product Owner)",
              "explanation": "¡CORRECTA! Él es la Mente Maestra Central (Representante exclusivo del negocio) que dicta prioridades.",
              "isCorrect": true
            },
            {
              "text": "Analista de Sistemas",
              "explanation": "Falso. El Analista disecciona en requisitos técnicos, apoya la labor, pero no aprueba prioridades de negocio ni decide por sí solo qué va primero.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Stakeholders (Clase 3)",
          "question": "[PPT TERCERA CLASE, Diapositiva 8] ¿Qué stakeholder proporciona financiación, recursos y dirección estratégica?",
          "options": [
            {
              "text": "Scrum Master",
              "explanation": "Falso. El Scrum Master remueve impedimentos organizacionales. No tiene la chequera mágica.",
              "isCorrect": false
            },
            {
              "text": "Gerente de TI (IT Manager)",
              "explanation": "Falso. Dirige la infraestructura de servidores de la compañía (depende del dinero gerencial).",
              "isCorrect": false
            },
            {
              "text": "Entidad Regulatoria",
              "explanation": "Falso. Los reguladores dictan la ley (Ministerios, Senadores, Auditoras), jamás financian sistemas privados.",
              "isCorrect": false
            },
            {
              "text": "Patrocinador del Proyecto (Sponsor)",
              "explanation": "¡CORRECTA! Director, Alta Gerencia o Inversionista de la película. [TIP]: En la matriz de Impacto vs Interés, este es el tipo al que TIENES QUE TENER CONTENTO todo el día porque apaga el sistema de 1 click.",
              "isCorrect": true
            }
          ]
        },
        {
          "topic": "Stakeholders (Clase 3)",
          "question": "[PPT TERCERA CLASE, Diapositiva 9] Son entidades externas que NO desarrollan el software ni proveen fondos, pero dictan estándares legales o éticos obligatorios:",
          "options": [
            {
              "text": "Entidades Regulatorias",
              "explanation": "¡CORRECTA! [DATO CLAVE]: ¡Nunca los subestimes! Las entidades regulatorias no ponen plata, pero tienen el \"Súper Poder\" jurídico de cancelar y multar todo tu proyecto si vulneras una sola norma sobre protección de datos personales.",
              "isCorrect": true
            },
            {
              "text": "Auditores de Desarrollo Agil",
              "explanation": "Falso. Una consultora ágil cobra por sus servicios; si son privados y voluntarios, no calzan aquí.",
              "isCorrect": false
            },
            {
              "text": "Usuarios Finales Avanzados",
              "explanation": "Falso. Ellos consumen el producto pero no tienen potestad legal para cerrar y auditar obligatoriamente a tu empresa.",
              "isCorrect": false
            },
            {
              "text": "Consultores Externos de Software",
              "explanation": "Falso. Intervienen activamente en tu código, cobrando sueldos como externos comerciales temporales.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN (Clase 4)",
          "question": "[PPT CUARTA CLASE, Diapositiva 4] ¿Qué es BPMN?",
          "options": [
            {
              "text": "Un protocolo de seguridad para resguardar la información en la nube.",
              "explanation": "Falso. No tiene ninguna relación con encriptación, protocolos IP o la nube informátia.",
              "isCorrect": false
            },
            {
              "text": "Un lenguaje gráfico estandarizado para representar procesos de negocio en diagramas de flujo.",
              "explanation": "¡CORRECTA! Business Process Model and Notation. Un diagrama de flujos puramente universal y normado globalmente.",
              "isCorrect": true
            },
            {
              "text": "Una metodología de levantamiento de requerimientos basada en entrevistas ágiles.",
              "explanation": "Falso. Es estricto. BPMN no es una \"metodología de entrevista\", es el resultado *gráfico* final del proceso que ya conoces.",
              "isCorrect": false
            },
            {
              "text": "Un estándar estricto para modelar datos en una base relacional SQL.",
              "explanation": "Falso. Modelar bases de datos recae sobre Diagramas Entidad-Relación o diagramas de UML enfocados en objetos.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN (Clase 4)",
          "question": "[PPT CUARTA CLASE, Diapositiva 6] En BPMN, ¿qué diagrama representa la interacción entre dos o más participantes (ej. empresa y cliente)?",
          "options": [
            {
              "text": "Diagramas de coreografía",
              "explanation": "Falso. Coreografías apuntan a las redes abstractas y de intercambio genéricas, no es la definición convencional clásica.",
              "isCorrect": false
            },
            {
              "text": "Diagramas de procesos privados",
              "explanation": "Falso. Privado significa 1 solo Pool (piscina) sin mostrar a factores externos ni interactuar hacia extraños.",
              "isCorrect": false
            },
            {
              "text": "Diagramas de colaboración",
              "explanation": "¡CORRECTA! [REGLA DE MEMORIA CLÁSICA]: Acuérdate de la palabra \"Colaboración = Varios Pools (Piscinas) interactuando mediantes líneas punteadas\". \"Privado = 1 único Pool triste y solo\".",
              "isCorrect": true
            },
            {
              "text": "Diagramas de Casos de Uso",
              "explanation": "Falso. Estamos hablando de BPMN (cajitas y flechas). Caso de Uso ocupa Stickmans de palitos (UML).",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN (Clase 4)",
          "question": "[PPT CUARTA CLASE, Diapositiva 10] En BPMN, el círculo verde con un borde fino tiene como función:",
          "options": [
            {
              "text": "Aprobar una decisión para poder iterar una tarea repetitiva.",
              "explanation": "Falso. Las tareas repetitivas se manejan en las mismas cajas de tarea agregándoles una flechita de loop inferior.",
              "isCorrect": false
            },
            {
              "text": "Marcar el comienzo (Evento de Inicio) del proceso.",
              "explanation": "¡CORRECTA! Círculo de línea fina/delgada indica START. (Dato pro: Círculo de bordes gruesos y rojo designa \"El FIN\" absoluto).",
              "isCorrect": true
            },
            {
              "text": "Representar un mensaje obligatorio de un participante externo.",
              "explanation": "Falso. Para eso el Círculo verde llevaría internamente el símbolo gráfico de un *Sobre/Carta de Papel*.",
              "isCorrect": false
            },
            {
              "text": "Iniciar de inmediato la creación de una base de datos.",
              "explanation": "Falso. Eso lo representa el clásico rombo computacional o cilindro.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN (Clase 4)",
          "question": "[PPT CUARTA CLASE, Diapositiva 11] En BPMN, ¿qué símbolo controla el flujo del proceso según condiciones o decisiones lógicas?",
          "options": [
            {
              "text": "Evento intermedio de temporizador",
              "explanation": "Falso. Simboliza una espera pasiva inevitable (ej: \"Espera 24 horas\" con el dibujo de relojito). Cero bifurcaciones de lógica.",
              "isCorrect": false
            },
            {
              "text": "Actividad de subproceso",
              "explanation": "Falso. La cajita de tarea más un símbolo de [+] que agrupa etapas internas, pero no rompe flechas lógicas.",
              "isCorrect": false
            },
            {
              "text": "Rombo (Compuerta / Gateway)",
              "explanation": "¡CORRECTA! El símbolo más importante del mundo informático. Representa las temidas preguntas existenciales del diagrama (Si X, entonces A. Si NO X, entonces B).",
              "isCorrect": true
            },
            {
              "text": "Flecha de mensaje",
              "explanation": "Falso. Solo traslada de un pool hacia el otro pool un aviso pasivo.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN (Clase 4)",
          "question": "[PPT CUARTA CLASE, Diapositiva 14] En BPMN, ¿qué función cumple el símbolo del \"Cilindro\"?",
          "options": [
            {
              "text": "Almacenamiento persistente de información (Base de datos).",
              "explanation": "¡CORRECTA! Dato universal de la computación comercial: toda cosa graficable que parezca disco duro cilíndrico refiere a \"Data Storage / Persistencia\".",
              "isCorrect": true
            },
            {
              "text": "Interacción manual obligatoria del usuario con el sistema.",
              "explanation": "Falso. Una tarea interactiva recae y lleva el sticker chiquito del actor vivo (un humano).",
              "isCorrect": false
            },
            {
              "text": "Retraso o pausa temporal dictada por una compuerta.",
              "explanation": "Falso. No tiene correlación con temporizadores.",
              "isCorrect": false
            },
            {
              "text": "Procesamiento de información en un servidor externo.",
              "explanation": "Falso. Sería Service Task con símbolo de rueda.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN (Clase 4)",
          "question": "[PPT CUARTA CLASE, Diapositiva 16] Una flecha punteada con un sobre (Flujo de Mensaje) representa típicamente:",
          "options": [
            {
              "text": "Un flujo de secuencia especial con prioridad crítica.",
              "explanation": "Falso. Modificador que pertenece a metodologías sin estándar.",
              "isCorrect": false
            },
            {
              "text": "Transferencia interna dentro del mismo pool o departamento.",
              "explanation": "Falso. ¡TRAMPA VITAL! Las flechas punteadas con sobre NO pueden nunca moverse bajo la misma piscina organizativa; comunican cosas ajenas (Ej: Tienda vs Banco).",
              "isCorrect": false
            },
            {
              "text": "Una asociación hacia un sistema de almacenamiento de datos.",
              "explanation": "Falso. Para almacenamiento se usan líneas sólidas hacia el cilindro.",
              "isCorrect": false
            },
            {
              "text": "Comunicación e intercambio de mensajes entre participantes distintos.",
              "explanation": "¡CORRECTA! Siempre apuntan viajando desde el ecosistema tu empresa y saltan el muro para chocar con tus clientes u organizaciones terceras extrañas.",
              "isCorrect": true
            }
          ]
        },
        {
          "topic": "Agile y KPIs (Clase 6)",
          "question": "[PPT SEXTA CLASE, Diapositiva 5] ¿Cuáles son las 4 etapas del Ciclo PDCA para la mejora continua?",
          "options": [
            {
              "text": "Planificar → Ejecutar → Verificar → Actuar",
              "explanation": "¡CORRECTA! El Método Clásico de Deming. [TIPS DE MEMORIA]: P (Plan - Pensar), D (Do - Hacer el pan), C (Check - Revisar que el pan no quemó), A (Act - Modificar receta de mañana).",
              "isCorrect": true
            },
            {
              "text": "Programar → Desarrollar → Comprobar → Aprobar",
              "explanation": "Falso. Engaño semántico. Es cíclico de mejora calidad, no ciclo de vida de desarrollo de software básico.",
              "isCorrect": false
            },
            {
              "text": "Planificar → Diseñar → Construir → Ajustar",
              "explanation": "Falso. Mezcla con metodologías iterativas sin seguir el canon Deming del PDCA real.",
              "isCorrect": false
            },
            {
              "text": "Priorizar → Desarrollar → Corregir → Avanzar",
              "explanation": "Falso. Trampa.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Agile y KPIs (Clase 6)",
          "question": "[PPT SEXTA CLASE, Diapositiva 10] En la metodología XP (Extreme Programming), la práctica donde \"el código se prueba y se integra varias veces al día\" se denomina:",
          "options": [
            {
              "text": "Programación en parejas (Pair Programming)",
              "explanation": "Falso. Es el acto de sentar a dos tipos en un teclado y mirarse a los ojos dictándose de forma obligatoria.",
              "isCorrect": false
            },
            {
              "text": "Refactorización (Refactoring)",
              "explanation": "Falso. Modificar código subyacente para mejorarlo sin asestar daños visuales.",
              "isCorrect": false
            },
            {
              "text": "Integración continua (Continuous Integration)",
              "explanation": "¡CORRECTA! Filosofía pilar de DevOps. Enviar tu código 15 veces al día asegurando que pruebas atajen desastres si tumbas algo.",
              "isCorrect": true
            },
            {
              "text": "Cliente In-Situ (On-site Customer)",
              "explanation": "Falso. El cliente es secuestrado dentro del laboratorio para dar Okays instantáneos presenciales.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Agile y KPIs (Clase 6)",
          "question": "[PPT SEXTA CLASE, Diapositiva 13] Una de las características de un buen KPI es que sea \"Medible\", esto significa concretamente que:",
          "options": [
            {
              "text": "Se puede recolectar su dato en menos de una hora.",
              "explanation": "Falso. Algunos KPIs se miden mensualmente como la fuga de clientes general bancaria. Aún medible, aunque tome tiempo y espera inamovible.",
              "isCorrect": false
            },
            {
              "text": "Evalúa el rendimiento de los empleados a final de año de manera cualitativa.",
              "explanation": "Falso. Un reporte tipo \"es re buen tipo\" apela a sentimientos subjetivos puros y cualitativos que evaden ser un KPI.",
              "isCorrect": false
            },
            {
              "text": "Logra cuantificarse objetivamente en números, promedios o porcentajes.",
              "explanation": "¡CORRECTA! Si no se puede meter puramente en una hoja de matemática financiera excel; entonces de plano ¡no sirve ni es confiable como KPI gerencial medible!",
              "isCorrect": true
            },
            {
              "text": "Determina la duración exacta en la que un proyecto culminará.",
              "explanation": "Falso. Medir duración es el fin natural de cronogramas Gantt, el KPI aplica a retenciones, compras y desvíos.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Agile y KPIs (Clase 6)",
          "question": "[PPT SEXTA CLASE, Diapositiva 16] Según se explica en las clases, ¿cuál es la diferencia clave entre una métrica y un KPI?",
          "options": [
            {
              "text": "Las métricas solo aplican a infraestructura TI y los KPIs a las gerencias.",
              "explanation": "Falso. Tú como gerente podrías andar contando \"cuántos lápices Bic existen\" y sería una métrica inútil.",
              "isCorrect": false
            },
            {
              "text": "Los KPIs evalúan aspectos abstractos cualitativos mientras las métricas evalúan bases de datos.",
              "explanation": "Falso. Ambos viven y mueren siendo elementos matemáticamente estadísticos duros (Base Cuantitativa).",
              "isCorrect": false
            },
            {
              "text": "Toda métrica es estratégica en el negocio, independientemente del contexto.",
              "explanation": "Falso. Mentira radical corporativa. \"Latidos por minuto del guardia de seguridad\". Métrica brillante numéricamente, cero utilidad estratégica en software.",
              "isCorrect": false
            },
            {
              "text": "Toda métrica NO es estratégica; el KPI es un tipo de métrica CLAVE que sí mide el éxito del negocio.",
              "explanation": "¡CORRECTA! Las métricas te dicen si andas bien del corazón. Los KPIs te dicen si estás jugando bien los mundiales corporativos y generando millones de dólares de ganancia a tus superiores. Es el indicador final sagrado.",
              "isCorrect": true
            }
          ]
        },
        {
          "topic": "Agile y KPIs (Clase 6)",
          "question": "[PPT SEXTA CLASE, Diapositiva 19] El margen de ganancia o el ROI (Retorno de Inversión) son perfectos ejemplos de KPIs de tipo:",
          "options": [
            {
              "text": "Operativos",
              "explanation": "Falso. Operativo = Métrica productiva física, como autos construidos por mes o incidencias técnicas reparadas sin impacto.",
              "isCorrect": false
            },
            {
              "text": "De gestión de clientes",
              "explanation": "Falso. Clientes = Referido por encuesta a tasas de satisfacción o quejas de la página online.",
              "isCorrect": false
            },
            {
              "text": "Financieros",
              "explanation": "¡CORRECTA! Flujo de capital puro. Si entra dinero y evalúas la relación dólar entrante vs inversión quemada inicial, es el terreno exclusivo puramente financiero matemático organizacional.",
              "isCorrect": true
            },
            {
              "text": "De calidad del producto",
              "explanation": "Falso. Calidad evalúa pureza métrica de rechazo, tolerancias ISO aplicadas en bodega, o defectos pre-lanzamientos.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Casos de Uso e Historias (Clase 7)",
          "question": "[PPT SEPTIMA CLASE, Diapositiva 4] Según la teoría, ¿qué es un Caso de Uso?",
          "options": [
            {
              "text": "Una representación visual del flujo de datos interno entre los servidores del sistema.",
              "explanation": "Falso. Sería diagramación pura nivel TI abstracto ajeno al ojo humano operario directo.",
              "isCorrect": false
            },
            {
              "text": "Un registro minucioso de todas las clases y métodos utilizados en lenguaje Java.",
              "explanation": "Falso. Arquitectura y diagramación clásica formal de clases encapsuladas back-end ajenas totalmente.",
              "isCorrect": false
            },
            {
              "text": "Una técnica de modelado que describe, paso a paso, cómo un usuario interactúa con un sistema para alcanzar un fin.",
              "explanation": "¡CORRECTA! Actores, pasos de éxito lógico directo, escenarios amigables a la lectura administrativa humana con flujos lógicos palpables.",
              "isCorrect": true
            },
            {
              "text": "Un documento legal de cumplimiento para ser presentado a reguladores externos.",
              "explanation": "Falso. Ni los jueces leen diagramas con \"stickmans y circulitos\" ovalados por un analista que detallan las pantallas.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Casos de Uso e Historias (Clase 7)",
          "question": "[PPT SEPTIMA CLASE, Diapositiva 7] En diagrama UML, si un caso de uso se relaciona con otro mediante el estereotipo <<include>>, significa que:",
          "options": [
            {
              "text": "Un caso de uso es situacional y puede invocar a otro sólo si el usuario lo requiere.",
              "explanation": "Falso. Para eso recurriríamos al gran hermano <<extend>>, diseñado por la divina providencia de UML para casos raros u opcionales anexos exentos de obligatoriedad natural.",
              "isCorrect": false
            },
            {
              "text": "El diagrama representa un caso de error donde el actor pierde su acceso.",
              "explanation": "Falso. Modelaciones de control exento fuera de flujos genéricos dependientes absolutos.",
              "isCorrect": false
            },
            {
              "text": "Un caso de uso base siempre y de forma obligatoria transita/invoca a otro caso de uso.",
              "explanation": "¡CORRECTA! [REGLA DE ORO UML]: \"Include\": dependencia vital que ineludiblemente jala la otra parte cada santa vez que lo uses (Ej: \"Emitir compra\" --> [include] --> \"Rebajar stock y revisar tarjeta\").",
              "isCorrect": true
            },
            {
              "text": "El actor hereda temporalmente las restricciones y accesos de un administrador.",
              "explanation": "Falso. Intercalación y relaciones \"generalizadas\", donde un \"Paciente VIP\" hereda permisos \"Paciente Base\". Cero relación formal al include.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Casos de Uso e Historias (Clase 7)",
          "question": "[PPT SEPTIMA CLASE, Diapositiva 10] Los Casos de Uso que detallan interacciones técnicas, pasos concretos y respuestas de interfaces con una parte específica del sistema, se denominan:",
          "options": [
            {
              "text": "Casos de uso de negocio",
              "explanation": "Falso. Desvinculan explícitamente y globalizan el accionar prescindiendo absolutos sin alusión formal alguna a clics online y web interfaces.",
              "isCorrect": false
            },
            {
              "text": "Casos de uso de sistema",
              "explanation": "¡CORRECTA! El sistema web y los módulos específicos y directos dictan \"Ingresa el Rut\", \"La intranet valida sus datos en 2 segundos\".",
              "isCorrect": true
            },
            {
              "text": "Casos de uso de validación analítica",
              "explanation": "Falso. Terminología y abstracciones ajenas formalmente dictaminadas por esta rama del aprendizaje de negocios puramente.",
              "isCorrect": false
            },
            {
              "text": "Casos de uso relacionales UML",
              "explanation": "Falso. Combinación técnica extraña irreal cruzada entre bases datos.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Casos de Uso e Historias (Clase 7)",
          "question": "[PPT SEPTIMA CLASE, Diapositiva 12] La estructura universal para redactar una Historia de Usuario dice: \"Como [Rol], quiero [funcionalidad] para...\". ¿Qué se estipula obligatoriamente en esa última sección [para...]? ",
          "options": [
            {
              "text": "La tecnología e infraestructura a usar en el desarrollo.",
              "explanation": "Falso. En marcos y dictámenes del Ágil puros se desaconseja letalmente dictarle tecnología a programadores, importa entregar el dolor general final o necesidad.",
              "isCorrect": false
            },
            {
              "text": "El tiempo máximo estimado para terminar la programación ágil.",
              "explanation": "Falso. Esto entra y descansa sobre procesos estimatorios de cartas de póker donde cada persona asigna Story Points a votaciones plurales (Estimaciones).",
              "isCorrect": false
            },
            {
              "text": "El criterio técnico de pruebas (QA) que los programadores verificarán.",
              "explanation": "Falso. Criterios (Given When Then) apoyan a los testers por fuera en el ticket, en una esquina libre; no caben nunca dentro del párrafo introductorio nominal de tres bloques principales exigidos.",
              "isCorrect": false
            },
            {
              "text": "El beneficio, meta o valor organizacional que se busca obtener de dicha funcionalidad.",
              "explanation": "¡CORRECTA! \"... [para optimizar el 15% del tiempo procesal]\". ¡Ahí está y radica verdaderamente el dolor capital! Todo sirve de valor base de validación y fin corporativo al usuario final natural.",
              "isCorrect": true
            }
          ]
        },
        {
          "topic": "Casos de Uso e Historias (Clase 7)",
          "question": "[PPT SEPTIMA CLASE, Diapositiva 17] Para evitar crear malas historias de usuario, se utiliza el criterio de calidad INVEST. ¿Qué significa o qué evalúa la letra \"E\"?",
          "options": [
            {
              "text": "Escrita (Written text)",
              "explanation": "Falso. Invocación de distractor clásico. Evidentes e inamovibles, van escritas.",
              "isCorrect": false
            },
            {
              "text": "Escalable (Scalable)",
              "explanation": "Falso. Apunte conceptual meramente ingenieril de nube y servidores escalables al millar de demandas, pero la metodología INVEST exige en la historia de usuario otros focos de atención y valor inmediato real tangibles.",
              "isCorrect": false
            },
            {
              "text": "Estimable (El equipo puede evaluar qué tiempo o esfuerzo tomará)",
              "explanation": "¡CORRECTA! Todo el conjunto de programadores asume \"Esto valdrá 2 horas, esto valdrá un mes de caos total, esto se puede picotear hoy\". Estimación clara garantiza certeza e hitos de pago.",
              "isCorrect": true
            },
            {
              "text": "Efectiva (Effective)",
              "explanation": "Falso. Típico engaño conceptual en test. INVEST las resume netamente en Independent, Negotiable, Valuable, Estimable, Small, Testable. Cero huecos de efectividad extra.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Gestión y FODA (Clase 11)",
          "question": "[PPT CLASE 11, Diapositiva 4] Según las 5 Fases del Ciclo de Vida del Proyecto, ¿en cuál de ellas se aprueba justificadamente la idea y se redacta el \"Acta de Constitución\" (Charter)?",
          "options": [
            {
              "text": "Planificación",
              "explanation": "Falso. Cuando pasas y logras el \"Acta\", entras de lleno legal y victorioso a esta etapa con tus directores con Gantt desglosados milimétricos en reuniones semanales densas formales.",
              "isCorrect": false
            },
            {
              "text": "Inicio",
              "explanation": "¡CORRECTA! Semilla original primogénita de los dueños, momento donde apruebas justificación capitalina. El \"Inicio\" engloba el acta oficial; sin ella y si saltas el paso formal la organización de tu proyecto será un rotundo desorden ilícito en gerencia corporativa de raíz.",
              "isCorrect": true
            },
            {
              "text": "Ejecución",
              "explanation": "Falso. Significa programar concretando acciones con presupuestos consumiendo cajas y bolsillos operacionales. Es criminal y absurdo realizarla al primer respiro inicial puramente.",
              "isCorrect": false
            },
            {
              "text": "Seguimiento y Control",
              "explanation": "Falso. Esto rige curvos visuales evaluados mes a mes, un auditoria sobre ruedas sobre un vehículo que al menos cuenta y ya transitó semanas de kilometraje reales de gestión.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Gestión y FODA (Clase 11)",
          "question": "[PPT CLASE 11, Diapositiva 6] En la Gestión de Riesgos, cuando clasificas un problema anotándolo como riesgo de probabilidad \"Alto\", \"Medio\" o \"Bajo\", corresponde a la técnica de análisis:",
          "options": [
            {
              "text": "Cuantitativo",
              "explanation": "Falso. Análisis que involucra dinero monetario financiero. Ej: [Si ocurre este incendio natural el hospital perderá 2,3 millones de euros anuales con seguridad del 40%].",
              "isCorrect": false
            },
            {
              "text": "Predictivo Secuencial",
              "explanation": "Falso. Corresponde netamente al diseño integral y clásico del marco base Cascada del PMI/Gantt y un proceso de vida integral completo transaccional de obra, no a riesgos focalizados nominales in situ puntuales en una matriz temporal ligera.",
              "isCorrect": false
            },
            {
              "text": "Cualitativo",
              "explanation": "¡CORRECTA! Palabras base de lenguaje natural suave y de apreciación (\"Grave\", \"Leve\", \"Muy alto\", \"Riesgoso emocional\"). Es una evaluación intuitiva del \"feeling\" general base gerencial humana instintiva directa y eficiente en un minuto base.",
              "isCorrect": true
            },
            {
              "text": "Histórico",
              "explanation": "Falso. Aunque analices caídas de meses anteriores del archivo duro (lo que es válido), la métrica nominal conceptual recae a otro departamento base estricto y analítico.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Gestión y FODA (Clase 11)",
          "question": "[PPT CLASE 11, Diapositiva 8] Tras hacer tu análisis de cuadrantes FODA, diseñas una \"Estrategia FA\". Esto lógicamente significa:",
          "options": [
            {
              "text": "Fomentar Alianzas estratégicas con competidores locales.",
              "explanation": "Falso. Las uniones empresariales escapan diametralmente a acrónimos nominales clásicos \"FODA\", es un distractor netamente lexical semántico español de test universitario superficial.",
              "isCorrect": false
            },
            {
              "text": "Usar Fortalezas internas para potenciar y aprovechar Oportunidades.",
              "explanation": "Falso. ¡CUIDADO! Cruzar internamente positivo (F) contra externo positivo (O) deviene dictaminantemente formal y lógica estricta a una Estrategia inamovible (FO), no (FA).",
              "isCorrect": false
            },
            {
              "text": "Minimizar Debilidades internas y así evitar caer en Amenazas externas.",
              "explanation": "Falso. Aborda y defiende con escudos la parte interna peor capacitada organizativa en cara y al frente a crisis mundiales (Estrategia Defensiva natural pura extrema: DA).",
              "isCorrect": false
            },
            {
              "text": "Utilizar y enfocar tus Fortalezas internas para combatir o esquivar tus Amenazas externas.",
              "explanation": "¡CORRECTA! Agarras tus millones de tu excelente cultura laboral intachable de empleados de matriz base (Fortaleza), e inviertes esa muralla fortificada gruesa frente a la feroz inflación o a Apple intentando demolerte de mercado (Amenaza Exterior de Mercado Global inamovible).",
              "isCorrect": true
            }
          ]
        },
        {
          "topic": "Gestión y FODA (Clase 11)",
          "question": "[PPT CLASE 11, Diapositiva 19] Una vez documentado el listado FODA, ¿qué técnica se recomienda usar como \"paso siguiente\" para aterrizarlos en acciones concretas y ejecutables?",
          "options": [
            {
              "text": "Documentar los requerimientos No Funcionales del proyecto.",
              "explanation": "Falso. Es totalmente micro y TI comparado a mandos analítico integrales gerenciales C-Levels.",
              "isCorrect": false
            },
            {
              "text": "Diagramación general BPMN enfocada en Riesgos.",
              "explanation": "Falso. Te pondrás a realizar cuadritos procedimentales logísticos, perdiendo y desconociendo todo el nivel estratégico general superior.",
              "isCorrect": false
            },
            {
              "text": "Análisis CAME (Corregir, Afrontar, Mantener y Explotar).",
              "explanation": "¡CORRECTA! [REGLA ESTRATÉGICA]: El FODA se queda puramente en diagnosticar (pensar), pero CAME te exige actuar. Corregir (Debilidades), Afrontar (Amenazas), Mantener (Fortalezas) y Explotar (Oportunidades).",
              "isCorrect": true
            },
            {
              "text": "Empleo de diagramas relacionales UML <<include>>",
              "explanation": "Falso. Es una locura y cruce académico espantoso ajeno al negocio llevar a Gerentes de Planificación Macroeconómica hacia análisis técnicos lógicos del backend transaccional de computación en diagramaciones de diseño relacional técnico de código.",
              "isCorrect": false
            }
          ]
        }
      ]
    },
    "test2": {
      "title": "Test 2: Escenarios Avanzados",
      "questions": [
        {
          "topic": "Requerimientos Complejos (Clases 2 y 3)",
          "question": "[ESCENARIO] El Sponsor te exige que \"la app no debe frustrar a los usuarios\" como requisito inicial. ¿Cuál es el problema real con este requerimiento?",
          "options": [
            {
              "text": "Es un requerimiento funcional puro, pero le falta la firma técnica del desarrollador.",
              "explanation": "Falso. \"No frustrar\" no es una función (como \"registrar usuario\"), es una intención cualitativa abstracta.",
              "isCorrect": false
            },
            {
              "text": "Es ambiguo y no es medible; debe ser traducido a una métrica verificable (ej: \"la tarea debe completarse en 3 clics\").",
              "explanation": "¡CORRECTA! Un requisito no medible ni testeable es basura técnica. Tienes que pasarlo por la lupa de la \"Especificación\".",
              "isCorrect": true
            },
            {
              "text": "Corresponde a una restricción legal, no a un requerimiento de calidad.",
              "explanation": "Falso. No hay ley estatal que pene la frustración del usuario en aplicaciones genéricas.",
              "isCorrect": false
            },
            {
              "text": "Es un requerimiento perfectamente estructurado bajo formato ágil.",
              "explanation": "Falso. Ni en Cascada ni en Ágil se aceptan ambigüedades románticas sin criterios de aceptación métricos.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Requerimientos Complejos (Clases 2 y 3)",
          "question": "[ESCENARIO] El equipo de Seguridad (Regulador) exige usar encriptación SHA-256 en las contraseñas, pero Marketing dice que los usuarios odian las contraseñas largas y quieren acceso con 4 dígitos. ¿Quién manda aquí?",
          "options": [
            {
              "text": "Marketing, porque representan directamente el dolor del cliente final (Usuarios).",
              "explanation": "Falso. Marketing puede opinar, pero no puede saltarse la ley o los estándares corporativos inquebrantables de seguridad.",
              "isCorrect": false
            },
            {
              "text": "El Product Owner por votación propia democrática con los desarrolladores.",
              "explanation": "Falso. La ley no se somete a votación de Scrum. Si el estándar exige SHA-256 por normativa, se hace.",
              "isCorrect": false
            },
            {
              "text": "El equipo de Seguridad, ya que las entidades regulatorias imponen restricciones legales/técnicas no negociables.",
              "explanation": "¡CORRECTA! [DATO CLAVE]: Los stakeholders regulatorios tienen el nivel más alto de poder. Un requerimiento legal o normativo aplasta cualquier queja de usabilidad.",
              "isCorrect": true
            },
            {
              "text": "Se debe programar ambas versiones y lanzar un Test A/B para ver qué prefiere el público.",
              "explanation": "Falso. No vas a lanzar una versión insegura que viola normativas solo para probar cómo reacciona el público.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Requerimientos Complejos (Clases 2 y 3)",
          "question": "[ESCENARIO] \"El sistema debe integrarse obligatoriamente con el motor de pago Transbank existente de la empresa\". Esto clasifica como:",
          "options": [
            {
              "text": "Requerimiento Funcional de Cobro.",
              "explanation": "Falso. El \"Cobro\" es la función. \"Usar Transbank obligatoriamente porque la empresa ya lo pagó\" es una restricción tecnológica limitante.",
              "isCorrect": false
            },
            {
              "text": "Regla de Negocio sobre descuentos.",
              "explanation": "Falso. Transbank no es una regla matemática de descuento (ej: \"10% off a jubilados\"), es una pasarela de infraestructura.",
              "isCorrect": false
            },
            {
              "text": "Una Restricción Tecnológica / Requerimiento No Funcional de integración.",
              "explanation": "¡CORRECTA! Te están cortando la libertad de elegir. Te obligan a integrar bajo un parámetro inamovible de arquitectura.",
              "isCorrect": true
            },
            {
              "text": "Criterio de aceptación estético de la interfaz de pago.",
              "explanation": "Falso. Integrar motores financieros transaccionales requiere backend puro, no es un tema netamente de paletas estéticas.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Escenarios de Scrum y PO (Clases 6)",
          "question": "[ESCENARIO] El Gerente General llega furioso a mitad de un \"Sprint\" de 2 semanas y exige que los programadores dejen todo y agreguen un botón rojo urgente. ¿Qué debes hacer tú como Scrum Master?",
          "options": [
            {
              "text": "Obligar a los programadores a incluir el botón trabajando horas extra esa misma noche.",
              "explanation": "Falso. Destruyes el principio ágil de ritmo sostenible y rompes el cerco del Sprint Planning.",
              "isCorrect": false
            },
            {
              "text": "Aceptar el cambio porque el Gerente General es el máximo nivel (Sponsor) y tiene la última palabra sobre el código diario.",
              "explanation": "Falso. El Sprint está sellado y blindado. Interrumpirlo causa caos técnico.",
              "isCorrect": false
            },
            {
              "text": "Proteger al equipo, bloquear la interrupción, y derivar al Gerente a hablar con el Product Owner para el próximo Sprint.",
              "explanation": "¡CORRECTA! [EL ESCUDO HUMANO]: La labor suprema del Scrum Master es proteger el foco del equipo y decirle amablemente \"No\" a las distracciones, guiándolas al PO.",
              "isCorrect": true
            },
            {
              "text": "Cancelar el Sprint inmediatamente, borrar el código y hacer una nueva reunión de Planning.",
              "explanation": "Falso. Una aberración cancelar semanas de trabajo por un mero botón caprichoso no catastrófico.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Escenarios de Scrum y PO (Clases 6)",
          "question": "[ESCENARIO] Eres el Product Owner. Tienes 2 Historias en el Backlog: A) Un nuevo filtro de búsqueda que traerá $1,000 extra al mes y cuesta 1 día de desarrollo. B) Un rediseño total que traerá $1,200 al mes pero cuesta 3 semanas. ¿Cuál priorizas y por qué?",
          "options": [
            {
              "text": "La opción B, porque su valor monetario nominal final ($1,200) es mayor, demostrando visión a largo plazo.",
              "explanation": "Falso. Matemáticas de PO: Gastar 21 días (3 semanas) por $200 extras es pésimo negocio.",
              "isCorrect": false
            },
            {
              "text": "La opción A, por su altísimo ROI (Retorno de Inversión) inmediato frente a un esfuerzo mínimo.",
              "explanation": "¡CORRECTA! [LA MENTE DEL PO]: La priorización siempre cruza \"Valor aportado vs Esfuerzo/Costo técnico\". Entregas valor rápido (Quick Win).",
              "isCorrect": true
            },
            {
              "text": "Ninguna, debes exigirle a Scrum Master que reduzca el tiempo de B a 1 día usando metodologías extremas.",
              "explanation": "Falso. El tiempo no se comprime mágicamente, el equipo técnico estima y el PO lo respeta.",
              "isCorrect": false
            },
            {
              "text": "Debes obligatoriamente hacer ambas al mismo tiempo para maximizar ganancias corporativas.",
              "explanation": "Falso. Ágil promueve el trabajo enfocado y secuencial priorizado, la multitarea destruye la entrega temprana.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Escenarios de Scrum y PO (Clases 6)",
          "question": "[CONCEPTUAL] ¿Qué es el \"Product Backlog Refinement\" (Refinamiento)?",
          "options": [
            {
              "text": "La auditoría final de calidad (QA) antes de lanzar el producto al público.",
              "explanation": "Falso. Refinar no es testear. Refinar es preparar el terreno a futuro.",
              "isCorrect": false
            },
            {
              "text": "La sesión diaria (Daily) donde se informan problemas y obstáculos.",
              "explanation": "Falso. La Daily evalúa el hoy (presente activo), el refinamiento mira el futuro (próximos Sprints).",
              "isCorrect": false
            },
            {
              "text": "La sesión donde el PO y el equipo limpian, aclaran, parten y estiman historias futuras para que estén listas antes de empezar a programarlas.",
              "explanation": "¡CORRECTA! Es \"sacarle punta al lápiz\". Asegurarse de que el requerimiento sea INVEST antes del siguiente Sprint Planning.",
              "isCorrect": true
            },
            {
              "text": "El castigo o retrospectiva donde se revisan los errores humanos del equipo y se despiden elementos ineficientes.",
              "explanation": "Falso. Las Retrospectivas (Retros) son para mejorar procesos en confianza, no cacerías de brujas para despedir gente.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Historias de Usuario (Clase 7)",
          "question": "[ESCENARIO] Lees esta historia: \"Como administrador, quiero mejorar la base de datos SQL para que los índices B-Tree se balanceen automáticamente.\" ¿Qué regla del modelo INVEST se rompe garrafalmente?",
          "options": [
            {
              "text": "La \"T\" (Testable), ya que las bases de datos no se pueden probar.",
              "explanation": "Falso. Las bases de datos claro que se testean con scripts y querys de rendimiento.",
              "isCorrect": false
            },
            {
              "text": "La \"N\" (Negotiable), porque obliga a usar SQL y no permite otras bases de datos.",
              "explanation": "Falso. Aunque usar SQL podría ser poco negociable, el problema capital es su enfoque puramente sistémico interno.",
              "isCorrect": false
            },
            {
              "text": "La \"V\" (Valuable) para el negocio o usuario final. Es una tarea técnica, no una historia de usuario real.",
              "explanation": "¡CORRECTA! [TRAMPA DE PROFE]: El usuario \"Administrador del software\" no obtiene valor de los \"Índices B-Tree\". Las Historias de Usuario NO son instrucciones técnicas encubiertas para desarrolladores.",
              "isCorrect": true
            },
            {
              "text": "La \"I\" (Independent), porque depende de que haya electricidad.",
              "explanation": "Falso. Justificación absurda académica de despiste.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Historias de Usuario (Clase 7)",
          "question": "[ESCENARIO] Tienes un Caso de Uso base \"Realizar Examen Médico\". Si el paciente llega con temperatura muy alta, opcionalmente el sistema te pedirá \"Registrar Fármaco Febrífugo\". ¿Qué relación UML utilizarías para conectar estos dos casos?",
          "options": [
            {
              "text": "<<include>>",
              "explanation": "Falso. El \"Include\" es dictatorial y obligatorio. Significará que a TODOS los pacientes de la historia del hospital les darás fármacos de fiebre, sanos o enfermos.",
              "isCorrect": false
            },
            {
              "text": "<<extend>>",
              "explanation": "¡CORRECTA! Extensión de uso condicional. Ocurre SOLO si se cumple una condición excepcional o alternativa (ej: Si tiene fiebre alta).",
              "isCorrect": true
            },
            {
              "text": "Una asociación simple cruzada entre dos Actores primarios.",
              "explanation": "Falso. Los Actores no se asocian a otros casos de uso ajenos sin pasar por la validación técnica del caso principal condicionado.",
              "isCorrect": false
            },
            {
              "text": "Generalización UML del Caso de Uso.",
              "explanation": "Falso. Generalizar es \"El Pago con Crédito hereda de Pago\", no una condición de interrupción opcional.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Historias de Usuario (Clase 7)",
          "question": "[CONCEPTUAL] Al reverso de una tarjeta de Historia de Usuario, o en el ticket digital, se deben anotar los \"Criterios de Aceptación\". Su objetivo técnico real es:",
          "options": [
            {
              "text": "Definir qué programador Junior o Senior debe ser asignado a la tarea.",
              "explanation": "Falso. La asignación de recursos humanos la decide el equipo técnico (Team), no el papel de los requerimientos.",
              "isCorrect": false
            },
            {
              "text": "Anotar los códigos y algoritmos base que el desarrollador debe copiar y pegar.",
              "explanation": "Falso. Dictadura tecnológica inaceptable. El equipo decide CÓMO, la historia dicta QUÉ.",
              "isCorrect": false
            },
            {
              "text": "Definir el límite exacto de cuándo la historia se considera 100% terminada y lista (Done).",
              "explanation": "¡CORRECTA! [CLAVE QA]: El criterio de aceptación le dice al Tester: \"Si cumple el Paso 1, 2 y 3, aprueba el ticket\". Evita la ambigüedad del famoso \"ya casi termino\".",
              "isCorrect": true
            },
            {
              "text": "Solicitar los permisos legales necesarios al Gobierno para operar el sistema en la nube.",
              "explanation": "Falso. Trámite legal que escapa al ticket funcional ágil del día a día.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN Avanzado (Clase 4)",
          "question": "[ESCENARIO BPMN] Estás modelando el proceso de un Banco. El cliente solicita un préstamo. Al mismo tiempo y en paralelo, el Departamento Legal revisa sus antecedentes penales y Riesgos revisa su Dicom. ¿Qué figura BPMN usas para dividir el flujo en estos dos caminos que ocurren obligatoriamente a la vez?",
          "options": [
            {
              "text": "Compuerta Exclusiva (Gateway con una \"X\")",
              "explanation": "Falso. La X es \"O eres blanco O eres negro\" (mutuamente exclusivo). El enunciado dice que ambas cosas suceden obligatoriamente a la vez.",
              "isCorrect": false
            },
            {
              "text": "Compuerta Paralela (Gateway con un símbolo de \"+\")",
              "explanation": "¡CORRECTA! [TRAMPA VISUAL]: El \"+\" divide el camino para que ambos departamentos trabajen simultáneamente (en paralelo) y luego obligatoriamente se vuelve a juntar con otro \"+\" para continuar.",
              "isCorrect": true
            },
            {
              "text": "Compuerta Inclusiva (Gateway con una \"O\" redonda interior)",
              "explanation": "Falso. La \"O\" significa que puede ser 1, 2 o las 3 cosas a la vez dependiendo de una condición. Pero aquí es tajante: \"Al mismo tiempo ambas\".",
              "isCorrect": false
            },
            {
              "text": "Un Evento Intermedio de Temporizador Múltiple.",
              "explanation": "Falso. Un temporizador frena el proceso en base a tiempo o fechas (ej: esperar 3 días), no ramifica caminos paralelos de trabajo.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN Avanzado (Clase 4)",
          "question": "[ESCENARIO BPMN] En el flujo de \"Preparar Pedido Delivery\", la flecha de secuencia choca directamente con un rombo vacío, de ahí salen dos flechas: \"Monto mayor a $50k\" y \"Monto menor a $50k\". Solo puedes tomar un camino. Esta es una compuerta:",
          "options": [
            {
              "text": "Exclusiva basada en datos (X)",
              "explanation": "¡CORRECTA! Es la típica decisión binaria de IF-ELSE informático. Te vas por un tubo o por el otro excluyentemente según la data (Monto del total).",
              "isCorrect": true
            },
            {
              "text": "Paralela (+)",
              "explanation": "Falso. Si usas paralela enviarías al cliente por los dos montos al mismo tiempo, fracturando la lógica universal matemática y estafándolo el doble.",
              "isCorrect": false
            },
            {
              "text": "Evento de Inicio Múltiple",
              "explanation": "Falso. Solo inician instancias, no separan secuencias activas en pleno proceso medio.",
              "isCorrect": false
            },
            {
              "text": "Colaboración Mixta con Pool",
              "explanation": "Falso. Mezcla absurda de términos sin sustento notacional.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN Avanzado (Clase 4)",
          "question": "[CONCEPTUAL] ¿Para qué sirve un \"Subproceso\" (la caja de Tarea que tiene un pequeño signo [+] en el centro inferior)?",
          "options": [
            {
              "text": "Para delegarle el control obligatoriamente al competidor directo de la empresa.",
              "explanation": "Falso. BPMN jamás modela a los enemigos del negocio como ejecutores de tus propios diagramas internos formales.",
              "isCorrect": false
            },
            {
              "text": "Para agrupar actividades complejas en una sola caja superior y evitar que el diagrama principal quede visualmente ilegible.",
              "explanation": "¡CORRECTA! Es un colapsable. [TIP]: En vez de dibujar los 20 pasos de \"Hacer una Pizza\" en el diagrama macro, pones una caja llamada \"Cocinar[+]\" y si alguien quiere, hace doble clic para ver el detalle en otro plano.",
              "isCorrect": true
            },
            {
              "text": "Representa tareas que se deben ejecutar múltiples veces en bucle iterativo de for-loop.",
              "explanation": "Falso. Eso lo representa la \"Loop Task\" (tarea con flechita en rulo).",
              "isCorrect": false
            },
            {
              "text": "Indicar que el proceso es ejecutado por un robot de Inteligencia Artificial automático sin humanos.",
              "explanation": "Falso. Eso recae en un tipo especial de Service Task o Script Task con forma de engranaje o tuerca.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN Avanzado (Clase 4)",
          "question": "[CONCEPTUAL] Estás modelando el Pool \"Restaurante\" y el Pool \"Cliente hambriento\". ¿Puedo trazar una flecha negra sólida de secuencia directa que salga de la cocina y entre al cuadro del cliente?",
          "options": [
            {
              "text": "Sí, siempre y cuando se le agregue un evento intermedio antes de chocar.",
              "explanation": "Falso. La notación es brutal y castiga esto; la flecha sólida es intransitiva fuera de los dominios privados de su propio Pool.",
              "isCorrect": false
            },
            {
              "text": "No, porque el cliente en los modelos BPMN jamás puede interactuar activamente con la empresa, solo paga pasivamente en silencio.",
              "explanation": "Falso. El cliente sí interactúa pidiendo cosas y recibiendo platos, la trampa es visual/sintáctica.",
              "isCorrect": false
            },
            {
              "text": "No. Entre Pools diferentes SOLO se pueden trazar flujos de mensaje (flecha punteada con sobre).",
              "explanation": "¡CORRECTA! [EL ERROR MÁS COMÚN DEL MUNDO BPMN]: Si tu diagrama tiene una flecha negra cruzando de la piscina 1 a la piscina 2, tu profesor te va a reprobar automáticamente por falta sintáctica. Entre entidades distintas solo viajan correos/mensajes.",
              "isCorrect": true
            },
            {
              "text": "Sí, la flecha sólida de secuencia es el método universal libre en la notación BPMN 2.0 y carece de reglas.",
              "explanation": "Falso. BPMN 2.0 es uno de los lenguajes más milimétricamente regulados a nivel global ISO.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Business Model Canvas (Clase 7/11)",
          "question": "[CANVAS] Netflix empezó mandando DVDs físicos por correo postal a la casa. Hoy es 100% Streaming Digital mundial en Smart TVs. ¿Qué bloque(s) del BMC sufrió el cambio o \"pivote\" más drástico técnico-distributivo?",
          "options": [
            {
              "text": "Relación con los Clientes (Customer Relationships)",
              "explanation": "Falso. La relación sigue siendo de auto-servicio pasivo (Self-Service). Netflix no te llama por teléfono hoy ni te llamaba antes para hablar del DVD.",
              "isCorrect": false
            },
            {
              "text": "Canales (Channels) y Estructura de Costos",
              "explanation": "¡CORRECTA! Pasaron del \"Canal Físico Postal de FedEx\" al \"Canal Digital de Internet / App\". Y sus costos pasaron de bodegas/carteros a Servidores de Nube Global (AWS). ¡Ese es un pivote brutal orgánico!",
              "isCorrect": true
            },
            {
              "text": "Segmento de Clientes (Customer Segments)",
              "explanation": "Falso. El cliente sigue siendo el mismo: gente en sus casas que quiere ver películas de sofá relajados.",
              "isCorrect": false
            },
            {
              "text": "Únicamente el Flujo de Ingresos (Revenue Streams)",
              "explanation": "Falso. Sigue siendo una suscripción mensual, el modelo de cobro per se (la caja registradora mensual tarjeta) es la misma premisa.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Business Model Canvas (Clase 7/11)",
          "question": "[CANVAS] \"Otorgar soporte VIP personalizado 24/7 de forma humana a cuentas Premium\". Este concepto va ubicado innegablemente en el bloque de:",
          "options": [
            {
              "text": "Canales (Channels)",
              "explanation": "Falso. El canal es \"Teléfono\" o \"Chat\", pero el TIPO de trato amigable VIP o robótico pasivo recae en Relación.",
              "isCorrect": false
            },
            {
              "text": "Actividades Clave (Key Activities)",
              "explanation": "Falso. Si bien contestar es la actividad, el diseño del estrato \"Trato VIP humano\" está enfocado al mapeo frontal en Canvas.",
              "isCorrect": false
            },
            {
              "text": "Relaciones con los Clientes",
              "explanation": "¡CORRECTA! [LA DIFERENCIA]: Canal es el MEDIO (App Móvil). Relación es el TRATO (Comunidad, Autoservicio, Asistencia Personal, Robótica, Self-Service).",
              "isCorrect": true
            },
            {
              "text": "Propuesta de Valor (Value Proposition)",
              "explanation": "Falso. La propuesta de valor principal no es contestarte el teléfono 24/7, la propuesta suele ser el núcleo (ej: \"Sistema contable infalible en nube\", y de plus, la relación amigable).",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Estrategias FODA/CAME (Clase 11)",
          "question": "[ESCENARIO FODA] El mercado de los taxis está en declive por leyes duras contra contaminación (Amenaza Alta). Tu empresa de taxis tiene una flota antigua obsoleta y pocos fondos (Debilidad Severa). ¿Qué tipo de estrategia combinada \"DA\" dicta la supervivencia empresarial?",
          "options": [
            {
              "text": "Estrategia de Crecimiento (FO): Comprar toda la competencia y monopolizar el sector urbano invirtiendo a préstamo en bancos y expandiéndose en publicidad nacional.",
              "explanation": "Falso. FO es usar dinero fuerte y mercado feliz para reventar el techo... tú tienes cajas vacías y la ley en tu contra, un préstamo FO te entierra.",
              "isCorrect": false
            },
            {
              "text": "Estrategia de Supervivencia o Defensiva (DA): Reducir al máximo flotas, aliarse con la competencia local de inmediato o liquidar la empresa antes de la quiebra inminente.",
              "explanation": "¡CORRECTA! Estrategia Defensiva: Juntar tu peor Debilidad con la peor Amenaza te arrincona contra el ring. Solo queda minimizar daños, vender activos, achicarse, o sobrevivir en modo bajo consumo aguantando el huracán.",
              "isCorrect": true
            },
            {
              "text": "Estrategia de Reorientación (DO): Mantener las flotas y esperar pasivamente que el gobierno levante los fallos de las leyes ambientales con paciencia.",
              "explanation": "Falso. La reorientación exige pivotear aprovechando un hueco legal de oportunidad de mercado inexplorada superando debilidad técnica, la pasividad no funciona de estrategia de combate.",
              "isCorrect": false
            },
            {
              "text": "Estrategia de Liderazgo (FA): Obligar a los pocos chóferes a realizar turnos de cuarenta horas con pagos inflados y precios de viaje cuádruples al cliente asumiendo superioridad elitista urbana.",
              "explanation": "Falso. Un choque financiero frontal de la nada que arruinaría toda empresa, nada que ver con Fortaleza ni Amenaza mitigada.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Estrategias FODA/CAME (Clase 11)",
          "question": "[ESCENARIO CAME] En tu FODA encontraste la siguiente (O) Oportunidad: \"Boom del teletrabajo dispara la venta de licencias VPN corporativas\". Para aplicar la \"E\" (Explotar) del modelo CAME, debes:",
          "options": [
            {
              "text": "Afrontar pacíficamente que el trabajo remoto es solo temporal y que invertir en VPN es demasiado Riesgo Cualitativo a largo plazo.",
              "explanation": "Falso. Eso es rendirse (y encima mezclas \"Afrontar\" (Amenazas) con \"Oportunidades\"). Las Oportunidades SE EXPLOTAN agresivamente.",
              "isCorrect": false
            },
            {
              "text": "Corregir la política interna de la empresa para prohibir VPN entre empleados del sindicato por temas de ciberseguridad sindical.",
              "explanation": "Falso. Corregir se le hace a tus Debilidades internas, y esto es una oportunidad dorada de ventas externa y mercantil.",
              "isCorrect": false
            },
            {
              "text": "Lanzar inmediatamente una campaña de ventas masiva y subir tus servidores para capturar obsesivamente ese nuevo flujo antes que otros competidores.",
              "explanation": "¡CORRECTA! [EL MÚSCULO CAME]: Oportunidad = Explotar sin piedad. Le clavas colmillos comerciales, inviertes, creces rápido y facturas.",
              "isCorrect": true
            },
            {
              "text": "Mantener tu catálogo de productos intacto sin realizar innovaciones por miedo a saturar el equipo técnico de Scrum.",
              "explanation": "Falso. Mantener aplica a tus propias Fortalezas que ya funcionan (M de CAME), aquí desaprovechaste la mina de oro global in situ.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "KPIs Avanzados (Clase 6)",
          "question": "[ESCENARIO KPI] El Gerente de e-Commerce impone el KPI: \"Número de carritos de compra abandonados antes de pagar en la web\". ¿De qué tipo corporativo es este indicador estratégico real?",
          "options": [
            {
              "text": "Indicador de Finanzas Netas de Capital.",
              "explanation": "Falso. Financiero sería si estuvieras evaluando el flujo del dólar y su ROI; el carrito abandonado indica una traba de usuario en la pantalla que frena la venta pura.",
              "isCorrect": false
            },
            {
              "text": "Indicador Técnico No Funcional / Infraestructura.",
              "explanation": "Falso. La gente no abandona el carrito siempre porque haya problemas del servidor, suele ser por gastos de envío ocultos o mal diseño visual del marketing en pantalla.",
              "isCorrect": false
            },
            {
              "text": "Indicador de Ventas / Conversión",
              "explanation": "¡CORRECTA! Todo lo relativo al embudo de clientes (Leads, Carritos, CTR de anuncios) ataca el motor directo del embudo comercial de Marketing-Ventas online cruzado.",
              "isCorrect": true
            },
            {
              "text": "Métrica Operacional Administrativa",
              "explanation": "Falso. Operacional remite a \"Cuántas zapatillas construyó la máquina hoy\", no si la persona online se asustó con el pago al final.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Metodologías y Gestión (Clase 2 y 11)",
          "question": "[CONCEPTUAL] Según los ciclos de vida del proyecto, un enfoque \"Iterativo e Incremental\" (como Ágil) asume desde el día uno que:",
          "options": [
            {
              "text": "Los requerimientos del cliente van a mutar inevitablemente y entregar pedazos de software pequeños mes a mes permite cambiar el rumbo sin traumas financieros letales.",
              "explanation": "¡CORRECTA! [LA LEY DEL ÁGIL]: \"El cliente no sabe lo que quiere hasta que se lo pones enfrente y lo usa\". El modelo acepta el caos como ley física universal y se moldea mediante Sprints a iterar con él.",
              "isCorrect": true
            },
            {
              "text": "Todos los requerimientos quedarán 100% tallados en piedra de forma inquebrantable tras firmar el Acta de Inicio Charter inicial formal al instante base.",
              "explanation": "Falso. Acabas de describir exactamente y puramente el enfoque tradicional CASCADA o Predictivo de los años 80 donde los cambios se castigaban duramente y paralizaban firmas.",
              "isCorrect": false
            },
            {
              "text": "El Product Owner no existe y los programadores lideran gerencialmente el desarrollo caóticamente de manera aleatoria.",
              "explanation": "Falso. Ágil no es anarquía, de hecho es ultrarígido con las ceremonias y el Product Owner es quien manda la batuta ordenatoria de valor.",
              "isCorrect": false
            },
            {
              "text": "El desarrollo debe obligatoriamente programarse solo en un ambiente de pruebas hasta que la fecha límite llegue.",
              "explanation": "Falso. Incremento significa que sacas a Producción real versiones betas y módulos usables reales desde la semana 3 en adelante periódicamente y constantes en el tiempo.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Metodologías y Gestión (Clase 2 y 11)",
          "question": "[ESCENARIO] Se desató un virus que arruinó la granja de servidores de Amazon, tirando el sistema. Como Gerente de Proyecto de TI, aplicas el Plan de Respuestas a Riesgos. Usar la \"Base de Datos Secundaria de Respaldo Físico Offline en Europa\" corresponde a la táctica de Respuesta Estratégica Riesgo Negativo llamada:",
          "options": [
            {
              "text": "Evitar Riesgos",
              "explanation": "Falso. Para evitarlo tendrías que haber sacado mágicamente los datos antes de que el virus tocara, garantizando a cero el daño. Aquí el golpe ya ocurrió, los servidores se tumbaron de frente y el virus aniquiló Amazon original.",
              "isCorrect": false
            },
            {
              "text": "Transferir Riesgos",
              "explanation": "Falso. Transferir es pagarle una póliza de seguro multimillonaria a una empresa en Londres para que si te hackean ellos asuman la deuda penal, aquí usaste tus propios respaldos para defenderte operativamente y continuar andando mermado temporalmente pero vivo aún.",
              "isCorrect": false
            },
            {
              "text": "Mitigación de Riesgos",
              "explanation": "¡CORRECTA! Mitigar: \"Tomar una acción anticipada a la fecha de crisis que reduzca la gravedad del dolor si estalla la bomba en plena guerra informático\". Al tener respaldo, la empresa sobrevive y el daño se alivia, amortigua el infarto letal del cierre empresarial absoluto natural.",
              "isCorrect": true
            },
            {
              "text": "Aceptación Pasiva de Riesgos",
              "explanation": "Falso. Pasivo es sentarse a llorar viendo cómo el virus te borra la base sin tocar botones o encomendarte netamente a la santísima providencia divina para no perder capital de forma mágica.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Historias de Usuario / INVEST (Clase 7)",
          "question": "Dentro de INVEST, una Historia \"Pequeña\" (Small) significa que:",
          "options": [
            {
              "text": "Debe tener menos de 10 líneas de código Java.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Debe requerir poca atención del Product Owner.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Su tamaño es lo suficientemente reducido como para ser completada dentro de un solo Sprint.",
              "explanation": "¡CORRECTA! Si es tan inmensa que toma 2 meses, se llama \"Épica\" y debes cortarla en historias más pequeñas obligatoriamente.",
              "isCorrect": true
            },
            {
              "text": "Debe ocupar poca memoria RAM en el servidor.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN Avanzado (Clase 4)",
          "question": "El evento intermedio que tiene un pequeño sobre BLANCO en el centro pegado a la línea indica:",
          "options": [
            {
              "text": "Recepción (Catching) de un mensaje que detiene el flujo hasta que el mensaje llegue.",
              "explanation": "¡CORRECTA! Sobre en blanco atrapa (Catch). Sobre rellenado negro envía (Throw).",
              "isCorrect": true
            },
            {
              "text": "Envío inmediato a un servidor externo de correo.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Comienzo absoluto del diagrama sin excepciones lógicas.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Bucle repetitivo (Loop) condicionado por datos for-each.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN Avanzado (Clase 4)",
          "question": "Si veo un evento intermedio con un RELOJ de arena/reloj analógico, este detiene la secuencia por:",
          "options": [
            {
              "text": "Decisión gerencial arbitraria humana obligatoria.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Condición de tiempo programada, como esperar 2 horas o esperar a fin de mes.",
              "explanation": "¡CORRECTA! El \"Timer Event\" automatiza demoras (Ej: \"Esperar a las 00:00 hrs\" para cerrar caja bancaria automatizada).",
              "isCorrect": true
            },
            {
              "text": "Pausa de sistema por saturación de CPU o red colapsada.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Error en la base de datos de datos transaccionales históricos.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Stakeholders y Análisis (Clase 3)",
          "question": "¿Qué objetivo primario tiene graficar la matriz \"Poder vs Interés\" con los Stakeholders?",
          "options": [
            {
              "text": "Definir los sueldos en dólares que ganarán en la empresa a nivel gerencial.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Clasificar quién requiere atención inmediata (Ej: Poder Alto / Interés Alto) vs quién solo necesita ser informado esporádicamente.",
              "explanation": "¡CORRECTA! Te salva la vida política. A los Alto-Alto hay que gestionarlos de cerca, y a los Bajo-Bajo solo monitorearlos de lejos para no perder el tiempo productivo inútilmente en charlas intrascendentes.",
              "isCorrect": true
            },
            {
              "text": "Dictaminar el tiempo de desarrollo de programación estricta.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Encontrar bugs en el código de forma visual.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Requerimientos (Clase 2)",
          "question": "Las \"Reglas de Negocio\" son:",
          "options": [
            {
              "text": "Decisiones de arquitectura técnica de software.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Políticas, leyes, condiciones y normativas de la propia empresa que el sistema debe acatar forzosamente.",
              "explanation": "¡CORRECTA! Ej: \"Todo cliente VIP tiene 5% de descuento\". No es un botón visual de interfaz de UI general funcional clásico superficial (requerimiento), es una regla dura matemática y corporativa subyacente impuesta obligatoria.",
              "isCorrect": true
            },
            {
              "text": "Los lenguajes de programación obligados.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Las ceremonias de Scrum como el Daily o Planning obligatorias semanales.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "KPIs y Métricas (Clase 6)",
          "question": "En el embudo de Marketing Digital, el \"CAC (Costo de Adquisición de Cliente)\" indica:",
          "options": [
            {
              "text": "Cuánto dinero le cobras al cliente mensualmente.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Cuánto dinero en publicidad u horas-hombre gasta la empresa para que UNA persona nueva termine comprando el producto.",
              "explanation": "¡CORRECTA! Métrica vital. Si tu software vale $10 pero te cuesta $50 en anuncios de Facebook conseguir a ese cliente, tu CAC es ruin y estás quebrando financieramente en caída libre absoluta inevitable in situ.",
              "isCorrect": true
            },
            {
              "text": "El costo de arrendar los servidores en Amazon AWS para todo el año calendario.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "El salario del departamento técnico de desarrollo sumado a los bonos productivos trimestrales inamovibles.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Casos de Uso (Clase 7)",
          "question": "El flujo base principal o \"Happy Path\" (Camino Feliz) en la redacción tabular de un Caso de Uso describe:",
          "options": [
            {
              "text": "El camino que el tester de QA debe intentar romper obligatoriamente agresivo a nivel extremo de hackers internacionales.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Los flujos de excepción donde el usuario ingresa mal la contraseña de manera obligatoria y cíclica para medir retenciones.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "La ruta óptima y perfecta donde no hay errores, el usuario ingresa sus datos y logra su meta a la primera sin contratiempos de excepciones de caídas ni alertas de fallos.",
              "explanation": "¡CORRECTA! Es el flujo ideal primario, el \"Deber Ser\" si todo fluye bien 100% como se concibió en los manuales perfectos académicos base y diseños.",
              "isCorrect": true
            },
            {
              "text": "La arquitectura de programación más económica en código y tiempo logístico.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Gestión de Proyecto (Clase 11)",
          "question": "¿Qué es el \"Alcance\" (Scope) de un proyecto de Software en su etapa de Planificación?",
          "options": [
            {
              "text": "El dinero total que se gastará.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Los límites absolutos: qué funcionalidades exactas están incluidas dentro de la billetera y tiempo a entregar, y qué está excluido explícitamente.",
              "explanation": "¡CORRECTA! El Alcance es la muralla protectora de un Jefe de Proyecto real. \"Haremos la Casa con 2 Baños, NO haremos piscina, ni terraza, ni patio extra ni luces led inteligentes. Fírmalo.\".",
              "isCorrect": true
            },
            {
              "text": "El número de programadores asignados al inicio.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "El diagrama técnico de los módulos internos.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Metodologías Ágiles (Clase 6)",
          "question": "La filosofía \"KISS (Keep It Simple, Stupid)\" en ingeniería y diseño ágil se refiere a:",
          "options": [
            {
              "text": "Una falta de respeto para el cliente si no entiende el código del desarrollador.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Comprar siempre las licencias de software más baratas.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "La simplicidad como un objetivo de diseño clave; evitar añadir complejidad innecesaria a los sistemas para que sean mantenibles.",
              "explanation": "¡CORRECTA! El código sobreingeniado falla y es imposible de leer o actualizar. Mantenerlo simple e iterar salva vidas tecnológicas.",
              "isCorrect": true
            },
            {
              "text": "Rechazar requerimientos funcionales constantemente.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "FODA / CAME (Clase 11)",
          "question": "Al realizar CAME, la \"M\" (Mantener) recae sobre:",
          "options": [
            {
              "text": "Las Debilidades (mantener la mala infraestructura para no gastar).",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Las Amenazas (mantener la vista en el horizonte a ver qué sucede con paciencia inactiva natural).",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Las Fortalezas (ej: Si tienes un equipo de excelencia, debes mantenerlos felices, subir sus sueldos y asegurar su permanencia laboral activa productiva leal).",
              "explanation": "¡CORRECTA! Las Fortalezas no se tocan, se \"Mantienen\" y se cuidan como hueso santo porque te dan la ventaja competitiva global dura de la empresa principal.",
              "isCorrect": true
            },
            {
              "text": "Las Oportunidades (mantener contacto con clientes a futuro dudoso lejano).",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        }
      ]
    },
    "test3": {
      "title": "Test 3: Examen Textual PPT",
      "questions": [
        {
          "topic": "Requerimientos (PPT 2 y 3)",
          "question": "Según los PPTs, ¿cuál es la etapa donde \"se recopila información de los usuarios y clientes mediante entrevistas, encuestas y observación\"?",
          "options": [
            {
              "text": "Análisis",
              "explanation": "Falso. El análisis revisa la información para detectar inconsistencias.",
              "isCorrect": false
            },
            {
              "text": "Obtención (Elicitación)",
              "explanation": "¡CORRECTA! Textual del PPT: Obtención (Elicitación): Se recopila información de los usuarios mediante entrevistas y encuestas.",
              "isCorrect": true
            },
            {
              "text": "Validación",
              "explanation": "Falso. La validación confirma con los usuarios.",
              "isCorrect": false
            },
            {
              "text": "Especificación",
              "explanation": "Falso. Especificar es documentar de manera clara y estructurada.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Requerimientos (PPT 2 y 3)",
          "question": "Los requerimientos funcionales se definen textualmente como:",
          "options": [
            {
              "text": "Los que describen CÓMO funciona el sistema (calidad, rendimiento).",
              "explanation": "Falso. Eso corresponde a los requerimientos No Funcionales.",
              "isCorrect": false
            },
            {
              "text": "Los que describen QUÉ hace el sistema (acciones, servicios, funciones visibles).",
              "explanation": "¡CORRECTA! Textual del PPT 3: \"Funcionales: Describen qué hace el sistema\".",
              "isCorrect": true
            },
            {
              "text": "Los que restringen las metodologías de programación.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Los que definen el ciclo de vida de Scrum.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Requerimientos (PPT 2 y 3)",
          "question": "\"El sistema debe responder en menos de 2 segundos\". Este es un claro ejemplo de:",
          "options": [
            {
              "text": "Requerimiento Funcional.",
              "explanation": "Falso. No es una función visible de acción, es una métrica de rendimiento.",
              "isCorrect": false
            },
            {
              "text": "Regla de Negocio.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Requerimiento No Funcional.",
              "explanation": "¡CORRECTA! Textual del PPT: \"No funcionales describen CÓMO funciona el sistema (calidad, rendimiento... Ejemplo: El sistema debe responder en menos de 2 segundos)\".",
              "isCorrect": true
            },
            {
              "text": "Criterio de Scrum.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN (PPT 4)",
          "question": "En notación BPMN, la \"Compuerta Exclusiva (X)\" indica que:",
          "options": [
            {
              "text": "Todas las rutas se ejecutan al mismo tiempo.",
              "explanation": "Falso. Eso es la Compuerta Paralela (+).",
              "isCorrect": false
            },
            {
              "text": "Una o más rutas se ejecutan.",
              "explanation": "Falso. Eso es la Compuerta Inclusiva (O).",
              "isCorrect": false
            },
            {
              "text": "Solo una ruta se ejecuta.",
              "explanation": "¡CORRECTA! Textual del PPT 4: \"Exclusiva (X): solo una ruta se ejecuta\".",
              "isCorrect": true
            },
            {
              "text": "El proceso se detiene obligatoriamente.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN (PPT 4)",
          "question": "En notación BPMN, la \"Compuerta Inclusiva (O)\" indica que:",
          "options": [
            {
              "text": "Todas las rutas se ejecutan al mismo tiempo obligatoriamente.",
              "explanation": "Falso. Eso es la Compuerta Paralela (+).",
              "isCorrect": false
            },
            {
              "text": "Una o más rutas se ejecutan si cumplen la condición.",
              "explanation": "¡CORRECTA! Textual del PPT 4: \"Compuerta Inclusiva (O): Una o más rutas se ejecutan si cumplen la condición\".",
              "isCorrect": true
            },
            {
              "text": "Solo una ruta se ejecuta.",
              "explanation": "Falso. Esa es la Exclusiva (X).",
              "isCorrect": false
            },
            {
              "text": "Representa el fin de un proceso.",
              "explanation": "Falso. El fin lo marca un círculo rojo.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN (PPT 4)",
          "question": "En BPMN, el símbolo para representar la comunicación entre participantes externos (ej. cliente y empresa) es:",
          "options": [
            {
              "text": "Flecha sólida (Flujo de Secuencia).",
              "explanation": "Falso. Esa conecta elementos en orden de ejecución dentro del mismo proceso.",
              "isCorrect": false
            },
            {
              "text": "Línea simple.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Flecha punteada con sobre (Flujo de Mensaje).",
              "explanation": "¡CORRECTA! Textual del PPT 4: \"Flujo de Mensaje: Flecha punteada con sobre. Representa comunicación entre participantes\".",
              "isCorrect": true
            },
            {
              "text": "Rectángulo punteado (Grupo).",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "BPMN (PPT 4)",
          "question": "¿Qué hace la herramienta \"Grupo\" (Rectángulo punteado) en BPMN?",
          "options": [
            {
              "text": "Termina el proceso por un error fatal.",
              "explanation": "Falso. Eso es el Evento de Fin de Error.",
              "isCorrect": false
            },
            {
              "text": "Agrupa elementos relacionados sin afectar el flujo.",
              "explanation": "¡CORRECTA! Textual del PPT 4: \"Grupo (Rectángulo punteado). Función: Agrupa elementos relacionados sin afectar el flujo\".",
              "isCorrect": true
            },
            {
              "text": "Detiene el diagrama por 24 horas.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Guarda datos en la base de datos de manera persistente.",
              "explanation": "Falso. Eso lo hace el Almacén de Datos (Cilindro).",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Mejora Continua y KPIs (PPT 6)",
          "question": "¿Qué significan las siglas del Ciclo PDCA en la mejora continua?",
          "options": [
            {
              "text": "Proceso, Desarrollo, Control, Análisis.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Planificar (Plan), Ejecutar (Do), Verificar (Check), Actuar (Act).",
              "explanation": "¡CORRECTA! Textual del PPT 6: \"Ciclo PDCA: Planificar -> Ejecutar -> Verificar -> Actuar\".",
              "isCorrect": true
            },
            {
              "text": "Programa, Diseñar, Codificar, Aplicar.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Probar, Documentar, Conectar, Adaptar.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Mejora Continua y KPIs (PPT 6)",
          "question": "Según los PPTs, ¿cuál de las siguientes es una DIFERENCIA CLAVE entre una Métrica y un KPI?",
          "options": [
            {
              "text": "La métrica siempre se mide en dólares y el KPI en porcentajes.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "No toda métrica es estratégica; el KPI sí lo es.",
              "explanation": "¡CORRECTA! Textual del PPT 6: \"Diferencia entre métrica y KPI: no toda métrica es estratégica. Ejemplo: número de llamadas (métrica) vs tiempo de respuesta (KPI)\".",
              "isCorrect": true
            },
            {
              "text": "El KPI se usa en Cascada y las métricas en Ágil.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Las métricas son exclusivas de finanzas.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Mejora Continua y KPIs (PPT 6)",
          "question": "¿Qué significa el acrónimo SMART para definir un buen KPI?",
          "options": [
            {
              "text": "Simple, Múltiple, Analítico, Rápido, Teórico.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Específico, Medible, Alcanzable, Relevante, Temporal.",
              "explanation": "¡CORRECTA! Textual del PPT 6: \"Características de un buen KPI (SMART): Específico, Medible, Alcanzable, Relevante, Temporal\".",
              "isCorrect": true
            },
            {
              "text": "Sistema, Medición, Actividad, Recursos, Tecnología.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Seguro, Mantenible, Ágil, Rentable, Trazable.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Scrum (PPT 6)",
          "question": "En Scrum, ¿cuál es el evento donde \"el equipo decide qué funcionalidades desarrollará en el próximo sprint\"?",
          "options": [
            {
              "text": "Daily Scrum.",
              "explanation": "Falso. Es una reunión diaria de 15 minutos para ajustar el trabajo.",
              "isCorrect": false
            },
            {
              "text": "Sprint Planning.",
              "explanation": "¡CORRECTA! Textual del PPT 6: \"Sprint Planning: El equipo decide qué funcionalidades desarrollará en el próximo sprint\".",
              "isCorrect": true
            },
            {
              "text": "Sprint Review.",
              "explanation": "Falso. En esta se muestra lo desarrollado al final del sprint.",
              "isCorrect": false
            },
            {
              "text": "Sprint Retrospective.",
              "explanation": "Falso. Esta es para reflexionar sobre cómo mejorar procesos.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Casos de Uso (PPT 7)",
          "question": "En la notación UML de Casos de Uso, la relación <<include>> significa que:",
          "options": [
            {
              "text": "Un caso de uso siempre invoca otro obligatoriamente.",
              "explanation": "¡CORRECTA! Textual del PPT 7: \"<<include>>: un caso de uso siempre invoca otro\".",
              "isCorrect": true
            },
            {
              "text": "Un caso de uso opcionalmente amplía otro.",
              "explanation": "Falso. Esa es la relación <<extend>>.",
              "isCorrect": false
            },
            {
              "text": "Hay comunicación externa con el cliente.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "El proceso ha llegado a un fin con error.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Casos de Uso (PPT 7)",
          "question": "¿Cuál es la diferencia entre los Casos de uso de Negocio y los de Sistema?",
          "options": [
            {
              "text": "Negocio es solo para gerentes; Sistema es solo para programadores.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Negocio usa óvalos; Sistema usa rectángulos.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Negocio se centra en las metas de la empresa; Sistema detalla interacciones técnicas.",
              "explanation": "¡CORRECTA! Textual del PPT 7: \"Casos de uso de negocio: Se centran en las metas de la empresa. Casos de uso de sistema: Detallan las interacciones técnicas de los usuarios\".",
              "isCorrect": true
            },
            {
              "text": "Negocio se hace en Cascada y Sistema se hace en Ágil.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Casos de Uso (PPT 7)",
          "question": "En UML de Casos de Uso, el \"Actor\" se dibuja como:",
          "options": [
            {
              "text": "Un cilindro de base de datos.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Un óvalo con un nombre.",
              "explanation": "Falso. El óvalo representa la funcionalidad (el caso de uso en sí).",
              "isCorrect": false
            },
            {
              "text": "Figura de persona (stickman).",
              "explanation": "¡CORRECTA! Textual del PPT 7: \"Actor: figura de persona (stickman)\".",
              "isCorrect": true
            },
            {
              "text": "Un rectángulo punteado.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Historias de Usuario (PPT 7)",
          "question": "¿Cuál es el formato estándar y textual enseñado en el PPT para una Historia de Usuario?",
          "options": [
            {
              "text": "\"Si [acción], entonces el sistema debe [reacción].\"",
              "explanation": "Falso. Eso es un escenario de prueba BDD.",
              "isCorrect": false
            },
            {
              "text": "\"Como [rol], quiero [funcionalidad] para [beneficio].\"",
              "explanation": "¡CORRECTA! Textual del PPT 7: Formato Clásico: COMO: [Rol], QUIERO: [Acción o funcionalidad], PARA: [Beneficio o valor].",
              "isCorrect": true
            },
            {
              "text": "\"El sistema deberá permitir [acción] usando [herramienta].\"",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "\"Yo quiero [funcionalidad] para que el [equipo de desarrollo] lo programe en [X tiempo].\"",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Historias de Usuario (PPT 7)",
          "question": "En el acrónimo INVEST para Historias de Usuario, la \"I\" y la \"V\" significan respectivamente:",
          "options": [
            {
              "text": "Inclusiva y Verificable.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Independiente y Valiosa.",
              "explanation": "¡CORRECTA! Textual del PPT 7: \"I: Independiente (no debe depender de otras historias). V: Valiosa (Debe aportar beneficio al cliente)\".",
              "isCorrect": true
            },
            {
              "text": "Iterativa y Visual.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Intuitiva y Validada.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Gestión de Proyectos (PPT 11)",
          "question": "Textualmente del PPT 11, la Gestión de Proyectos se define como la disciplina de:",
          "options": [
            {
              "text": "Programar código fuente en iteraciones cortas.",
              "explanation": "Falso. Eso es desarrollo de software ágil.",
              "isCorrect": false
            },
            {
              "text": "Identificar errores en la fase de Testing.",
              "explanation": "Falso. Eso es aseguramiento de calidad (QA).",
              "isCorrect": false
            },
            {
              "text": "Planificar, ejecutar y controlar tareas y recursos para alcanzar objetivos (SMART) dentro de un tiempo y presupuesto definidos.",
              "explanation": "¡CORRECTA! Textual del PPT 11: \"La gestión de proyectos es la disciplina de planificar, ejecutar y controlar tareas y recursos para alcanzar objetivos específicos (SMART) dentro de un tiempo y presupuesto definidos\".",
              "isCorrect": true
            },
            {
              "text": "Diseñar las bases de datos para un nuevo sistema.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Gestión de Proyectos (PPT 11)",
          "question": "Según las 5 Fases del Ciclo de Vida del Proyecto, ¿en qué fase se crea el \"Acta de Constitución\" (Project Charter)?",
          "options": [
            {
              "text": "En la Fase de Planificación.",
              "explanation": "Falso. La planificación define el cronograma y presupuesto (Gantt).",
              "isCorrect": false
            },
            {
              "text": "En la Fase de Ejecución.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "En la Fase de Inicio.",
              "explanation": "¡CORRECTA! Textual del PPT 11: \"Inicio: Se define el propósito... Se crea el Acta de Constitución (Project Charter)\".",
              "isCorrect": true
            },
            {
              "text": "En la Fase de Cierre.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Gestión de Proyectos (PPT 11)",
          "question": "Según el Ciclo de Vida del Proyecto, la Fase de Ejecución se caracteriza porque:",
          "options": [
            {
              "text": "Se define el propósito y la justificación.",
              "explanation": "Falso. Eso ocurre en el Inicio.",
              "isCorrect": false
            },
            {
              "text": "Se elabora la Carta Gantt y el presupuesto.",
              "explanation": "Falso. Eso es en Planificación.",
              "isCorrect": false
            },
            {
              "text": "Se documentan las lecciones aprendidas.",
              "explanation": "Falso. Eso es en el Cierre.",
              "isCorrect": false
            },
            {
              "text": "El equipo realiza las tareas asignadas para crear los entregables y es donde se consume la mayor cantidad de recursos.",
              "explanation": "¡CORRECTA! Textual del PPT 11: \"Ejecución: El equipo realiza las tareas asignadas para crear los entregables. Es la fase donde se consume la mayor cantidad de recursos\".",
              "isCorrect": true
            }
          ]
        },
        {
          "topic": "Análisis FODA (PPT 11)",
          "question": "Dentro del FODA, ¿a qué categoría corresponden las Variables Internas?",
          "options": [
            {
              "text": "A las Oportunidades y Amenazas.",
              "explanation": "Falso. Esas son Variables Externas.",
              "isCorrect": false
            },
            {
              "text": "A las Fortalezas y Debilidades.",
              "explanation": "¡CORRECTA! Textual del PPT 11: \"Variables internas: Fortalezas (positivas) y Debilidades (negativas)\".",
              "isCorrect": true
            },
            {
              "text": "A las Oportunidades y Debilidades.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Al CAME.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Análisis CAME (PPT 11)",
          "question": "El análisis CAME es el paso siguiente al FODA. Según el acrónimo enseñado, ¿qué significan sus siglas?",
          "options": [
            {
              "text": "Controlar, Analizar, Mejorar, Ejecutar.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Corregir, Afrontar, Mantener, Explotar.",
              "explanation": "¡CORRECTA! Textual del PPT 11: \"Corregir (debilidades), Afrontar (amenazas), Mantener (fortalezas), Explotar (oportunidades)\".",
              "isCorrect": true
            },
            {
              "text": "Cuestionar, Anticipar, Minimizar, Expandir.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Crear, Adaptar, Modificar, Evaluar.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Análisis FODA/CAME (PPT 11)",
          "question": "Al cruzar las variables en la matriz para diseñar estrategias, la Estrategia \"DO\" consiste en:",
          "options": [
            {
              "text": "Minimizar debilidades y evitar amenazas.",
              "explanation": "Falso. Esa es la Estrategia DA (Debilidades - Amenazas).",
              "isCorrect": false
            },
            {
              "text": "Usar fortalezas para enfrentar amenazas.",
              "explanation": "Falso. Esa es la Estrategia FA (Fortalezas - Amenazas).",
              "isCorrect": false
            },
            {
              "text": "Superar debilidades aprovechando oportunidades.",
              "explanation": "¡CORRECTA! Textual del PPT 11: \"DO: Superar debilidades aprovechando oportunidades\".",
              "isCorrect": true
            },
            {
              "text": "Usar fortalezas para aprovechar oportunidades.",
              "explanation": "Falso. Esa es la Estrategia FO.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Roles Scrum (PPT 2 y 3)",
          "question": "¿Qué nombre recibe el Stakeholder que \"Asegura que el equipo siga las prácticas ágiles y elimina impedimentos\"?",
          "options": [
            {
              "text": "Product Owner.",
              "explanation": "Falso. El PO prioriza el backlog y actúa como enlace principal.",
              "isCorrect": false
            },
            {
              "text": "Gerente de Proyecto.",
              "explanation": "Falso.",
              "isCorrect": false
            },
            {
              "text": "Scrum Master.",
              "explanation": "¡CORRECTA! Textual del PPT 3: \"Scrum Master: Asegura que el equipo siga las prácticas ágiles y elimina impedimentos\".",
              "isCorrect": true
            },
            {
              "text": "Equipo de Desarrollo.",
              "explanation": "Falso. Ellos son los profesionales que realizan el trabajo técnico.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Roles Scrum (PPT 2 y 3)",
          "question": "¿Qué nombre recibe el Stakeholder que \"Define las funcionalidades del software, prioriza el backlog y actúa como enlace principal entre usuarios y equipo técnico\"?",
          "options": [
            {
              "text": "Patrocinador del Proyecto.",
              "explanation": "Falso. El patrocinador pone el dinero y dirección estratégica.",
              "isCorrect": false
            },
            {
              "text": "Gerente de Proyecto (Project Manager).",
              "explanation": "Falso. El PM planifica, gestiona riesgos y plazos.",
              "isCorrect": false
            },
            {
              "text": "Product Owner.",
              "explanation": "¡CORRECTA! Textual del PPT 3: \"Product Owner: Define las funcionalidades, prioriza el backlog y actúa como enlace\".",
              "isCorrect": true
            },
            {
              "text": "Scrum Master.",
              "explanation": "Falso.",
              "isCorrect": false
            }
          ]
        },
        {
          "topic": "Gestión de Riesgos (PPT 11)",
          "question": "¿Qué es el \"Análisis Cuantitativo\" de riesgos?",
          "options": [
            {
              "text": "La clasificación rápida como \"Alto\", \"Medio\" o \"Bajo\".",
              "explanation": "Falso. Eso es Análisis Cualitativo.",
              "isCorrect": false
            },
            {
              "text": "El uso de datos numéricos para proyectar costos o retrasos específicos.",
              "explanation": "¡CORRECTA! Textual del PPT 11: \"Cuantitativo: Uso de datos numéricos para proyectar costos o retrasos específicos\".",
              "isCorrect": true
            },
            {
              "text": "La lluvia de ideas con expertos.",
              "explanation": "Falso. Eso es parte de la \"Identificación\".",
              "isCorrect": false
            },
            {
              "text": "La definición de las acciones a tomar si ocurre el riesgo.",
              "explanation": "Falso. Eso es \"Planificación de Respuesta\".",
              "isCorrect": false
            }
          ]
        }
      ]
    }
  },
  "guides": {
    "guide1": {
      "title": "Guía 1: Teoría Básica",
      "temas": [
        {
          "titulo": "📚 TEMA: REQUERIMIENTOS Y ESTRUCTURA",
          "lineas": [
            "🔸 Definición Mística: Un 'Sistema' es más que código y servidores. Es un conjunto de hardware, software, personas, procedimientos y datos.",
            "   👉 [Tip de Profe]: Piensa que sin las PERSONAS que lo operan o los PROCEDIMIENTOS (reglas de la empresa), el código solo es texto muerto.",
            "🔸 ¿Para qué hacemos Requerimientos?: Su propósito central es comunicar de manera *precisa* qué se espera del sistema entre el cliente, usuarios y desarrolladores.",
            "🔸 Las Fases: Sus 4 fases son Obtención, Análisis, Especificación y Validación. Ojo con la trampa de siempre: ¡La 'Programación / Implementación' NO es una fase de los requerimientos!",
            "🔸 Riesgo Inminente: Si defines mal esto al inicio, en etapas avanzadas se generarán altísimos costos adicionales por cambios tardíos.",
            "   👉 [Ejemplo Práctico]: Es como construir una casa. Si no dices que quieres 3 baños al principio (requerimiento), instalar cañerías cuando la casa ya está construida te costará una fortuna.",
            "🔸 Funcional vs No Funcional: Si te dicen 'El sistema debe responder en menos de 2 segundos', eso NO describe qué hace, sino CÓMO o BAJO QUÉ CONDICIONES lo hace: Requerimiento No Funcional.",
            "\n————————————————————————————————————————————————————————————",
            "📖 GLOSARIO DE TÉRMINOS Y SIGLAS:",
            "   📌 UI: User Interface (Interfaz de Usuario). Habitualmente referida en requerimientos visuales.",
            "   📌 QA: Quality Assurance (Aseguramiento de Calidad / Pruebas de software)."
          ],
          "pregunta": {
            "texto": "¿Cuál es el propósito principal de los requerimientos de software?",
            "opciones": [
              {
                "letra": "A",
                "texto": "Definir la arquitectura técnica interna del sistema computacional.",
                "isCorrect": false,
                "explicacion": "Falso. Entrar al diseño de la arquitectura sucede mucho más adelante, no en la fase germinal de requisitos."
              },
              {
                "letra": "B",
                "texto": "Comunicar de manera precisa qué se espera del sistema entre cliente, usuarios y desarrolladores.",
                "isCorrect": true,
                "explicacion": "¡CORRECTA! El objetivo base es lograr un entendimiento mutuo formal de QUÉ debe hacerse."
              },
              {
                "letra": "C",
                "texto": "Especificar exclusivamente el lenguaje de programación y la base de datos a utilizar.",
                "isCorrect": false,
                "explicacion": "Falso. Proponer usar \"Python\" o \"SQL\" es trabajo técnico de implementación, los requerimientos no entran ahí."
              },
              {
                "letra": "D",
                "texto": "Establecer el diseño gráfico, los colores y la navegabilidad de la interfaz.",
                "isCorrect": false,
                "explicacion": "Falso. La interfaz y las paletas de colores pertenecen al trabajo estético de diseño gráfico formal."
              }
            ]
          }
        },
        {
          "titulo": "📚 TEMA: STAKEHOLDERS (PARTES INTERESADAS)",
          "lineas": [
            "🔸 Requerimientos Funcionales: Estos describen *qué* hace el sistema (acciones, servicios, funciones visibles para el usuario). Ej: 'El sistema debe enviar un correo electrónico'.",
            "🔸 Problemática Social: Un sistema de salud pública o educación inclusiva ataca una problemática netamente 'Social'.",
            "🔸 El Product Owner: Quien define las funcionalidades del software y prioriza lo que se debe hacer. Es vital como enlace principal, la voz del cliente.",
            "   👉 [Tip de Profe]: Imagínatelo como el director de la orquesta, si él no dice qué tocar y cuándo, los programadores (ni el Project Manager) sabrán qué es lo importante.",
            "🔸 El Patrocinador del Proyecto: Proporciona financiación, recursos y dirección estratégica.",
            "   👉 [Ejemplo Práctico]: Es el inversionista millonario de la película. No sabe echar código, pero sin su plata no hay proyecto.",
            "🔸 Entidades Regulatorias: No desarrollan código, no te lo pagan, pero dictan estándares éticos y obligatorios (como cumplir la ley de datos).",
            "\n————————————————————————————————————————————————————————————",
            "📖 GLOSARIO DE ROLES Y SIGLAS:",
            "   📌 PO: Product Owner (Dueño del Producto). El representante del corporativo y la voz del negocio en metodologías ágiles Scrum.",
            "   📌 PM: Project Manager (Gerente del Proyecto). El jefe que vela por los recursos y control de riesgos y tiempo.",
            "   📌 Stakeholder: Literal en español significa Parte Interesada (Cualquier individuo/grupo impactado por el sistema)."
          ],
          "pregunta": {
            "texto": "En un proyecto, ¿qué rol \"define las funcionalidades del software, prioriza el backlog y actúa como enlace principal\"?",
            "opciones": [
              {
                "letra": "A",
                "texto": "Patrocinador del Proyecto (Sponsor)",
                "isCorrect": false,
                "explicacion": "Falso. El Patrocinador da la plata, él no define la lista de los botones que el software va a tener en su menú."
              },
              {
                "letra": "B",
                "texto": "Gerente de Proyecto (Project Manager)",
                "isCorrect": false,
                "explicacion": "Falso. El Gerente maneja el calendario y al equipo. Él no es dueño analítico del \"Negocio o Producto\"."
              },
              {
                "letra": "C",
                "texto": "Dueño del Producto (Product Owner)",
                "isCorrect": true,
                "explicacion": "¡CORRECTA! El PO lidera la lista de requerimientos (Backlog) actuando como la Mente Maestra centralizada del cliente."
              },
              {
                "letra": "D",
                "texto": "Analista de Sistemas",
                "isCorrect": false,
                "explicacion": "Falso. El Analista disecciona sistemas en pedacitos pero es un intermediario que asiste y acata al dueño (Product Owner)."
              }
            ]
          }
        },
        {
          "titulo": "📚 TEMA: MODELADO BPMN",
          "lineas": [
            "🔸 ¿Qué es BPMN?: Es un lenguaje *gráfico estandarizado* para modelar/representar procesos de negocio en diagramas de flujo.",
            "🔸 Diagramas de colaboración: Si tu diagrama muestra interacciones entre dos participantes (empresa vs cliente), estamos hablando de un diagrama de colaboración.",
            "🔸 [ SIMBOLOGÍA QUE ENTRARÁ SÍ O SÍ EN LA PRUEBA ]:",
            "   👉 El Círculo Verde (fino): Es el 'Evento de Inicio', marca dónde comienza el proceso.",
            "   👉 El Rombo (Compuerta): Controla el flujo. Parte el camino en dos según decisiones lógicas (¿Pagó? Sí -> Enviar / No -> Bloquear).",
            "   👉 El Cilindro: Siempre representa almacenamiento de información persistente (Bases de Datos).",
            "   👉 Flecha punteada con un sobre (Flujo de Mensaje): Representa comunicación e intercambio entre participantes distintos.",
            "\n————————————————————————————————————————————————————————————",
            "📖 GLOSARIO DE MODELADO Y SIGLAS:",
            "   📌 BPMN: Business Process Model and Notation (Modelo y Notación de Procesos de Negocio). Es por definición un lenguaje visual gráfico mundial.",
            "   📌 DB / BD: Data Base / Base de Datos. Gráficamente asociado en todo los lenguajes a un Cilindro Tridimensional."
          ],
          "pregunta": {
            "texto": "En BPMN, el círculo verde con un borde fino tiene como función:",
            "opciones": [
              {
                "letra": "A",
                "texto": "Aprobar una decisión para poder iterar una tarea repetitiva.",
                "isCorrect": false,
                "explicacion": "Falso. Dividir lógica la hace el rombo amarrilo (Gateway). Y un loop (repetitivo) lleva una flecha circular anexa."
              },
              {
                "letra": "B",
                "texto": "Marcar el comienzo (Evento de Inicio) del proceso.",
                "isCorrect": true,
                "explicacion": "¡CORRECTA! Círculo de línea delgada es START. Círculo de línea gruesa es STOP (Fin)."
              },
              {
                "letra": "C",
                "texto": "Representar un mensaje obligatorio de un participante externo.",
                "isCorrect": false,
                "explicacion": "Falso. Un mensaje o carta lleva un gatillador Start modificado con un icono de sobre de correo."
              },
              {
                "letra": "D",
                "texto": "Iniciar de inmediato la creación de una base de datos.",
                "isCorrect": false,
                "explicacion": "Falso. Las base de datos se plasman gráficamente usando el típico Cilindro tridimensional."
              }
            ]
          }
        },
        {
          "titulo": "📚 TEMA: AGILE Y MEJORA CONTINUA",
          "lineas": [
            "🔸 Ciclo PDCA: Apréndete el orden: Planificar → Ejecutar → Verificar → Actuar.",
            "   👉 [Ejemplo Práctico]: Planeas un pastel (Planificar), lo cocinas (Ejecutar), lo pruebas y ves que le falta azúcar (Verificar), modificas tu receta (Actuar).",
            "🔸 Programación e Integración: En metodologías XP, si probamos e integramos código muchas veces al día, aplicamos 'Integración continua'.",
            "🔸 KPIs Medibles: Un KPI 'Medible' significa estrictamente que logras cuantificarlo objetivamente: en números concretos o porcentajes.",
            "🔸 Diferencia Métrica vs KPI: Toda métrica NO es estratégica. Puedes medir el nivel de café consumido (métrica), pero no define el negocio. El KPI sí es el indicador *CLAVE* de éxito.",
            "🔸 El margen de ganancia o el ROI son clásicos KPIs de naturaleza Financiera.",
            "\n————————————————————————————————————————————————————————————",
            "📖 GLOSARIO ÁGIL Y FINANCIERO:",
            "   📌 PDCA: Plan, Do, Check, Act (Planificar, Ejecutar, Verificar, Actuar). Acrónimo clásico de Edwards Deming.",
            "   📌 XP: Extreme Programming (Programación Extrema). Metodología ágil parecida a Scrum, pero enfocada 100% agresivamente a la escritura de código iterativa.",
            "   📌 KPI: Key Performance Indicator (Indicador Clave de Rendimiento). Un indicador macro que decide si la empresa gana o pierde la competencia.",
            "   📌 ROI: Return On Investment (Retorno de Inversión). El margen entre lo que inviertes en software vs la ganancia que esto te produce."
          ],
          "pregunta": {
            "texto": "Según se explica en las clases, ¿cuál es la diferencia clave entre una métrica y un KPI?",
            "opciones": [
              {
                "letra": "A",
                "texto": "Las métricas solo aplican a infraestructura TI y los KPIs a las gerencias.",
                "isCorrect": false,
                "explicacion": "Falso. Invento teórico. Puedes medir cuántos almuerzos comen las gerencias y será solo una métrica estúpida pero sin impacto TI."
              },
              {
                "letra": "B",
                "texto": "Los KPIs evalúan aspectos abstractos cualitativos mientras las métricas evalúan bases de datos.",
                "isCorrect": false,
                "explicacion": "Falso. ¡Error inmenso! Tanto una métrica como un KPI son inamoviblemente numéricos y cuantitativos/estadísticos."
              },
              {
                "letra": "C",
                "texto": "Toda métrica es estratégica en el negocio, independientemente del contexto.",
                "isCorrect": false,
                "explicacion": "Falso. Totalmente incorrecto. \"Métrica = Pasos que das hacia la puerta\" es inútil para invertir corporativamente."
              },
              {
                "letra": "D",
                "texto": "Toda métrica NO es estratégica; el KPI es un tipo de métrica CLAVE que sí mide el éxito del negocio.",
                "isCorrect": true,
                "explicacion": "¡CORRECTA! KPI presupone literalmente e imperativamente la palabra (Key = Clave/Vital). Es de vida o muerte para los accionistas."
              }
            ]
          }
        },
        {
          "titulo": "📚 TEMA: CASOS DE USO E HISTORIAS DE USUARIO",
          "lineas": [
            "🔸 ¿Qué es un Caso de Uso?: Es una técnica de modelado que te describe *paso a paso* cómo un usuario interactúa con un sistema para alcanzar un fin valioso.",
            "🔸 Relación <<include>>: En diagrama UML, si un caso básico se relaciona con otro mediante <<include>>, invoca OBLIGATORIAMENTE al otro. (Ej: 'Pagar Carrito' invoca 'Validar Tarjeta').",
            "🔸 Casos de uso de sistema: Son los que detallan las interacciones técnicas concretas y respuestas de interfaces con piezas del sistema.",
            "🔸 Historia de Usuario: 'Como [Rol], quiero [funcionalidad] para...'. Termina siempre explicando el Beneficio, valor organizacional o meta que se busca obtener.",
            "🔸 INVEST: La letra 'E' significa que la historia debe ser 'Estimable' (saber cuánto esfuerzo tomará).",
            "\n————————————————————————————————————————————————————————————",
            "📖 GLOSARIO DE HISTORIAS DE USUARIO Y MODELADO:",
            "   📌 UML: Unified Modeling Language (Lenguaje Unificado de Modelado). Sirve para usar los diagramas del famoso 'Caso de Uso'.",
            "   📌 CU / UC: Caso de Uso / Use Case.",
            "   📌 INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable. Son las 6 obligaciones que debe cumplir toda Historia de Usuario para considerarse de buena calidad."
          ],
          "pregunta": {
            "texto": "¿Qué es un Caso de Uso?",
            "opciones": [
              {
                "letra": "A",
                "texto": "Una representación visual del flujo de datos interno entre los servidores del sistema.",
                "isCorrect": false,
                "explicacion": "Falso. Flujo de red pura es muy TI/Arquitectura; el CU humaniza las interacciones que un cajero o actor físico sufre con el sistema."
              },
              {
                "letra": "B",
                "texto": "Un registro minucioso de todas las clases y métodos utilizados en lenguaje Java.",
                "isCorrect": false,
                "explicacion": "Falso. De nuevo, es abstracción orientada al actor vivo de negocios, no al programador backend que invoca lenguajes de Java."
              },
              {
                "letra": "C",
                "texto": "Una técnica de modelado que describe, paso a paso, cómo un usuario interactúa con un sistema para alcanzar un fin.",
                "isCorrect": true,
                "explicacion": "¡CORRECTA! Resume las respuestas e interacciones para llegar a una meta final deseada."
              },
              {
                "letra": "D",
                "texto": "Un documento legal de cumplimiento para ser presentado a reguladores externos.",
                "isCorrect": false,
                "explicacion": "Falso. Un caso de uso es meramente diagramático interno, llevarle burbujas dibujadas a un fiscal legal en tribunales no tiene alcance."
              }
            ]
          }
        },
        {
          "titulo": "📚 TEMA: GESTIÓN DE PROYECTO Y FODA",
          "lineas": [
            "🔸 El Acta de Constitución: Ocurre en la fase de 'Inicio' (la que aprueba y justifica todo).",
            "🔸 Riesgos Cualitativos: Clasificas tus riesgos usando palabras o etiquetas como 'Alto', 'Medio', o 'Bajo' (No números reales financieros, por eso es cualitativo).",
            "🔸 Estrategias en FODA: 'FA' significa utilizar explícitamente y enfocar tus (F)ortalezas internas para poder enfrentar las (A)menazas externas.",
            "🔸 El paso siguiente del FODA: El análisis 'CAME'. Es recomendado para aterrizarlos a nivel estratégico en acciones concretas (Corregir, Afrontar, Mantener, Explotar).",
            "\n————————————————————————————————————————————————————————————",
            "📖 GLOSARIO GENERAL Y EJECUTIVO:",
            "   📌 Charter: Nombre oficial en inglés del 'Acta de Constitución' del Proyecto (Fase de Inicio).",
            "   📌 FODA / SWOT: Fortalezas, Oportunidades, Debilidades, Amenazas. (Fotografía estática temporal del entorno de la organización que permite diagnosticar).",
            "   📌 CAME: Corregir (Debilidades), Afrontar (Amenazas), Mantener (Fortalezas), Explotar (Oportunidades)."
          ],
          "pregunta": {
            "texto": "Una vez documentado el listado FODA, ¿qué técnica se recomienda usar como \"paso siguiente\" para aterrizarlos en acciones concretas y ejecutables?",
            "opciones": [
              {
                "letra": "A",
                "texto": "Documentar los requerimientos No Funcionales del proyecto.",
                "isCorrect": false,
                "explicacion": "Falso. Eso recae sobre el levantamiento informático con el cliente, no entra en el marco estricto del planeamiento corporativo comercial inmediato."
              },
              {
                "letra": "B",
                "texto": "Diagramación general BPMN enfocada en Riesgos.",
                "isCorrect": false,
                "explicacion": "Falso. Aunque en etapas lejanas modeles flujos con riesgos anexos, no es la \"consecuencia\" formal corporativa de hacer el 4-cuadrante FODA."
              },
              {
                "letra": "C",
                "texto": "Análisis CAME (Corregir, Afrontar, Mantener y Explotar).",
                "isCorrect": true,
                "explicacion": "¡CORRECTA! Luego de mapearlos mentalmente (FODA), toca ejercerlos pasionalmente accionando con verbos directos C.A.M.E"
              },
              {
                "letra": "D",
                "texto": "Empleo de diagramas relacionales UML <<include>>",
                "isCorrect": false,
                "explicacion": "Falso. UML es puro desarrollo de software y no pinta absolutamente en la fase administrativa de Gerencia de Matriz corporativa."
              }
            ]
          }
        }
      ]
    },
    "guide2": {
      "title": "Guía 2: Escenarios Prácticos",
      "temas": [
        {
          "titulo": "📚 TEMA: REQUERIMIENTOS Y CONFLICTOS",
          "lineas": [
            "🔸 Ambigüedad Letal: Si un requisito dice 'El sistema no debe frustrar al usuario', es basura técnica. Todo requerimiento DEBE ser medible (ej: 'cargar en 2 seg').",
            "   👉 [Tip de Profe]: Lo que no se puede probar (testear) o medir en QA, no existe en la ingeniería.",
            "🔸 La Ley Manda: Si Seguridad / Legal / Gobierno te exige usar un cifrado o regla específica, ellos APLASTAN cualquier requerimiento de Marketing.",
            "🔸 Restricciones Tecnológicas: Si el jefe te obliga a integrarte con una base de datos antiquísima que él ya pagó, eso no es un requerimiento funcional. Es una 'Restricción Tecnológica' dura y No Funcional.",
            "\\n————————————————————————————————————————————————————————————",
            "📖 REGLA DE ORO:",
            "   📌 Todo lo que te límite usar ciertas tecnologías, servidores, o pasarelas ya existentes es un RNF de Integración."
          ],
          "pregunta": {
            "texto": "[ESCENARIO] \"El sistema debe integrarse obligatoriamente con el motor de pago Transbank existente de la empresa\". Esto clasifica como:",
            "opciones": [
              {
                "letra": "A",
                "texto": "Requerimiento Funcional de Cobro.",
                "isCorrect": false,
                "explicacion": "Falso. El \"Cobro\" genérico es la función. \"Transbank obligatoriamente porque ya está pagado\" es una cadena que te limita la arquitectura técnica."
              },
              {
                "letra": "B",
                "texto": "Regla de Negocio sobre descuentos.",
                "isCorrect": false,
                "explicacion": "Falso. Las pasarelas de pago son infraestructuras, no reglas lógicas de descuento porcentual."
              },
              {
                "letra": "C",
                "texto": "Una Restricción Tecnológica / Requerimiento No Funcional de integración.",
                "isCorrect": true,
                "explicacion": "¡CORRECTA! Siempre que te corten las alas de programador y te impongan software legacy o de la empresa, es una Restricción de Arquitectura (RNF)."
              },
              {
                "letra": "D",
                "texto": "Criterio de aceptación estético de la interfaz de pago.",
                "isCorrect": false,
                "explicacion": "Falso. Es 100% backend e infraestructura corporativa."
              }
            ]
          }
        },
        {
          "titulo": "📚 TEMA: LA BATALLA DEL PRODUCT OWNER",
          "lineas": [
            "🔸 El Protector: El Scrum Master no escribe código. Su tarea es ser un escudo. Si el Gerente entra gritando pidiendo cambios a mitad del Sprint, el SM lo detiene.",
            "🔸 El ROI (Retorno sobre Inversión): Como Product Owner, siempre, pero SIEMPRE, priorizas lo que da más dinero o valor rápido en relación al esfuerzo. Los Quick Wins.",
            "   👉 [Ejemplo Práctico]: Un filtro que cuesta 1 día y te da $1,000 va muchísimo antes que un rediseño que cuesta 1 mes y da $1,200.",
            "🔸 Refinamiento (Refinement): La reunión vital donde tú (el PO) le sacas brillo, cortas y aclaras las historias para dejarlas listas antes de que el equipo comience a trabajar.",
            "\\n————————————————————————————————————————————————————————————",
            "📖 GLOSARIO DE GUERRA:",
            "   📌 Sprint: La iteración ininterrumpible y sagrada donde el equipo desarrolla (1 a 4 semanas).",
            "   📌 Quick Win: Victoria rápida. Alto valor comercial con bajísimo esfuerzo de programación."
          ],
          "pregunta": {
            "texto": "[ESCENARIO] El Gerente General llega furioso a mitad de un \"Sprint\" y exige que dejen todo para agregar un botón urgente. ¿Qué debes hacer como Scrum Master?",
            "opciones": [
              {
                "letra": "A",
                "texto": "Obligar a los programadores a incluir el botón trabajando horas extra.",
                "isCorrect": false,
                "explicacion": "Falso. Eso rompe la motivación y el ritmo sostenible dictado por el Manifiesto Ágil."
              },
              {
                "letra": "B",
                "texto": "Aceptar el cambio porque el Gerente General tiene la última palabra sobre el código.",
                "isCorrect": false,
                "explicacion": "Falso. En Scrum puro el Sprint Scope es sagrado; el jefe máximo deberá esperar a que termine."
              },
              {
                "letra": "C",
                "texto": "Proteger al equipo, bloquear la interrupción, y derivar al Gerente a hablar con el Product Owner para el próximo Sprint.",
                "isCorrect": true,
                "explicacion": "¡CORRECTA! El SM es un guardián y un facilitador. El PO es el único que puede negociar con el Gerente General los dólares futuros."
              },
              {
                "letra": "D",
                "texto": "Cancelar el Sprint inmediatamente y borrar el código.",
                "isCorrect": false,
                "explicacion": "Falso. Hacer eso por un capricho es quemar dinero de la empresa de forma irracional."
              }
            ]
          }
        },
        {
          "titulo": "📚 TEMA: MODELADO BPMN: TRAMPAS VISUALES",
          "lineas": [
            "🔸 Cuidado con la Flecha: NUNCA cruces una flecha sólida (negra) entre dos piscinas (Pools) distintas. ¡Falta eliminatoria! Entre empresas diferentes sólo viajan Mensajes (Flecha punteada con sobre).",
            "🔸 La Compuerta Paralela (+): Cuando dos o más departamentos (Ej: Legal y Riesgos) deben trabajar AL MISMO TIEMPO y ambas acciones son obligatorias simultáneas.",
            "🔸 El Subproceso [+]: Esa cajita con un [+] abajo sirve para ocultar basura. Esconder 20 pasos de una 'Cocina' en una sola tarea limpia, para que tu jefe no se maree leyendo.",
            "🔸 Eventos de Tiempo: Un reloj de arena en el circulito detiene todo el flujo hasta que pase un tiempo X (ej: 'Esperar a fin de mes').",
            "\\n————————————————————————————————————————————————————————————",
            "📖 TRAMPA MORTAL DE PRUEBA:",
            "   📌 Compuerta Exclusiva (X o Vacía) = Te vas por un tubo O por el otro, excluyentemente.",
            "   📌 Compuerta Paralela (+) = Te vas por los dos tubos OBLIGATORIAMENTE Y A LA VEZ."
          ],
          "pregunta": {
            "texto": "[ESCENARIO BPMN] El cliente solicita un préstamo. Al mismo tiempo y obligatoriamente en paralelo, Legal revisa penales y Riesgos revisa el Dicom. ¿Qué figura BPMN usas para dividir el flujo en estos dos caminos?",
            "opciones": [
              {
                "letra": "A",
                "texto": "Compuerta Exclusiva (Gateway con una \"X\")",
                "isCorrect": false,
                "explicacion": "Falso. Con la X evaluarías a Legal O a Riesgos, pero no a los dos. Y te pedían hacer ambas simultáneas."
              },
              {
                "letra": "B",
                "texto": "Compuerta Paralela (Gateway con un símbolo de \"+\")",
                "isCorrect": true,
                "explicacion": "¡CORRECTA! El \"+\" fuerza a que los \"hilos de trabajo\" se dividan y ambos departamentos empiecen a transpirar a la vez."
              },
              {
                "letra": "C",
                "texto": "Compuerta Inclusiva (Gateway con una \"O\" redonda interior)",
                "isCorrect": false,
                "explicacion": "Falso. Esa compuerta evalúa y podría dejar a Riesgos afuera. La Paralela NO perdona a nadie, todos trabajan."
              },
              {
                "letra": "D",
                "texto": "Un Evento Intermedio de Temporizador Múltiple.",
                "isCorrect": false,
                "explicacion": "Falso. El reloj temporizador se usa para pausas temporales, no bifurcaciones."
              }
            ]
          }
        },
        {
          "titulo": "📚 TEMA: BUSINESS MODEL CANVAS AVANZADO",
          "lineas": [
            "🔸 Pivote Violento: Netflix de DVD's físicos a Streaming. ¿Qué cambió? ¡Los Canales (ahora internet) y su Estructura de Costos (ahora pagan Amazon AWS)!.",
            "   👉 [Tip de Profe]: El Modelo de Ingresos suele ser el mismo (suscripción mensual), pero cómo te entregan el valor (Canal) explota y cambia.",
            "🔸 Canales vs Relación: El Canal es el MEDIO físico o digital (Aplicación, Tienda Física, Delivery). La Relación es CÓMO te trato por ese medio (Premium, Auto-servicio, Comunidad amigable).",
            "🔸 Cuidado: Poner 'Inteligencia Artificial' en el bloque de Socios Clave es un error si lo desarrollas internamente. Socios son proveedores TERCEROS indispensables (ej: OpenAI).",
            "\\n————————————————————————————————————————————————————————————",
            "📖 CONSEJO ESTRATÉGICO:",
            "   📌 Siempre pregúntate: ¿Esto es lo QUE hago (Propuesta), a QUIÉN se lo doy (Segmento) o CÓMO lo entrego (Canal)?"
          ],
          "pregunta": {
            "texto": "[CANVAS] Netflix empezó mandando DVDs por correo. Hoy es 100% Streaming Digital mundial. ¿Qué bloque del BMC sufrió el \"pivote\" (cambio) distribucional más drástico?",
            "opciones": [
              {
                "letra": "A",
                "texto": "Relación con los Clientes (Customer Relationships)",
                "isCorrect": false,
                "explicacion": "Falso. Sigue siendo Auto-Servicio. Ellos no te llamaban antes para saludarte y tampoco lo hacen ahora."
              },
              {
                "letra": "B",
                "texto": "Canales (Channels) y Estructura de Costos",
                "isCorrect": true,
                "explicacion": "¡CORRECTA! Netflix cambió completamente el \"Tubo\" de distribución (de FedEx a Internet de Fibra). Y sus costos pasaron de CDs de plástico a Granjas de Servidores brutales."
              },
              {
                "letra": "C",
                "texto": "Segmento de Clientes (Customer Segments)",
                "isCorrect": false,
                "explicacion": "Falso. Sigue apuntando al mismo nicho: Gente cómoda que quiere entretenimiento en el sillón de su casa."
              },
              {
                "letra": "D",
                "texto": "Únicamente el Flujo de Ingresos (Revenue Streams)",
                "isCorrect": false,
                "explicacion": "Falso. El Revenue (forma de ganar plata) se mantuvo casi intacto: te cobraban una suscripción plana al mes."
              }
            ]
          }
        },
        {
          "titulo": "📚 TEMA: FODA Y CAME EXTREMO",
          "lineas": [
            "🔸 Afrontar o Mitigar: Si hay una Amenaza externa brutal (Ej: Leyes anticontaminación), usas CAME para AFRONTAR. Y en gestión de riesgos, a esto se le llama 'Mitigación de Riesgos'.",
            "🔸 Explotar la Oportunidad: Cuando ves una mina de oro en el FODA (Oportunidad externa), aplicas la letra E del CAME: ¡Explotas obsesivamente invirtiendo para capturarla antes que el enemigo!",
            "🔸 Mantener la Fortaleza: Si tienes programadores nivel Senior increíbles (Fortaleza), los 'Mantienes' felices con bonos para no perder esa superioridad dura.",
            "   👉 [Tip de Profe]: La técnica 'DA' (Debilidad vs Amenaza) es la de SUPERVIVENCIA. Cuando todo arde y estás endeudado, solo tratas de sobrevivir al huracán reduciéndote.",
            "\\n————————————————————————————————————————————————————————————",
            "📖 RESUMEN EJECUTIVO:",
            "   📌 C.A.M.E: Corregir (Debilidades), Afrontar (Amenazas), Mantener (Fortalezas), Explotar (Oportunidades)."
          ],
          "pregunta": {
            "texto": "[ESCENARIO CAME] En tu FODA encontraste esta (O) Oportunidad: \"Boom mundial del teletrabajo\". Para aplicar la \"E\" (Explotar) del modelo CAME, tú debes:",
            "opciones": [
              {
                "letra": "A",
                "texto": "Afrontar pacíficamente que el trabajo remoto es solo temporal.",
                "isCorrect": false,
                "explicacion": "Falso. Rendirse y pasividad no existe en la E de Explotar las Oportunidades. Además mezclaste (A)frontar."
              },
              {
                "letra": "B",
                "texto": "Corregir la política interna de la empresa para prohibir VPN entre empleados del sindicato.",
                "isCorrect": false,
                "explicacion": "Falso. (C)orregir ataca tus Debilidades internas, y aquí estamos lidiando con oportunidades jugosas."
              },
              {
                "letra": "C",
                "texto": "Lanzar inmediatamente una campaña de ventas agresiva y subir tus servidores para capturar obsesivamente ese nuevo flujo antes que tus rivales.",
                "isCorrect": true,
                "explicacion": "¡CORRECTA! Oportunidad = Ataque. Pones plata de inversión para dominar el nicho vacante rápidamente."
              },
              {
                "letra": "D",
                "texto": "Mantener tu catálogo de productos intacto sin realizar innovaciones.",
                "isCorrect": false,
                "explicacion": "Falso. Las innovaciones se deben ejecutar. Mantener intacto y sin tocar aplica solo a tus Fortalezas internas maduras."
              }
            ]
          }
        }
      ]
    },
    "guide3": {
      "title": "Guía 3: Definiciones PPT",
      "temas": [
        {
          "titulo": "📚 TEMA: REQUERIMIENTOS Y ROLES SCRUM (PPT 2 y 3)",
          "lineas": [
            "🔸 Obtención (Elicitación): Se recopila información de los usuarios y clientes mediante entrevistas, encuestas, observación, etc.",
            "🔸 Requerimientos funcionales: Describen QUÉ debe hacer el sistema (acciones, servicios o funciones visibles). Ejemplo: 'El sistema debe permitir registrar usuarios'.",
            "🔸 Requerimientos no funcionales: Describen CÓMO debe funcionar el sistema (calidad, rendimiento, seguridad). Ejemplo: 'El sistema debe responder en menos de 2 segundos'.",
            "🔸 Riesgos si no se definen bien: El sistema no satisface al cliente, costos adicionales, pérdida de tiempo.",
            "🔸 Product Owner: Define las funcionalidades, prioriza el backlog y actúa como enlace principal entre clientes y equipo técnico.",
            "🔸 Scrum Master: Asegura que el equipo siga las prácticas ágiles y elimina impedimentos.",
            "🔸 Equipo de Desarrollo: Profesionales que realizan el trabajo técnico de crear el producto."
          ],
          "pregunta": {
            "texto": "¿Según los textos, si un usuario dice 'El sistema debe responder en menos de 2 segundos', qué tipo de requerimiento es?",
            "opciones": [
              {
                "letra": "A",
                "texto": "Requerimiento Funcional",
                "isCorrect": false,
                "explicacion": "Recuerda que los funcionales describen QUÉ hace (ej: registrar un usuario), no los tiempos ni rendimiento."
              },
              {
                "letra": "B",
                "texto": "Requerimiento No Funcional",
                "isCorrect": true,
                "explicacion": "¡Exacto! El tiempo de respuesta es un requerimiento No Funcional (describe CÓMO funciona)."
              }
            ]
          }
        },
        {
          "titulo": "📚 TEMA: MODELADO BPMN Y SÍMBOLOS (PPT 4)",
          "lineas": [
            "🔸 Evento de Inicio (Círculo Verde): Marca el comienzo del proceso.",
            "🔸 Evento Intermedio (Círculo Doble): Ocurre entre el inicio y el fin del proceso.",
            "🔸 Evento de Fin (Círculo Rojo): Indica el término del proceso.",
            "🔸 Compuerta Exclusiva (X): Solo una ruta se ejecuta.",
            "🔸 Compuerta Paralela (+): Todas las rutas se ejecutan al mismo tiempo.",
            "🔸 Compuerta Inclusiva (O): Una o más rutas se ejecutan si cumplen la condición.",
            "🔸 Flujo de Secuencia (Flecha sólida): Conecta elementos del proceso en orden de ejecución.",
            "🔸 Flujo de Mensaje (Flecha punteada con sobre): Representa comunicación entre participantes (ej. cliente y empresa).",
            "🔸 Grupo (Rectángulo punteado): Agrupa elementos relacionados sin afectar el flujo."
          ],
          "pregunta": {
            "texto": "¿Qué tipo de flecha se debe usar si queremos representar un mensaje enviado de un Cliente a la Empresa en BPMN?",
            "opciones": [
              {
                "letra": "A",
                "texto": "Flecha sólida de secuencia",
                "isCorrect": false,
                "explicacion": "Ojo, la flecha sólida de secuencia solo conecta tareas internamente dentro del mismo proceso."
              },
              {
                "letra": "B",
                "texto": "Flecha punteada con sobre",
                "isCorrect": true,
                "explicacion": "¡Súper! La flecha punteada con sobre es el 'Flujo de Mensaje' usado para participantes externos."
              }
            ]
          }
        },
        {
          "titulo": "📚 TEMA: MEJORA CONTINUA Y KPIs (PPT 6)",
          "lineas": [
            "🔸 Ciclo PDCA: Planificar (Plan) → Ejecutar (Do) → Verificar (Check) → Actuar (Act).",
            "🔸 Diferencia Métrica vs KPI: No toda métrica es estratégica. 'Número de llamadas' es métrica. 'Tiempo promedio de respuesta' es KPI.",
            "🔸 KPI SMART: Específico, Medible, Alcanzable, Relevante, Temporal.",
            "🔸 Sprints en Scrum: Iteraciones cortas (2 a 4 semanas).",
            "🔸 Sprint Planning: El equipo decide qué funcionalidades desarrollará en el próximo sprint.",
            "🔸 Daily Scrum: Reunión diaria de 15 minutos para ajustar el trabajo.",
            "🔸 Sprint Review: Se muestra lo desarrollado y se recibe feedback.",
            "🔸 Sprint Retrospective: El equipo reflexiona sobre cómo mejorar para la próxima iteración."
          ],
          "pregunta": {
            "texto": "Si te preguntan qué evento sirve para que 'el equipo decida qué funcionalidades desarrollará en el próximo sprint', debes responder:",
            "opciones": [
              {
                "letra": "A",
                "texto": "Sprint Planning",
                "isCorrect": true,
                "explicacion": "¡Correcto! En la Planning se planifica el trabajo a futuro del sprint."
              },
              {
                "letra": "B",
                "texto": "Sprint Review",
                "isCorrect": false,
                "explicacion": "Te confundiste con la Sprint Review, que ocurre al final para revisar y mostrar lo que ya se hizo."
              }
            ]
          }
        },
        {
          "titulo": "📚 TEMA: CASOS DE USO E HISTORIAS DE USUARIO (PPT 7)",
          "lineas": [
            "🔸 Caso de Uso: Técnica que describe cómo un usuario (actor) interactúa con un sistema para alcanzar un objetivo.",
            "🔸 Casos de uso de Negocio: Se centran en las metas de la empresa.",
            "🔸 Casos de uso de Sistema: Detallan las interacciones técnicas de los usuarios con una parte específica del sistema.",
            "🔸 Notación UML: Actor (stickman), Caso de uso (óvalo con el nombre de la funcionalidad).",
            "🔸 Relación <<include>>: Un caso de uso siempre invoca otro de manera obligatoria.",
            "🔸 Relación <<extend>>: Un caso de uso opcional que amplía otro.",
            "🔸 Historias de Usuario: Formato -> 'Como [rol], quiero [funcionalidad] para [beneficio]'.",
            "🔸 El Método INVEST: Independiente, Negociable, Valiosa, Estimable, Small (Pequeña), Testable."
          ],
          "pregunta": {
            "texto": "En un diagrama, si la acción 'Validar Tarjeta' es obligatoria siempre que se ejecuta 'Pagar Compra', ¿qué relación usamos?",
            "opciones": [
              {
                "letra": "A",
                "texto": "Relación <<extend>>",
                "isCorrect": false,
                "explicacion": "No puede ser <<extend>> porque esa relación se usa solo para casos opcionales que a veces suceden."
              },
              {
                "letra": "B",
                "texto": "Relación <<include>>",
                "isCorrect": true,
                "explicacion": "¡Bien hecho! <<include>> significa que un caso invoca al otro siempre y obligatoriamente."
              }
            ]
          }
        },
        {
          "titulo": "📚 TEMA: GESTIÓN DE PROYECTOS, FODA Y CAME (PPT 11)",
          "lineas": [
            "🔸 Gestión de Proyectos: Disciplina de planificar, ejecutar y controlar tareas para alcanzar objetivos SMART en tiempo y presupuesto.",
            "🔸 Fase de Inicio: Se define el propósito y se crea el Acta de Constitución (Project Charter).",
            "🔸 Fase de Ejecución: El equipo realiza las tareas asignadas. Es la fase que consume la mayor cantidad de recursos.",
            "🔸 Riesgos Cuantitativos: Uso de datos numéricos para proyectar costos o retrasos.",
            "🔸 FODA - Variables Internas: Fortalezas (Positivas) y Debilidades (Negativas).",
            "🔸 FODA - Variables Externas: Oportunidades (Positivas) y Amenazas (Negativas).",
            "🔸 CAME (Corregir, Afrontar, Mantener, Explotar):",
            "   - Estrategia FO: Usar fortalezas para aprovechar oportunidades.",
            "   - Estrategia FA: Usar fortalezas para enfrentar amenazas.",
            "   - Estrategia DO: Superar debilidades aprovechando oportunidades.",
            "   - Estrategia DA: Minimizar debilidades y evitar amenazas."
          ],
          "pregunta": {
            "texto": "En el análisis CAME de tu PPT, la estrategia 'DO' nos dice textualmente que debemos:",
            "opciones": [
              {
                "letra": "A",
                "texto": "Minimizar debilidades y evitar amenazas",
                "isCorrect": false,
                "explicacion": "La opción que elegiste corresponde a DA (Debilidades - Amenazas)."
              },
              {
                "letra": "B",
                "texto": "Superar debilidades aprovechando oportunidades",
                "isCorrect": true,
                "explicacion": "¡Eso es! DO significa (Debilidades - Oportunidades): Superar debilidades aprovechando oportunidades."
              }
            ]
          }
        }
      ]
    }
  },
  "ppts": {
  "ppt2": {
    "title": "PPT Segunda Clase",
    "slides": [
      {
        "slide": 1,
        "content": "Introducción a Requerimiento y Modelo de Negocios Clase N°  2  Semana: 1 Fecha: 18-03-26 Docente: Daniela Medina A ."
      },
      {
        "slide": 2,
        "content": "Condiciones favorables para la clase Mantén tus dispositivos electrónicos en silencio Respeta el turno de participación Practica la puntualidad Mantén todos tus sentidos activos"
      },
      {
        "slide": 3,
        "content": "Clase 2 – Ciclo de vida del software Definición: Son especificaciones que describen las funciones, características y restricciones de un sistema de software. Propósito: Permiten comunicar de manera precisa entre el cliente, los usuarios y el equipo de desarrollo qué se espera del sistema. Importancia: Si los requerimientos no están bien definidos, el sistema puede terminar siendo inútil o no cumplir con las necesidades reales."
      },
      {
        "slide": 4,
        "content": "Aspectos generales Conocer sobre el análisis y diseño de sistemas es útil para los clientes  y proporciona conocimientos que mejora su capacidad como usuario. El uso del análisis y diseño de sistemas se hace necesario para reducir el riesgo de fracaso y determina con certeza los requerimientos. Emprender un proyecto de manera casual, representa un alto grado de riesgo de no tener éxito . Sistema: Conjunto de hardware, software, personas, procedimientos y datos. En la actualidad, la información se conoce en las organizaciones como algo sumamente valioso. Un hecho común en las organizaciones es que requieran cambiar su sistema de información, esto esta motivado por buscar cubrir adecuadamente las necesidades de información"
      },
      {
        "slide": 5,
        "content": "Conceptos Básicos : ROL dentro de la Ingeniería de Software\n\n[Notas de clase]: Se debe considerar como máximo el 40% de los minutos de la clase para  abordar los contenidos, ideas, procedimientos, teorías, postulados, etc. ‹#›"
      },
      {
        "slide": 6,
        "content": "Tipos principales de requerimientos\n\n[Notas de clase]: Se debe considerar como máximo el 40% de los minutos de la clase para abordar  la aplicación de lo conocido en actividades prácticas. ‹#›"
      },
      {
        "slide": 7,
        "content": "Fases relacionadas con los   requerimientos Obtención (Elicitación): Se recopila información de los usuarios y clientes mediante entrevistas, encuestas, observación, etc. Análisis: Se revisa la información para detectar inconsistencias o necesidades ocultas. Especificación: Se documentan los requerimientos de manera clara y estructurada. Validación: Se confirma con los usuarios que los requerimientos reflejan lo que realmente necesitan. Ejemplo cotidiano : Imagina que una empresa quiere una app para pedir comida: Requerimiento funcional: “El sistema debe permitir seleccionar un plato y agregarlo al carrito.” Requerimiento no funcional: “La aplicación debe funcionar en dispositivos Android e iOS.”"
      },
      {
        "slide": 8,
        "content": "El sistema no satisface al cliente. Se generan costos adicionales por cambios tardíos. Se pierde tiempo en desarrollo innecesario. Se dificulta la validación y las pruebas. Riesgos si no se definen bien"
      },
      {
        "slide": 9,
        "content": "Elige un software que conozcas y uses en tu vida diaria (ejemplo: WhatsApp, Netflix, Uber, Word, Moodle).    - Haz un pequeño informe de media página donde indiques:    - Nombre del software y para qué  sirve .    -5  requerimientos funcionales (qué hace el sistema).    -5  requerimientos no funcionales (cómo lo hace, condiciones de calidad). Entrega tu informe al final de la clase.   Tarea en clases (Individual)"
      },
      {
        "slide": 10,
        "content": "Gracias\n\n[Detalle del docente]: Definición “Son especificaciones que describen las funciones, características y restricciones de un sistema de software.” Aquí explicas que los requerimientos son como la “lista de instrucciones” que dicen qué debe hacer el sistema y bajo qué condiciones. Ejemplo: “El sistema debe permitir registrar usuarios” (funcional) y “Debe responder en menos de 2 segundos” (no funcional). 🔹 Propósito “Permiten comunicar de manera precisa entre el cliente, los usuarios y el equipo de desarrollo qué se espera del sistema.” Señala que los requerimientos son un puente de comunicación: evitan malentendidos entre quienes piden el software y quienes lo construyen. Ejemplo: “Si el cliente pide una app para pedir comida, los requerimientos detallan cómo debe funcionar el pedido, el pago y la entrega.” 🔹 Importancia “Si los requerimientos no están bien definidos, el sistema puede terminar siendo inútil o no cumplir con las necesidades reales.” Refuerza que un error en esta etapa afecta todo el proyecto. Ejemplo: “Si no se especifica que la app debe mostrar el tiempo estimado de entrega, el usuario puede quedar insatisfecho.” 💡 Cómo presentarla en clase Explica cada bloque con ejemplos cotidianos (apps que ellos usan). Haz una mini dinámica rápida: Pregunta: “¿Qué creen que pidió el cliente para que WhatsApp funcionara como lo conocemos?” Escribe en la pizarra ejemplos de requerimientos funcionales y no funcionales. Conecta con la actividad: prepara el mapa mental colaborativo sobre el ciclo de vida del software, usando esta base."
      }
    ]
  },
  "ppt3": {
    "title": "PPT Tercera Clase",
    "slides": [
      {
        "slide": 1,
        "content": "Introducción a Requerimiento y Modelo de Negocios. Clase N°  3 Fecha: 20-03-26 Carrera: Tec. Programación y Análisis de Sistemas Docente: Daniela Medina A."
      },
      {
        "slide": 2,
        "content": "Condiciones favorables para la clase Mantén tus dispositivos electrónicos en silencio Respeta el turno de participación Practica la puntualidad Mantén todos tus sentidos activos"
      },
      {
        "slide": 3,
        "content": "📚 Clase 3 – Requerimientos funcionales vs no funcionales Momento para recordar  !!! Breve repaso de la clase anterior (ciclo de vida del software). “¿Qué creen que pasa si no definimos bien lo que un sistema debe hacer?” Conecta con los riesgos vistos: costos, tiempo perdido, insatisfacción del cliente."
      },
      {
        "slide": 4,
        "content": "📚 Clase 3 – Requerimientos funcionales vs no funcionales Definiciones claras Funcionales:   ➝ Describen qué hace el sistema (acciones, servicios, funciones visibles). Ejemplo: “El sistema debe permitir registrar nuevos usuarios.” No funcionales:   ➝ Describen cómo funciona el sistema (calidad, rendimiento, seguridad, compatibilidad). Ejemplo: “El sistema debe responder en menos de 2 segundos.”"
      },
      {
        "slide": 5,
        "content": "Ejemplos cotidianos (apps conocidas) WhatsApp Funcional: enviar mensajes, hacer llamadas. No funcional: rapidez de entrega, seguridad de conversaciones. Netflix Funcional: reproducir películas y series. No funcional: funcionar en múltiples dispositivos, buena calidad de streaming."
      },
      {
        "slide": 6,
        "content": "Objetivos de la clase: -Identificar los distintos tipos de problemáticas en organizaciones (sociales, empresariales, gubernamentales). -Diferenciar roles y responsabilidades de los stakeholders en cada tipo de organización. -Comprender la importancia de los requerimientos funcionales y no funcionales en el desarrollo de software. - Profundizar en la clasificación y aplicación de requerimientos funcionales y no funcionales. Problemáticas, Roles y Requerimientos"
      },
      {
        "slide": 7,
        "content": "Sociales: sistemas de salud, educación inclusiva, gestión comunitaria. Empresariales: ERP, CRM, logística, comercio electrónico. Gubernamentales: registro civil, impuestos, gestión de trámites ciudadanos. Tipos de problemáticas organizacionales"
      },
      {
        "slide": 8,
        "content": "Patrocinador del Proyecto: Proporciona financiación, recursos y dirección estratégica. Toma decisiones de alto nivel. Product Owner : Define las funcionalidades del software, prioriza el backlog y actúa como enlace principal entre usuarios y equipo técnico. Equipo de Desarrollo (Desarrolladores, QA, Diseñadores): Ejecuta la construcción del software, realiza pruebas y asegura la calidad técnica. Usuarios Finales: Prueban el producto, ofrecen retroalimentación (feedback) sobre usabilidad y validan que el software resuelva sus necesidades. Gerente de Proyecto (Project Manager): Planifica, gestiona riesgos, asegura el cumplimiento de plazos y mantiene la comunicación con todos los stakeholders. Stakeholders y roles clave"
      },
      {
        "slide": 9,
        "content": "Personas o entidades que, aunque no desarrollan el software, determinan su éxito o fracaso en el mercado. Clientes:  Las entidades o individuos que financian el proyecto y esperan un retorno de inversión alineado con sus metas de negocio. Usuarios Finales : Son quienes interactúan directamente con el software. Su feedback es crítico para definir la usabilidad y funcionalidad real. Proveedores : Organizaciones externas que suministran herramientas, infraestructura o servicios necesarios para el desarrollo. Entidades Regulatorias : Organismos que dictan estándares de cumplimiento legal, ético o de seguridad que el software debe cumplir. Stakeholders Externos (Impacto e Influencia)"
      },
      {
        "slide": 10,
        "content": "Independientemente de su nivel de participación, los stakeholders comparten responsabilidades clave para el éxito del proyecto . Definición de Requerimientos: Aportar claridad sobre las necesidades y problemas que el software debe resolver. Retroalimentación Continua: Participar en revisiones (como la Sprint Review en Scrum) para validar el progreso e inspeccionar el producto. Asignación de Recursos: Garantizar que el equipo cuente con el apoyo financiero, humano y tecnológico necesario. Gestión de Expectativas: Mantener una comunicación abierta para evitar malentendidos sobre el alcance y los plazos . Responsabilidades Generales"
      },
      {
        "slide": 11,
        "content": "Obtener más apoyo y recursos Aumentar la visibilidad de los proyectos, especialmente para los participantes que son ejecutivos Prevenir que se presenten obstáculos costosos más adelante en el ciclo del proyecto Comunicarte a través de los canales correctos y en el momento adecuado Compartir información relevante con los participantes de acuerdo con el nivel de influencia o participación de cada uno Los beneficios de realizar un análisis de los stakeholders"
      },
      {
        "slide": 12,
        "content": "Caso: “Una municipalidad necesita un sistema para gestionar solicitudes ciudadanas en línea”. Paso 1: Identificar la problemática principal. Paso 2: Listar stakeholders y asignar roles. Paso 3: Clasificar al menos 5 requerimientos funcionales y 5 no funcionales. Paso 4: Discusión grupal sobre cómo los roles influyen en la definición de requerimientos.  Paso 5: Necesito que expongan su trabajo grupal y se organicen para presentarlo. Actividad en Clases"
      },
      {
        "slide": 13,
        "content": "Gracias!!!\n\n[Detalle del docente]: Requerimientos funcionales Definición: describen qué hace el sistema (acciones, servicios, funciones visibles para el usuario). Ejemplo: “El sistema debe permitir registrar nuevos usuarios.” Idea clave: son las tareas que el sistema realiza directamente. 🔹 Requerimientos no funcionales Definición: describen cómo funciona el sistema (calidad, rendimiento, seguridad, compatibilidad). Ejemplo: “El sistema debe responder en menos de 2 segundos.” Idea clave: no agregan nuevas funciones, sino condiciones que garantizan que el sistema sea confiable y útil. 🔹 Tabla comparativa (muy visual) Funcionales No funcionales Qué hace el sistema Cómo lo hace Acciones visibles Condiciones de calidad y desempeño Ejemplo: Registrar usuarios Ejemplo: Responder en < 2 segundos 💡 Cómo presentarla en clase Explica primero con ejemplos cotidianos: WhatsApp → Funcional: enviar mensajes. No funcional: rapidez y seguridad. Netflix → Funcional: reproducir películas. No funcional: buena calidad de streaming. Haz una mini dinámica rápida: Pregunta: “Piensen en una aplicación que usan todos los días. ¿Qué hace? ¿Y cómo lo hace?” Anota en la pizarra ejemplos que ellos digan y clasifícalos en las dos columnas. Refuerza con una frase sencilla:   “Los funcionales dicen QUÉ hace el sistema, los no funcionales aseguran CÓMO lo hace.”"
      }
    ]
  },
  "ppt4": {
    "title": "PPT Cuarta Clase",
    "slides": [
      {
        "slide": 1,
        "content": "Introducción a Requerimiento y Modelo de Negocios. Clase N°  4 Fecha: 23-03-26 Carrera: Tec. Programación y Análisis de Sistemas Docente: Daniela Medina A."
      },
      {
        "slide": 2,
        "content": "Condiciones favorables para la clase Mantén tus dispositivos electrónicos en silencio Respeta el turno de participación Practica la puntualidad Mantén todos tus sentidos activos"
      },
      {
        "slide": 3,
        "content": "Viernes 23: Tarea sumativa. Este ramo tiene 3 notas, las cuales las dividiremos en: Nota sumativas; Trabajos, actividades, etc.  Nota formativa: Prueba. (Se aplica el punto base). (Abril) Nota final: (mayo) Un proyecto ficticio simulado en un informe y explicado frente al curso por cada integrante. (Se aplica el punto base). Evaluaciones Sumativa esta semana:"
      },
      {
        "slide": 4,
        "content": "M odelado de procesos de negocio BPMN Lenguaje gráfico estandarizado para representar procesos de negocio en forma de diagramas de flujo Lenguaje gráfico estandarizado para representar procesos de negocio en forma de diagramas de flujo  Facilitar la comunicación entre analistas de negocio, desarrolladores y stakeholders, asegurando que todos comprendan los procesos de manera uniforme"
      },
      {
        "slide": 5,
        "content": "Elementos principales de BPMN BPMN organiza sus símbolos en cuatro categorías:"
      },
      {
        "slide": 6,
        "content": "Tipos de diagramas BPMN Diagramas de procesos privados (internos):  Modelan procesos dentro de una organización. Diagramas de colaboración : Representan la interacción entre dos o más participantes (ej. empresa y cliente). Diagramas de coreografía : Enfocados en la secuencia de mensajes entre actores. Diagramas de conversación : Simplifican la comunicación entre participantes."
      },
      {
        "slide": 7,
        "content": "Ventajas de usar BPMN Claridad universal:  Lenguaje gráfico entendible por técnicos y no técnicos. Optimización : Permite identificar cuellos de botella y mejorar la eficiencia. Estándar global:  Compatible con múltiples herramientas de modelado (Camunda, Bizagi, Signavio, etc.). Integración:  Se conecta con sistemas de ejecución de procesos (BPMS)."
      },
      {
        "slide": 8,
        "content": "Desafíos y consideraciones Curva de aprendizaje:  Aunque es intuitivo, requiere capacitación para usar correctamente todos los símbolos. Complejidad : Los diagramas grandes pueden volverse difíciles de leer si no se estructuran bien. Herramientas : La elección de software influye en la facilidad de implementación y en la integración con sistemas existentes."
      },
      {
        "slide": 10,
        "content": "Símbolo:  Círculo verde.    Función:  Marca el comienzo del proceso. Puede ser disparado por un evento (ej. recepción de solicitud, clic de usuario, hora programada). Ejemplo: “Inicio” del proceso de revisión de una solicitud. 🟢 1. Evento de Inicio"
      },
      {
        "slide": 11,
        "content": "Símbolo: Rombo con símbolo interno (X, +, etc.). Función: Controla el flujo del proceso según condiciones. Puede ser: Exclusiva (X): solo una ruta se ejecuta. Paralela (+): todas las rutas se ejecutan. Inclusiva (O): una o más rutas se ejecutan. Ejemplo: “¿Aprobada?” con salidas “Sí” y “No”. 🔷 3. Compuerta (Decisión)"
      },
      {
        "slide": 12,
        "content": "Símbolo:  Círculo rojo. Función:  Indica el término del proceso. Puede ser normal, de error, de mensaje, etc. Ejemplo: Fin del proceso tras enviar confirmación o notificar rechazo. 🔴 4. Evento de Fin"
      },
      {
        "slide": 13,
        "content": "Símbolo:  Icono de documento. Función:  Representa información usada o generada por una actividad. Ejemplo: La solicitud que se revisa. 📄 5. Objeto de Datos"
      },
      {
        "slide": 14,
        "content": "Símbolo:  Cilindro (base de datos). Función:  Indica almacenamiento persistente de información. Ejemplo: Registro de solicitudes aprobadas. 🗄️ 6. Almacén de Datos"
      },
      {
        "slide": 15,
        "content": "Símbolo:  Flecha sólida. Función:  Conecta elementos del proceso en orden de ejecución. Ejemplo: De “Inicio” a “Revisar Solicitud”. ➡️ 7. Flujo de Secuencia"
      },
      {
        "slide": 16,
        "content": "Símbolo:  Flecha punteada con sobre. Función:  Representa comunicación entre participantes (ej. cliente y empresa). Ejemplo: Enviar confirmación por correo. ✉️ 8. Flujo de Mensaje"
      },
      {
        "slide": 17,
        "content": "Símbolo:  Rectángulo punteado. Función:  Agrupa elementos relacionados sin afectar el flujo. Ejemplo: Actividades del área de soporte. 🗂️ 9. Grupo"
      },
      {
        "slide": 18,
        "content": "Símbolo: Nota adhesiva. Función:  Añade comentarios o aclaraciones al diagrama. Ejemplo: “Este paso depende del sistema X”. 📝 10. Anotación"
      },
      {
        "slide": 19,
        "content": "Diagrama de flujo BPMN\n\n[Detalle del docente]: Qué decir en clase BPMN es un lenguaje gráfico estandarizado: todos los analistas, desarrolladores y stakeholders hablan el mismo “idioma visual”. Facilita la comunicación: evita malentendidos porque los procesos se representan con símbolos universales. Uniformidad: asegura que cualquier persona, sin importar su rol, pueda comprender el flujo del proceso. Ejemplo cotidiano: “Así como los mapas de tránsito nos ayudan a entender cómo movernos por la ciudad, BPMN nos da un mapa para entender cómo fluye la información y las tareas dentro de una organización.” Estrategia para que lo recuerden Pide a los estudiantes que piensen en un proceso simple (ej. pedir comida en una cafetería). Haz que lo describan primero en palabras y luego en un esquema BPMN."
      },
      {
        "slide": 20,
        "content": "Aplicar los conceptos de BPMN para modelar un proceso cotidiano usando Bizagi Modeler, identificando eventos, tareas, decisiones y agrupaciones. Instrucciones:  -Elige uno de los siguientes procesos: -Solicitud de inscripción escolar. -Compra en línea. -Solicitud de vacaciones en una empresa. -Atención de reclamos en una tienda. Actividad: Modela tu propio proceso con BPMN"
      },
      {
        "slide": 21,
        "content": "- Evento de inicio - Actividades (mínimo 3) - Compuerta de decisión - Evento de fin - Artefacto “Grupo” para organizar tareas por área Modela el proceso en Bizagi: Identifica los elementos BPMN: Usa los símbolos correctos. Conecta los elementos con flujos de secuencia. Añade anotaciones si es necesario. Agrupa tareas relacionadas con un rectángulo punteado."
      }
    ]
  },
  "ppt6": {
    "title": "PPT Sexta Clase",
    "slides": [
      {
        "slide": 1,
        "content": "Taller de Requerimiento y Modelo de Sistemas. Clase N° 6   Fecha: 27-03-26 Carrera: Tec. Programación y Análisis de Sistemas Docente: Daniela Medina A."
      },
      {
        "slide": 2,
        "content": "Condiciones favorables para la clase Mantén tus dispositivos electrónicos en silencio Respeta el turno de participación Practica la puntualidad Mantén todos tus sentidos activos"
      },
      {
        "slide": 3,
        "content": "Procesos de negocio y mejora continua Analizar cómo los procesos de negocio se pueden optimizar mediante prácticas de mejora continua."
      },
      {
        "slide": 4,
        "content": "Introducción a la mejora continua P equeños cambios iterativos que generan grandes mejoras. Relación con metodologías ágiles y BPMN. Frase clave: “Siempre hay una forma de hacerlo mejor.”"
      },
      {
        "slide": 5,
        "content": "Ciclo PDCA (Plan–Do–Check–Act) Planificar → Ejecutar → Verificar → Actuar. Ejemplo aplicado: proceso de atención al cliente."
      },
      {
        "slide": 6,
        "content": "Procesos de negocio y optimización Identificación de cuellos de botella. Eliminación de redundancias. Automatización de tareas repetitivas."
      },
      {
        "slide": 7,
        "content": "Ejemplo aplicado – Hospital   Proceso: admisión de pacientes. Mejora: digitalización de fichas → reducción de tiempos de espera. Ejemplo aplicado – Retail Proceso: despacho de productos. Mejora: integración de inventario en tiempo real → menos errores de stock."
      },
      {
        "slide": 8,
        "content": "BPMN para visualizar procesos. Scrum/XP para iterar mejoras. Indicadores de desempeño (KPIs). Herramientas de mejora continua"
      },
      {
        "slide": 9,
        "content": "Iteraciones   cortas  (sprints):   N ormalmente  de 2 a 4  semanas . Eventos  clave : Daily Scrum:   reunión   diaria  de 15  minutos  para  ajustar  el  trabajo . Sprint Review : se  muestra  lo  desarrollado  y se  recibe  feedback. Sprint Retrospective:  el  equipo   reflexiona   sobre   cómo   mejorar . Beneficio :   C ada  sprint  es   una   oportunidad  de  entregar  valor y  ajustar  el  proceso . Scrum"
      },
      {
        "slide": 10,
        "content": "Extreme Programming (XP) Prácticas clave Programación en parejas:  dos desarrolladores trabajan juntos para mejorar calidad. Integración continua:  el código se prueba y se integra varias veces al día. Refactorización:  se mejora el código sin cambiar su funcionalidad. Cliente presente:  el usuario participa activamente en el desarrollo. Beneficio:  asegura calidad técnica y adaptación rápida a cambios."
      },
      {
        "slide": 11,
        "content": "Scrum y XP no buscan un producto “perfecto” desde el inicio, sino mejorarlo paso a paso. Cada iteración es un ciclo de aprendizaje: se entrega, se recibe feedback, se ajusta. Esto genera un hábito organizacional de evolución constante. Conexión con mejora continua"
      },
      {
        "slide": 12,
        "content": "Métricas cuantitativas que reflejan el progreso hacia objetivos específicos. Función: Transforman datos en información útil para la toma de decisiones. Ejemplo: En un hospital, el tiempo promedio de atención de pacientes; en retail, el porcentaje de pedidos entregados a tiempo . Qué son los KPIs"
      },
      {
        "slide": 13,
        "content": "Específico: mide un aspecto concreto del proceso. Medible: se expresa en números o porcentajes. Alcanzable: debe ser realista según los recursos disponibles. Relevante: vinculado directamente a los objetivos estratégicos. Temporal: se mide en un periodo definido (diario, mensual, anual). Características de un buen KPI"
      },
      {
        "slide": 14,
        "content": "📊 Tipos de KPIs\n\n[Detalle del docente]: 💡 Qué decir en clase Mejora continua: los procesos no son estáticos, se revisan y ajustan para ser más eficientes. Optimización: al analizar un proceso modelado, se pueden detectar pasos innecesarios, cuellos de botella o tareas que conviene automatizar. Ejemplo aplicado: en un proceso de matrícula, si la validación de documentos genera retrasos, se puede implementar un sistema digital que agilice la revisión. Idea clave: BPMN es la base para aplicar metodologías de mejora como Kaizen, Lean o Six Sigma, que buscan eliminar desperdicios y aumentar valor. Estas metodologias no son agiles, pero se enfocan en la mejora coninua, es una metodologia japonesa (Kaiszen)"
      },
      {
        "slide": 15,
        "content": "Riesgo: medir demasiados KPIs → dispersión y falta de foco. Buena práctica: seleccionar 3–5 KPIs críticos por proceso. Riesgo: confundir métricas con KPIs → no todas las métricas son estratégicas. Buena práctica: vincular cada KPI a un objetivo claro. ⚠️ Riesgos y buenas prácticas"
      },
      {
        "slide": 16,
        "content": "Comprender qué son los KPIs, cómo se definen y cómo se aplican en procesos de negocio para evaluar desempeño y mejora continua. Indicadores de desempeño en procesos de negocio (KPIs) Son  indicadores clave de rendimiento que miden el éxito de un proceso. Diferencia entre métrica y KPI: no toda métrica es estratégica. Ejemplo: “número de llamadas atendidas” (métrica) vs. “tiempo promedio de respuesta” (KPI)."
      },
      {
        "slide": 17,
        "content": "- Específico. - Medible. - Alcanzable. - Relevante. - Temporal. Características de un buen KPI"
      },
      {
        "slide": 18,
        "content": "Buen indicador de desempeño\n\n[Detalle del docente]: 💡 Qué decir en clase Pequeños cambios iterativos: la mejora continua se basa en ajustes frecuentes y graduales que, acumulados, generan grandes resultados. Relación con metodologías ágiles: igual que en Scrum o XP, se busca retroalimentación rápida y adaptación constante. Conexión con BPMN: al modelar procesos, se pueden identificar oportunidades de mejora y aplicar cambios en ciclos cortos. Frase clave: “Siempre hay una forma de hacerlo mejor.” → resume la filosofía de mejora continua."
      },
      {
        "slide": 19,
        "content": "Financieros: margen de ganancia, ROI. Operativos: tiempo de ciclo, tasa de errores. De clientes: satisfacción, NPS. De calidad: defectos por lote, cumplimiento de estándares. De innovación: nuevos productos lanzados. Tipos de KPIs"
      },
      {
        "slide": 20,
        "content": "Aiep  necesita modelar el proceso de inscripción de estudiantes en un  curso online \" Agente IA de Visual Studio Code\" ACTIVIDAD SUMATIVA Paso 1:  Dibujar en Bizagi el flujo del proceso de inscripción: *  Inicio: estudiante solicita inscripción. *  Validación de requisitos. *  Pago en línea. *  Confirmación de inscripción. *  Notificación al estudiante. Paso 2:  Redactar los requerimientos funcionales, por ejemplo: El sistema debe validar automáticamente los requisitos del curso. Paso 3:  Redactar los requerimientos no funcionales, por ejemplo: El sistema debe estar disponible 24/7."
      },
      {
        "slide": 21,
        "content": "Este tarea con nota sumativa, debe estar:  - En Word, guardado formato PDF.  - El diagrama debe ser en BizAgi o algún programa de UML. Este debe ser copiado y pegado en el informe, pero que sea entendible.   - Al igual que los requerimientos funcionales y no funcionales, estos deben ser entendibles. - Se descontarán decimas si, hay falta de ortografía. - Si se copia literalmente de la IA. * El trabajo de informe debe ir con el nombre del alumno, carrera, nombre   del docente, y se debe entregar el día 1 DE ABRIL.  Actividad"
      },
      {
        "slide": 22,
        "content": "Gracias!!!\n\n[Detalle del docente]: 💡 Qué decir en clase Definición: el ciclo PDCA es una metodología iterativa para mejorar procesos. Etapas: Planificar (Plan): definir objetivos y pasos. Hacer (Do): ejecutar las tareas planificadas. Verificar (Check): revisar resultados y detectar problemas. Actuar (Act): implementar mejoras y ajustes. Ejemplo aplicado: proceso de atención al cliente → se planifica el flujo, se ejecuta, se revisa la satisfacción y se ajusta para mejorar. Idea clave: el ciclo nunca termina, es un bucle de mejora continua."
      }
    ]
  },
  "ppt7": {
    "title": "PPT Septima Clase",
    "slides": [
      {
        "slide": 1,
        "content": "Taller Introducción y Modelo de Negocios Clase N° 7   Fecha: 30-03-26 Carrera: Tec. Programación y Análisis de Sistemas Docente: Daniela Medina A."
      },
      {
        "slide": 2,
        "content": "Condiciones favorables para la clase Mantén tus dispositivos electrónicos en silencio Respeta el turno de participación Practica la puntualidad Mantén todos tus sentidos activos"
      },
      {
        "slide": 3,
        "content": "Diagramación de Procesos de Negocio: Casos de Uso\n\n[Notas de clase]: Tiempo: máximo 3% de los minutos de la clase El docente: - Recuerda a los estudiantes el aprendizaje esperado, los criterios de evaluación y los contenidos a abordar en la clase. 3"
      },
      {
        "slide": 4,
        "content": "¿Qué es un caso de Uso? T écnica de modelado de software que describe, paso a paso, cómo un usuario (actor) interactúa con un sistema para alcanzar un objetivo específico y valioso . Define el comportamiento del sistema ante interacciones, incluyendo caminos exitosos y escenarios de error, siendo fundamental para capturar requisitos funcionales."
      },
      {
        "slide": 5,
        "content": "Componentes clave de un caso de uso: Actor:  Usuario, equipo u otro sistema externo que interactúa con el sistema. Sistema : La aplicación o producto que ofrece la funcionalidad. Objetivo (Meta) : El resultado valioso que el actor busca lograr (ej. \"Completar compra\"). Flujo de eventos:  Secuencia de pasos que describen la interacción.  Ejemplo: Caso de uso:  Realizar transferencia bancaria. Actor:  Cliente del banco. Flujo:  El cliente ingresa monto, el sistema verifica fondos, el sistema confirma transferencia"
      },
      {
        "slide": 6,
        "content": "Ejemplo de CASO DE USO //caso de inscripción de cursos//\n\n[Notas de clase]: Se debe considerar como máximo el 40% de los minutos de la clase para abordar  la aplicación de lo conocido en actividades prácticas. 6"
      },
      {
        "slide": 7,
        "content": "Notación UML Actor:  figura de persona (stickman). Caso de uso:  óvalo con el nombre de la funcionalidad. Relacione s Línea simple : interacción. <<include>>:  un caso de uso siempre invoca otro. <<extend>>:  un caso de uso opcional que amplía otro."
      },
      {
        "slide": 8,
        "content": "Ejemplo simple Sistema:  Cajero Automático (ATM) Actores:  Cliente, Banco. Casos de uso:                           -  Retirar dinero.                           -  Consultar saldo.                           -  Depositar dinero.                           -  Transferir fondos. Diagrama UML con cliente conectado a los óvalos de funcionalidades."
      },
      {
        "slide": 9,
        "content": "Buenas prácticas -  Usar nombres claros y consistentes. -  No mezclar requerimientos técnicos con funcionales. -  Mantener el diagrama simple y legible. -  Validar con los stakeholders que los casos de uso reflejan sus    necesidades."
      },
      {
        "slide": 10,
        "content": "Tipos de Casos de Uso: Casos de uso de negocio:  Se centran en las metas de la empresa y cómo el usuario interactúa para lograrlas. Casos de uso de sistema:  Detallan las interacciones técnicas de los usuarios con una parte específica del sistema. Los casos de uso son fundamentales en las primeras etapas de desarrollo para asegurar que el sistema satisfaga las necesidades del usuario final."
      },
      {
        "slide": 11,
        "content": "¿Para qué sirven? Capturar requisitos:  Identifican las necesidades funcionales del sistema de forma clara para el cliente. Escenarios de prueba:  Ayudan a los desarrolladores a crear pruebas basadas en el comportamiento esperado. Comunicación:  Facilitan el entendimiento entre el equipo técnico y los interesados no técnicos."
      },
      {
        "slide": 12,
        "content": "Origen:   Metodologías   ágiles  (Scrum, XP). Formato:  Texto breve y simple, normalmente:      “Como [rol], quiero [funcionalidad] para [beneficio].” Enfoque:  Necesidad del usuario expresada en lenguaje natural. Elementos:  Rol, necesidad, beneficio. Ejemplo: “Como cliente, quiero poder pagar con tarjeta para completar mi compra rápidamente.” Historias  de  usuario  (User Stories  - Ágil /Scrum)"
      },
      {
        "slide": 13,
        "content": "Relación entre ambos Una historia de usuario puede convertirse en uno o varios casos de uso más detallados. Los casos de uso son más formales y técnicos, útiles para documentación y modelado UML. Las historias de usuario son más ligeras, usadas en equipos ágiles para priorizar y discutir funcionalidades."
      },
      {
        "slide": 14,
        "content": "Ejemplo comparativo Historia de usuario:    “Como estudiante, quiero inscribirme en cursos online para avanzar en mi carrera.” Caso de uso: Actor: Estudiante. Caso de uso: Inscripción en curso. Flujo principal: Seleccionar curso → Confirmar inscripción → Recibir comprobante. Extensiones: Pago rechazado, curso lleno."
      },
      {
        "slide": 16,
        "content": "COMO: [Rol del usuario] (p. ej., un cliente nuevo) QUIERO: [Acción o funcionalidad] (p. ej., crear una cuenta) PARA: [Beneficio o valor] (p. ej., guardar mis productos favoritos) Estructura Clásica"
      },
      {
        "slide": 17,
        "content": "Una   buena   historia  de  usuario   debe   seguir  el  acrónimo  INVEST para  asegurar   su   calidad . I ndependiente: No debe depender de otras historias. N egociable: Los detalles se discuten, no son contratos cerrados. V aliosa: Debe aportar un beneficio claro al cliente. E stimable: El equipo debe poder calcular cuánto esfuerzo requiere. S mall (Pequeña): Debe poder terminarse dentro de un solo sprint. T esteable : Debe haber una forma clara de verificar que funciona. El  Método  INVEST"
      },
      {
        "slide": 18,
        "content": "Significado de simbología Diagrama de Flujos\n\n[Detalle del docente]: Actores: Usuario (a la izquierda). Administrador (a la derecha). Sistema: Representado por el rectángulo central. Dentro del sistema hay tres casos de uso (óvalos): Realizar Acción A Procesar Acción B Generar Reporte C Relaciones: El Usuario interactúa con “Realizar Acción A” y “Procesar Acción B”. El Administrador interactúa con “Procesar Acción B” y “Generar Reporte C”."
      },
      {
        "slide": 19,
        "content": "Simbología\n\n[Detalle del docente]: ¿Qué es un caso de uso? Es una técnica de modelado que describe cómo un usuario (llamado actor) interactúa con un sistema. Se centra en mostrar el comportamiento del sistema frente a esas interacciones. 🧩 Elementos clave Actor: la persona o sistema externo que utiliza la aplicación (ejemplo: un cliente en un banco digital). Objetivo específico y valioso: lo que el actor quiere lograr (ejemplo: transferir dinero). Interacciones paso a paso: se documenta cómo el actor y el sistema se comunican para alcanzar ese objetivo. Caminos exitosos y escenarios de error: no solo se describe el flujo ideal, también qué pasa si algo falla (ejemplo: error en la validación de datos). Requisitos funcionales: los casos de uso ayudan a capturar lo que el sistema debe hacer para cumplir con las necesidades del usuario. 📌 Ejemplo sencillo Imagina un sistema de cajero automático: Actor: cliente. Objetivo: retirar dinero. Flujo exitoso: el cliente inserta tarjeta → ingresa PIN → selecciona monto → recibe dinero. Escenario de error: PIN incorrecto → el sistema muestra mensaje de error y permite reintentar. En resumen, un caso de uso es una herramienta fundamental para entender y documentar cómo debe comportarse un sistema desde la perspectiva del usuario, asegurando que se cumplan los requisitos funcionales."
      },
      {
        "slide": 20,
        "content": "Simbología\n\n[Detalle del docente]: Componentes clave Actor Es quien interactúa con el sistema. Puede ser un usuario humano, otro sistema o incluso un dispositivo externo. Ejemplo: un cliente del banco. Sistema La aplicación o producto que ofrece la funcionalidad. Ejemplo: el sistema bancario en línea. Objetivo (Meta) El resultado que el actor quiere lograr, siempre debe ser algo valioso para él. Ejemplo: “Realizar transferencia bancaria”. Flujo de eventos La secuencia de pasos que describe cómo se da la interacción entre actor y sistema. Incluye tanto el camino exitoso como posibles variaciones o errores. Ejemplo: el cliente ingresa monto → el sistema verifica fondos → el sistema confirma transferencia."
      },
      {
        "slide": 21,
        "content": "Simbología\n\n[Detalle del docente]: ¿Qué muestra este diagrama? Sistema: Sistema de Inscripción de Cursos Actores: Estudiante: puede buscar cursos, inscribirse, ver horario y cancelar inscripción. Administrador: gestiona inscripciones y cancelaciones. Profesor: consulta horarios y gestiona calificaciones. Casos de uso principales: Buscar Cursos Inscribirse en Curso <<include>> Validar Prerrequisitos <<extend>> Seleccionar Medio de Pago Ver Horario Cancelar Inscripción Gestionar Calificaciones"
      },
      {
        "slide": 22,
        "content": "Simbología\n\n[Detalle del docente]: Notación UML para casos de uso Actor Se dibuja como un muñeco de palo (stickman). Representa al usuario o sistema externo que interactúa con el sistema. Caso de uso Se representa con un óvalo que lleva dentro el nombre de la funcionalidad. Ejemplo: “Realizar transferencia bancaria”. Relaciones Línea simple: indica la interacción entre actor y caso de uso. <<include>>: significa que un caso de uso siempre invoca otro. Ejemplo: “Realizar compra” incluye “Validar pago”. <<extend>>: indica que un caso de uso opcionalmente amplía otro. Ejemplo: “Realizar compra” puede extenderse con “Aplicar descuento”."
      },
      {
        "slide": 23,
        "content": "Simbología\n\n[Detalle del docente]: Buenas prácticas Usar nombres claros y consistentes Los casos de uso deben tener títulos fáciles de entender, sin ambigüedades. Ejemplo: mejor “Registrar usuario” que “Proceso de alta”. No mezclar requerimientos técnicos con funcionales Los casos de uso se enfocan en lo que el sistema debe hacer desde la perspectiva del usuario (funcional). Los detalles técnicos (bases de datos, servidores, protocolos) se documentan en otro nivel. Esto evita confusión y mantiene el enfoque en el valor para el actor. Mantener el diagrama simple y legible No sobrecargar con demasiados actores o relaciones en una sola vista. Si el sistema es complejo, se pueden dividir los diagramas en módulos o subsistemas. Validar con los stakeholders Es fundamental revisar los casos de uso con clientes, usuarios finales o responsables del negocio. Así se asegura que lo que se modela realmente refleja sus necesidades y expectativas."
      },
      {
        "slide": 24,
        "content": "Diferencia  clave Flecha  continua (→):  Secuencia  de  actividades   dentro  del  mismo   proceso . Flecha   discontinua  (------------):  Asociación  o  intercambio  de  información , no  ejecución   directa . Diferencia clave"
      },
      {
        "slide": 25,
        "content": "ACTIVIDAD\n\n[Detalle del docente]: Tipos de casos de uso Casos de uso de negocio Se enfocan en las metas de la empresa o de la organización. Describen cómo los usuarios interactúan con procesos de negocio para alcanzar objetivos estratégicos. Ejemplo: “Gestionar ventas” en una empresa de retail. Aquí no se detallan pantallas ni funciones técnicas, sino el flujo de valor que la organización quiere lograr. Casos de uso de sistema Se centran en las interacciones técnicas entre el usuario y el sistema. Detallan funcionalidades específicas que el software debe ofrecer. Ejemplo: “Registrar cliente en la base de datos”. Aquí sí se describen pasos concretos, validaciones y respuestas del sistema. 📌 Diferencia clave Negocio: visión macro, orientada a objetivos estratégicos. Sistema: visión micro, orientada a funcionalidades técnicas. Ambos son fundamentales en las primeras etapas del desarrollo porque permiten asegurar que el sistema final responda tanto a las necesidades del negocio como a las del usuario final."
      }
    ]
  },
  "ppt11": {
    "title": "PPT Clase 11",
    "slides": [
      {
        "slide": 1,
        "content": "Taller Introducción y Modelo de Negocios Clase N° 11 Fecha: 10-04-26 Carrera: Tec. Programación y Análisis de Sistemas Docente: Daniela Medina A."
      },
      {
        "slide": 2,
        "content": "Condiciones favorables para la clase Mantén tus dispositivos electrónicos en silencio Respeta el turno de participación Practica la puntualidad Mantén todos tus sentidos activos"
      },
      {
        "slide": 3,
        "content": "Fundamentos de Gestión de Proyectos La gestión de proyectos es la disciplina de planificar, ejecutar y controlar tareas y recursos para alcanzar objetivos específicos (SMART) dentro de un tiempo y presupuesto definidos. Aplica conocimientos, habilidades y herramientas para guiar proyectos únicos desde su inicio hasta el cierre, aumentando el éxito organizacional ."
      },
      {
        "slide": 4,
        "content": "El Ciclo de Vida del Proyecto (Las 5 Fases) Casi todos los proyectos atraviesan estas etapas clave para garantizar que el resultado final sea exitoso: I nicio:  Se define el propósito, la justificación y se obtiene la aprobación inicial. Se crea el \"Acta de Constitución\" (Project Charter). Planificación:  Se establece la hoja de ruta detallada: objetivos SMART, cronograma (Carta Gantt), presupuesto, roles y gestión de riesgos. Ejecución:  El equipo realiza las tareas asignadas para crear los entregables. Es la fase donde se consume la mayor cantidad de recursos. Seguimiento y Control:  Se supervisa el progreso para asegurar que el proyecto no se desvíe del plan original. Se ajustan plazos o recursos si hay imprevistos. Cierre:  Se entrega el resultado final al cliente, se liberan los recursos y se documentan las \"lecciones aprendidas\" para futuros proyectos"
      },
      {
        "slide": 5,
        "content": "Gestión de Riesgo La gestión de riesgos es el proceso sistemático de identificar, evaluar y responder a eventos inciertos que podrían afectar los objetivos de un proyecto. Su meta no es eliminar todo riesgo (lo cual es imposible), sino minimizar las amenazas y maximizar las oportunidades."
      },
      {
        "slide": 6,
        "content": "1. El Proceso de Gestión de Riesgos (5 Pasos) Para gestionar la incertidumbre de forma proactiva, se suele seguir este flujo: Identificación:  Listar todos los eventos potenciales que podrían afectar el cronograma, presupuesto o calidad. Se usan técnicas como la lluvia de ideas, entrevistas a expertos o el análisis FODA. Análisis de Riesgos:  Determinar la probabilidad de que ocurra cada riesgo y el impacto que tendría. Cualitativo:  Clasificación rápida como \"Alto\", \"Medio\" o \"Bajo\". Cuantitativo:  Uso de datos numéricos para proyectar costos o retrasos específicos. Priorización:  Ordenar los riesgos según su gravedad. Esto ayuda a decidir dónde enfocar los recursos limitados. Planificación de Respuesta:  Definir qué acciones se tomarán si el riesgo ocurre. Seguimiento y Control:  Monitorear continuamente el proyecto para detectar nuevos riesgos y evaluar la efectividad de las respuestas implementadas"
      },
      {
        "slide": 7,
        "content": "¿Qué es el FODA? Fortalezas (F):  Capacidades internas que diferencian y generan ventaja competitiva. Oportunidades (O):  Factores externos positivos que pueden aprovecharse. Debilidades (D):  Aspectos internos que limitan el desempeño. Amenazas (A):  Factores externos que pueden afectar negativamente."
      },
      {
        "slide": 8,
        "content": "¿ Cómo realizar un análisis FODA ? 1-. Definir el objetivo del análisis (ej. mejorar un proyecto, evaluar una empresa). 2-. Recolectar información interna y externa (recursos, procesos, mercado, competencia). 3-. Clasificar en la matriz FODA:      Interno → Fortalezas y Debilidades.      Externo → Oportunidades y Amenazas. 4-.Diseñar estrategias: FO: Usar fortalezas para aprovechar oportunidades. FA: Usar fortalezas para enfrentar amenazas. DO: Superar debilidades aprovechando oportunidades. DA: Minimizar debilidades y evitar amenazas."
      },
      {
        "slide": 9,
        "content": "Características del análisis FODA El análisis FODA comprende cuatro factores principales que conforman la sigla de su nombre, y que se agrupan en dos tipos de variables: internas y externas a la organización. VARIABLES INTERNAS A LA ORGANIZACIÓN 1-. Fortalezas.     Corresponden a las variables internas y positivas que están relacionadas con los atributos, ventajas diferenciales y todas las cualidades que tiene el elemento a analizar (que puede ser un servicio, un negocio, un producto) y que lo destacan de los competidores."
      },
      {
        "slide": 10,
        "content": "Para conocer las fortalezas debemos responder a las siguientes preguntas:                     ¿Qué ventajas ofrece respecto a la competencia directa?                                         ¿Qué beneficios brinda a los consumidores?                                  ¿Reduce al máximo su impacto ambiental y es sostenible?"
      },
      {
        "slide": 11,
        "content": "2-. Debilidades Corresponden a las variables internas y negativas que están relacionadas con las deficiencias y aspectos que debe mejorar el elemento a analizar (producto, servicio, negocio) para ser rentable, competitivo y sostenible en el mercado. Para conocer las debilidades debemos responder a las siguientes preguntas:              ¿Por qué los clientes eligen a los competidores en lugar de elegir nuestra               propuesta?              ¿Satisface las expectativas de los clientes?             ¿Analiza el impacto que su actividad genera en el medioambiente?"
      },
      {
        "slide": 12,
        "content": "VARIABLES EXTERNAS A LA ORGANIZACIÓN   Oportunidades.  Corresponden a las variables externas y positivas que están relacionadas con el momento o circunstancia del entorno en el que se desarrolla nuestro negocio y que puede significar un beneficio para la organización. Por ejemplo: Una nueva legislación que facilita la exportación de mi producto para vender en el extranjero. Para conocer las oportunidades debemos responder a las siguientes preguntas: ¿Qué modificación podemos realizar en nuestro negocio para que satisfaga una necesidad extra, además de aquella para la que fue creado? ¿Qué necesidades demanda el mercado actual y cómo responde nuestro negocio a esas demandas? ¿Qué limitaciones tienen los competidores para expandirse? ¿Podemos superar alguna de esas limitaciones?"
      },
      {
        "slide": 13,
        "content": "Amenazas Corresponden a las variables externas y negativas que están relacionadas con los problemas y las novedades del entorno en el que se desarrolla nuestro negocio. Comprende la situación del mercado y de los competidores directos, que puede afectar en mayor o menor medida a nuestro negocio. Para conocer las amenazas debemos responder a las siguientes preguntas: ¿Nos perjudican las leyes locales sobre comercialización y manufactura?   ¿Podemos afrontar el aumento de precios de las materias primas? ¿Cómo nos afectan las nuevas legislaciones? ¿Surgieron nuevos competidores que ofrecen algo distinto?"
      },
      {
        "slide": 14,
        "content": "Ejemplo de análisis FODA A continuación detallamos el ejemplo de una empresa que fabrica una línea de jabones para el cuidado de la piel y quiere realizar un análisis FODA de sus jabones: FORTALEZAS ¿Cuál es nuestra ventaja diferencial en el mercado? La calidad de las materias primas que son naturales y 100 % puro vegetal. Sugerencia: Mantener la calidad y procesos de trabajo."
      },
      {
        "slide": 15,
        "content": "OPORTUNIDADES ¿Cuál es la principal necesidad a cubrir para los consumidores de este tipo de productos?  Utilizar un envoltorio seguro y que no genere desperdicios, algo que en el mundo del marketing se conoce como zero waste, expresión en inglés que significa “residuo cero”. Sugerencia:  Mantener nuestro envoltorio reutilizable de bolsa de tela de algodón orgánico confeccionada por empleados de organizaciones que trabajan de manera digna. DEBILIDADES ¿Cuál es nuestra principal desventaja?  El reducido alcance de logística para comercializar nuestros productos en todo el país y en el extranjero. Sugerencia:  Establecer convenios con cadenas y puntos de venta de negocios que no se relacionen en forma directa con nuestro rubro, pero que compartan los mismos valores. Por ejemplo: almacenes que venden productos alimenticios a granel y que suelen comercializar productos industrializados que fomentan el comercio justo y la alimentación saludable."
      },
      {
        "slide": 16,
        "content": "AMENAZAS ¿Cuál es nuestra principal amenaza? Las nuevas normativas, emitidas por el ente regulador y fiscalizador estatal, exigen más instancias de análisis y monitoreo para la conservación y la logística de los productos de cosmética, lo que representa elevados costos para realizar los testeos, trámites y formularios. Sugerencia: Avanzar lo antes posible con un servicio de asesoría para realizar el trámite solicitado por el ente regulador y obtener un certificado de “autorización en trámite” y poder continuar comercializando los lotes ya producidos. Además, incrementar de manera moderada los precios de los próximos lotes de productos para afrontar estos gastos."
      },
      {
        "slide": 17,
        "content": "Importancia del análisis FODA El análisis FODA es una técnica que permite estudiar ciertos factores internos y externos de la organización para comprender el estado de situación del negocio en el mercado."
      },
      {
        "slide": 18,
        "content": "El análisis FODA Es importante realizar un análisis FODA, tanto para el inicio de un negocio o lanzamiento de un producto, como durante su desarrollo, porque permite orientar a la organización para realizar una planificación estratégica acertada, tras identificar sus fortalezas y sus debilidades. En los negocios no siempre se dan las condiciones óptimas de comercialización, de inversión necesaria o de reglas de mercado. Por eso, es importante tomar decisiones estratégicas en base a datos concretos y reales, no solo apreciaciones personales. El análisis FODA es uno de los múltiples métodos de estudio de mercado, que permite obtener datos concretos."
      },
      {
        "slide": 19,
        "content": "Análisis CAME El análisis CAME es otra técnica de análisis que permite avanzar luego de haber realizado un análisis FODA, es decir, es el paso siguiente y la puesta en acción. El nombre del método es una sigla formada por las primeras letras de las siguientes palabras: Corregir, Afrontar, Mantener y Explotar y se corresponden con las palabras de la sigla FODA. Corregir las debilidades.  Se plantean acciones que contribuyan a modificar o disminuir las deficiencias y aspectos negativos del negocio. Por ejemplo: Los jabones aún no se comercializan de manera masiva en todo el territorio nacional y es necesario establecer convenios con otras cadenas y tiendas."
      },
      {
        "slide": 20,
        "content": "Afrontar las amenazas Se plantean acciones que permitan sobrepasar conflictos o evitarlos. Por ejemplo: Ampliar la variedad de productos para no depender solo de una línea acotada de artículos que puede dejar de ser competitiva debido a la gran cantidad de competidores en el mercado.   Mantener las fortalezas Se plantean acciones que mantienen las cualidades del negocio en el tiempo y que representan una ventaja diferencial. Por ejemplo: Utilizar siempre la misma calidad de las materias primas y su proceso de manufactura. Los jabones son muy efectivos, no provocan alergia y tanto su producción como su consumo son sostenibles y no generan impacto negativo en el medio ambiente."
      },
      {
        "slide": 21,
        "content": "Explotar las oportunidades Se plantean acciones de mejora continua que buscan optimizar las fortalezas y detectar nuevas ventajas productivas para el negocio. Por ejemplo: Cada vez son más los consumidores que eligen productos naturales debido a la difusión de información sobre los aspectos negativos de los jabones convencionales elaborados con gran cantidad de productos químicos que pueden resultar nocivos para la salud."
      },
      {
        "slide": 23,
        "content": "https://www.youtube.com/watch?v=gHaDGlix0DY VIDEO COMPLEMENTARIO \"FODA\""
      },
      {
        "slide": 24,
        "content": "https://www.youtube.com/watch?v=AG8jW1hcDOU VIDEO COMPLEMENTARIO CAME"
      },
      {
        "slide": 25,
        "content": "Actividad Individual: “Mi Proyecto Tecnológico y su Estrategia FODA + CAME” Actividad en clases Objetivo Que cada  uno  identifique los factores internos y externos que afectan un proyecto tecnológico propio o ficticio, y proponga acciones estratégicas concretas para mejorarl o."
      },
      {
        "slide": 26,
        "content": "Instrucciones 1- . Piensa en un proyecto tecnológico que te interese o que hayas desarrollado (por ejemplo, una app, un sistema web, un videojuego educativo, o una herramienta de automatización). 2- . Realiza un análisis FODA del proyecto, considerando: Fortalezas: capacidades técnicas, innovación, facilidad de uso, diseño. Debilidades: errores, falta de recursos, poca experiencia, limitaciones técnicas. Oportunidades: tendencias tecnológicas, necesidades del mercado, apoyo institucional. Amenazas: competencia, cambios tecnológicos rápidos, costos, regulaciones."
      },
      {
        "slide": 27,
        "content": "Instrucciones 3-. Luego, transforma tu FODA en un análisis CAME, definiendo acciones concretas: C: ¿Qué harás para corregir tus debilidades? A: ¿Cómo afrontarás las amenazas externas? M: ¿Qué harás para mantener tus fortalezas? E: ¿Cómo aprovecharás las oportunidades? 4-. Redacta un informe breve (1 página) con: Descripción del proyecto. Tabla FODA. Acciones CAME. Conclusión: ¿Qué aprendiste sobre tu proyecto al hacer este análisis?"
      },
      {
        "slide": 28,
        "content": "Formato sugerido\n\n[Detalle del docente]: Concepción del proyecto: Se identifica una necesidad o problema y se plantea una idea inicial. Definición y planificación: Se establecen objetivos, alcance, recursos, cronograma y presupuesto. Lanzamiento: Se inicia oficialmente el proyecto, se asignan roles y se comunican los planes. Ejecución y control: Se desarrollan las tareas planificadas, mientras se monitorea el avance, costos y calidad. Cierre: Se entregan los resultados, se evalúa el cumplimiento de objetivos y se documentan aprendizajes."
      },
      {
        "slide": 29,
        "content": "Ejemplo: Datos del estudiante Nombre: __________________________ Proyecto elegido (app, sistema, videojuego, etc.): __________________________ Análisis FODA (Diagnóstico)"
      },
      {
        "slide": 30,
        "content": "Análisis Came Conclusión personal ¿Qué aprendiste sobre tu proyecto al hacer este análisis? ¿Qué acción crees que es más urgente implementar?"
      }
    ]
  }
}
};
