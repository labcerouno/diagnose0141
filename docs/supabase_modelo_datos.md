# Persistencia en Supabase

## Resumen

La app ahora persiste diagnósticos en Supabase (tabla `diagnosticos_ia`).

- Escritura: al finalizar el flujo (`gen()`), se ejecuta `saveDiagnosis(entry)`.
- Lectura: en el panel admin (`Adm`), se ejecuta `listDiagnoses()`.
- Fallback: si Supabase no está configurado o devuelve error, se usa `localStorage`.

## Variables de entorno (Vite)

Definir en `.env` o en Vercel:

```bash
VITE_SUPABASE_URL=https://zcysdjkomsazgiqomjtt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjeXNkamtvbXNhemdpcW9tanR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMTA5OTUsImV4cCI6MjA5MTY4Njk5NX0.NaUB4iegeCUCaLoTv4RhR-pcKNBTJlVHVnMMbiS4TPc
```

## Modelo de datos

Tabla: `diagnosticos_ia`

### Opción recomendada (simple y flexible)

```sql
create table if not exists public.diagnosticos_ia (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  payload jsonb not null
);
```

La aplicación inserta un objeto completo en `payload` con esta forma:

```json
{
  "ts": "2026-04-13T18:00:00.000Z",
  "nm": "Nombre",
  "emp": "Empresa",
  "rub": "Rubro",
  "emp_s": "51–200",
  "q11": 4,
  "q12": 3,
  "q13": 4,
  "q21": 5,
  "q22": 4,
  "q23": 4,
  "q31": 4,
  "q32": 3,
  "des": "Principal desafío",
  "cap": 3.7,
  "vol": 4.3,
  "cla": 3.5,
  "edu": 3,
  "ar": "informado"
}
```

## RLS y seguridad

Si el frontend escribe directo con `anon key`, habilitar una política de inserción limitada.

Ejemplo base:

```sql
alter table public.diagnosticos_ia enable row level security;

create policy "allow_public_insert_diagnosticos"
on public.diagnosticos_ia
for insert
with check (true);

create policy "allow_public_select_diagnosticos"
on public.diagnosticos_ia
for select
using (true);
```

Nota: para producción real, se recomienda no exponer lectura pública de todos los diagnósticos. Lo ideal es mover lectura admin a una API protegida (Edge Function o backend propio).

## Estrategia de fallback

- Si faltan `VITE_SUPABASE_URL` o `VITE_SUPABASE_ANON_KEY`: usa `localStorage`.
- Si Supabase falla en insert/select: usa `localStorage`.
- Clave local utilizada: `diag:entries`.

Esto evita pérdida de UX en desarrollo, pero no reemplaza una persistencia server-side en producción.
