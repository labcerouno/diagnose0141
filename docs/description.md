# diagnostico_chatbot.jsx

## Propósito

Chatbot de diagnóstico de madurez en IA para empresas argentinas/latinoamericanas. Desarrollado para **OXY46**, es una herramienta de captación de leads que guía al usuario a través de 11 preguntas y devuelve un perfil estratégico personalizado. El objetivo comercial es derivar al usuario a agendar una conversación con OXY46 (`oxy46.com`).

## Stack

- **React 18** (hooks: `useState`, `useEffect`, `useRef`)
- Sin librerías de UI externas — estilos 100% inline
- **Supabase** (`@supabase/supabase-js`) para persistencia de diagnósticos
- Fallback local con `localStorage` cuando no hay credenciales o falla la conexión
- Single-file component, `export default function App`

## Flujo de la conversación

```
Pregunta 0 (text)     → nombre y empresa
Pregunta 1 (choice)   → rubro
Pregunta 2 (choice)   → tamaño de empresa
Preguntas 3–5  (scored, dim: cap)  → Capacidad tecnológica
Preguntas 6–8  (scored, dim: vol)  → Voluntad organizacional
Preguntas 9–10 (scored, dim: cla)  → Claridad estratégica
Pregunta 11 (text)    → desafío principal en texto libre

[Condicional] Si cap ≥ 3.6 && vol ≥ 3.6 && cla ≥ 3.6:
  → Pregunta extra sobre disponibilidad de equipo técnico interno
```

Después del último paso se ejecuta `gen()`, que calcula scores y renderiza el resultado.

## Estructura de datos

### Preguntas (`QS`)

Array de objetos con los campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | Identificador único de la pregunta |
| `type` | `"text"` / `"choice"` / `"scored"` | Tipo de input |
| `bot` | `string[]` | Mensajes del bot antes de mostrar opciones |
| `opts` | `string[]` / `{l, s}[]` | Opciones (para `choice`) o con score (para `scored`) |
| `dim` | `"cap"` / `"vol"` / `"cla"` | Dimensión a la que contribuye el score |
| `isEdu` | `boolean` | Marca la pregunta de capacitación (q12), usada para detectar brecha formativa |

### Scores y dimensiones

Cada respuesta `scored` aporta un valor de 1 a 5. Se promedian por dimensión:

- **cap** (Capacidad): promedio de q11, q12, q13
- **vol** (Voluntad): promedio de q21, q22, q23
- **cla** (Claridad): promedio de q31, q32

### Arquetipos de resultado (`ar`)

Calculados por `getArch(cap, vol, cla, edu, hasTeam)`:

| Arquetipo | Color | Label | Condición principal |
|---|---|---|---|
| `curioso` | `#FFE0B2` | Exploración inicial | cap bajo |
| `ansioso` | `#FFCDD2` | Urgencia sin plan | cap bajo, vol medio/alto |
| `informado` | `#90CAF9` | Bases con gaps | cap medio |
| `constructor` | `#A5D6A7` | Listo para construir | cap alto, cla medio |
| `listo` | `#81D4FA` | Listo para ejecutar | cap alto, cla alto, sin equipo interno |
| `autonomo` | `#C8E6C9` | Autónomo | cap/vol/cla altos + tiene equipo interno |

## Componentes internos

| Componente | Descripción |
|---|---|
| `App` | Componente raíz. Maneja todo el estado del chat. |
| `Bub` | Burbuja de mensaje (bot o usuario). Soporta `**bold**` en mensajes de bot vía `dangerouslySetInnerHTML`. |
| `Bars` | Barra de progreso de las 3 dimensiones, visible desde la pregunta 3 en adelante. |
| `Res` | Resultado final: perfil, riesgo, brecha de formación, recomendaciones y CTA. |

## Estado principal (`App`)

```js
msgs     // array de mensajes {f: "bot"|"user", t: string}
step     // índice de la pregunta actual en QS
ans      // objeto con respuestas por id de pregunta
sc       // objeto con scores numéricos por id de pregunta
res      // resultado final {ar, nm, risk, ef, des}
typ      // boolean — si el bot está "escribiendo"
nc       // boolean — si se activó la pregunta condicional
cd       // boolean — si la pregunta condicional ya fue respondida
showIn   // boolean — si se muestra el input de texto libre
```

## Lógica de contenido dinámico

- **`getRisk(ar, rubro)`**: Devuelve texto de riesgo principal. Incluye un stat aleatorio de `STATS` filtrado por rubro.
- **`eduFind(ar, edu)`**: Si `edu < 4`, devuelve texto de brecha formativa según arquetipo. Si `edu >= 4`, devuelve `null` (no se muestra la sección).
- **`NEEDS[ar]`**: Texto fijo de recomendación según arquetipo.
- **`PROFILES[ar]`**: Objeto con `intro(nombre)`, `bullets[]` y `close` para armar el diagnóstico narrativo.
- **`STATS`**: Estadísticas de mercado segmentadas por rubro. Fuentes: Monitor Nacional de IA 2025, IDC/Intel, McKinsey+WEF, IDEA, NTT DATA, Bain & Company, Microsoft/Edelman.

## Persistencia (Supabase + fallback local)

Al finalizar el diagnóstico, la app guarda una entrada en Supabase (tabla `diagnosticos_ia`) con un `payload` JSON.

Si Supabase no está configurado o devuelve error, guarda en `localStorage` con clave `diag:entries`.

Estructura del payload:

```js
{
  ts, nm, emp, rub, emp_s,
  q11, q12, q13, q21, q22, q23, q31, q32,
  cap, vol, cla, edu, ar, des
}
```

Variables de entorno requeridas para Supabase:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Ver documentación detallada del modelo en `docs/supabase_modelo_datos.md`.

Listado completo de preguntas y respuestas posibles en `docs/cuestionario_diagnostico.md`.

## Paleta de colores (`C`)

```js
bg: "#0f1923"        // fondo general
card: "#1c2b36"      // cards y header
accent: "#3a9e8f"    // color primario (teal)
accentLight: "#4fc4b0"
text: "#e8edf1"
muted: "#8a9baa"
botBub: "#1e3040"    // burbujas del bot
userBub: "#3a9e8f"   // burbujas del usuario
danger: "#e85d4a"    // sección de riesgo
purple: "#9b6dff"    // sección de formación
```

## Notas para modificación

- El texto de todos los perfiles, riesgos y recomendaciones está hardcodeado en el archivo. Para hacerlo editable, extraer `PROFILES`, `NEEDS`, `STATS` y los riesgos de `getRisk` a un archivo JSON separado o a un CMS.
- El CTA final apunta a `https://oxy46.com`. Parametrizar si se reutiliza en otro contexto.
- `dangerouslySetInnerHTML` en `Bub` parsea `**texto**` a `<strong>`. Solo se usa en mensajes del bot, que son datos internos del propio archivo, por lo que no representa riesgo XSS en uso normal.
- El componente está diseñado para ancho máximo de 480px (mobile-first).
- Si se usa panel admin en producción, evitar políticas de lectura pública en Supabase y mover esa lectura a un backend autenticado.
