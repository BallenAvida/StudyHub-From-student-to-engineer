# 📝 Registro de Cambios - Sesiones de Desarrollo

Este archivo contiene el desglose técnico de lo implementado en cada sesión.

## Resumen de la Sesión (5 de Junio, 2026 - Modo Demostración / Simulador de Chat Offline)
**Objetivo:** Permitir el uso del Chat de Estudio (Tutor IA) e interactuar con la calculadora local sin necesidad de configurar una API Key real (evitando cuotas o errores de conexión), mediante un Modo Demostración simulado offline completo.

### Cambios Técnicos Implementados:
1.  **Frontend & Lógica de Interfaz (`hub.js`):**
    *   **Control del Modo Demostración:** Añadimos `toggleChatDemoMode()` para detectar en tiempo real el cambio del checkbox `#chat-demo-mode` del banner de alerta. Si está marcado, habilita el campo de texto y el botón de envío de chat, incluso si no hay una API Key configurada.
    *   **Actualización de `openCourseChat()`:** Ajustamos la lógica de inicio del chat para comprobar el estado de la casilla de modo demostración, de modo que se habiliten/deshabiliten los controles del chat apropiadamente al abrir la vista.
    *   **Enrutador en `submitChatMessage()`:** Modificamos el envío del mensaje para que, al estar activo el Modo Demostración, se simule un retraso de escritura de 800ms (imitando latencia de red de una IA real) y se llame al motor local `getSimulatedAIChatResponse(text)` en lugar del resolvedor de API en la nube.
    *   **Gestión de Foco Activo del Teclado Virtual:** Añadimos llamadas a `input.focus()` en `clearSolver()` y `backspaceSolver()`. Esto previene que el input pierda foco al usar los botones virtuales de borrar (`C` y `DEL`), garantizando que la calculadora mantenga su estado activo de escritura y el teclado móvil se mantenga desplegado.
    *   **Blinking Cursor HTML & Fallback Resiliente:** Modificamos `updateMathDisplay()` para usar un elemento `span` HTML nativo estilizado en lugar de KaTeX para dibujar el cursor azul parpadeante cuando la entrada de texto está vacía. Asimismo, agregamos una verificación del estado del CDN de KaTeX: si no está disponible, el sistema renderiza el texto de la expresión y el cursor en HTML plano, evitando que se muestre código LaTeX crudo como `\class{math-cursor}`.

2.  **Motor de Respuestas Didácticas Offline (`getSimulatedAIChatResponse`):**
    *   Implementamos un motor de correspondencia (matching) por expresiones regulares y palabras clave para detectar intenciones matemáticas en español:
        *   **Mínimo Común Múltiplo (MCM) / Máximo Común Divisor (MCD):** Extrae expresiones como `mcm de 12 y 18` o `mcd(15, 20)` y formatea llamadas `[CALCULA: mcm(12, 18)]`.
        *   **Cálculo e Integración/Derivación:** Detecta comandos `integral`, `int(x^2)dx`, `derivar`, `d/dx(...)` y genera los tags `[CALCULA: ...]`.
        *   **Sistemas de Ecuaciones 2x2:** Detecta sistemas separados por comas, punto y coma o palabras de enlace (ej: `2x+y=5; x-y=1`) e invoca la calculadora local.
        *   **Ecuaciones Cuadráticas:** Detecta formas de segundo grado con `x^2` o `x2` y signo igual.
        *   **Cálculos Aritméticos Generales:** Detecta operaciones combinadas matemáticas.
        *   **Contexto Teórico del Curso:** Si el mensaje no es puramente matemático, responde didácticamente según el curso activo (por ejemplo, Gestión de Centros Deportivos o Bases de Datos).
        *   **Respuesta Estándar (Fallback):** Genera sugerencias didácticas y ejemplos de comandos que el usuario puede ingresar para probar la integración local.

## Resumen de la Sesión (5 de Junio, 2026 - Usabilidad, Historial e Integración de IA)
**Objetivo:** Solucionar problemas de enfoque en móviles, perfeccionar la sincronización del cursor en KaTeX, agregar un historial persistente de expresiones y crear la integración bidireccional entre el Tutor de IA y la calculadora local.

### Cambios Técnicos Implementados:
1.  **Frontend (HTML & CSS):**
    *   **Seguridad de Foco en Pantalla:** Convertimos la pantalla `.calculator-screen` de `div` a un elemento `<label for="solver-input">` nativo, permitiendo que cualquier clic en la pantalla abra de forma segura y robusta el teclado blando táctil en navegadores móviles (iOS/Android).
    *   **Estilo de Entrada Premium:** Rediseñamos el campo de entrada `#solver-input` con bordes HSL con transiciones suaves al enfocar/desenfocar, simulando un campo de texto moderno y limpio.
    *   **Historial de Búsquedas (Pills):** Añadimos el contenedor `#solver-history-block` con pastillas horizontales auto-scrollables para ver las búsquedas recientes, con botón para borrar el historial completo.
    *   **Teclado Ampliado (36 Teclas):** Rediseñamos la cuadrícula del teclado virtual a 36 teclas, agregando una fila superior de navegación de cursor con botones de dirección izquierda (`←`) y derecha (`→`), paréntesis `(`, `)`, la constante exponencial de Euler `e`, y la función de logaritmo de base 10 `log`.
    *   **Estilos CSS de la Ficha Educativa:** Añadimos estilos en `hub.css` para insignias redondas con colores HSL diferenciados para cada conjunto numérico (Naturales, Enteros, Racionales, Irracionales, Reales) y un estilo opaco/tachado (`.inactive`) para los conjuntos excluidos. También se diseñaron tarjetas translúcidas (`.num-fact-card`) con iconos de FontAwesome y ocultamos el scrollbar del historial.

2.  **Lógica JavaScript (`hub.js`):**
    *   **Integración Bidireccional IA-Calculadora:**
        *   Modificamos el prompt del chat de estudio (`getAIChatResponse`) para darle conciencia al tutor sobre el Hub y la calculadora offline. Le enseñamos a usar la etiqueta especial `[CALCULA: expresion]`.
        *   Actualizamos `submitChatMessage` para interceptar dicha etiqueta usando expresiones regulares, resolver el cálculo de forma local offline, incrustar una tarjeta didáctica de pasos e insignias directamente en el globo del chat, y rellenar y actualizar automáticamente el resolutor del estudiante.
    *   **Historial Persistente en LocalStorage:**
        *   Implementamos `saveToSolverHistory`, `renderSolverHistory` y `clearSolverHistory`. Las expresiones exitosas se agregan al historial guardado localmente (hasta 10 elementos únicos).
        *   Hacer clic en una pastilla rellena automáticamente el campo de entrada, enfoca y resuelve la expresión al instante.
    *   **Sincronización del Cursor WYSIWYG:** Modificamos `updateMathDisplay` para que inserte el cursor de KaTeX (`math-cursor`) en la posición exacta del cursor de texto del input (`selectionStart`). Esto se logra inyectando un marcador temporal `CURSORX` y reemplazándolo por el código LaTeX animado.
    *   **Eventos de Cursor en Tiempo Real:** Añadimos manejadores de eventos `keyup` y `click` al input para redibujar la pantalla y el cursor de KaTeX de forma instantánea al navegar con flechas físicas o mouse.
    *   **Lógica de Navegación del Cursor Virtual:** Implementamos `moveSolverCursor(dir)` para desplazar el cursor del input programáticamente de carácter en carácter mediante los botones virtuales `←` y `→`.
    *   **Lógica Didáctica de Ficha de Números:** Re-estructuramos `getNumberProperties(val)` para devolver metadatos completos del número. Actualizamos `renderAlternateRepresentations(resultStr)` para renderizar una hermosa ficha educativa que detalla el Signo, Tipo, Paridad, Primalidad y un diagrama visual interactivo de Conjuntos Numéricos.
    *   **Soporte de la Constante e:** Añadimos soporte para reemplazar la constante exponencial `e` por su valor numérico real (`Math.E`) en la evaluación de expresiones en `solveArithmetic`.

## Resumen de la Sesión (5 de Junio, 2026 - Continuación)
**Objetivo:** Implementar el Bloc de Notas del Curso y el Resolutor Matemático Paso a Paso ("Photomath Local") con soporte offline.

### Cambios Técnicos Implementados:
1.  **Frontend (HTML & CSS):**
    *   Integrado el selector de pestañas `.course-tabs` y botones (`#tab-modules`, `#tab-notes`) en la cabecera de la vista de curso.
    *   Envolvedor `#course-modules-tab-content` para aislar el temario.
    *   Creado el panel `#course-notes-tab-content` con editor textarea de apuntes y previsualizador en vivo con pantalla dividida (split-screen).
    *   Añadido botón de calculadora en la barra superior (`#btn-open-solver`).
    *   Creado el panel lateral flotante `#math-solver-panel` con diseño glassmorphic de pizarra y teclado virtual científico.
    *   Estilos en `hub.css` para el grid de pantalla dividida responsivo, teclas táctiles físicas de la calculadora, transiciones animadas de entrada (`translateX`) del panel lateral, y overrides de tema para modo Pizarra.

2.  **Lógica del Storage (`core/storage.js`):**
    *   Implementados los métodos `getCourseNotes(courseId)` y `saveCourseNotes(courseId, text)` en `HubStorage` para persistencia local de apuntes por curso.

3.  **Lógica de Negocio y Motor Matemático (`hub.js`):**
    *   **Sistema de Formateo "Pizarra" (`formatBlackboardMath`)**: Traduce expresiones matemáticas de texto plano y auto-envuelve a formato LaTeX.
    *   **Previsualizador Markdown + Math (`renderMarkdownAndMath`)**: Renderiza apuntes en vivo conservando las ecuaciones matemáticas intactas.
    *   **Resolutor Matemático Premium ("Photomath Local")**:
        *   Soporte para **Integrales Indefinidas básicas** (regla de potencia, constante, suma, logarítmica y trigonométricas) con explicación pedagógica completa paso a paso en KaTeX.
        *   Soporte multi-método para ecuaciones cuadráticas (Fórmula General, Factorización de Trinomios, y Completación de Cuadrados) con explicaciones en KaTeX.
        *   Resolutor de Sistemas de Ecuaciones Lineales 2x2 mediante la Regla de Cramer (método de determinantes) con rendering de matrices en LaTeX.
        *   Resolutor de derivadas paso a paso para polinomios y funciones trigonométricas básicas (`sin(x)`, `cos(x)`, `tan(x)`).
        *   Análisis y solución de sumas/restas de fracciones paso a paso (MCM, simplificación por MCD).
        *   Evaluación científica básica (trigonometría, logaritmos, potencias, raíces) 100% offline.
    *   **Pizarra de Gráficas Interactivas 2D (`MathGrapher`)**:
        *   **Graficación Múltiple:** Plano cartesiano estilo tiza verde que dibuja múltiples funciones matemáticas `y = f(x)` separadas por punto y coma (ej: `y = x^2 - 4; y = x - 2`) en diferentes colores de tiza.
        *   **Cálculo de Intersecciones:** Escanea numéricamente (por bisección) y dibuja círculos rojos de tiza sobre los puntos de intersección entre las funciones, con etiquetas de coordenadas exactas.
        *   **Rastreo de Coordenadas en Vivo (Hover/Tooltip):** Cursor inteligente deslizante que sigue el movimiento del puntero/dedo y proyecta líneas discontinuas a los ejes junto a un tooltip flotante `(x, y)` al estar cerca de cualquier curva.
        *   Calcula de forma automática y marca en la pizarra las raíces, intersección Y y el vértice (mínimo/máximo para parábolas) de la función principal.
        *   Permite interactuar arrastrando el mouse/touch (desplazamiento) y usando la rueda (zoom interactivo).
    *   **Bloc Borrador de Tiza (`ChalkScratchpad`)**:
        *   Pizarra de dibujo libre con efecto de pincel de tiza difuminada sobre lienzo verde y botón de limpieza rápida.
    *   **Modo Guiado Paso a Paso (`hubApp`)**:
        *   Incorporación de botones interactivos de navegación de pasos ("Ver todo" y "Modo Guiado") que revelan los pasos de resolución de forma secuencial con efectos de animación fluidos.
    *   **Pantalla de Calculadora Natural V.P.A.M. Interactiva**:
        *   Diseñamos una pantalla de pizarra superior que compila y renderiza en vivo usando KaTeX la expresión matemática ingresada por el usuario (las fracciones se apilan verticalmente, los exponentes y raíces se ven en formato real) con un cursor matemático animado en azul. Además, unificamos la pantalla con el input de texto de modo que hacer clic en cualquier parte del bloque le da el foco de entrada automáticamente para facilitar la edición directa.
    *   **Teclado Completo de 32 Teclas con Teclado Numérico Dedicado**:
        *   Añadimos una cuadrícula de 32 botones que contiene un teclado numérico físico-virtual completo (0-9, punto decimal, constantes) además de las teclas científicas, distinguiéndolas visualmente en la hoja de estilos ([hub.css](file:///C:/Users/JP/Desktop/PRIEBANEGOCIOS1/hub.css)).
    *   **Formateo de Entrada de Operadores en Tiempo Real**:
        *   Inyección de un listener de entrada que intercepta y reemplaza inmediatamente `*` por `×` y `/` por `÷` para garantizar que la previsualización del usuario sea puramente matemática.
    *   **Visualización de Formatos Alternativos y Clasificación Teórica**:
        *   Diseñamos y renderizamos dinámicamente un bloque de "Formatos Alternativos" que previsualiza simultáneamente cualquier resultado numérico en decimal, porcentaje, fracción simplificada, fracción equivalente no simplificada, fracción mixta y notación científica. Asimismo, clasifica el número teóricamente en sus conjuntos matemáticos correspondientes ($\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{I}$, $\mathbb{R}$), detallando paridad y primalidad (incluyendo la descomposición de factores primos para compuestos).
    *   **Cálculo de MCM y MCD paso a paso**:
        *   Añadimos soporte para encontrar el MCM y el MCD detallando la factorización prima de cada término y aplicando las reglas de exponentes correspondientes.
    *   Integración de `formatBlackboardMath` en el renderizado de módulos, preguntas de test, explicaciones de feedback y respuestas del chat de estudio.


## Resumen de la Sesión (5 de Junio, 2026)
**Objetivo:** Implementar el "Chat de Estudio" (Tutor de IA) con integración agnóstica de Gemini/Claude y soporte KaTeX en la interfaz.

### Cambios Técnicos Implementados:
1.  **Frontend (HTML & CSS):**
    *   Integrado botón de "Chat de Estudio (IA)" en la cabecera de la vista de módulos de cada curso (`view-course-menu`).
    *   Añadida la estructura del chat en `index.html` (`view-course-chat`) con globos de diálogo diferenciados para Estudiante y Asistente.
    *   Estilos en `hub.css` para mensajes de chat, avatares dinámicos de FontAwesome, estados de error y una animación interactiva de tres puntos (`typingBounce`) para indicar carga.

2.  **Lógica JavaScript (`hub.js`):**
    *   `openCourseChat()`: Carga el chat, reinicia el historial local e interactúa con `HubStorage` para verificar la clave de API del usuario. Si no está configurada, muestra un banner de alerta amigable redirigiendo a Configuración.
    *   `getAIChatResponse()`: Genera un prompt enriquecido compilando los apuntes teóricos de todos los módulos del curso actual y el historial de la conversación. Utiliza `callGeminiAPI` o `callClaudeAPI` de forma transparente.
    *   `submitChatMessage()`: Maneja el envío del formulario, la actualización del scroll automático en el chat y la visualización de la respuesta formateada con soporte de fórmulas matemáticas vía KaTeX.
    *   **Bugfix en `callGeminiAPI()`**: Parametrizamos la función para que no obligue a Gemini a responder en formato JSON al utilizar funciones de chat conversacional o explicaciones de código (evitando el error de conexión Bad Request 400).

## Resumen de la Sesión Anterior (Mayo 2026)
**Objetivo:** Finalizar la transición a SPA y optimizar la ingesta de datos con feedback granular.

### Cambios Técnicos Implementados:
1.  **Motor de Ingesta (Backend Python):**
    *   Refactorización de `export_data.py`: Ahora genera archivos en dos formatos simultáneos: `course_data.json` (estándar) y `course_data.js` (fallback para carga local).
    *   Inyección de **Feedback Granular**: Se mapearon las explicaciones específicas de cada opción desde los diccionarios de Python al objeto de pregunta en el JSON.

2.  **Arquitectura SPA (Frontend JS):**
    *   **Resiliencia en Carga Local**: Se implementó una lógica de "Doble Chequeo" en `hub.js` que intenta cargar datos vía `fetch()` pero recurre a la variable global `DEFAULT_COURSE_PACK` si detecta restricciones de CORS (ideal para cuando abres el archivo sin servidor).
    *   **Motor de Feedback Detallado**: Se actualizó `selectOption()` para detectar si una opción tiene su propia explicación y mostrarla dinámicamente en la caja de feedback.
    *   **Corrección de IDs**: Sincronización del ID del uploader entre el HTML (`courseUploader`) y el JS para garantizar que la importación manual sea fluida.

3.  **Interfaz y Experiencia de Usuario (UI/UX):**
    *   **Micro-animaciones**: Añadidas transiciones `cubic-bezier` y efectos de traslación (`translateX`) en las opciones de test para dar una sensación de app premium.
    *   **Caja de Feedback Inteligente**: Rediseño visual con estados de éxito/error diferenciados y animaciones de entrada (`slideUp`).
    *   **Auto-poblamiento**: El Hub ahora se llena automáticamente al primer inicio si detecta el archivo de datos, eliminando la fricción inicial para el usuario.

### Hito Alcanzado:
**Estabilidad total del Motor Agnóstico.** El sistema ahora es capaz de consumir cualquier pack de estudio (Course Pack) manteniendo una experiencia visual consistente y proporcionando feedback educativo profundo en cada clic.
