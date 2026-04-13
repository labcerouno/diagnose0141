import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { createClient } from "@supabase/supabase-js";
import oxyLogo from "./assets/Oxy_blanco.png";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const DIAG_TABLE = "diagnosticos_ia";
const DIAG_LOCAL_KEY = "diag:entries";

function getLocalEntries() {
  try {
    const raw = localStorage.getItem(DIAG_LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveLocalEntry(entry) {
  try {
    const entries = getLocalEntries();
    entries.unshift(entry);
    localStorage.setItem(DIAG_LOCAL_KEY, JSON.stringify(entries.slice(0, 500)));
  } catch (error) {
    // Ignore local persistence errors to avoid blocking UX.
  }
}

async function saveDiagnosis(entry) {
  if (!supabase) {
    saveLocalEntry(entry);
    return;
  }

  const { error } = await supabase
    .from(DIAG_TABLE)
    .insert({ payload: entry });

  if (error) {
    saveLocalEntry(entry);
  }
}

async function listDiagnoses() {
  if (!supabase) {
    return getLocalEntries().sort((a, b) => new Date(b.ts) - new Date(a.ts));
  }

  const { data, error } = await supabase
    .from(DIAG_TABLE)
    .select("created_at,payload")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error || !data) {
    return getLocalEntries().sort((a, b) => new Date(b.ts) - new Date(a.ts));
  }

  return data
    .map((row) => {
      const payload = row?.payload && typeof row.payload === "object" ? row.payload : {};
      return {
        ...payload,
        ts: payload.ts || row.created_at || new Date().toISOString(),
      };
    })
    .sort((a, b) => new Date(b.ts) - new Date(a.ts));
}

const C = {
  bg:"#0f1923", card:"#1c2b36", accent:"#3a9e8f", accentLight:"#4fc4b0",
  text:"#e8edf1", muted:"#8a9baa", dim:"#5a6f7e", white:"#fff",
  botBub:"#1e3040", userBub:"#3a9e8f", pillBd:"#3a5565",
  danger:"#e85d4a", purple:"#9b6dff", purpleFade:"rgba(155,109,255,0.12)",
  accentFade:"rgba(58,158,143,0.15)",
};

const QS = [
  { id:"name",type:"text",bot:["Buen día 👋 Soy el **Asistente estratégico Oxy46 en IA**.","Tres minutos. Respuestas directas. Diagnóstico real.","¿Tu nombre y empresa?"] },
  { id:"rubro",type:"choice",bot:["¿Cuál es el rubro principal de tu empresa?"],
    opts:["Corretaje de Granos","Exportación / Trading","Logística Agro","Finanzas & Seguros","Agroindustria","Tecnología / SaaS","Otro"] },
  { id:"size",type:"choice",bot:["¿Cantidad de empleados?"],
    opts:["1–50","51–200","201–500","501–2.000","+2.000"] },
  { id:"q11",type:"scored",dim:"cap",bot:["Empecemos con el diagnóstico.","¿Dónde se almacena la información clave del negocio?"],
    opts:[
      {l:"En planillas, mails y WhatsApps",s:1},{l:"En sistemas aislados, sin o con poca integración",s:2},
      {l:"En sistemas centralizados, con inconsistencias",s:3},{l:"En sistemas centralizados y limpios",s:4},
      {l:"En sistemas integrados en tiempo real",s:5}
    ]},
  { id:"q12",type:"scored",dim:"cap",isEdu:true,bot:["¿Cómo se capacita tu equipo en Inteligencia Artificial?"],
    opts:[
      {l:"No tenemos un programa de capacitación",s:1},{l:"Cada uno estudia por su cuenta",s:2},
      {l:"Hemos dado algún curso suelto, sin continuidad",s:3},{l:"Tenemos un programa activo aunque incompleto",s:4},
      {l:"Tenemos una academia interna completa con continuidad",s:5}
    ]},
  { id:"q13",type:"scored",dim:"cap",bot:["¿Qué hizo tu empresa con IA hasta ahora?"],
    opts:[
      {l:"Nada, ni siquiera exploramos",s:1},{l:"Uso informal e individual, sin coordinación",s:2},
      {l:"Alguna prueba piloto o proyecto puntual",s:3},{l:"Casos en producción con resultados medibles",s:4},
      {l:"IA integrada en procesos críticos del negocio",s:5}
    ]},
  { id:"q21",type:"scored",dim:"vol",bot:["Ahora sobre la voluntad de tu organización.","¿Quién impulsa el tema de IA en tu empresa?"],
    opts:[
      {l:"Nadie en particular, es un tema que flota",s:1},{l:"Alguien lo menciona pero sin poder de decisión",s:2},
      {l:"Un directivo lo tiene en agenda, sin presupuesto",s:3},{l:"La dirección lo impulsa con recursos comprometidos",s:4},
      {l:"Hay un mandato del directorio con KPIs de seguimiento",s:5}
    ]},
  { id:"q22",type:"scored",dim:"vol",bot:["¿Qué pasaría si tu empresa no hace nada con IA en los próximos 12 meses?"],
    opts:[
      {l:"No pasaría nada, no es relevante hoy",s:1},{l:"Probablemente nada grave, pero deberíamos explorarlo",s:2},
      {l:"Perderíamos eficiencia frente a competidores",s:3},{l:"Quedaríamos en desventaja clara",s:4},
      {l:"Hay riesgo serio de perder mercado",s:5}
    ]},
  { id:"q23",type:"scored",dim:"vol",bot:["¿Cuál es la postura de tu empresa frente a invertir en IA?"],
    opts:[
      {l:"Primero queremos entender de qué se trata",s:1},{l:"Dispuestos a invertir en un piloto acotado",s:2},
      {l:"Tenemos presupuesto aprobado para IA este año",s:3},{l:"Ya hay presupuesto recurrente asignado",s:4},
      {l:"IA tiene línea presupuestaria propia con governance",s:5}
    ]},
  { id:"q31",type:"scored",dim:"cla",bot:["Última dimensión: claridad.","¿Tenés claro cuál es el primer problema de negocio que resolverías con IA?"],
    opts:[
      {l:"No, es todo muy abstracto todavía",s:1},{l:"Tengo una idea vaga pero no sabría definir el caso",s:2},
      {l:"Sé cuál es el problema, pero no cómo IA ayudaría",s:3},{l:"Tengo el problema y una hipótesis de solución con IA",s:4},
      {l:"Tengo el caso documentado con métricas de éxito",s:5}
    ]},
  { id:"q32",type:"scored",dim:"cla",bot:["¿Qué esperarías ver como resultado concreto en 90 días?"],
    opts:[
      {l:"Honestamente, no sé qué esperar",s:1},{l:"Que el equipo entienda qué es posible y qué no",s:2},
      {l:"Un plan claro con prioridades y costos",s:3},{l:"Un piloto funcionando en un proceso real",s:4},
      {l:"Resultados medibles: ahorro, velocidad o revenue",s:5}
    ]},
  { id:"q33",type:"text",bot:["Última pregunta — y la más importante.","En una frase: ¿cuál es el mayor desafío de tu negocio donde la tecnología podría ayudar?"] },
];

const COND = {id:"cond",type:"choice",bot:["Una pregunta más para afinar el diagnóstico:","¿Tenés internamente el equipo técnico para ejecutar tu caso de IA prioritario?"],opts:["Sí, tenemos equipo","Necesitamos capacidad externa"]};

const pick = arr => arr[Math.floor(Math.random()*arr.length)];
function cls(s,d){const m={cap:[["Fundacional",2],["En construcción",3.5],["Habilitada",5]],vol:[["Exploratoria",2],["Comprometida",3.5],["Acelerada",5]],cla:[["Difusa",2],["Enfocándose",3.5],["Cristalizada",5]]};for(const[l,x]of m[d])if(s<=x)return l;return m[d][2][0];}
function lv(s){return s<=2?"bajo":s<=3.5?"medio":"alto";}
function getArch(c,v,cl,e,ht){const lc=lv(c),lv2=lv(v),lcl=lv(cl);if(lc==="alto"&&lv2==="alto"&&lcl==="alto")return ht?"autonomo":"listo";if(lc==="bajo"&&lcl==="bajo"&&lv2==="bajo")return"curioso";if(lc==="bajo"&&(lv2==="medio"||lv2==="alto"))return"ansioso";if(lc==="bajo")return"curioso";if(lc==="alto"&&lcl==="medio")return"constructor";if(lc==="alto"&&lcl==="alto")return"listo";return"informado";}

const STATS = {
  "default":[
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
  "Finanzas & Seguros":["El sector bancario y financiero tiene una adopción sistemática de IA del 69% en LATAM — la segunda más alta después de telecomunicaciones (IDC/Intel, 2025).","Bancolombia logró un 30% más de generación de código y 18.000 cambios automatizados por año con IA (Google Cloud, 2025)."],
  "Agroindustria":["Grupo Pão de Açúcar usa IA para pronóstico de ventas en 700+ tiendas y 60.000+ productos (Google Cloud, 2025). La agroindustria que no integra IA en su cadena pierde eficiencia cada trimestre.","En Argentina, el 43% de las organizaciones ya ve resultados de implementación de IA, pero el 57% restante no los ve — en gran parte por falta de estrategia (Meta/Linux Foundation, 2025)."],
  "Tecnología / SaaS":["Mercado Libre ya genera el 20% de su nuevo código con IA y usa búsqueda semántica vía Vertex AI (Google Cloud, 2025). En SaaS, la ventana para diferenciarse con IA se cierra rápido.","El 14% de las empresas de LATAM ya tiene proyectos de IA agéntica activos. En tecnología, ese número crece más rápido que en cualquier otro sector (NTT DATA, 2025)."],
  "Corretaje de Granos":["El 49% de la inversión de empresas argentinas en IA no tiene claridad presupuestaria (NTT DATA, 2025). En corretaje, donde los márgenes son estrechos, eso significa oportunidad perdida cada día."],
  "Logística Agro":["Manufactura tiene 67% de adopción sistemática de IA en LATAM (IDC/Intel, 2025). Logística y supply chain son las áreas donde el impacto se mide en horas y costos directos."],
  "Exportación / Trading":["Los servicios financieros y el trading lideran la adopción de IA generativa en LATAM, con eficiencia operativa como principal beneficio buscado por el 54% de las empresas (NTT DATA, 2025)."],
};

function getStat(rubro){return pick([...(STATS[rubro]||[]),...STATS["default"]]);}

const PROFILES = {
  curioso:{
    intro:n=>`${n}, tu empresa está en una etapa muy temprana del camino hacia la inteligencia artificial. Eso no es un problema — es un punto de partida. Pero es importante tener claridad sobre dónde estás parado para no dar pasos en falso.`,
    bullets:["La infraestructura tecnológica todavía no está preparada para soportar proyectos de IA — los datos están dispersos y no hay sistemas que los conecten de forma útil.","El tema IA no tiene un impulsor claro dentro de la organización. Sin alguien con poder de decisión detrás, los proyectos no arrancan o se diluyen en las primeras semanas.","Todavía no hay un caso de uso concreto definido. Se habla de IA en general pero no hay un problema específico del negocio donde aplicarla con retorno medible."],
    close:"La buena noticia: estás haciendo este diagnóstico. Eso ya te pone por delante del 67% de empresas argentinas que ni siquiera lo intentaron (Monitor Nacional de IA, 2025).",
  },
  ansioso:{
    intro:n=>`${n}, tu empresa siente la urgencia de moverse hacia la IA — y esa energía es valiosa. Pero hay una brecha importante entre la voluntad de avanzar y la preparación real para hacerlo con impacto.`,
    bullets:["Hay decisión de moverse, pero la infraestructura de datos y los sistemas todavía no están al nivel que se necesita. Implementar IA sobre datos dispersos o inconsistentes genera frustraciones, no resultados.","La urgencia es genuina, pero sin un plan estratégico puede convertirse en inversión dispersa — herramientas que nadie adopta, pilotos que no escalan, proveedores que no cumplen.","Falta definir con precisión cuál es el primer problema de negocio que IA resolvería. Sin ese foco, es fácil intentar resolver todo y no resolver nada."],
    close:"La urgencia que sentís no está mal. Lo que necesitás es canalizarla. El 44% de las empresas argentinas que invierten en IA no miden ningún KPI de resultado (Monitor Nacional, 2025) — porque invirtieron sin plan.",
  },
  informado:{
    intro:n=>`${n}, tu empresa tiene bases sólidas y una dirección clara. Hay sistemas, hay voluntad, hay una noción de hacia dónde ir. El desafío ahora no es convencerse de que hay que hacer algo — es asegurar que lo que hagan tenga impacto real y sostenible.`,
    bullets:["La infraestructura está en construcción — hay sistemas pero con gaps de integración o calidad de datos que pueden frenar un proyecto de IA en el momento menos esperado.","Hay voluntad real de avanzar y algo de claridad sobre el problema a resolver, pero todavía falta la definición precisa del caso y el alineamiento completo de la dirección con recursos concretos.","El equipo tiene intención pero necesita un marco común para que la adopción sea organizacional y no dependiente de dos o tres personas puntuales que saben más que el resto."],
    close:"Estás en el grupo del 24% de empresas que alcanzó implementación avanzada de IA en LATAM (NTT DATA, 2025). El siguiente paso es pasar de avanzado a estratégico.",
  },
  constructor:{
    intro:n=>`${n}, tu empresa está en una posición envidiable: la infraestructura está lista, hay voluntad de avanzar y hay capacidad técnica. Lo que falta es definir el caso exacto y ejecutar sin dilaciones.`,
    bullets:["Los datos están organizados, los sistemas funcionan y hay equipo técnico con experiencia. Las condiciones están dadas para implementar IA con resultados medibles en el corto plazo.","La dirección está comprometida y hay recursos asignados. No es un tema que flota — hay decisión real de avanzar, lo cual es poco común.","El gap está en la definición: todavía falta elegir el caso de uso prioritario con métricas claras de éxito y un timeline de ejecución concreto."],
    close:"Con tu nivel de preparación, la distancia entre donde estás y resultados concretos es más corta de lo que parece. El 25% de las empresas con perfil similar recuperó su inversión en menos de 6 meses (IDC/Intel, 2025).",
  },
  listo:{
    intro:n=>`${n}, tu empresa tiene todo lo necesario para implementar IA con impacto transformador: infraestructura sólida, claridad estratégica, sponsor decidido y urgencia fundamentada.`,
    bullets:["Los datos están limpios e integrados, hay casos definidos con métricas y la dirección está comprometida con recursos reales. Las condiciones son óptimas.","El equipo tiene claridad sobre qué resolver y qué esperar. No necesitás más diagnósticos ni workshops de sensibilización — necesitás construir.","La pieza que falta es capacidad técnica especializada: talento, velocidad o expertise puntual que no tenés internamente para ejecutar al nivel que tu ambición requiere."],
    close:"Estás en el 6% de empresas de LATAM que puede capturar impacto significativo de IA (McKinsey + WEF, 2026). La diferencia entre capturarlo y no hacerlo es la velocidad de ejecución.",
  },
  autonomo:{
    intro:n=>`${n}, tu empresa está lista para ejecutar — y tiene el equipo interno para hacerlo. No necesitás consultora. Lo que compartimos es una lectura honesta de tu situación.`,
    bullets:["Infraestructura sólida, datos integrados, equipo técnico con experiencia y proyectos en marcha. Las condiciones son las mejores posibles para capturar valor con IA.","Hay sponsor fuerte, presupuesto dedicado y claridad sobre los casos prioritarios. La organización está alineada de arriba a abajo.","Tenés capacidad de ejecución interna. No dependés de terceros para avanzar — y eso es una ventaja competitiva que pocas empresas en Argentina tienen."],
    close:"Estás en una posición que la mayoría de las empresas aspira a alcanzar. Ejecutá con confianza.",
  },
};

function getRisk(ar,rubro){
  const risks = {
    curioso:`El mayor riesgo para una empresa en tu situación es invertir en tecnología sin saber para qué. Sin una visión clara de qué problema resolver, cualquier inversión en IA — por chica que sea — es un tiro al aire.\n\nY no es un riesgo teórico: el 50% de las organizaciones argentinas no calcula ROI de sus inversiones en IA (Monitor Nacional, 2025), en gran parte porque invirtieron sin tener claro el para qué.\n\n${getStat(rubro)}`,
    ansioso:`El mayor riesgo para una empresa con tu perfil es comprar herramientas que nadie usa. La urgencia sin plan genera gasto, no inversión.\n\nEn LATAM, el 49% de las empresas todavía no tiene claridad presupuestaria sobre IA (NTT DATA, 2025). Sin esa claridad, las decisiones se toman por impulso o por miedo a quedarse atrás — no por estrategia.\n\n${getStat(rubro)}`,
    informado:`El mayor riesgo para una empresa en tu situación es que el proyecto muera antes de dar resultados. Los proyectos de IA no fallan por la tecnología — fallan cuando el sponsor no es real, cuando los datos no están listos, o cuando no hay alineamiento entre las áreas.\n\nSegún McKinsey + WEF (2026), solo el 6% de las empresas de LATAM captura impacto significativo de IA. La diferencia no es la tecnología sino la disciplina de ejecución.\n\n${getStat(rubro)}`,
    constructor:`El mayor riesgo para una empresa con tu nivel de preparación es la parálisis por exceso de opciones. Cuando tenés capacidad e infraestructura, el peligro es querer hacer todo al mismo tiempo y no terminar nada. O peor: elegir el proyecto equivocado y desperdiciar el momentum.\n\n${getStat(rubro)}`,
    listo:`El mayor riesgo para una empresa lista para ejecutar es elegir un partner de ejecución que no esté a la altura técnica. A tu nivel, la diferencia entre un resultado transformador y un proyecto mediocre depende de la calidad del equipo que construya.\n\n${getStat(rubro)}`,
    autonomo:`El mayor riesgo en tu situación es paradójico: que alguien te venda algo que no necesitás. Con tu nivel de madurez, la tentación del mercado es ofrecerte soluciones premium que no agregan valor proporcional a su costo.\n\n${getStat(rubro)}`,
  };
  return risks[ar];
}

const NEEDS = {
  curioso:"Antes de pensar en herramientas o proyectos de IA, lo que tu empresa necesita es alinear la visión a nivel directivo. Eso significa responder tres preguntas fundamentales: ¿qué papel va a jugar la IA en nuestro negocio? ¿Qué problemas concretos queremos resolver? ¿Y qué estamos dispuestos a invertir para lograrlo?\n\nEste tipo de alineamiento se logra en sesiones de trabajo cortas y enfocadas con quienes toman decisiones — no en presentaciones genéricas sobre tendencias. El beneficio es pasar de «deberíamos hacer algo con IA» a «sabemos qué hacer, por qué y en qué orden». Eso solo puede ahorrar meses de inversión mal dirigida.",
  ansioso:"Lo que tu empresa necesita es un plan estratégico que convierta la urgencia en acción ordenada. Eso implica mapear los procesos del negocio, identificar dónde la IA puede generar impacto real (no teórico), priorizar por retorno concreto y armar una hoja de ruta con plazos, responsables y métricas de éxito.\n\nEl beneficio de este paso es frenar para avanzar mejor: en vez de invertir en la herramienta que más ruido hace, invertís en el problema que más duele. Las empresas que priorizan con rigor recuperan su inversión en un promedio de 14 meses (IDC/Intel, 2025). Las que no priorizan suelen gastar más y obtener menos.",
  informado:"Tu empresa necesita dos cosas en paralelo. Primero, un diagnóstico profundo que mapee el estado real de tus datos, procesos y capacidades — no lo que creés que tenés sino lo que realmente hay, con sus fortalezas y sus agujeros. Segundo, un proceso de alineamiento directivo para que el sponsor sea real y no declarativo: con objetivos claros, recursos comprometidos y criterios de decisión definidos.\n\nEl beneficio es evitar el fracaso más común en proyectos de IA: empezar con entusiasmo y morir cuando se encuentran con la realidad de los datos o la falta de apoyo político. Las empresas que hacen este trabajo previo multiplican sus chances de capturar valor real.",
  constructor:"Con tu nivel de infraestructura y voluntad, lo que necesitás es definir el caso de uso concreto con métricas claras e ir directo a ejecución. Nada de más diagnósticos ni más workshops de sensibilización — eso ya lo tenés cubierto.\n\nEl proceso ideal es un sprint de definición corto (2-3 semanas) donde se elige el caso prioritario, se definen las métricas de éxito, se valida la viabilidad técnica y se arranca a construir. El beneficio: resultados medibles en 60-90 días en vez de 6 meses de planificación que nunca aterriza.",
  listo:"Tu empresa necesita capacidad de ejecución externa especializada que complemente lo que ya tenés internamente. No necesitás que te expliquen qué es IA ni que te ayuden a definir la estrategia — necesitás un equipo que construya a la velocidad y calidad que tu ambición requiere.\n\nEl beneficio de elegir bien esta pieza es enorme: la diferencia entre un proyecto que transforma la operación y uno que simplemente funciona. A tu nivel de madurez, el estándar debería ser transformación, no implementación básica.",
  autonomo:"No necesitás ayuda externa para ejecutar. Tenés equipo, claridad, infraestructura y sponsor. Lo que podría sumar valor es una perspectiva externa puntual: una segunda opinión sobre decisiones técnicas, una validación de approach, o un benchmark contra lo que están haciendo empresas similares en la región.\n\nPero eso es un nice-to-have, no una necesidad. Ejecutá con confianza.",
};

function eduFind(a,e){
  if(e>=4)return null;
  const m={
    curioso:{1:"Tu equipo no tiene herramientas conceptuales para evaluar qué es posible con IA. Sin esa base, cualquier decisión va a ser a ciegas. Dato clave: el 88% de los profesionales argentinos ya usa IA por su cuenta, pero solo el 35% recibió capacitación de su empresa (IDEA, 2025). Tu equipo probablemente esté en esa brecha.",2:"Tu equipo explora por su cuenta pero sin guía ni marco común. Cada persona aprende cosas distintas, de fuentes distintas, y el conocimiento no se comparte. Eso genera una ilusión de avance individual que no se traduce en capacidad organizacional.",3:"Hubo algún curso suelto pero sin continuidad ni conexión con el negocio. Es como aprender a manejar en un simulador y después no tener auto: el conocimiento existe pero no se aplica en la operación real."},
    ansioso:{1:"Hay urgencia por adoptar IA pero el equipo no sabe por dónde empezar. La formación es el primer paso para convertir ansiedad en acción. Sin ella, las decisiones de compra se toman por moda, no por necesidad real.",2:"Cada persona estudia por su cuenta, lo cual genera conocimiento desparejo y desalineado. Cuando llegue el momento de implementar, vas a tener personas que saben mucho de herramientas que tal vez no son las correctas para tu negocio.",3:"Hubo algún curso pero desconectado del negocio real. La formación necesita estar alineada con la estrategia de IA — de lo contrario es un gasto, no una inversión."},
    informado:{1:"Hay claridad estratégica pero el equipo no está preparado para ejecutar. Los proyectos van a depender de personas puntuales y no escalan. El 88% de profesionales argentinos usa IA — pero solo el 35% fue capacitado por su empresa (IDEA, 2025).",2:"La formación es informal y cada persona explora por su cuenta. Sin un marco común, el conocimiento no se comparte ni se aplica de forma consistente. Eso va a ser un cuello de botella cuando pases de plan a ejecución.",3:"Hubo alguna capacitación puntual pero probablemente desactualizada o desconectada de tu operación. Para que la adopción sea real y sostenible, la formación tiene que estar atada a los procesos y objetivos del negocio."},
    constructor:{1:"La infraestructura está lista pero el equipo no tiene las herramientas para integrar IA en su día a día. El riesgo es construir sistemas que técnicamente funcionan pero que nadie adopta internamente.",2:"Tu equipo aprende por su cuenta, sin guía. Eso genera adopción despareja y dependencia de personas puntuales — exactamente lo contrario de lo que necesitás para escalar resultados.",3:"Hubo algún curso pero probablemente no conectado con tu operación real. El riesgo es construir soluciones que el equipo no sabe integrar en su trabajo diario."},
    listo:{1:"Necesitás capacidad externa, pero tu equipo interno también necesita formación para integrar lo que se construya. Sin eso, la solución funciona mientras el proveedor la mantiene — y no se vuelve parte del negocio.",2:"Tu equipo tiene base pero necesita un nivel superior de preparación para integrar soluciones avanzadas de IA en la operación diaria.",3:"Hubo formación básica. Para integrar lo que vas a construir, el equipo necesita capacitación alineada específicamente con las soluciones que se implementen."},
  };
  return m[a]?.[e]||`Detectamos una brecha importante entre lo que tu empresa quiere hacer con IA y lo que tu equipo está preparado para ejecutar. El 88% de los profesionales argentinos usa IA, pero solo el 35% fue capacitado por su empresa (IDEA, 2025).`;
}

const A_COLORS={"curioso":"#FFE0B2","ansioso":"#FFCDD2","informado":"#90CAF9","constructor":"#A5D6A7","listo":"#81D4FA","autonomo":"#C8E6C9"};
const A_LABELS={"curioso":"Exploración inicial","ansioso":"Urgencia sin plan","informado":"Bases con gaps","constructor":"Listo para construir","listo":"Listo para ejecutar","autonomo":"Autónomo"};

function makeReportPdf(r){
  const p = PROFILES[r.ar];
  const doc = new jsPDF({ unit:"pt", format:"a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 44;
  const contentW = pageW - margin * 2;
  const ctaUrl = "https://oxy46.com";
  let y = margin;

  const ensureSpace = (need = 26) => {
    if (y + need > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const addTitle = (text) => {
    ensureSpace(32);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(20, 28, 35);
    doc.text(text, margin, y);
    y += 22;
  };

  const addSection = (text, color = [20, 28, 35]) => {
    const lines = doc.splitTextToSize(text, contentW);
    const lineH = 16;
    ensureSpace(lines.length * lineH + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(lines, margin, y);
    y += lines.length * lineH + 8;
  };

  addTitle("Informe de Madurez IA - Oxy46");
  addSection(`${r.nm || "Empresa"} - ${A_LABELS[r.ar] || r.ar}`, [58, 158, 143]);

  addTitle("Diagnóstico");
  addSection(p.intro(r.nm));
  p.bullets.forEach((b) => addSection(`- ${b}`));
  addSection(p.close, [89, 111, 126]);

  addTitle("Tu mayor riesgo");
  r.risk.split("\n\n").forEach((x, i) => addSection(x, i > 0 ? [89, 111, 126] : [20, 28, 35]));

  if (r.ef) {
    addTitle("Brecha de formación detectada");
    addSection(r.ef);
  }

  addTitle("Lo que necesitás");
  NEEDS[r.ar].split("\n\n").forEach((x) => addSection(x));

  addTitle("Siguiente paso");
  if (r.ar === "autonomo") {
    addSection("No tenemos nada que venderte. Si en algún momento querés contrastar una decisión técnica o tener una segunda opinión, podés contactarnos sin compromiso.");
  } else {
    addSection(`Si querés profundizar en lo que encontramos, el siguiente paso es una conversación de 45 minutos sin compromiso donde hablamos de tu desafío: \"${r.des}\".`);
  }

  ensureSpace(56);
  const btnX = margin;
  const btnY = y + 4;
  const btnW = contentW;
  const btnH = 38;
  doc.setFillColor(58, 158, 143);
  doc.roundedRect(btnX, btnY, btnW, btnH, 8, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("Agendá una conversación →", btnX + btnW / 2, btnY + 24, { align:"center" });
  doc.link(btnX, btnY, btnW, btnH, { url: ctaUrl });

  return doc;
}

function Bub({t,f}){
  if(f==="user")return <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8,animation:"fs .25s ease-out"}}><div style={{background:C.userBub,borderRadius:"16px 4px 16px 16px",padding:"10px 16px",maxWidth:"78%",fontSize:14,fontWeight:600,color:C.white}}>{t}</div></div>;
  return <div style={{display:"flex",gap:10,marginBottom:8,animation:"fs .35s ease-out"}}><div style={{width:28,height:28,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><span style={{fontSize:11,fontWeight:700,color:C.white}}>O</span></div><div style={{background:C.botBub,borderRadius:"4px 16px 16px 16px",padding:"10px 14px",maxWidth:"82%",fontSize:14,lineHeight:1.5,color:C.text}} dangerouslySetInnerHTML={{__html:t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}}/></div>;
}

function Bars({sc}){
  const d=[{k:"cap",l:"Capacidad",c:C.accent},{k:"vol",l:"Voluntad",c:"#5b8def"},{k:"cla",l:"Claridad",c:C.purple}];
  const g={cap:["q11","q12","q13"],vol:["q21","q22","q23"],cla:["q31","q32"]};
  return <div style={{display:"flex",gap:12,padding:"12px 16px",background:C.card,borderRadius:12,margin:"0 0 16px"}}>{d.map(x=>{const vs=g[x.k].map(k=>sc[k]).filter(Boolean);const avg=vs.length?vs.reduce((a,b)=>a+b,0)/(x.k==="cla"?2:3):0;return <div key={x.k} style={{flex:1}}><div style={{fontSize:10,color:C.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>{x.l}</div><div style={{height:6,background:"rgba(255,255,255,.06)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${(avg/5)*100}%`,background:x.c,borderRadius:3,transition:"width .6s cubic-bezier(.4,0,.2,1)"}}/></div><div style={{fontSize:11,color:x.c,marginTop:3,fontWeight:600}}>{avg>0?avg.toFixed(1):"—"}</div></div>;})}</div>;
}

function Res({r}){
  const [sharing, setSharing] = useState(false);
  if(!r)return null;const p=PROFILES[r.ar];
  const isAutonomo = r.ar === "autonomo";

  const shareReport = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const doc = makeReportPdf(r);
      const safeName = (r.nm || "empresa").replace(/[^a-z0-9-_]+/gi, "_").toLowerCase();
      const fileName = `informe-oxy46-${safeName}.pdf`;
      const blob = doc.output("blob");
      const file = new File([blob], fileName, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: "Informe Oxy46", text: "Te comparto mi informe de diagnóstico IA.", files: [file] });
      } else {
        doc.save(fileName);
      }
    } catch (e) {
      const doc = makeReportPdf(r);
      const safeName = (r.nm || "empresa").replace(/[^a-z0-9-_]+/gi, "_").toLowerCase();
      doc.save(`informe-oxy46-${safeName}.pdf`);
    } finally {
      setSharing(false);
    }
  };

  return <div style={{animation:"fs .5s ease-out"}}><div style={{background:C.botBub,borderRadius:"4px 16px 16px 16px",padding:"18px 16px",marginBottom:8,marginLeft:38}}>
    <div style={{fontSize:13.5,lineHeight:1.75,color:C.text}}>
      <p style={{margin:"0 0 14px"}}>{p.intro(r.nm)}</p>
      {p.bullets.map((b,i)=><div key={i} style={{display:"flex",gap:10,margin:"8px 0"}}><span style={{color:C.accent,fontWeight:700,flexShrink:0,marginTop:2}}>→</span><span>{b}</span></div>)}
      <p style={{margin:"14px 0 0",color:C.muted,fontStyle:"italic",fontSize:13}}>{p.close}</p>

      <div style={{height:1,background:"rgba(255,255,255,.06)",margin:"20px 0"}}/>
      <p style={{margin:"0 0 8px",fontWeight:700,color:C.danger,fontSize:11,textTransform:"uppercase",letterSpacing:1}}>Tu mayor riesgo</p>
      {r.risk.split("\n\n").map((x,i)=><p key={i} style={{margin:"0 0 10px",fontSize:13,lineHeight:1.65,...(i>0?{color:C.muted,fontSize:12.5}:{})}}>{x}</p>)}

      {r.ef&&<><div style={{height:1,background:"rgba(155,109,255,.15)",margin:"20px 0"}}/><p style={{margin:"0 0 8px",fontWeight:700,color:C.purple,fontSize:11,textTransform:"uppercase",letterSpacing:1}}>Brecha de formación detectada</p><p style={{margin:"0 0 10px",fontSize:13,lineHeight:1.65}}>{r.ef}</p></>}

      <div style={{height:1,background:"rgba(255,255,255,.06)",margin:"20px 0"}}/>
      <p style={{margin:"0 0 8px",fontWeight:700,color:C.accentLight,fontSize:11,textTransform:"uppercase",letterSpacing:1}}>Lo que necesitás</p>
      {NEEDS[r.ar].split("\n\n").map((x,i)=><p key={i} style={{margin:"0 0 12px",fontSize:13,lineHeight:1.65}}>{x}</p>)}
    </div></div>
    <div style={{background:C.botBub,borderRadius:"4px 16px 16px 16px",padding:"14px 16px",marginLeft:38,marginTop:8}}>
      <p style={{margin:0,fontSize:13.5,lineHeight:1.6,color:C.text}}>
        {isAutonomo?"No tenemos nada que venderte. Si en algún momento querés contrastar una decisión técnica o tener una segunda opinión, podés contactarnos sin compromiso."
          :<>Si querés profundizar en lo que encontramos, el siguiente paso es una conversación de 45 minutos sin compromiso donde hablamos de tu desafío: <em style={{color:C.accentLight}}>"{r.des}"</em></>}
      </p>
      <button onClick={()=>window.open("https://oxy46.com","_blank")} style={{marginTop:12,background:C.accent,color:C.white,border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer",width:"100%",transition:"background .2s"}} onMouseEnter={e=>e.target.style.background=C.accentLight} onMouseLeave={e=>e.target.style.background=C.accent}>{isAutonomo?"Conocer más de Oxy":"Agendá una conversación →"}</button>
      <button onClick={shareReport} disabled={sharing} style={{marginTop:10,background:"transparent",color:C.accentLight,border:`1px solid ${C.accentLight}`,borderRadius:10,padding:"11px 24px",fontSize:14,fontWeight:700,cursor:sharing?"wait":"pointer",width:"100%",opacity:sharing?0.7:1}}>{sharing?"Generando informe...":"Compartir informe"}</button>
    </div></div>;
}

function Adm({onClose}){
  const[ent,setEnt]=useState([]);const[ld,setLd]=useState(true);
  useEffect(()=>{(async()=>{try{const rows=await listDiagnoses();setEnt(rows);}catch(e){}setLd(false);})();},[]);
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{background:C.bg,borderRadius:16,width:"100%",maxWidth:800,maxHeight:"90vh",overflow:"auto",border:`1px solid ${C.pillBd}`}}>
      <div style={{position:"sticky",top:0,background:C.bg,padding:"16px 20px",borderBottom:`1px solid ${C.pillBd}`,display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:2}}>
        <div><h2 style={{margin:0,color:C.text,fontSize:18}}>Registro de diagnósticos</h2><p style={{margin:"4px 0 0",color:C.muted,fontSize:13}}>{ent.length} registros</p></div>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:24,cursor:"pointer"}}>✕</button></div>
      {ld?<p style={{padding:40,textAlign:"center",color:C.muted}}>Cargando...</p>:ent.length===0?<p style={{padding:40,textAlign:"center",color:C.muted}}>No hay diagnósticos registrados.</p>:
        <div style={{padding:"0 12px 12px"}}>{ent.map((e,i)=><div key={i} style={{background:C.card,borderRadius:12,padding:14,marginTop:12,fontSize:13,color:C.text}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div><strong>{e.nm}</strong> <span style={{color:C.muted}}>· {e.emp}</span></div>
          <span style={{background:A_COLORS[e.ar]||"#666",color:"#1a1a1a",fontWeight:700,fontSize:11,padding:"2px 10px",borderRadius:12}}>{A_LABELS[e.ar]||e.ar}</span></div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap",fontSize:12,color:C.muted}}><span>Cap: <strong style={{color:C.accent}}>{e.cap}</strong></span><span>Vol: <strong style={{color:"#5b8def"}}>{e.vol}</strong></span><span>Cla: <strong style={{color:C.purple}}>{e.cla}</strong></span><span>Edu: <strong style={{color:e.edu<=3?C.danger:C.accent}}>{e.edu}/5</strong></span><span>{e.rub} · {e.emp_s}</span></div>
          <p style={{margin:"8px 0 0",color:C.dim,fontSize:12,fontStyle:"italic"}}>"{e.des}"</p>
          <p style={{margin:"4px 0 0",color:C.dim,fontSize:11}}>{new Date(e.ts).toLocaleString("es-AR")}</p></div>)}</div>}
    </div></div>;
}

export default function App(){
  const[msgs,setMsgs]=useState([]);const[step,setStep]=useState(0);const[ans,setAns]=useState({});const[sc,setSc]=useState({});
  const[showIn,setShowIn]=useState(false);const[iv,setIv]=useState("");const[res,setRes]=useState(null);
  const[adm,setAdm]=useState(false);const[typ,setTyp]=useState(false);
  const[nc,setNc]=useState(false);const[cd,setCd]=useState(false);
  const cr=useRef(null);const ir=useRef(null);const rr=useRef(null);const un=useRef("");
  const scr=()=>setTimeout(()=>{if(cr.current)cr.current.scrollTop=cr.current.scrollHeight;},100);
  const ab=async ms=>{setTyp(true);for(let i=0;i<ms.length;i++){await new Promise(r=>setTimeout(r,i===0?400:700));setMsgs(p=>[...p,{f:"bot",t:ms[i]}]);scr();}setTyp(false);};
  useEffect(()=>{
    let active = true;

    const showInitialMessages = async () => {
      setTyp(true);

      for (let i = 0; i < QS[0].bot.length; i++) {
        await new Promise(r=>setTimeout(r,i===0?400:700));
        if (!active) return;
        setMsgs(p=>[...p,{f:"bot",t:QS[0].bot[i]}]);
        scr();
      }

      if (active) setTyp(false);
    };

    showInitialMessages();

    return () => {
      active = false;
    };
  },[]);
  useEffect(()=>{
    if(!res||!cr.current||!rr.current)return;
    const id=setTimeout(()=>{
      const cRect=cr.current.getBoundingClientRect();
      const rRect=rr.current.getBoundingClientRect();
      cr.current.scrollTo({top:cr.current.scrollTop+(rRect.top-cRect.top)-16,behavior:"smooth"});
    },80);
    return ()=>clearTimeout(id);
  },[res]);
  const cQ=step<QS.length?QS[step]:null;

  const proc=async(txt,sv)=>{
    setMsgs(p=>[...p,{f:"user",t:txt}]);scr();
    const nA={...ans,[cQ?.id||"cond"]:txt};const nS={...sc};
    if(sv!==undefined&&cQ)nS[cQ.id]=sv;setAns(nA);setSc(nS);
    if(step===0)un.current=txt.split(/[·\/]/)[0].trim().split(" ")[0];
    const nx=step+1;
    if(nx>=QS.length&&!nc&&!cd){const cap=(nS.q11+nS.q12+nS.q13)/3,vol=(nS.q21+nS.q22+nS.q23)/3,cla=(nS.q31+nS.q32)/2;if(cap>=3.6&&vol>=3.6&&cla>=3.6){setStep(nx);setNc(true);await ab(COND.bot);return;}}
    if(nc&&!cd){setCd(true);setAns(p=>({...p,cond:txt}));gen(nS,nA,txt.includes("equipo")||txt.includes("Sí"));return;}
    if(nx>=QS.length&&!nc){setStep(nx);gen(nS,nA,null);return;}
    setStep(nx);const nQ=QS[nx];
    if(nQ){await ab(nx===1&&un.current?[`Bienvenido, ${un.current}. Empecemos.`,...nQ.bot]:nQ.bot);if(nQ.type==="text"){setShowIn(true);setTimeout(()=>ir.current?.focus(),300);}else setShowIn(false);}
  };

  const gen=async(s,a,ht)=>{
    const cap=+((s.q11+s.q12+s.q13)/3).toFixed(1),vol=+((s.q21+s.q22+s.q23)/3).toFixed(1),cla=+((s.q31+s.q32)/2).toFixed(1),edu=s.q12;
    const ar=getArch(cap,vol,cla,edu,ht);const rub=a.rubro||"default";
    const r={ar,nm:un.current||"",risk:getRisk(ar,rub),ef:eduFind(ar,edu),des:a.q33||""};
    const entry={ts:new Date().toISOString(),nm:un.current,emp:a.name?.split(/[·\/]/)[1]?.trim()||"",rub:a.rubro||"",emp_s:a.size||"",q11:s.q11,q12:s.q12,q13:s.q13,q21:s.q21,q22:s.q22,q23:s.q23,q31:s.q31,q32:s.q32,des:a.q33||"",cap,vol,cla,edu,ar};
    await saveDiagnosis(entry);
    setTyp(true);await new Promise(r=>setTimeout(r,1500));
    setMsgs(p=>[...p,{f:"bot",t:`${un.current||""}, acá va tu diagnóstico.`}]);scr();
    await new Promise(r=>setTimeout(r,800));setTyp(false);setRes(r);
  };

  const sub=()=>{if(!iv.trim())return;const v=iv.trim();setIv("");setShowIn(false);proc(v);};
  const so=!res&&!typ&&(!!cQ||(nc&&!cd&&step>=QS.length));

  return <><style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}@keyframes fs{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}@keyframes pulse{0%,100%{opacity:.3;}50%{opacity:1;}}input::placeholder{color:${C.dim};}`}</style>
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,height:"100vh",display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto",position:"relative"}}>
      <div style={{padding:"14px 16px",background:C.card,borderBottom:`1px solid ${C.pillBd}`,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <div style={{width:40,height:40,borderRadius:10,background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}><img src={oxyLogo} alt="Oxy46" style={{width:"100%",height:"100%",objectFit:"contain",padding:4}}/></div>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:C.text}}>Asistente estratégico Oxy46 en IA</div><div style={{fontSize:11,color:C.accent,display:"flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:"50%",background:C.accent,display:"inline-block"}}/>Activo</div></div>
        <button onClick={()=>setAdm(true)} style={{background:"none",border:`1px solid ${C.pillBd}`,borderRadius:8,padding:"6px 10px",color:C.muted,fontSize:11,cursor:"pointer"}}>Admin</button></div>
      {step>=3&&!res&&<div style={{padding:"12px 16px 0"}}><Bars sc={sc}/></div>}
      <div ref={cr} style={{flex:1,overflow:"auto",padding:"16px 16px 8px",display:"flex",flexDirection:"column"}}>
        {msgs.map((m,i)=><Bub key={i} t={m.t} f={m.f}/>)}
        {typ&&<div style={{display:"flex",gap:10,marginBottom:8}}><div style={{width:28,height:28,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:11,fontWeight:700,color:C.white}}>O</span></div><div style={{background:C.botBub,borderRadius:"4px 16px 16px 16px",padding:"12px 18px",display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.muted,animation:`pulse 1.2s ease-in-out ${i*.2}s infinite`}}/>)}</div></div>}
        {res&&<div ref={rr}><Res r={res}/></div>}<div style={{height:8}}/></div>
      {!res&&<div style={{flexShrink:0,padding:"8px 16px 16px",background:`linear-gradient(transparent, ${C.bg} 20%)`}}>
        {so&&cQ?.type==="scored"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>{cQ.opts.map((o,i)=><button key={i} onClick={()=>proc(o.l,o.s)} style={{background:"transparent",border:`1.5px solid ${cQ.isEdu?"rgba(155,109,255,.3)":C.pillBd}`,borderRadius:12,padding:"11px 16px",color:C.text,fontSize:13.5,fontWeight:500,cursor:"pointer",textAlign:"left",transition:"all .15s"}} onMouseEnter={e=>{e.target.style.background=cQ.isEdu?C.purpleFade:C.accentFade;e.target.style.borderColor=cQ.isEdu?C.purple:C.accent;}} onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.borderColor=cQ.isEdu?"rgba(155,109,255,.3)":C.pillBd;}}>{o.l}</button>)}</div>}
        {so&&cQ?.type==="choice"&&<div style={{display:"flex",flexWrap:"wrap",gap:8}}>{cQ.opts.map((o,i)=><button key={i} onClick={()=>proc(o)} style={{background:"transparent",border:`1.5px solid ${C.pillBd}`,borderRadius:20,padding:"9px 16px",color:C.text,fontSize:13,fontWeight:500,cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>{e.target.style.background=C.accentFade;e.target.style.borderColor=C.accent;}} onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.borderColor=C.pillBd;}}>{o}</button>)}</div>}
        {so&&nc&&!cd&&step>=QS.length&&<div style={{display:"flex",flexDirection:"column",gap:8}}>{COND.opts.map((o,i)=><button key={i} onClick={()=>proc(o)} style={{background:"transparent",border:`1.5px solid ${C.pillBd}`,borderRadius:12,padding:"11px 16px",color:C.text,fontSize:13.5,fontWeight:500,cursor:"pointer",textAlign:"left",transition:"all .15s"}} onMouseEnter={e=>{e.target.style.background=C.accentFade;e.target.style.borderColor=C.accent;}} onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.borderColor=C.pillBd;}}>{o}</button>)}</div>}
        {(showIn||(so&&cQ?.type==="text"))&&!nc&&<div style={{display:"flex",gap:8}}><input ref={ir} value={iv} onChange={e=>setIv(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sub()} placeholder={step===0?"Nombre · Empresa":"Escribí tu respuesta..."} style={{flex:1,background:C.card,border:`1.5px solid ${C.pillBd}`,borderRadius:12,padding:"12px 16px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.pillBd}/><button onClick={sub} style={{background:C.accent,border:"none",borderRadius:12,padding:"0 18px",color:C.white,fontWeight:700,fontSize:14,cursor:"pointer"}}>→</button></div>}
      </div>}</div>
    {adm&&<Adm onClose={()=>setAdm(false)}/>}</>;
}
