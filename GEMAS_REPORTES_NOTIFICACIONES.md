# Gemas por asignación admin, Reportes PDF y Notificaciones — Notas y roadmap

## Por qué

Mientras el pago de developer de iOS no se aprueba, se quitó de la app cualquier flujo de "compra" de gemas para evitar problemas. En su lugar: el admin asigna gemas libremente desde una lista de usuarios, puede generar reportes mensuales en PDF (mismo estilo visual que BigDreamers Inversiones), y el usuario recibe notificación de ambas cosas.

## Qué se implementó hoy

### 1. Base de datos (Supabase)

- `services/supabase/migrations/001_notifications_and_reports.sql` — **ya ejecutado**. Crea las tablas `notifications` e `investment_reports` con sus políticas RLS.
- Bucket de Storage `reports` — creado como público, pero **le faltaban las políticas de acceso** (subir/leer archivos). Se agregaron estas dos (fuera del archivo de migración, pegadas directo en el SQL Editor):
  ```sql
  create policy "Public read access for reports"
  on storage.objects for select
  using ( bucket_id = 'reports' );

  create policy "Admins can upload reports"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'reports'
    and exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );
  ```
- No se tocó ninguna tabla existente (`users`, `companies`, `investments`, `gem_requests`, etc.).

### 2. Admin (`/admin`) — pestaña "Usuarios"

- Lista de todos los usuarios con buscador (nombre/correo).
- Botón "Asignar gemas" por usuario: cantidad + empresa opcional (si se elige empresa, además de sumar las gemas se registra una fila en `investments`).
- Archivos: `components/admin/users/UserListCard.tsx`, `components/admin/users/AssignGemsModal.tsx`, `hooks/user/useAllUsers.ts`, `hooks/user/useAssignGems.ts`, `assignGemsToUser` en `services/supabase/userService.ts`.

### 3. Admin — pestaña "Reportes" (generación de PDF)

- Formulario (`components/admin/reports/ReportForm.tsx`): empresa, inversionista (busca entre usuarios), fecha, monto de inversión, interés compuesto, capital actualizado, ganancia actualizada, capital del siguiente mes (opcional), observaciones.
- El PDF se arma como HTML/CSS (`services/pdf/reportPdfService.ts` → `buildReportHtml`) reproduciendo el diseño de fondo degradado turquesa-azul + logo + timeline con íconos, se renderiza con `expo-print` y se sube al bucket `reports`.
- Al generarse: se guarda la fila en `investment_reports`, se crea la notificación in-app y se manda el push al usuario.
- El usuario ve/descarga sus reportes en Perfil → sección "MIS REPORTES" (`app/(tabs)/profile.tsx`).

### 4. Notificaciones

- Tabla `notifications` + servicio `services/supabase/notificationDbService.ts`.
- Campana con contador de no-leídas en el header (`components/home/Header.tsx`) → pantalla `app/notifications.tsx`.
- Push extendido (`services/notifications/notificationService.ts`): `sendGemsAssignedNotification`, `sendReportGeneratedNotification`.

### 5. Flujo de compra de gemas del usuario

- Se quitó de la UI (botones "Recargar gemas" / navegación a `/gems` en Header, LearnHeader, Perfil, InvestmentControls, CompanyCard) pero **no se borró nada**: `app/gems.tsx`, `components/gems/*`, `hooks/gem/*`, `services/supabase/gemService.ts` y los componentes de admin para aprobar/rechazar (`components/admin/gems/*`) siguen en el repo por si se necesita reactivar.

### Dependencias nuevas

`expo-print`, `expo-sharing`, `expo-asset` (agregadas a `package.json` y `app.json`).

## Estado actual — pendiente de resolver

**La generación de PDF sigue fallando** después de correr la migración y las políticas de storage de arriba. Falta:
1. Confirmar en el bucket `reports` que ahora aparecen 2 políticas (antes de las políticas de arriba mostraba 0).
2. Conseguir el **mensaje de error exacto** (de la app o de los logs de Metro/consola) para saber si es:
   - Storage (RLS todavía bloqueando, o nombre de bucket mal escrito).
   - `investment_reports` (algún campo obligatorio faltante, o el usuario logueado no tiene `role = 'admin'` en la tabla `users`).
   - Algo del lado de `expo-print`/`expo-asset` (por ejemplo si se está probando en Expo Go en vez de un dev build — ninguno de los dos funciona ahí).
3. Una vez identificado el error puntual, corregirlo.

## Qué falta para las notificaciones de tiempo ("faltan 5 días", "se cumplió el mes")

Esto se dejó fuera a propósito para después. Requiere infraestructura que hoy no existe en el proyecto:

1. **Una Supabase Edge Function** (Deno) que, corriendo del lado del servidor con la service role key, recorra la tabla `investments`, calcule los días transcurridos desde `created_at` de cada inversión, y para las que caen en el día 25 (faltan 5 días) o el día 30 (se cumplió el mes) cree la notificación in-app + dispare el push — todo esto sin depender de que nadie tenga la app abierta.
2. **`pg_cron` + `pg_net`** habilitados en el proyecto Supabase, con una tarea programada (ej. diaria) que invoque esa Edge Function.
3. Decidir si el ciclo se repite indefinidamente cada 30 días mientras la inversión siga activa (para que combine con que el admin genera un reporte nuevo cada mes), o si es un aviso único.
4. Desplegar la función (`supabase functions deploy`) y activar el cron — esto necesita acceso al proyecto Supabase (CLI login o dashboard) que todavía no se ha configurado en esta sesión.

Cuando se retome, avisar para diseñarlo y desplegarlo.
