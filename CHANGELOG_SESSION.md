# 📝 Registro de Cambios - Sesiones de Desarrollo

Este archivo contiene el desglose técnico de lo implementado en cada sesión.

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
