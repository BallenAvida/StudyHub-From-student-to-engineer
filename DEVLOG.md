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


