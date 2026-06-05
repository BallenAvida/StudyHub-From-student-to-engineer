# 📓 DEVLOG (Diario de Análisis)

El registro de mi evolución técnica desde Técnico en Análisis de Sistemas hasta la Ingeniería.

## Entrada #1: El Punto de Partida (Mayo 2026)
**Contexto:** Iniciando primer año de Análisis de Sistemas en AIEP.

**Lo que aporto hoy:** La arquitectura de la información del Hub y la visión de usuario.

**El desafío técnico:** El código actual usa estructuras que aún no veo en clases (como la conexión con bases de datos o manipulación avanzada del DOM de JavaScript, de las que solo he visto pinceladas).

**Hito del día:** Decisión de certificarme en AWS Cloud Practitioner para entender la infraestructura donde vivirá este proyecto y fundar formalmente este repositorio en GitHub para documentar mi ruta hacia NVIDIA.

## Entrada #2: El Gran Pivote Arquitectónico (Mayo 2026)
**Contexto:** Planeando el crecimiento del Study Hub.

**Reflexión:** Me di cuenta de que para que este proyecto sea verdaderamente profesional, el código no puede estar amarrado al contenido (mis materias). He decidido aplicar el principio de "Separación de Responsabilidades", dividiendo el "Motor" (HTML/JS) de los "Cursos" (JSON).

**Lección aprendida:** Como futuro ingeniero, he entendido que es mejor pasar tres semanas construyendo un motor sólido y agnóstico que pasar tres años pegando parches en un código estático que no escala. Esto hará que mi proyecto sea verdaderamente Open Source, permitiendo que cualquier persona cargue sus propios apuntes.

**Hito del día:** Aprobación del plan de refactorización para transformar el Hub en una Single Page Application (SPA) con ingesta dinámica de datos.

## Entrada #3: La Batalla contra NotebookLM (Mayo 2026)
**Contexto:** Diseñando el futuro del Hub para que sea un verdadero asistente de estudio interactivo y dinámico, inspirado en las mejores capacidades de NotebookLM.

**Roadmap de Innovación IA:**
1. **Chat de Estudio ("Pregúntale a tus Apuntes"):** Integrar un chat interactivo por curso/módulo que use la clave de API del usuario (Gemini/Claude) para responder dudas directamente sobre la materia cargada.
2. **Audio Resúmenes ("Podcasts Educativos"):** Generar guiones dinámicos de debate entre dos locutores usando IA y reproducirlos alternando voces sintéticas del navegador (`SpeechSynthesis`).
3. **Materiales de Apoyo Automatizados:** Botones en los módulos para autogenerar Preguntas Frecuentes (FAQs), Glosarios de términos complejos y resúmenes ejecutivos (Briefing Docs).
4. **Bloc de Notas Inteligente:** Un editor de notas del curso enriquecido con capacidades de la IA para expandir ideas, crear analogías o resumir apuntes guardados.

## Entrada #4: Nacimiento del Chat de Estudio (Junio 2026)
**Contexto:** Implementando el primer pilar de IA del Roadmap de Innovación.

**El desafío técnico:** Mantener la arquitectura agnóstica de la aplicación sin duplicar el código de llamada de API para Gemini y Claude. Decidí estructurar un prompt compilado que pre-alimenta la API con todo el material teórico de los módulos en cada mensaje, permitiendo mantener el historial conversacional y un contexto de tutor de estudio súper denso.

**Hito del día:** Implementación exitosa del "Chat de Estudio" (Pregúntale a tus Apuntes) con UI glassmorphic, globos interactivos, soporte para fórmulas matemáticas mediante KaTeX e indicador dinámico de carga. El motor es 100% resiliente y orienta al usuario si no tiene configurada su API Key.

**Corrección técnica posterior:** Solucionamos un error de conexión (Bad Request 400) causado por tener el formato de respuesta JSON (`responseMimeType: 'application/json'`) preestablecido de forma rígida en `callGeminiAPI`. Parametrizamos la función para que funcione en formato de texto libre para el chat conversacional y explicaciones de código, reservando el modo JSON exclusivamente para la generación de packs de estudio.


## Entrada #5: El Despertar de la Pizarra Matemática (Junio 2026)
**Contexto:** Focalizando en la experiencia matemática offline y en el auto-guardado local (debido a limitaciones temporales de API).

**El desafío técnico:** Evitar que expresiones de matemáticas escritas en texto plano (como `5 * 5` o `a / b`) o generadas informalmente por otras IAs se rendericen de forma ilegible con asteriscos o diagonales. Diseñé un parser regex dinámico (`formatBlackboardMath`) que intercepta ecuaciones informales, las traduce al vuelo a LaTeX limpio (transformando multiplicación en `\cdot` o `\times`, fracciones en `\frac{}{}`, raíces en `\sqrt{}`, etc.), y las dibuja mediante KaTeX. 

**Hito del día:** Construcción del **Bloc de Notas del Curso** (con pestañas integradas, guardado automático debounced por curso en localStorage, editor de pantalla dividida, y barra de herramientas Markdown/LaTeX) y de la **Pizarra Resolutora (Photomath Local)**. Hemos elevado la calculadora matemática al estándar premium con resolución multi-método para ecuaciones cuadráticas (Fórmula General, Factorización, Completar Cuadrado), sistemas lineales 2x2 mediante determinantes de Cramer, y diferenciación simbólica paso a paso de derivadas polinomiales/trigonométricas. Además, integramos un **Graficador interactivo 2D** en plano cartesiano para hallar ceros/vértices y un **Borrador de Tiza (Scratchpad)** libre con física de tiza difuminada sobre canvas. Todo funcionando 100% offline sin dependencias externas complejas.

## Entrada #6: El Salto Casio Natural V.P.A.M. e Interactividad (Junio 2026)
**Contexto:** Elevando el resolutor offline al estándar de visualización de fórmulas reales (WYSIWYG) de calculadoras físicas potentes y Photomath, mejorando su editabilidad directa y valor educativo.

**El desafío técnico:** Evitar la desconexión entre la pantalla de KaTeX y el campo de edición, y dar información teórica profunda del número resultante.
1. Fusionamos la pantalla verde y la caja de texto en un bloque interactivo donde hacer clic en cualquier parte enfoca el cursor de edición.
2. Diseñamos un motor de análisis numérico para clasificar resultados en conjuntos matemáticos.

**Hito del día:**
1. **Pantalla Casio Natural V.P.A.M. Interactiva y Segura:** Modificación a una etiqueta `<label>` nativa de HTML para sortear restricciones de seguridad móvil y asegurar que al clickear cualquier zona de la pantalla matemática se despliegue el teclado táctil en smartphones de forma consistente.
2. **Sincronización Avanzada del Cursor WYSIWYG:** El cursor parpadeante de KaTeX (`math-cursor`) ahora sigue con precisión el cursor de entrada de texto (`selectionStart`) en tiempo real mientras el usuario se desplaza, hace click o usa las teclas físicas o virtuales.
3. **Teclado Táctil de 36 Teclas con Navegación:** Añadidas flechas de dirección izquierda (`←`) y derecha (`→`) en la fila superior para permitir navegación manual precisa del cursor sobre la pantalla matemática, junto con la constante de Euler (`e`) y la función `log()`.
4. **Ficha Educativa Visual del Número (Estilo Photomath Premium):** Rediseño de la clasificación numérica a una tarjeta premium que incluye badges coloreados (Signo, Tipo, Primalidad) y un mapa visual de conjuntos numéricos ($\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{I}$, $\mathbb{R}$) que ilumina los conjuntos válidos y opaca con tachado los inválidos, promoviendo el aprendizaje conceptual interactivo.
5. **Historial de Búsquedas Persistente:** Barra de historial de expresiones matemáticas reciente con pastillas de acceso rápido guardadas en `localStorage`. Al hacer clic en cualquier pastilla, se autocompleta y resuelve la expresión de forma instantánea.
6. **Integración Bidireccional IA-Calculadora:** Enriquecimos el prompt del Asistente de Estudio con conciencia del ecosistema "Study Hub". La IA ahora puede invocar la calculadora local del Hub usando la etiqueta especial `[CALCULA: expresion]`. El frontend intercepta esta instrucción, ejecuta el resolutor matemático de forma 100% offline, inyecta tarjetas interactivas de pasos y propiedades en el diálogo del chat, y sincroniza la calculadora del usuario de forma automática.

## Entrada #7: Activación del Modo Demostración / Simulador Chat Offline (Junio 2026)
**Contexto:** Resolviendo el problema de falta de API Key y cuotas en la API del Chat de Estudio para permitir pruebas locales continuas y una demostración funcional offline robusta.

**El desafío técnico:** Permitir que el chat responda didácticamente y demuestre su integración con la calculadora local sin realizar llamadas HTTP externas. 

**Solución Implementada:**
1. **Configuración Dinámica de Interfaz:** Modificamos la visualización del chat en `openCourseChat()` para comprobar la casilla "Modo Demostración". Si está activa, habilita el cuadro de texto y el botón de enviar chat incluso si no se ha configurado ninguna API Key en el Hub.
2. **Controlador del Estado (`toggleChatDemoMode`):** Un listener en tiempo real para habilitar y deshabilitar controles de forma instantánea al alternar la casilla del banner.
3. **Motor de Respuestas Simuladas Didácticas (`getSimulatedAIChatResponse`):** Un motor inteligente basado en regex y palabras clave que analiza el mensaje del estudiante en busca de intenciones matemáticas (MCM, MCD, derivadas, integrales, sistemas de ecuaciones, ecuaciones cuadráticas u operaciones generales). Si detecta alguna, genera una respuesta de tutoría en español e inyecta la directiva `[CALCULA: expresion]`. De lo contrario, ofrece una bienvenida amigable y orienta al usuario con ejemplos válidos adaptados a su curso activo (como Gestión de Centros Deportivos o Bases de Datos).
4. **Mock de Latencia:** Implementamos una promesa con retraso de 800ms antes de entregar la respuesta simulada para imitar la latencia de red de una IA real, logrando una experiencia de usuario natural.

**Mejoras Adicionales de Usabilidad de Calculadora:**
*   **Gestión de Foco Activo:** Modificamos las funciones del teclado virtual `clearSolver()` y `backspaceSolver()` para invocar `input.focus()` después de realizar cambios. Esto evita que el campo pierda el foco (blur) al pulsar botones virtuales, garantizando que el cursor de KaTeX se mantenga parpadeando y que el teclado virtual o nativo en dispositivos móviles no se cierre de forma inesperada.
*   **Renderizado de Cursor Resiliente (Fallback Offline):** Añadimos un comprobador del cargador de KaTeX. Si la CDN de KaTeX no se ha cargado (por ejemplo, al iniciar sin conexión a internet), el sistema conmuta automáticamente a una visualización en texto plano limpia con un cursor HTML animado por CSS (`|`) en lugar de mostrar código LaTeX sin procesar (evitando que aparezca texto como `class math-cursor`).
*   **Optimización del Estado Vacío:** Reemplazamos la llamada a KaTeX para renderizar el cursor en el estado vacío por un elemento `span` HTML nativo estilizado. Esto acelera el renderizado inicial y previene problemas de parpadeo y textos con fallas de renderizado en el primer inicio.

## Entrada #8: Escáner de Cámara Real y Solucionador de Google Forms (Junio 2026)
**Contexto:** Expandiendo las características del Hub hacia funcionalidades avanzadas de software comercial (móviles y cuestionarios online).

**Desafío Técnico 1 (Cámara Viewfinder):**
Integrar el stream de video en tiempo real de forma segura y con bajo consumo. Implementamos `navigator.mediaDevices.getUserMedia` solicitando idealmente la cámara trasera (`environment`). Diseñamos un viewport estilizado con un visor de tiza verde, destello físico simulado al capturar y barrido láser verde con CSS Keyframes. Aseguramos la liberación de la cámara deteniendo los tracks (`track.stop()`) tan pronto como el usuario cambia de pestaña de la calculadora o cierra el panel lateral para ahorrar batería y respetar la privacidad.

**Desafío Técnico 2 (Google Forms Parser):**
Permitir que el estudiante resuelva preguntas de exámenes y formularios de Google Forms importándolos de forma automática.
Implementamos una lógica de parser híbrido:
1. **Parser de Texto Plano:** Utiliza regex de coincidencia de líneas y bloques para extraer enunciados de ejercicios y listas de alternativas múltiples (ej: `A) x=1`).
2. **Parser HTML (Google Forms Source):** Utiliza un `DOMParser` para analizar el código fuente HTML copiado directamente de los formularios, identificando los selectores del DOM de Google Forms (`[role="listitem"]`, `.M7e2gb`, `.LgJN8e`) para extraer la pregunta y sus alternativas radiales o de selección.
3. **Resolución y Cruzamiento de Resultados:** El solucionador extrae la fórmula matemática, ejecuta el motor del resolutor local offline ( KaTeX, desgloses paso a paso) y contrasta numéricamente el resultado final con las alternativas de la pregunta, coloreando en verde brillante y badgeando la opción correcta de forma totalmente automatizada.



