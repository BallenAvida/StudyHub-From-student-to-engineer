/*
  slide_explanations.js
  Explicaciones en voz de profesora para cada diapositiva de cada PPT.
  Escritas con mis propias palabras, proporcionales al contenido de cada slide.
*/

const EXPLANATIONS = {

  // ─────────────────────────────────────────────
  //  PPT SEGUNDA CLASE
  // ─────────────────────────────────────────────
  "PPT SEGUNDA CLASE": {

    "Diapositiva 3": `Los requerimientos de software son el contrato escrito entre quien pide el sistema y quien lo construye. Imagina que le pides a un arquitecto que construya una casa sin decirle cuántas habitaciones quieres, si necesita garaje o qué altura debe tener: el resultado puede ser una casa que nada tiene que ver con lo que soñabas. Exactamente lo mismo pasa en el software.

Los requerimientos son especificaciones que describen las funciones, características y restricciones que el sistema debe cumplir. Su propósito central es generar un entendimiento compartido y preciso entre tres actores: el cliente (quien tiene el problema de negocio), los usuarios (quienes van a usar el sistema día a día) y el equipo de desarrollo (quienes lo van a construir). Sin ese entendimiento común, cada uno trabaja con su propia interpretación de lo que se necesita, y al final del proyecto nadie está satisfecho.

La importancia que señala la diapositiva no es exagerada: si los requerimientos no están bien definidos desde el inicio, el sistema puede terminar siendo técnicamente impecable pero completamente inútil para el negocio. Es el error más caro que puede cometer un proyecto de software, porque el esfuerzo de meses de desarrollo se va a la basura.`,

    "Diapositiva 4": `Esta diapositiva establece dos ideas fundamentales que van juntas. La primera es que el análisis y diseño de sistemas no es cosa exclusiva de programadores: entenderlo también beneficia a los clientes y usuarios porque les da herramientas para comunicarse mejor con el equipo técnico, detectar qué necesitan realmente y evitar que les construyan algo que no sirve. Cuando el cliente entiende cómo funciona el análisis, la conversación se vuelve más productiva.

La segunda idea es la definición de sistema, que es mucho más amplia de lo que la gente cree. Un sistema no es solo software ni solo código: es la combinación de hardware, software, personas, procedimientos y datos. Esto es fundamental porque cuando algo "falla en el sistema", a veces el problema no está en el código sino en el proceso, en el humano que lo opera, o en los datos que se le entregan. El análisis debe considerar todos estos componentes para ser completo.

La diapositiva también menciona que las organizaciones frecuentemente cambian sus sistemas de información, no porque estén rotos, sino porque las necesidades del negocio evolucionan constantemente: nuevas regulaciones, nuevos mercados, nuevas formas de trabajar.`,

    "Diapositiva 5": `Esta diapositiva presenta gráficamente el rol de los requerimientos dentro del ciclo completo de la Ingeniería de Software. La idea central es que los requerimientos no son un paso opcional ni algo que se hace "de pasada" al inicio del proyecto: son la base sobre la que se construye todo lo demás. Si el diseño, el desarrollo y las pruebas son los pisos de un edificio, los requerimientos son los cimientos.

Un arquitecto no empieza a poner ladrillos antes de entender el terreno y tener un plano aprobado. De la misma manera, un equipo de desarrollo no debería escribir una línea de código antes de tener los requerimientos bien definidos, documentados y validados. Esta diapositiva refuerza que el analista de requerimientos no es "alguien que escribe lo que pide el cliente": es un rol especializado dentro de la ingeniería que requiere habilidades técnicas y de comunicación.`,

    "Diapositiva 6": `Los requerimientos no son todos del mismo tipo, y clasificarlos correctamente es fundamental para saber cómo tratarlos, quién los implementa y cómo se prueban. Los más importantes son los funcionales, que describen qué debe hacer el sistema, las acciones concretas que ejecuta para el usuario. Y los no funcionales, que describen cómo debe hacerlo: bajo qué condiciones de rendimiento, seguridad, disponibilidad o usabilidad debe operar.

También existen los requerimientos de dominio, que reflejan reglas propias del negocio o la industria, como regulaciones legales o estándares del sector. Y los requerimientos de datos, que definen cómo debe manejarse, almacenarse y protegerse la información.

Clasificar bien un requerimiento importa mucho en la práctica: un requerimiento no funcional mal clasificado como funcional puede llevar a que el equipo lo implemente de manera incorrecta o que las pruebas no lo verifiquen adecuadamente.`,

    "Diapositiva 7": `Los requerimientos no aparecen solos: deben pasar por un proceso formal de cuatro fases que garantiza su calidad y completitud.

La primera fase es la Obtención o Elicitación, que es el proceso de "extraerle" la información al cliente y a los usuarios. Se usan entrevistas, encuestas, observación directa del trabajo, talleres y prototipos. La trampa de esta fase es que los usuarios a veces no saben expresar lo que necesitan, así que el analista debe ser como un detective: preguntar, escuchar y leer entre líneas.

La segunda fase es el Análisis, donde el equipo revisa toda esa información críticamente: ¿hay requerimientos que se contradicen? ¿hay necesidades ocultas que el usuario asumió pero nunca dijo explícitamente?

La tercera es la Especificación, donde se documenta todo de manera formal, clara y sin ambigüedades. Aquí la precisión del lenguaje es vital: "rápido" no es un requerimiento válido, pero "responder en menos de 2 segundos con hasta 1.000 usuarios simultáneos" sí lo es.

La cuarta es la Validación, donde se presenta lo documentado al cliente para confirmar que realmente refleja lo que necesita, antes de pasar al diseño o programación.

El ejemplo de la app de comida que aparece en la diapositiva ilustra perfectamente la diferencia: "permitir agregar un plato al carrito" es funcional (una acción concreta), mientras que "funcionar en Android e iOS" es no funcional (una condición de calidad que se aplica a todas las funciones).`,

    "Diapositiva 8": `Esta diapositiva es una advertencia sobre las consecuencias de hacer mal —o saltarse— la fase de requerimientos. Son cuatro riesgos muy reales.

El primero es el más obvio: el sistema no satisface al cliente. Puedes haber gastado meses construyendo algo técnicamente correcto, pero que no resuelve el problema real del negocio. El segundo es el de los costos adicionales por cambios tardíos. En ingeniería de software existe el principio de que corregir un error en la fase de requerimientos cuesta 1 unidad de esfuerzo, pero corregirlo en producción puede costar 100 veces más, porque implica rediseñar, recodificar, volver a probar y redeployar.

El tercer riesgo es el tiempo perdido en desarrollo innecesario: si el equipo programa funcionalidades que el cliente nunca pidió, ese esfuerzo se va a la basura. El cuarto es el más sutil: si no tienes requerimientos claros, tampoco tienes criterios para verificar si el sistema funciona bien. ¿Cómo pruebas que algo "funciona correctamente" si nunca definiste qué significa correcto?`
  },

  // ─────────────────────────────────────────────
  //  PPT TERCERA CLASE
  // ─────────────────────────────────────────────
  "PPT TERCERA CLASE": {

    "Diapositiva 4": `La distinción entre requerimientos funcionales y no funcionales es la más importante del levantamiento de requerimientos, y es la que más confusión genera en los exámenes.

Los requerimientos funcionales son las acciones y servicios que el sistema debe realizar, lo que el usuario puede ver y tocar directamente. Son el "qué" del sistema. Por ejemplo, "el sistema debe permitir registrar nuevos usuarios" describe una acción concreta que el sistema ejecuta.

Los no funcionales, en cambio, son las restricciones de calidad sobre esas acciones: el "cómo debe ser" el sistema mientras funciona. Rendimiento, seguridad, disponibilidad, compatibilidad, usabilidad: todo eso es no funcional. El ejemplo "responder en menos de 2 segundos" es un clásico no funcional porque no describe una nueva función, sino una condición de calidad que se aplica a todas las funciones del sistema.

La pregunta que siempre debes hacerte para distinguirlos es: ¿esto describe una nueva capacidad del sistema, o una característica de cómo debe operar? Si es una capacidad nueva → funcional. Si es una condición de calidad → no funcional.`,

    "Diapositiva 5": `Los ejemplos de WhatsApp y Netflix son poderosos porque son sistemas que todos usamos y entendemos, lo que hace muy fácil aplicar la distinción funcional/no funcional a algo concreto.

En WhatsApp: enviar mensajes, hacer llamadas, compartir fotos → esas son funciones concretas que el sistema ejecuta, son funcionales. Pero que los mensajes lleguen inmediatamente, que las conversaciones estén cifradas de extremo a extremo, que la app funcione bien aunque tengas mala señal → eso no agrega nuevas funciones, define la calidad con la que operan las que ya existen. Es no funcional.

En Netflix: reproducir películas y series es la función principal (funcional). Pero que esa reproducción funcione en tu Smart TV, tu celular y tu laptop al mismo tiempo, o que la calidad del video se adapte automáticamente a la velocidad de tu internet, son condiciones de calidad sobre esa función (no funcional).

Aprende a pensar en estas dos dimensiones con cualquier software que uses y nunca te vas a confundir.`,

    "Diapositiva 7": `Una de las primeras preguntas que debe responder un analista al llegar a un nuevo proyecto es: ¿en qué tipo de organización estoy trabajando y cuál es el contexto de su problemática? Porque el tipo de problemática define qué stakeholders estarán involucrados, qué tipo de requerimientos son más probables y qué restricciones legales o técnicas existen.

Las problemáticas sociales afectan al bienestar colectivo: sistemas de salud con colapso de atención, modelos educativos que no incluyen a estudiantes con discapacidad, plataformas para coordinar trabajo comunitario. El impacto es humano y directo.

Las problemáticas empresariales son las más comunes en el mundo del software comercial: una empresa que no puede saber en tiempo real cuánto stock tiene (necesita un ERP), una compañía que no gestiona bien la relación con sus clientes (necesita un CRM), o un proceso logístico que genera retrasos y pérdidas. Aquí el foco es la eficiencia y la competitividad.

Las problemáticas gubernamentales son las más complejas en términos de actores y regulaciones: desde el trámite para renovar tu carnet de identidad hasta el pago de impuestos o la solicitud de permisos municipales. Aquí la cantidad de usuarios es masiva y las regulaciones son estrictas.`,

    "Diapositiva 8": `Esta diapositiva presenta los cinco roles clave de cualquier proyecto de software. Entender estos roles es esencial para saber con quién hablar, qué pedirle a cada uno y cómo gestionar sus expectativas.

El Patrocinador del Proyecto es quien pone el dinero y toma decisiones de alto nivel: define si el proyecto sigue adelante o se cancela. El Product Owner es quien define qué construir: prioriza la lista de funcionalidades (el backlog) y es el puente entre el negocio y el equipo técnico. Es el rol más crítico en metodologías ágiles.

El Equipo de Desarrollo (desarrolladores, QA, diseñadores) es quien ejecuta: programan, prueban y diseñan el sistema. Los Usuarios Finales usan el producto a diario y su retroalimentación es la más honesta porque ellos detectan problemas que nadie más ve. Y el Gerente de Proyecto mantiene todo sincronizado: gestiona tiempos, riesgos y la comunicación entre todos.

Una analogía que lo hace fácil de recordar: si el proyecto fuera una película, el patrocinador sería el estudio que pone el dinero, el Product Owner sería el director creativo, el equipo sería los actores y técnicos, los usuarios finales serían el público de prueba, y el Project Manager sería el productor ejecutivo que mantiene todo en carril.`,

    "Diapositiva 9": `Además de los stakeholders internos del equipo, existen actores externos que tienen impacto directo en el éxito o fracaso del sistema sin ser parte del desarrollo.

Los Clientes financian el proyecto y esperan retorno de su inversión: su medida de éxito es si el sistema genera valor para su negocio. Los Usuarios Finales, en este contexto, son los consumidores del producto final: si no lo encuentran útil y fácil de usar, el proyecto falla aunque funcione técnicamente perfecto.

Los Proveedores dan la infraestructura y herramientas necesarias: servidores en la nube, licencias de software, APIs externas. Sin ellos, muchos proyectos no podrían ejecutarse. Y las Entidades Regulatorias son quizás los stakeholders más poderosos y menos visibles: son los organismos que dictan normas de cumplimiento legal, ético y de seguridad. En Chile, por ejemplo, la Ley de Datos Personales define restricciones concretas sobre cómo un sistema puede almacenar y usar información de sus usuarios. Ignorar estas normas puede llevar a multas millonarias o al cierre del sistema.`,

    "Diapositiva 10": `Más allá de sus roles individuales, todos los stakeholders comparten responsabilidades comunes que determinan el éxito del proyecto.

La Definición de Requerimientos es la primera: cada stakeholder debe aportar claridad desde su perspectiva. El cliente conoce el problema de negocio, el usuario final conoce cómo trabaja en el día a día, el equipo técnico sabe qué es viable construir.

La Retroalimentación Continua es la segunda: en metodologías ágiles, la Sprint Review existe precisamente para que todos vean el progreso real y den su opinión antes de que sea demasiado tarde para cambiar algo. La tercera es la Asignación de Recursos: no solo dinero, sino tiempo de las personas clave para entrevistas, revisiones y aprobaciones.

La cuarta es la Gestión de Expectativas: muchos proyectos fracasan no porque el software sea malo, sino porque el stakeholder esperaba algo distinto a lo que se construyó. La comunicación clara y constante a lo largo del proyecto es la única solución real a este problema.`
  },

  // ─────────────────────────────────────────────
  //  PPT CUARTA CLASE
  // ─────────────────────────────────────────────
  "PPT CUARTA CLASE": {

    "Diapositiva 4": `BPMN, que significa Business Process Model and Notation, es el lenguaje estándar internacional para representar procesos de negocio mediante diagramas de flujo visuales. La idea detrás de su existencia es simple pero poderosa: cuando describes un proceso solo con palabras, cada persona lo interpreta a su manera. Cuando lo dibujas con símbolos estandarizados de BPMN, todos ven exactamente lo mismo.

Es como la diferencia entre describir verbalmente cómo llegar a un lugar versus mostrar un mapa: el mapa no da lugar a ambigüedades. Su propósito principal es facilitar la comunicación entre los analistas de negocio (que conocen los procesos), los desarrolladores (que los van a automatizar) y los stakeholders (que los aprueban). Al ser un estándar global reconocido internacionalmente, los diagramas BPMN pueden ser leídos por cualquier profesional del mundo, independiente del idioma o de la herramienta que usen.`,

    "Diapositiva 5": `BPMN organiza todos sus símbolos en cuatro grandes categorías, y entender esta organización es la clave para leer cualquier diagrama sin perderse.

Los Flujos de Proceso son los que definen el comportamiento: inicio, actividades (tareas), decisiones (compuertas) y fin. Son la columna vertebral del diagrama, el "esqueleto" que muestra qué pasa y en qué orden.

Los Datos representan la información que fluye: documentos que se producen, formularios que se llenan, registros que se consultan. Son los "insumos" y "productos" de cada actividad.

Los Conectores son los "cables" que unen todo: flechas sólidas que indican secuencia de ejecución, y flechas punteadas que indican comunicación entre participantes distintos.

Los Artefactos son el contexto: anotaciones que explican algo sin cambiar el flujo, y grupos que organizan visualmente actividades relacionadas.

Si reconoces estas cuatro categorías, puedes orientarte en cualquier diagrama BPMN aunque no conozcas todos sus símbolos específicos.`,

    "Diapositiva 6": `No todos los diagramas BPMN sirven para lo mismo. Existen cuatro tipos y cada uno responde una pregunta diferente sobre el proceso.

Los Diagramas de Procesos Privados muestran cómo funciona un proceso dentro de una sola organización, "puertas adentro": cómo un hospital gestiona la admisión de pacientes o cómo una empresa procesa una solicitud interna.

Los Diagramas de Colaboración son más complejos: muestran cómo interactúan dos o más participantes distintos usando "pools" (carriles) para separar a cada actor. Un proceso de compra online que muestra simultáneamente lo que hace el cliente, el sistema del comercio y el banco es un diagrama de colaboración.

Los Diagramas de Coreografía se enfocan exclusivamente en la secuencia de mensajes entre actores: quién le envía qué a quién y cuándo, sin mostrar las actividades internas de cada uno.

Los Diagramas de Conversación son la vista más simplificada: un resumen de alto nivel de las interacciones entre participantes, sin detalles de flujo. Se usan para dar una visión panorámica rápida.`,

    "Diapositiva 7": `BPMN tiene cuatro ventajas que lo han convertido en el estándar dominante del modelado de procesos.

La Claridad Universal es quizás la más valiosa: un diagrama BPMN lo puede leer tanto el gerente de finanzas como el desarrollador de backend, porque los símbolos son visuales e intuitivos. Elimina la brecha de comunicación entre el mundo técnico y el mundo del negocio.

La Optimización es el beneficio más práctico: al dibujar un proceso lo estás viendo completo por primera vez. Eso revela cuellos de botella, pasos duplicados y oportunidades de automatización que antes eran invisibles porque el proceso solo existía en la cabeza de las personas.

El Estándar Global significa que los diagramas que creas en Bizagi los puede abrir alguien con Camunda o Signavio sin perder nada, porque todos hablan el mismo idioma.

La Integración es el punto más avanzado: los diagramas BPMN se pueden conectar con sistemas BPMS que los ejecutan automáticamente, convirtiendo el diagrama en el proceso real que corre en producción.`,

    "Diapositiva 8": `BPMN tiene sus desafíos reales y es honesto reconocerlos antes de usarlo.

La Curva de Aprendizaje existe: aunque los símbolos básicos son intuitivos, BPMN completo tiene más de 100 elementos. Confundir un evento de mensaje con un flujo de mensaje, por ejemplo, cambia completamente el significado del diagrama. La solución es empezar con los elementos básicos y avanzar gradualmente.

La Complejidad es otro desafío real: cuando un proceso tiene muchos actores, muchas decisiones y muchas excepciones, el diagrama puede crecer hasta volverse ilegible. La solución profesional es descomponer procesos complejos en subprocesos, mostrando solo el nivel de detalle necesario para cada audiencia.

Y la elección de Herramientas importa más de lo que parece: Bizagi es muy visual y fácil de usar para aprender, Camunda es ideal para ejecutar los procesos automáticamente, Signavio facilita la colaboración en equipo. La herramienta debe adaptarse al contexto y al nivel del equipo.`,

    "Diapositiva 10": `El Evento de Inicio es el punto donde el proceso arranca, y se representa con un círculo de borde delgado. Es uno de los símbolos más básicos pero más importantes de BPMN porque todo proceso debe tener exactamente un inicio claramente definido. Si no está claro qué lo dispara, nadie sabe cuándo comenzar.

La versión más simple tiene el círculo vacío (inicio genérico), pero puede tener símbolos internos que indican qué lo activa: un sobre indica que el proceso se dispara al recibir un mensaje; un reloj indica inicio programado en horario; un rayo indica que lo dispara una señal del sistema.

En el ejemplo de la diapositiva, el evento de inicio es la recepción de una solicitud. Piénsalo como el "play" de una película: antes de ese momento, nada sucede. Un proceso sin evento de inicio claro es un proceso que nadie sabe cuándo ejecutar.`,

    "Diapositiva 11": `La Compuerta o Gateway es el símbolo más importante para modelar lógica y toma de decisiones dentro de un proceso. Se representa con un rombo y aparece cada vez que el flujo puede tomar caminos diferentes dependiendo de alguna condición.

Hay tres tipos que debes dominar. La Compuerta Exclusiva (marcada con X) significa "uno u otro": el proceso toma exactamente uno de los caminos disponibles. Es la más común: ¿El pago fue aprobado? Sí → continúa el pedido. No → notifica al cliente.

La Compuerta Paralela (marcada con +) significa "todos al mismo tiempo": el proceso divide el flujo en múltiples caminos que se ejecutan en paralelo. Por ejemplo, enviar correo de confirmación Y actualizar base de datos simultáneamente, sin que uno deba esperar al otro.

La Compuerta Inclusiva (marcada con O) es la más flexible: "uno o más caminos se activan según las condiciones". Por ejemplo, un cliente puede recibir descuento por volumen, descuento por cliente frecuente, o ambos al mismo tiempo.

Regla rápida: X = solo uno, + = todos, O = uno o más.`,

    "Diapositiva 12": `El Evento de Fin marca el momento en que el proceso concluye, y se representa con un círculo de borde grueso. Al igual que el inicio, puede tener variantes que indican cómo termina el proceso.

El fin normal (borde grueso sin símbolo interno) indica que el proceso terminó exitosamente. El fin de error (con símbolo de rayo o X) indica que el proceso terminó de manera anormal por una falla. El fin de mensaje (con símbolo de sobre) indica que el proceso concluye enviando una notificación a otro participante.

Un proceso puede tener múltiples eventos de fin si tiene varios caminos posibles: por ejemplo, "Solicitud Aprobada" y "Solicitud Rechazada" son dos fines distintos del mismo proceso. La regla es que todos los caminos deben terminar en algún evento de fin: no puede haber flechas que "se pierdan" en el diagrama. El fin es la "línea de meta": todos los caminos del proceso deben llegar a una.`,

    "Diapositiva 14": `El Almacén de Datos representa una base de datos o cualquier repositorio persistente de información. Se simboliza con el clásico cilindro de base de datos que probablemente ya conoces de otros diagramas.

La diferencia clave con el Objeto de Datos es importante: el objeto de datos es información en tránsito, que un proceso produce o consume en un momento específico (como un formulario o un documento). El almacén de datos es el repositorio permanente donde esa información vive de manera estable y puede ser consultada por múltiples procesos y en múltiples momentos.

Por ejemplo, en un sistema de matrícula: el formulario que llena el estudiante es un objeto de datos que transita por el proceso. La base de datos de estudiantes inscritos es el almacén de datos que persiste entre procesos y entre períodos académicos. Se usa en diagramas BPMN cuando quieres mostrar explícitamente que el proceso lee de o escribe en un sistema de datos externo al flujo inmediato.`,

    "Diapositiva 16": `El Flujo de Mensaje es la flecha punteada que termina en un pequeño sobre, y representa la comunicación entre dos participantes distintos, es decir, entre elementos que pertenecen a diferentes pools del diagrama.

Es fundamentalmente diferente al Flujo de Secuencia: la flecha sólida muestra el orden de ejecución dentro de un mismo participante, mientras que la flecha punteada con sobre muestra el intercambio de información entre actores distintos.

En un diagrama de colaboración de compra online: cuando el cliente hace su pedido y el sistema del comercio recibe esa solicitud, esa comunicación es un flujo de mensaje. Cuando el banco le confirma al sistema del comercio que la transacción fue exitosa, otro flujo de mensaje.

El error más común es confundir ambas flechas. La regla es simple: sólida = secuencia dentro del mismo actor; punteada con sobre = comunicación entre actores distintos. Si ves una flecha cruzando de un pool a otro, siempre debe ser punteada.`,

    "Diapositiva 18": `La Anotación es el equivalente BPMN del post-it: una nota que puedes adjuntar a cualquier elemento del diagrama para agregar contexto, condiciones especiales o aclaraciones que no caben en el nombre de la actividad. Se representa con un recuadro de texto conectado al elemento por una línea punteada.

Las anotaciones no cambian la lógica del proceso: no son actividades, no son decisiones, no redirigen el flujo. Son información adicional para quien lee el diagrama, especialmente cuando hay condiciones de negocio que no son obvias.

Por ejemplo: "Este paso depende del sistema CRM externo", o "Solo aplica para contratos vigentes", o "El tiempo máximo para esta tarea es de 24 horas". Sin esas anotaciones, el diagrama puede ser técnicamente correcto pero difícil de interpretar para alguien que no conoce el contexto del negocio.

Un buen diagrama BPMN usa anotaciones con moderación: en los puntos donde realmente se necesita contexto adicional, no en cada elemento.`,

    "Diapositiva 20": `Esta es la actividad práctica del módulo de BPMN, que te pide modelar un proceso real usando Bizagi Modeler. La elección del proceso no es al azar: todos los ejemplos propuestos (solicitud de inscripción escolar, compra en línea, solicitud de vacaciones, atención de reclamos) son procesos cotidianos con estructura clara de inicio, decisiones y múltiples actores.

Lo que hace valioso este ejercicio no es aprender a usar el software, sino aprender a pensar en procesos. Antes de abrir Bizagi, deberías poder responder: ¿qué dispara este proceso? ¿quiénes son los actores? ¿cuáles son los puntos de decisión? ¿cuántos fines posibles tiene? Si puedes responder esas preguntas, el diagrama prácticamente se dibuja solo.`
  },

  // ─────────────────────────────────────────────
  //  PPT SEXTA CLASE
  // ─────────────────────────────────────────────
  "PPT SEXTA CLASE": {

    "Diapositiva 4": `La mejora continua parte de una premisa contraintuitiva: en lugar de buscar el proceso perfecto desde el inicio (lo cual es prácticamente imposible), se empieza con algo funcional y se mejora constantemente en pequeños pasos iterativos.

Esta filosofía se conecta directamente con las metodologías ágiles que ya conocemos: Scrum y XP no buscan construir el sistema perfecto en un sprint, sino entregar algo funcional, recibir retroalimentación real y mejorar en el siguiente ciclo. La conexión con BPMN también es directa: al tener procesos modelados visualmente, puedes identificar dónde hacer cambios y medir si los cambios funcionaron.

La frase "Siempre hay una forma de hacerlo mejor" no es solo motivacional: es el principio operativo que impulsa a los equipos a nunca aceptar el statu quo como definitivo. Lo que hoy funciona "bien" puede funcionar "mucho mejor" si se analiza con los ojos de la mejora continua.`,

    "Diapositiva 5": `El ciclo PDCA (Plan-Do-Check-Act: Planificar, Ejecutar, Verificar, Actuar) es la metodología de mejora continua más antigua y usada en el mundo. Su mayor característica es que es un ciclo, no un proceso lineal: cuando terminas la fase Act, vuelves a Plan con el conocimiento que ganaste.

En la fase Plan defines el problema, estableces el objetivo de mejora y diseñas el plan de acción con criterios medibles de éxito. En Do ejecutas el plan en un ámbito controlado y preferiblemente pequeño, para no arriesgar todo el sistema en un experimento. En Check mides los resultados y los comparas con lo que esperabas: ¿mejoró? ¿cuánto? ¿por qué sí o por qué no? En Act implementas los cambios que funcionaron de manera más amplia, o si no funcionaron, ajustas el plan y repites el ciclo desde el inicio.

El ejemplo de la atención al cliente lo ilustra bien: planificas un nuevo flujo, lo pruebas con un equipo pequeño, mides si mejoró el tiempo de respuesta, y si los resultados son buenos, lo expandes a toda la organización.`,

    "Diapositiva 6": `Optimizar un proceso de negocio no significa hacerlo más rápido por hacerlo más rápido: significa eliminar todo lo que no agrega valor para el cliente o para el resultado.

La Identificación de Cuellos de Botella es el primer paso: un cuello de botella es el punto donde el trabajo se acumula y todo se ralentiza. Si tienes un proceso donde muchas personas pueden hacer el paso A, pero solo una persona puede hacer el paso B, el paso B es tu cuello de botella sin importar qué tan rápido sea el resto del proceso.

La Eliminación de Redundancias apunta a los pasos duplicados: actividades que se hacen dos veces por distintos actores, validaciones que se repiten innecesariamente, documentos que se generan y nadie lee.

La Automatización de Tareas Repetitivas es la etapa más avanzada: una vez que tienes el proceso bien documentado y libre de desperdicios, puedes automatizar los pasos rutinarios para que el sistema los ejecute solo, liberando a las personas para trabajo que requiere criterio.`,

    "Diapositiva 8": `Las tres herramientas de mejora continua forman un ecosistema complementario, y cada una cumple un rol diferente.

BPMN es la herramienta de visibilidad: te permite ver el proceso tal como es hoy ("as-is") y diseñar cómo debería ser después de la mejora ("to-be"). Sin esa visibilidad compartida, es muy difícil alinear al equipo sobre qué mejorar y cómo, porque cada uno tiene su versión mental del proceso.

Scrum y XP son las herramientas de ejecución iterativa: te dan el marco para implementar mejoras en ciclos cortos, recibir retroalimentación rápida y ajustar. En lugar de hacer un gran cambio de golpe (que es riesgoso), haces cambios pequeños y controlados.

Y los KPIs son las herramientas de medición: sin métricas claras, no puedes saber si una mejora realmente funcionó. Puedes creer que el proceso está mejor, pero solo los datos te lo confirman. Sin KPIs, la mejora continua es solo una intuición, no una práctica.`,

    "Diapositiva 9": `Scrum es la metodología ágil más usada en el mundo del software, y su principal contribución a la mejora continua es que estructura el trabajo en ciclos cortos y predecibles llamados sprints, de 2 a 4 semanas. Esta brevedad es intencional: fuerza al equipo a entregar algo concreto y funcional en cada ciclo.

Los tres eventos clave de Scrum son fundamentales para entender cómo funciona. El Daily Scrum es una reunión diaria de 15 minutos exactos (no más) donde cada miembro comparte qué hizo ayer, qué hará hoy y si tiene algún obstáculo. Es una herramienta de coordinación y visibilidad, no de control o reporte.

La Sprint Review es el momento de verdad: el equipo muestra lo que construyó al cliente y a los stakeholders, y recibe retroalimentación real sobre trabajo real. No sobre planes, sino sobre resultados.

La Sprint Retrospective es quizás la más poderosa para la mejora continua: el equipo se pregunta a sí mismo qué funcionó bien, qué no funcionó y qué cambiará en el próximo sprint. Es el momento donde Scrum aplica la mejora continua sobre sí mismo.`,

    "Diapositiva 10": `XP (Extreme Programming) es una metodología ágil que se enfoca específicamente en la calidad técnica del código y en la capacidad de respuesta rápida a cambios. Sus cuatro prácticas clave son radicales pero muy efectivas.

La Programación en Parejas es la más polémica: dos desarrolladores trabajan juntos en el mismo código, en el mismo computador. Parece ineficiente, pero en la práctica reduce errores significativamente, facilita la transferencia de conocimiento dentro del equipo y mejora el diseño del código.

La Integración Continua significa que el código no se "guarda para el final": se integra y prueba automáticamente varias veces al día. Esto evita el infierno de integración que ocurre cuando el equipo trabaja en paralelo durante semanas y luego intenta unir todo de golpe.

La Refactorización es el proceso continuo de mejorar la estructura interna del código sin cambiar su comportamiento externo: código más limpio, más legible y más fácil de mantener a largo plazo.

Y el Cliente Presente es el principio más poderoso: el cliente o su representante está disponible constantemente durante el desarrollo. Esto elimina el ciclo interminable de "preguntar → esperar días la respuesta → continuar con suposiciones incorrectas".`,

    "Diapositiva 12": `Los KPIs (Key Performance Indicators, o Indicadores Clave de Rendimiento) son las métricas que una organización elige para saber si está avanzando hacia sus objetivos estratégicos. La palabra "clave" es crucial: no es cualquier métrica, sino aquellas que reflejan el desempeño en lo que más importa.

Su función es transformar datos crudos en información útil para tomar decisiones. Un hospital puede tener miles de datos, pero si quiere saber si está mejorando la calidad del servicio, necesita el KPI de "tiempo promedio de atención". Un retail puede tener datos de todo tipo, pero el KPI de "porcentaje de pedidos entregados a tiempo" le dice directamente si su logística está funcionando.

Los KPIs son el tablero de control del proceso: te dicen en tiempo real si vas bien o si necesitas intervenir antes de que el problema se agrave. Sin ellos, las decisiones se basan en intuiciones y percepciones subjetivas en lugar de en evidencia.`,

    "Diapositiva 13": `No cualquier indicador es un buen KPI. Para que cumpla su función, debe tener cinco características que forman el acrónimo SMART (con una ligera variación).

Específico: mide un aspecto concreto del proceso, no algo vago. "Satisfacción del cliente" es vago; "NPS mensual del canal de soporte telefónico" es específico.

Medible: se expresa en números o porcentajes. "Respuesta rápida" no es medible; "responder en menos de 4 horas" sí lo es.

Alcanzable: la meta debe ser realista con los recursos disponibles. Un KPI imposible de alcanzar no motiva al equipo, lo desmotiva.

Relevante: vinculado directamente a un objetivo estratégico. Si el objetivo es reducir costos, un KPI sobre número de reuniones puede ser relevante; uno sobre color favorito del equipo, no.

Temporal: tiene un periodo de medición definido. No es lo mismo medir algo diariamente que mensualmente o anualmente. La periodicidad determina con qué velocidad detectas problemas y puedes reaccionar a ellos.`,

    "Diapositiva 16": `Esta diapositiva es el punto de partida conceptual: un KPI no es cualquier dato que puedas medir, sino un indicador estratégico que te dice si estás cumpliendo tus objetivos de negocio.

La distinción entre métrica y KPI es crucial y frecuentemente confundida. Una métrica es cualquier medida sobre una actividad: te dice cuánto trabajo se hizo. Un KPI es una métrica estratégica: te dice si ese trabajo está generando el resultado que importa.

El ejemplo es perfecto: "número de llamadas atendidas" es una métrica operativa. Te dice el volumen de actividad, pero puedes atender 1.000 llamadas sin resolver ningún problema. "Tiempo promedio de resolución" es un KPI: ese dato impacta directamente en la satisfacción del cliente y en los costos operativos. La diferencia no está en el dato en sí, sino en si ese dato está conectado a un objetivo estratégico.`,

    "Diapositiva 19": `Los KPIs se clasifican en cinco tipos según qué aspecto del negocio miden, y una organización bien gestionada monitoreA indicadores de todas estas categorías.

Los Financieros (margen de ganancia, ROI) son los que los ejecutivos y accionistas miran primero porque determinan la viabilidad del negocio. Los Operativos (tiempo de ciclo, tasa de errores) son los que el equipo de operaciones monitorea día a día porque revelan la eficiencia interna.

Los KPIs de Clientes (satisfacción, NPS) son críticos en un mundo donde la experiencia del cliente define si una empresa crece o muere. El NPS en particular es simple y poderoso: mide qué tan probable es que un cliente te recomiende a alguien más. Los de Calidad (defectos por lote, cumplimiento de estándares) son especialmente importantes en sectores donde los errores tienen consecuencias graves.

Y los de Innovación (nuevos productos lanzados) miden la capacidad de la organización de renovarse: son los indicadores del futuro, no del presente.`,

    "Diapositiva 22": `Esta es la actividad sumativa del módulo de mejora continua y KPIs, y tiene tres pasos que integran todo lo aprendido.

Paso 1: modelar en Bizagi el proceso de inscripción en un curso online. Este proceso incluye todos los elementos BPMN que estudiamos: evento de inicio, actividades, compuertas de decisión (¿los requisitos están cumplidos? ¿el pago fue exitoso?), flujos de mensaje entre el estudiante y el sistema, y eventos de fin.

Paso 2: identificar los requerimientos funcionales del proceso: qué debe hacer el sistema en cada paso. Paso 3: identificar los requerimientos no funcionales: bajo qué condiciones de calidad debe operar (disponibilidad 24/7, tiempo de respuesta, seguridad del pago).

Este ejercicio es una síntesis de todo el curso hasta ahora: BPMN + requerimientos funcionales + requerimientos no funcionales aplicados a un caso real.`
  },

  // ─────────────────────────────────────────────
  //  PPT SEPTIMA CLASE
  // ─────────────────────────────────────────────
  "PPT SEPTIMA CLASE": {

    "Diapositiva 4": `Un Caso de Uso es una técnica de modelado que describe, de manera estructurada y narrativa, cómo un usuario (llamado actor) interactúa con un sistema para lograr un objetivo específico. No describe arquitectura técnica ni código: describe el comportamiento del sistema desde la perspectiva de quien lo usa.

Es como una historia que tiene protagonista (el actor), objetivo (lo que quiere lograr) y resolución (cómo el sistema responde). Pero no solo describe el camino feliz: también documenta qué pasa cuando algo falla. PIN incorrecto, pago rechazado, usuario sin permisos: esos escenarios de error también son parte del caso de uso.

Los casos de uso son fundamentales para capturar requerimientos funcionales porque obligan a pensar en el sistema de afuera hacia adentro: no "cómo lo voy a programar" sino "qué debe poder hacer el usuario". Esta perspectiva centrada en el usuario evita el error clásico de construir algo que funciona técnicamente perfecto pero que nadie puede usar de manera efectiva.`,

    "Diapositiva 5": `Los casos de uso tienen cuatro componentes que debes identificar en cualquier situación.

El Actor es el ente externo que interactúa con el sistema: puede ser una persona (cliente, administrador, cajero), otro sistema (API de pagos, sistema de inventario) o un dispositivo. Lo importante es que el actor es siempre externo al sistema que modelas.

El Sistema es la "caja" que ofrece la funcionalidad. Delimitar el sistema claramente define qué está dentro y qué está fuera del alcance del proyecto.

El Objetivo (o Meta) es el resultado valioso que el actor quiere alcanzar. Siempre debe ser algo significativo para el actor, no solo un paso técnico. "Consultar saldo" es un objetivo real; "hacer clic en el botón de consulta" es un paso técnico, no un objetivo.

El Flujo de Eventos es la secuencia de pasos de la interacción: el actor hace algo, el sistema responde, el actor reacciona, hasta que el objetivo se logra o falla. El ejemplo de la transferencia bancaria lo ilustra perfectamente: cliente ingresa monto → sistema verifica fondos → sistema confirma.`,

    "Diapositiva 7": `La notación UML estandariza cómo se dibujan los casos de uso, haciendo los diagramas legibles para cualquier profesional. Los tres elementos visuales básicos son el stickman (actor), el óvalo (caso de uso) y el rectángulo (sistema).

Las relaciones entre casos de uso son donde más errores se cometen, especialmente la distinción entre <<include>> y <<extend>>.

<<include>> significa que un caso de uso siempre invoca a otro como parte obligatoria de su ejecución. Por ejemplo, "Realizar compra" siempre incluye "Validar pago": no puedes completar la compra sin que el pago sea validado. Es obligatorio, no opcional.

<<extend>> significa que un caso de uso puede opcionalmente ampliar a otro en situaciones específicas. Por ejemplo, "Realizar compra" puede extenderse con "Aplicar descuento especial", pero solo si el cliente tiene un cupón activo. Es condicional, no siempre ocurre.

La regla mnemotécnica que nunca falla: include = siempre (obligatorio); extend = a veces (condicional).`,

    "Diapositiva 10": `La distinción entre Casos de Uso de Negocio y Casos de Uso de Sistema define el nivel de detalle con el que se trabaja en cada etapa del proyecto.

Los de Negocio son de alto nivel: describen cómo los procesos de la organización generan valor. "Gestionar ventas", "Tramitar solicitud de crédito", "Realizar inscripción académica" son casos de uso de negocio. No mencionan pantallas, botones, ni validaciones técnicas. Responden a la pregunta: ¿qué objetivo de negocio logra el usuario con este caso de uso?

Los de Sistema son de bajo nivel: detallan la interacción técnica precisa entre el usuario y el sistema. "El sistema valida el formato del RUT y muestra mensaje de error si es incorrecto", "El sistema consulta la base de datos y muestra los cursos disponibles con sus capacidades" son casos de uso de sistema. Incluyen pasos concretos, validaciones y respuestas específicas del sistema.

En etapas tempranas del proyecto se trabaja con casos de negocio para alinear expectativas. En etapas de diseño y desarrollo se trabaja con casos de sistema para guiar la implementación.`,

    "Diapositiva 12": `Las Historias de Usuario son la alternativa ágil a los casos de uso formales. Nacidas en metodologías como Scrum y XP, expresan requerimientos funcionales en un formato extremadamente simple: "Como [rol], quiero [funcionalidad] para [beneficio]."

Esta estructura de tres partes es deliberada. El rol define quién necesita algo y ayuda a priorizar según el tipo de usuario. La funcionalidad describe qué quiere hacer. Y el beneficio es la parte más importante y la más frecuentemente omitida: define POR QUÉ lo quiere y qué valor obtiene.

Una historia sin beneficio claro es una funcionalidad sin propósito. Si el equipo conoce el beneficio buscado, puede proponer soluciones alternativas si hay problemas técnicos, en lugar de implementar ciegamente lo que se pidió. Por ejemplo: "Como cliente, quiero poder pagar con tarjeta para completar mi compra rápidamente." Si hay problemas con tarjetas, el equipo sabe que el objetivo real es "completar la compra", y puede proponer otras formas de pago.

Las historias de usuario viven en el backlog de Scrum y son la unidad básica de planificación del sprint.`,

    "Diapositiva 17": `INVEST es el estándar de calidad para evaluar si una historia de usuario está bien escrita. Cada letra representa una característica que debe cumplir.

Independiente: cada historia debe poder desarrollarse sin depender de que otra esté terminada primero. Las dependencias entre historias complican la planificación y pueden paralizar al equipo en medio de un sprint.

Negociable: no es un contrato rígido sino el punto de partida de una conversación. Los detalles se ajustan durante el refinamiento del backlog.

Valiosa: si no puedes explicar qué beneficio concreto recibe el cliente, la historia no debería estar en el backlog.

Estimable: el equipo debe poder calcular el esfuerzo requerido. Si es demasiado vaga para estimar, necesita ser refinada o dividida.

Small (Pequeña): debe poder completarse dentro de un sprint. Si es más grande, se divide en historias más pequeñas.

Testeable: debe existir un criterio claro y verificable para saber si está "done". Sin ese criterio, el equipo puede trabajar indefinidamente sin saber cuándo terminar. "El usuario puede registrarse con email y contraseña y recibe un correo de confirmación" es testeable. "El sistema debe ser fácil de usar" no lo es.`
  },

  // ─────────────────────────────────────────────
  //  PPT CLASE 11
  // ─────────────────────────────────────────────
  "PPT CLASE 11": {

    "Diapositiva 3": `La Gestión de Proyectos es la disciplina que convierte una idea en un resultado concreto usando recursos limitados (tiempo, dinero, personas) de manera organizada y controlada.

Lo que distingue a un proyecto de las operaciones cotidianas es que un proyecto tiene inicio y fin definidos, y produce algo único que no existía antes. No es lo mismo que la operación diaria de una empresa (que se repite continuamente): un proyecto termina cuando entrega su resultado.

La gestión de proyectos aplica conocimientos, habilidades y herramientas para aumentar las probabilidades de que ese resultado sea el correcto, entregado en el tiempo acordado y dentro del presupuesto definido. Los objetivos SMART son centrales porque sin criterios de éxito claros, es imposible saber al final si el proyecto fue exitoso o no. "Mejorar el sistema" no es un objetivo SMART. "Reducir el tiempo de respuesta del sistema en un 40% antes del 30 de junio, dentro de un presupuesto de $50.000" sí lo es.`,

    "Diapositiva 4": `Todo proyecto pasa por cinco fases que forman su ciclo de vida, independiente de su tamaño o industria.

La fase de Inicio es donde el proyecto obtiene su "acta de nacimiento": el Acta de Constitución que define formalmente el propósito, los objetivos, el alcance inicial y quiénes son los responsables. Sin este documento, el proyecto no tiene aprobación oficial y cualquier trabajo que se haga está en el aire.

La fase de Planificación es la más crítica para el éxito: aquí se construye la hoja de ruta completa. Objetivos SMART, cronograma (Carta Gantt), presupuesto detallado, roles, responsabilidades y gestión de riesgos. Los proyectos que fallan frecuentemente lo hacen porque la planificación fue insuficiente o fue omitida.

La fase de Ejecución es donde el equipo construye los entregables y se consume la mayor cantidad de recursos.

La fase de Seguimiento y Control corre en paralelo con la ejecución: monitorea el progreso y detecta desviaciones del plan antes de que sea demasiado tarde.

La fase de Cierre es la más descuidada pero fundamental: se entrega el resultado formalmente, se liberan los recursos del equipo y se documentan las "lecciones aprendidas" para que el próximo proyecto empiece con más conocimiento acumulado.`,

    "Diapositiva 5": `La Gestión de Riesgos parte de una premisa realista e importante: en todo proyecto hay incertidumbre, y esa incertidumbre puede impactar los objetivos. La pregunta no es si algo puede salir mal (siempre puede), sino qué tan preparados estamos para cuando ocurra.

Es el proceso sistemático de identificar esas fuentes de incertidumbre, evaluar su probabilidad e impacto, y definir cómo responder si se materializan. Su meta no es eliminar todo riesgo, lo cual es imposible y además costoso, sino minimizar las amenazas y maximizar las oportunidades.

Esta última parte es importante: el riesgo tiene dos caras. Puede ser negativo (algo que puede perjudicar el proyecto: un proveedor que falla, un requerimiento que cambia, un integrante del equipo que se enferma) o positivo (una oportunidad que podría mejorar el resultado si se aprovecha: una nueva tecnología disponible, un cambio regulatorio favorable). Un equipo que practica gestión de riesgos no es pesimista: es proactivo.`,

    "Diapositiva 6": `El proceso de gestión de riesgos sigue cinco pasos formales que garantizan que ninguna fuente de incertidumbre importante quede sin atención.

La Identificación es el primer paso: listar exhaustivamente todo lo que podría afectar el cronograma, presupuesto o calidad. Las técnicas incluyen lluvia de ideas con el equipo, entrevistas a expertos con experiencia en proyectos similares, y el análisis FODA.

El Análisis de Riesgos evalúa cada riesgo en dos dimensiones: probabilidad (¿qué tan likely es que ocurra?) e impacto (¿qué tan grave sería si ocurre?). El análisis cualitativo clasifica estos factores en términos simples (Alto/Medio/Bajo). El análisis cuantitativo usa datos numéricos para proyectar costos o retrasos específicos.

La Priorización ordena los riesgos por su gravedad combinada, porque los recursos del proyecto son limitados y no puedes prepararte igualmente para todos.

La Planificación de Respuesta define qué harás ante cada riesgo de alta prioridad: evitarlo, transferirlo (seguros, contratos), mitigarlo (reducir probabilidad o impacto) o aceptarlo conscientemente.

El Seguimiento y Control monitorea continuamente el proyecto para detectar nuevos riesgos y evaluar si los planes de respuesta están funcionando.`,

    "Diapositiva 7": `El análisis FODA es una herramienta de diagnóstico estratégico que organiza la realidad en cuatro cuadrantes según dos ejes: interno/externo y positivo/negativo.

Las Fortalezas son capacidades internas y positivas: lo que tu organización o proyecto hace bien, tus ventajas competitivas reales, lo que te diferencia.

Las Oportunidades son factores externos y positivos: tendencias del mercado que puedes aprovechar, cambios tecnológicos favorables, debilidades de la competencia que puedes capitalizar.

Las Debilidades son limitaciones internas y negativas: lo que haces mal, lo que te falta, las áreas donde estás en desventaja frente a otros.

Las Amenazas son factores externos y negativos: competencia fuerte, cambios regulatorios adversos, caída de mercado, tecnologías que vuelven tu producto obsoleto.

La clave del FODA está en la separación entre interno (lo que puedes controlar o cambiar) y externo (lo que no puedes controlar pero puedes anticipar y responder). Esta distinción define qué tipo de estrategia debes diseñar para cada cuadrante.`,

    "Diapositiva 8": `Hacer un análisis FODA útil no es solo llenar una tabla de cuatro cuadrantes: es un proceso de análisis que debe terminar en acciones concretas.

Los pasos son: primero, definir claramente el objetivo del análisis (¿evalúas la empresa completa, un producto específico, un proyecto en particular?). Segundo, recolectar información real, tanto interna (datos operacionales, feedback del equipo, resultados históricos) como externa (investigación de mercado, análisis de la competencia). Tercero, clasificar esa información con honestidad, sin sobreestimar fortalezas ni ignorar debilidades incómodas.

El paso más valioso y frecuentemente omitido es el cuarto: diseñar estrategias combinadas que surjan de cruzar los cuadrantes. Las estrategias FO usan tus Fortalezas para aprovechar las Oportunidades (ofensivas). Las FA usan tus Fortalezas para enfrentar las Amenazas (defensivas). Las DO intentan superar Debilidades aprovechando Oportunidades disponibles (reorientación). Las DA buscan minimizar Debilidades mientras evitas Amenazas (supervivencia).

Un FODA sin estas estrategias combinadas es un diagnóstico sin tratamiento: sabes cuál es el problema pero no haces nada al respecto.`,

    "Diapositiva 19": `El análisis CAME es el paso que convierte el diagnóstico del FODA en un plan de acción concreto. La relación entre ambos es directa y elegante: cada cuadrante del FODA genera una categoría de acción en el CAME.

CAME son las iniciales de Corregir, Afrontar, Mantener y Explotar. Para Corregir las Debilidades, diseñas acciones que eliminen o reduzcan tus puntos débiles. Para Afrontar las Amenazas, diseñas estrategias que te preparen para los riesgos externos o que los neutralicen antes de que impacten. Para Mantener las Fortalezas, defines acciones que preserven y potencien lo que ya haces bien, porque las ventajas competitivas se pierden si no se cuidan activamente. Y para Explotar las Oportunidades, diseñas iniciativas concretas que capitalicen las condiciones favorables del entorno antes de que cambien o la competencia las aproveche primero.

FODA + CAME juntos son una metodología de planificación estratégica completa: FODA es el diagnóstico, CAME es el tratamiento. Sin CAME, el FODA queda como un ejercicio académico sin impacto real en la gestión del proyecto o negocio.`
  }

};

/**
 * Obtiene la explicación de profesora para un PPT y diapositiva específicos.
 * @param {string} pptName - Nombre exacto del PPT (ej. "PPT SEGUNDA CLASE").
 * @param {string} slideLabel - Etiqueta de la diapositiva (ej. "Diapositiva 3").
 * @returns {string} Texto de la explicación.
 */
function getExplanation(pptName, slideLabel) {
  const ppt = EXPLANATIONS[pptName];
  if (ppt && ppt[slideLabel]) {
    return ppt[slideLabel];
  }
  return "Explicación no disponible para esta diapositiva.";
}
