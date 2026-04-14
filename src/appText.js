export const APP_TEXT = {
  assistantTitle: "Asistente estratégico Oxy46 en IA",
  statusActive: "Activo",
  logoAlt: "Oxy46",
  welcomeBack: "Bienvenido, {{name}}. Empecemos.",
  diagnosisReady: "{{name}}, acá va tu diagnóstico.",
  namePlaceholder: "Nombre · Empresa",
  answerPlaceholder: "Escribí tu respuesta...",
  shareLoading: "Generando informe...",
  shareButton: "Descargar y compartir informe",
  learnMoreButton: "Conocer más de Oxy",
  rubroOtherPrompt: "Excelente. ¿Cuál?",
  supabaseInitWarning: "Supabase no inicializado: revisa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. Guardando en localStorage.",
  supabaseWriteError: "Error al guardar en Supabase:",
};

export const QUESTION_TEXT = {
  name: {
    bot: [
      "Buen día 👋 Soy el **Asistente estratégico Oxy46 en IA**.",
      "Tres minutos. Respuestas directas. Diagnóstico real.",
      "¿Tu nombre y empresa?",
    ],
  },
  rubro: {
    bot: ["¿Cuál es el rubro principal de tu empresa?"],
    opts: ["Agroindustria", "Salud", "Comunicación", "Finanzas", "Energía", "Comercio", "Infraestructura", "Otro"],
  },
  size: {
    bot: ["¿Cantidad de empleados?"],
    opts: ["1–50", "51–200", "201–500", "501–2.000", "+2.000"],
  },
  q11: {
    bot: ["Empecemos con el diagnóstico.", "¿Dónde se almacena la información clave del negocio?"],
    opts: [
      "En planillas, mails y WhatsApps",
      "En sistemas aislados, sin o con poca integración",
      "En sistemas centralizados, con inconsistencias",
      "En sistemas centralizados y limpios",
      "En sistemas integrados en tiempo real",
    ],
  },
  q12: {
    bot: ["¿Cómo se capacita tu equipo en Inteligencia Artificial?"],
    opts: [
      "No tenemos un programa de capacitación",
      "Cada uno estudia por su cuenta",
      "Hemos dado algún curso suelto, sin continuidad",
      "Tenemos un programa activo aunque incompleto",
      "Tenemos una academia interna completa con continuidad",
    ],
  },
  q13: {
    bot: ["¿Qué hizo tu empresa con IA hasta ahora?"],
    opts: [
      "Nada, ni siquiera exploramos",
      "Uso informal e individual, sin coordinación",
      "Alguna prueba piloto o proyecto puntual",
      "Casos en producción con resultados medibles",
      "IA integrada en procesos críticos del negocio",
    ],
  },
  q21: {
    bot: ["¿Quién impulsa el tema de IA en tu empresa?"],
    opts: [
      "Nadie en particular, es un tema que flota",
      "Alguien lo menciona pero sin poder de decisión",
      "Un directivo lo tiene en agenda, sin presupuesto",
      "La dirección lo impulsa con recursos comprometidos",
      "Hay un mandato del directorio con KPIs de seguimiento",
    ],
  },
  q22: {
    bot: ["¿Qué pasaría si tu empresa no hace nada con IA en los próximos 12 meses?"],
    opts: [
      "No pasaría nada, no es relevante hoy",
      "Probablemente nada grave, pero deberíamos explorarlo",
      "Perderíamos eficiencia frente a competidores",
      "Quedaríamos en desventaja clara",
      "Hay riesgo serio de perder mercado",
    ],
  },
  q23: {
    bot: ["¿Cuál es la postura de tu empresa frente a invertir en IA?"],
    opts: [
      "Primero queremos entender de qué se trata",
      "Dispuestos a invertir en un piloto acotado",
      "Tenemos presupuesto aprobado para IA este año",
      "Ya hay presupuesto recurrente asignado",
      "IA tiene línea presupuestaria propia con governance",
    ],
  },
  q31: {
    bot: ["¿Tenés claro cuál es el primer problema de negocio que resolverías con IA?"],
    opts: [
      "No, es todo muy abstracto todavía",
      "Tengo una idea vaga pero no sabría definir el caso",
      "Sé cuál es el problema, pero no cómo IA ayudaría",
      "Tengo el problema y una hipótesis de solución con IA",
      "Tengo el caso documentado con métricas de éxito",
    ],
  },
  q32: {
    bot: ["¿Qué esperarías ver como resultado concreto en 90 días?"],
    opts: [
      "Honestamente, no sé qué esperar",
      "Que el equipo entienda qué es posible y qué no",
      "Un plan claro con prioridades y costos",
      "Un piloto funcionando en un proceso real",
      "Resultados medibles: ahorro, velocidad o revenue",
    ],
  },
  q33: {
    bot: ["Última pregunta — y la más importante.", "En una frase: ¿cuál es el mayor desafío de tu negocio donde la tecnología podría ayudar?"],
  },
};

export const CONDITIONAL_QUESTION_TEXT = {
  bot: ["Una pregunta más para afinar el diagnóstico:", "¿Tenés internamente el equipo técnico para ejecutar tu caso de IA prioritario?"],
  opts: ["Sí, tenemos equipo", "Necesitamos capacidad externa"],
};

export const STATS_TEXT = {
  default: [
    "En Argentina, solo el 6% de las empresas tiene una implementación amplia de IA, mientras que dos tercios nunca lo intentó o abandonó el intento (Monitor Nacional de IA, 2025).",
    "El 88% de los profesionales argentinos ya usa IA en su trabajo, pero solo el 35% recibió capacitación de su empresa — la principal deuda corporativa según IDEA (2025).",
    "Las empresas que adoptan IA estratégicamente en LATAM obtienen un retorno de US$3 por cada US$1 invertido. En Argentina el ratio es 2,6x con recuperación en ~14 meses (IDC/Intel, 2025).",
    "Solo el 6% de las empresas de LATAM captura impacto significativo de IA. El 94% restante experimenta sin resultados medibles (McKinsey + WEF, 2026).",
    "El 44% de las organizaciones argentinas no mide ningún KPI de IA, y más del 50% no calcula ROI de sus inversiones (Monitor Nacional de IA, 2025).",
    "La IA podría multiplicar x5 la productividad histórica de LATAM: de 0,4% anual a 1,9-2,3% anual (McKinsey + WEF, 2026). Pero solo para quienes la implementan estratégicamente.",
    "El 54% del empleo formal argentino (~3 millones de puestos) tiene al menos el 50% de sus tareas automatizables con IA generativa (Ministerio de Trabajo Argentina, 2025).",
    "El 97% de las empresas de LATAM planea aumentar su presupuesto de IA en los próximos 12 meses, con un crecimiento promedio esperado del 14% (IDC/Intel, 2025).",
    "Solo el 4% de las empresas argentinas considera la IA como prioridad estratégica, pese a que el 67% ya tiene alguna iniciativa en marcha (Bain & Company, 2025).",
    "El 60% de las PyMEs argentinas ya usa IA o IA generativa, pero la inversión es desordenada y sin estrategia clara (Microsoft/Edelman, 2025).",
  ],
  Agroindustria: [
    "Grupo Pão de Açúcar usa IA para pronóstico de ventas en 700+ tiendas y 60.000+ productos (Google Cloud, 2025). La agroindustria que no integra IA en su cadena pierde eficiencia cada trimestre.",
    "En Argentina, el 43% de las organizaciones ya ve resultados de implementación de IA, pero el 57% restante no los ve — en gran parte por falta de estrategia (Meta/Linux Foundation, 2025).",
  ],
  Salud: [
    "Los hospitales de LATAM que adoptaron IA clínica redujeron tiempos de diagnóstico en promedio 35% (IDC/Intel, 2025). En salud, cada minuto de diagnóstico impacta directamente en resultados.",
    "El sector de salud lidera la adopción de IA para análisis de datos predictivos, con 62% de implementaciones activas en LATAM (Bain & Company, 2025).",
  ],
  Comunicación: [
    "Medios y telecomunicaciones han logrado a través de IA incrementos de 25-40% en personalización de contenidos y retención de usuarios (McKinsey, 2025).",
    "El 71% de las empresas de comunicación en LATAM ya usa IA para análisis de audiencia y optimización editorial (NTT DATA, 2025).",
  ],
  Finanzas: [
    "El sector bancario y financiero tiene una adopción sistemática de IA del 69% en LATAM — la segunda más alta después de telecomunicaciones (IDC/Intel, 2025).",
    "Bancolombia logró un 30% más de generación de código y 18.000 cambios automatizados por año con IA (Google Cloud, 2025).",
  ],
  Energía: [
    "Empresas de energía en LATAM emplean IA para optimización de redes con reducción de pérdidas de hasta 18% y predictive maintenance (IDC/Intel, 2025).",
    "La adopción de IA en el sector energético es del 58% en LATAM, orientada principalmente a eficiencia operativa y sostenibilidad (Bain & Company, 2025).",
  ],
  Comercio: [
    "El comercio minorista que integra IA obtiene mejoras de 15-22% en conversión y 30% en gestión de inventario (McKinsey + WEF, 2026).",
    "Mercado Libre ya genera el 20% de su nuevo código con IA y usa búsqueda semántica vía Vertex AI (Google Cloud, 2025).",
  ],
  Infraestructura: [
    "Proyectos de infraestructura con IA logran detección de anomalías en estructuras 40% más rápida que inspecciones tradicionales (IDC/Intel, 2025).",
    "La adopción de IA en construcción e infraestructura crece 22% anual en LATAM, enfocada en BIM, planificación y seguridad (Bain & Company, 2025).",
  ],
};

export const PROFILE_TEXT = {
  curioso: {
    intro: "{{name}}, tu empresa está en un punto de partida.",
    bullets: [
      "Centralizá y conectá los datos clave — ese es el cimiento de cualquier proyecto de IA.",
      "Asigná un sponsor con poder de decisión: sin ese rol, los proyectos no arrancan.",
      "Elegí un problema concreto y definí cómo medirías el éxito con IA.",
    ],
    close: "La buena noticia: estás haciendo este diagnóstico. Eso ya te pone por delante del 67% de empresas argentinas que ni siquiera lo intentaron (Monitor Nacional de IA, 2025).",
  },
  ansioso: {
    intro: "{{name}}, tu empresa siente la urgencia de moverse hacia la IA — y esa energía es valiosa.",
    bullets: [
      "Auditá el estado de tus datos antes de implementar — ese paso evita frustraciones costosas.",
      "Convertí la urgencia en un plan: priorizá un caso, definí métricas y presupuesto antes de hablar con proveedores.",
      "Elegí un problema acotado para empezar — resolverlo bien vale más que intentar todo a la vez.",
    ],
    close: "La urgencia que sentís no está mal. Lo que necesitás es canalizarla. El 44% de las empresas argentinas que invierten en IA no miden ningún KPI de resultado (Monitor Nacional, 2025) — porque invirtieron sin plan.",
  },
  informado: {
    intro: "{{name}}, tu empresa tiene bases sólidas y una dirección clara. El desafío es asegurar que lo que hagan tenga impacto real.",
    bullets: [
      "Identificá los gaps críticos de integración de datos y resolvélos antes de lanzar — eso separa un piloto exitoso del fracaso.",
      "Asegurate de tener un sponsor real con recursos comprometidos, no solo IA en la agenda.",
      "Armá un marco de adopción con ownership claro por área para que el avance no dependa de pocos.",
    ],
    close: "Estás en el grupo del 24% de empresas que alcanzó implementación avanzada de IA en LATAM (NTT DATA, 2025). El siguiente paso es pasar de avanzado a estratégico.",
  },
  constructor: {
    intro: "{{name}}, tu empresa está en una posición envidiable: infraestructura lista, voluntad y capacidad técnica.",
    bullets: [
      "Tenés todo para arrancar: la orden de largada es lo único que falta.",
      "Formalizá el mandato directivo con un objetivo medible y una fecha concreta de primer resultado.",
      "Elegí el caso prioritario, definí métricas y timeline, y pasá directamente a construir.",
    ],
    close: "Con tu nivel de preparación, la distancia entre donde estás y resultados concretos es más corta de lo que parece. El 25% de las empresas con perfil similar recuperó su inversión en menos de 6 meses (IDC/Intel, 2025).",
  },
  listo: {
    intro: "{{name}}, tu empresa tiene todo para implementar IA con impacto transformador.",
    bullets: [
      "Pasá directamente a construir: las condiciones son óptimas y el momento es ahora.",
      "Establecé un primer hito en 60 días y comunicalo internamente para generar tracción real.",
      "Conseguí el equipo técnico especializado — ese es el único gap que cerrar.",
    ],
    close: "Estás en el 6% de empresas de LATAM que puede capturar impacto significativo de IA (McKinsey + WEF, 2026). La diferencia entre capturarlo y no hacerlo es la velocidad de ejecución.",
  },
  autonomo: {
    intro: "{{name}}, tu empresa está lista para ejecutar — y tiene el equipo interno para hacerlo.",
    bullets: [
      "Pasá de proyectos aislados a una plataforma de IA que escale resultados en múltiples procesos.",
      "Formalizá el governance con KPIs de negocio para que el directorio vea el impacto en sus términos.",
      "Documentá casos, medí resultados y convertílos en estándares replicables.",
    ],
    close: "Estás en una posición que la mayoría de las empresas aspira a alcanzar. Ejecutá con confianza.",
  },
};

export const RISK_TEXT = {
  curioso: "El mayor riesgo para una empresa en tu situación es invertir en tecnología sin saber para qué. Sin una visión clara de qué problema resolver, cualquier inversión en IA — por chica que sea — es un tiro al aire.\n\nY no es un riesgo teórico: el 50% de las organizaciones argentinas no calcula ROI de sus inversiones en IA (Monitor Nacional, 2025), en gran parte porque invirtieron sin tener claro el para qué.\n\n{{stat}}",
  ansioso: "El mayor riesgo para una empresa con tu perfil es comprar herramientas que nadie usa. La urgencia sin plan genera gasto, no inversión.\n\nEn LATAM, el 49% de las empresas todavía no tiene claridad presupuestaria sobre IA (NTT DATA, 2025). Sin esa claridad, las decisiones se toman por impulso o por miedo a quedarse atrás — no por estrategia.\n\n{{stat}}",
  informado: "El mayor riesgo para una empresa en tu situación es que el proyecto muera antes de dar resultados. Los proyectos de IA no fallan por la tecnología — fallan cuando el sponsor no es real, cuando los datos no están listos, o cuando no hay alineamiento entre las áreas.\n\nSegún McKinsey + WEF (2026), solo el 6% de las empresas de LATAM captura impacto significativo de IA. La diferencia no es la tecnología sino la disciplina de ejecución.\n\n{{stat}}",
  constructor: "El mayor riesgo para una empresa con tu nivel de preparación es la parálisis por exceso de opciones. Cuando tenés capacidad e infraestructura, el peligro es querer hacer todo al mismo tiempo y no terminar nada. O peor: elegir el proyecto equivocado y desperdiciar el momentum.\n\n{{stat}}",
  listo: "El mayor riesgo para una empresa lista para ejecutar es elegir un partner de ejecución que no esté a la altura técnica. A tu nivel, la diferencia entre un resultado transformador y un proyecto mediocre depende de la calidad del equipo que construya.\n\n{{stat}}",
  autonomo: "El mayor riesgo en tu situación es paradójico: que alguien te venda algo que no necesitás. Con tu nivel de madurez, la tentación del mercado es ofrecerte soluciones premium que no agregan valor proporcional a su costo.\n\n{{stat}}",
};

export const NEEDS_TEXT = {
  curioso: "Lo que tu empresa necesita es alinear la visión directiva: ¿qué papel jugará la IA? ¿Qué problemas resolver? ¿Qué invertir?\n\nEse alineamiento, en sesiones cortas con quienes deciden, transforma el «deberíamos hacer algo» en «sabemos qué hacer y en qué orden» — y ahorra meses de inversión mal dirigida.",
  ansioso: "Lo que necesitás es un plan estratégico: mapeá los procesos, priorizá por retorno concreto y armá una hoja de ruta con plazos, responsables y métricas.\n\nFrenar para planificar bien es avanzar mejor. Las empresas que priorizan con rigor recuperan su inversión en ~14 meses (IDC/Intel, 2025). Las que no, gastan más y obtienen menos.",
  informado: "Tu empresa necesita dos cosas: un diagnóstico real del estado de datos y procesos, y un alineamiento directivo con objetivos claros y recursos comprometidos.\n\nEse trabajo previo evita el fracaso más común en IA: empezar con entusiasmo y frenar cuando la realidad de los datos o la falta de apoyo político aparece.",
  constructor: "Lo que necesitás es elegir el caso de uso con métricas claras e ir directo a ejecución — sin más diagnósticos ni workshops.\n\nUn sprint de definición de 2-3 semanas (caso, métricas, viabilidad) te da resultados medibles en 60-90 días en vez de meses de planificación que nunca aterriza.",
  listo: "Necesitás capacidad externa especializada para construir a la velocidad y calidad que tu ambición requiere — no consultores que te expliquen qué es IA.\n\nElegir bien esa pieza es la diferencia entre un proyecto que transforma la operación y uno que simplemente funciona.",
  autonomo: "No necesitás ayuda externa. Lo que podría sumar es una perspectiva puntual: segunda opinión técnica, validación de approach o benchmark regional.\n\nPero es un nice-to-have. Ejecutá con confianza.",
};

export const EDUCATION_TEXT = {
  curioso: {
    1: "Tu equipo no tiene herramientas conceptuales para evaluar qué es posible con IA. Sin esa base, cualquier decisión va a ser a ciegas. Dato clave: el 88% de los profesionales argentinos ya usa IA por su cuenta, pero solo el 35% recibió capacitación de su empresa (IDEA, 2025). Tu equipo probablemente esté en esa brecha.",
    2: "Tu equipo explora por su cuenta pero sin guía ni marco común. Cada persona aprende cosas distintas, de fuentes distintas, y el conocimiento no se comparte. Eso genera una ilusión de avance individual que no se traduce en capacidad organizacional.",
    3: "Hubo algún curso suelto pero sin continuidad ni conexión con el negocio. Es como aprender a manejar en un simulador y después no tener auto: el conocimiento existe pero no se aplica en la operación real.",
  },
  ansioso: {
    1: "Hay urgencia por adoptar IA pero el equipo no sabe por dónde empezar. La formación es el primer paso para convertir ansiedad en acción. Sin ella, las decisiones de compra se toman por moda, no por necesidad real.",
    2: "Cada persona estudia por su cuenta, lo cual genera conocimiento desparejo y desalineado. Cuando llegue el momento de implementar, vas a tener personas que saben mucho de herramientas que tal vez no son las correctas para tu negocio.",
    3: "Hubo algún curso pero desconectado del negocio real. La formación necesita estar alineada con la estrategia de IA — de lo contrario es un gasto, no una inversión.",
  },
  informado: {
    1: "Hay claridad estratégica pero el equipo no está preparado para ejecutar. Los proyectos van a depender de personas puntuales y no escalan. El 88% de profesionales argentinos usa IA — pero solo el 35% fue capacitado por su empresa (IDEA, 2025).",
    2: "La formación es informal y cada persona explora por su cuenta. Sin un marco común, el conocimiento no se comparte ni se aplica de forma consistente. Eso va a ser un cuello de botella cuando pases de plan a ejecución.",
    3: "Hubo alguna capacitación puntual pero probablemente desactualizada o desconectada de tu operación. Para que la adopción sea real y sostenible, la formación tiene que estar atada a los procesos y objetivos del negocio.",
  },
  constructor: {
    1: "La infraestructura está lista pero el equipo no tiene las herramientas para integrar IA en su día a día. El riesgo es construir sistemas que técnicamente funcionan pero que nadie adopta internamente.",
    2: "Tu equipo aprende por su cuenta, sin guía. Eso genera adopción despareja y dependencia de personas puntuales — exactamente lo contrario de lo que necesitás para escalar resultados.",
    3: "Hubo algún curso pero probablemente no conectado con tu operación real. El riesgo es construir soluciones que el equipo no sabe integrar en su trabajo diario.",
  },
  listo: {
    1: "Necesitás capacidad externa, pero tu equipo interno también necesita formación para integrar lo que se construya. Sin eso, la solución funciona mientras el proveedor la mantiene — y no se vuelve parte del negocio.",
    2: "Tu equipo tiene base pero necesita un nivel superior de preparación para integrar soluciones avanzadas de IA en la operación diaria.",
    3: "Hubo formación básica. Para integrar lo que vas a construir, el equipo necesita capacitación alineada específicamente con las soluciones que se implementen.",
  },
  fallback: "Detectamos una brecha importante entre lo que tu empresa quiere hacer con IA y lo que tu equipo está preparado para ejecutar. El 88% de los profesionales argentinos usa IA, pero solo el 35% fue capacitado por su empresa (IDEA, 2025).",
};

export const ARCHETYPE_LABELS = {
  curioso: "Exploración inicial",
  ansioso: "Urgencia sin plan",
  informado: "Bases con gaps",
  constructor: "Listo para construir",
  listo: "Listo para ejecutar",
  autonomo: "Autónomo",
};

export const REPORT_TEXT = {
  title: "Diagnóstico AI Oxy46",
  profileSummary: "{{name}} - {{label}}",
  diagnosisTitle: "Diagnóstico",
  riskTitle: "Tu mayor riesgo",
  educationGapTitle: "Brecha de formación detectada",
  needsTitle: "Lo que necesitás",
  nextStepTitle: "Siguiente paso",
  noSellCopy: "No tenemos nada que venderte. Si en algún momento querés contrastar una decisión técnica o tener una segunda opinión, podés contactarnos sin compromiso.",
  nextStepWithChallenge: "Si querés profundizar en lo que encontramos, el siguiente paso es una conversación de 15 minutos sin compromiso. Hablemos de tu desafío.",
  scheduleConversationButton: "Agendá una conversación →",
  shareTitle: "Informe Oxy46",
  shareText: "Te comparto mi informe de diagnóstico IA.",
  filePrefix: "informe-oxy46",
};