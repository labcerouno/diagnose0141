# Cuestionario de diagnóstico

## Resumen

El flujo principal tiene 11 preguntas:

1. Nombre y empresa
2. Rubro principal
3. Cantidad de empleados
4. Dónde se almacena la información clave
5. Cómo se capacita el equipo en IA
6. Qué hizo la empresa con IA hasta ahora
7. Quién impulsa el tema de IA
8. Qué pasaría si la empresa no hace nada con IA
9. Postura frente a invertir en IA
10. Primer problema de negocio a resolver con IA
11. Resultado esperado en 90 días
12. Desafío principal del negocio en texto libre

Además, existe 1 pregunta condicional si el promedio de capacidad, voluntad y claridad es alto.

## Pregunta 0

### ID

`name`

### Tipo

Texto libre

### Mensajes del bot

- Buen día 👋 Soy el **Asistente estratégico OXY46 en IA**.
- Tres minutos. Respuestas directas. Diagnóstico real.
- ¿Tu nombre y empresa?

### Respuesta esperada

Texto libre en formato nombre y empresa.

## Pregunta 1

### ID

`rubro`

### Tipo

Selección única

### Mensaje del bot

- ¿Cuál es el rubro principal de tu empresa?

### Opciones

- Agroindustria
- Salud
- Comunicación
- Finanzas
- Energía
- Comercio
- Infraestructura
- Otro

## Pregunta 2

### ID

`size`

### Tipo

Selección única

### Mensaje del bot

- ¿Cantidad de empleados?

### Opciones

- 1–50
- 51–200
- 201–500
- 501–2.000
- +2.000

## Pregunta 3

### ID

`q11`

### Tipo

Selección con score

### Dimensión

Capacidad (`cap`)

### Mensajes del bot

- Empecemos con el diagnóstico.
- ¿Dónde se almacena la información clave del negocio?

### Opciones

- 1: En planillas, mails y WhatsApps
- 2: En sistemas aislados, sin o con poca integración
- 3: En sistemas centralizados, con inconsistencias
- 4: En sistemas centralizados y limpios
- 5: En sistemas integrados en tiempo real

## Pregunta 4

### ID

`q12`

### Tipo

Selección con score

### Dimensión

Capacidad (`cap`)

### Marca especial

Pregunta educativa (`isEdu: true`)

### Mensaje del bot

- ¿Cómo se capacita tu equipo en Inteligencia Artificial?

### Opciones

- 1: No tenemos un programa de capacitación
- 2: Cada uno estudia por su cuenta
- 3: Hemos dado algún curso suelto, sin continuidad
- 4: Tenemos un programa activo aunque incompleto
- 5: Tenemos una academia interna completa con continuidad

## Pregunta 5

### ID

`q13`

### Tipo

Selección con score

### Dimensión

Capacidad (`cap`)

### Mensaje del bot

- ¿Qué hizo tu empresa con IA hasta ahora?

### Opciones

- 1: Nada, ni siquiera exploramos
- 2: Uso informal e individual, sin coordinación
- 3: Alguna prueba piloto o proyecto puntual
- 4: Casos en producción con resultados medibles
- 5: IA integrada en procesos críticos del negocio

## Pregunta 6

### ID

`q21`

### Tipo

Selección con score

### Dimensión

Voluntad (`vol`)

### Mensajes del bot

- Ahora sobre la voluntad de tu organización.
- ¿Quién impulsa el tema de IA en tu empresa?

### Opciones

- 1: Nadie en particular, es un tema que flota
- 2: Alguien lo menciona pero sin poder de decisión
- 3: Un directivo lo tiene en agenda, sin presupuesto
- 4: La dirección lo impulsa con recursos comprometidos
- 5: Hay un mandato del directorio con KPIs de seguimiento

## Pregunta 7

### ID

`q22`

### Tipo

Selección con score

### Dimensión

Voluntad (`vol`)

### Mensaje del bot

- ¿Qué pasaría si tu empresa no hace nada con IA en los próximos 12 meses?

### Opciones

- 1: No pasaría nada, no es relevante hoy
- 2: Probablemente nada grave, pero deberíamos explorarlo
- 3: Perderíamos eficiencia frente a competidores
- 4: Quedaríamos en desventaja clara
- 5: Hay riesgo serio de perder mercado

## Pregunta 8

### ID

`q23`

### Tipo

Selección con score

### Dimensión

Voluntad (`vol`)

### Mensaje del bot

- ¿Cuál es la postura de tu empresa frente a invertir en IA?

### Opciones

- 1: Primero queremos entender de qué se trata
- 2: Dispuestos a invertir en un piloto acotado
- 3: Tenemos presupuesto aprobado para IA este año
- 4: Ya hay presupuesto recurrente asignado
- 5: IA tiene línea presupuestaria propia con governance

## Pregunta 9

### ID

`q31`

### Tipo

Selección con score

### Dimensión

Claridad (`cla`)

### Mensajes del bot

- Última dimensión: claridad.
- ¿Tenés claro cuál es el primer problema de negocio que resolverías con IA?

### Opciones

- 1: No, es todo muy abstracto todavía
- 2: Tengo una idea vaga pero no sabría definir el caso
- 3: Sé cuál es el problema, pero no cómo IA ayudaría
- 4: Tengo el problema y una hipótesis de solución con IA
- 5: Tengo el caso documentado con métricas de éxito

## Pregunta 10

### ID

`q32`

### Tipo

Selección con score

### Dimensión

Claridad (`cla`)

### Mensaje del bot

- ¿Qué esperarías ver como resultado concreto en 90 días?

### Opciones

- 1: Honestamente, no sé qué esperar
- 2: Que el equipo entienda qué es posible y qué no
- 3: Un plan claro con prioridades y costos
- 4: Un piloto funcionando en un proceso real
- 5: Resultados medibles: ahorro, velocidad o revenue

## Pregunta 11

### ID

`q33`

### Tipo

Texto libre

### Mensajes del bot

- Última pregunta — y la más importante.
- En una frase: ¿cuál es el mayor desafío de tu negocio donde la tecnología podría ayudar?

### Respuesta esperada

Texto libre.

## Pregunta condicional

Esta pregunta solo aparece si `cap >= 3.6`, `vol >= 3.6` y `cla >= 3.6`.

### ID

`cond`

### Tipo

Selección única

### Mensajes del bot

- Una pregunta más para afinar el diagnóstico:
- ¿Tenés internamente el equipo técnico para ejecutar tu caso de IA prioritario?

### Opciones

- Sí, tenemos equipo
- Necesitamos capacidad externa