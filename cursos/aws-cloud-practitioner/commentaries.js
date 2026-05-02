/*
  commentaries.js
  Auto‑generated professor explanations for PPT slides used in StudyHub.
  Each entry follows the pattern:
    "PPT_NAME": {
      "Slide X": "Prof. commentary…"
    }
  The UI can import this module and call `getCommentary(ppt, slide)`.
*/

const COMMENTARIES = {
  "PPT SEGUNDA CLASE": {
    "Diapositiva 3": "Los requerimientos son el *puente* que traduce lo que el negocio necesita al lenguaje técnico de los desarrolladores. Sin un acuerdo claro aquí, el proyecto se vuelve una torre de Jenga que se derrumba al primer temblor.",
    "Diapositiva 7": "Un requisito de tiempo (< 2 s) es un *requisito no funcional*: define *cómo* debe comportarse el sistema, no *qué* hace. Es esencial para garantizar una experiencia fluida que no frustre al usuario.",
    "Diapositiva 8": "Cuando los requerimientos son vagos o ambiguos, los cambios en fases tardías se vuelven costosos. Cada ajuste inesperado agrega tiempo y dinero, como si tuvieras que reconstruir el edificio cada vez que cambian los planos.",
    "Diapositiva 4": "Un "sistema" no es solo software; incluye personas, procesos y tecnología. Piensa en él como una orquesta donde cada instrumento (humano o máquina) debe estar afinado y seguir la partitura.",
    "Diapositiva 6": "En esta diapositiva vemos solo el título «Tipos de requerimientos». La imagen subyacente ilustra la clasificación: funcionales, no funcionales, de dominio y de datos. Cada tipo responde a una pregunta distinta del negocio.",
    "Diapositiva 9": "Los riesgos de requerimientos mal definidos aparecen como sobrecostos dramáticos. La regla de Boehm muestra que arreglar un error en la fase de requisitos cuesta 1 $, en producción 100 $.",
    "Diapositiva 10": "Los stakeholders son los actores clave que influyen o se ven impactados por el proyecto. Identificarlos temprano permite alinear expectativas y evitar sorpresas costosas."
  },
  "PPT TERCERA CLASE": {
    "Diapositiva 4": "Los requisitos funcionales describen *qué* debe hacer el sistema: acciones visibles al usuario, como registrar un cliente o generar un reporte.",
    "Diapositiva 7": "Los casos de uso describen paso a paso la interacción usuario‑sistema. Son la guía narrativa que transforma requisitos abstractos en escenarios concretos.",
    "Diapositiva 8": "Los requisitos de negocio se enfocan en el valor que el sistema aporta a la organización, no en la tecnología. Piensa en ellos como la razón de ser del proyecto.",
    "Diapositiva 9": "Los stakeholders externos establecen normas o regulaciones que el sistema debe respetar; aunque no financien, su conformidad es obligatoria.",
    "Diapositiva 10": "El Product Owner es el guardián del backlog: prioriza funcionalidades según valor de negocio y actúa como enlace principal entre el cliente y el equipo de desarrollo."
  },
  "PPT CUARTA CLASE": {
    "Diapositiva 4": "BPMN es el lenguaje gráfico estándar para modelar procesos de negocio. Permite a analistas y técnicos conversar usando diagramas claros y consistentes.",
    "Diapositiva 6": "Los diagramas de colaboración (o \"collaboration\") muestran cómo varios participantes (pools) interactúan mediante flujos de mensaje entre ellos.",
    "Diapositiva 10": "El círculo delgado indica un evento de inicio: el punto donde el proceso comienza su ejecución.",
    "Diapositiva 11": "Los gateways (rombos) son los puntos de decisión que bifurcan el flujo según condiciones lógicas, como \"si X entonces A\".",
    "Diapositiva 14": "El cilindro representa almacenamiento persistente, típicamente una base de datos donde se guardan los datos del proceso.",
    "Diapositiva 16": "Las flechas punteadas con sobre son flujos de mensaje: comunicación entre diferentes pools (ej. cliente <-> sistema).",
    "Diapositiva 18": "Los eventos intermedios, temporizadores o señales, permiten pausar o sincronizar el proceso en momentos clave."
  },
  "PPT SEXTA CLASE": {
    "Diapositiva 5": "PDCA (Plan‑Do‑Check‑Act) es el ciclo de mejora continua que ayuda a iterar procesos y aprender de los resultados.",
    "Diapositiva 10": "Integración continua (CI) implica compilar y probar el código varias veces al día para detectar rápidamente errores.",
    "Diapositiva 13": "Un KPI \"medible\" debe expresarse en métricas cuantitativas (porcentajes, promedios) para que sea objetivamente evaluable.",
    "Diapositiva 16": "Los KPIs son métricas estratégicas clave que alinean la medición con los objetivos de negocio, mientras que las métricas genéricas solo describen datos sin contexto.",
    "Diapositiva 19": "ROI y margen de ganancia son KPIs financieros: miden la rentabilidad del proyecto y el retorno de la inversión.",
    "Diapositiva 22": "La práctica de pruebas automatizadas garantiza que cada cambio mantiene la estabilidad del producto.",
    "Diapositiva 24": "El feedback continuo del cliente en sitio ayuda a validar requisitos y ajustar prioridades en tiempo real."
  },
  "PPT SEPTIMA CLASE": {
    "Diapositiva 4": "Un caso de uso describe, con lenguaje natural, cómo un actor logra un objetivo dentro del sistema.",
    "Diapositiva 7": "El estereotipo <<include>> indica una dependencia obligatoria: la función base siempre invoca la funcionalidad incluida.",
    "Diapositiva 10": "Los casos de uso de sistema detallan interacciones técnicas y respuestas de la interfaz, enfocándose en la lógica del software.",
    "Diapositiva 12": "La sección \"para...\" del formato de historia de usuario debe expresar el valor o beneficio que se busca lograr.",
    "Diapositiva 17": "En INVEST, la \"E\" representa \"Estimable\": el equipo debe poder estimar tiempo o esfuerzo con confianza."
  },
  "PPT CLASE 11": {
    "Diapositiva 4": "La fase de inicio incluye la autorización del proyecto mediante el acta de constitución que define alcance y objetivos.",
    "Diapositiva 6": "El análisis cualitativo de riesgos valora la probabilidad y el impacto usando descriptores como alto, medio o bajo.",
    "Diapositiva 8": "La estrategia FA (Fortalezas‑Amenazas) aprovecha los puntos fuertes internos para mitigar amenazas externas.",
    "Diapositiva 19": "El siguiente paso después del FODA es aplicar CAME: corregir, afrontar, mantener y explotar, convirtiendo diagnóstico en acción."
  }
};

/**
 * Retrieve the professor commentary for a given PPT and slide.
 * @param {string} pptName - Exact name of the PPT (e.g., "PPT SEGUNDA CLASE").
 * @param {string} slideLabel - Slide label such as "Diapositiva 3".
 * @returns {string} Commentary text or a default placeholder.
 */
export function getCommentary(pptName, slideLabel) {
  const ppt = COMMENTARIES[pptName];
  if (ppt && ppt[slideLabel]) {
    return ppt[slideLabel];
  }
  return "Comentario del profesor no disponible para esta diapositiva.";
}
