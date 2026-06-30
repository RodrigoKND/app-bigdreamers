# Flujo de Login con Google

## Visión general

La app usa **Supabase OAuth + PKCE** para autenticar usuarios con Google. El flujo opera completamente dentro del Custom Tab del sistema (sin abrir el navegador externo) y redirige de vuelta a la app mediante deep link.

## Actores y archivos

| Archivo | Rol |
|---|---|
| `components/login/ButtonLoginGoogle.tsx` | Botón que dispara el flujo |
| `services/supabase/googleService.ts` | Lógica OAuth + intercambio de sesión |
| `services/supabase/userService.ts` | Lectura y creación del perfil en `public.users` |
| `contexts/AuthContext.tsx` | Estado global de sesión |
| `app/auth/callback.tsx` | Pantalla de carga mostrada durante el callback |
| `app.json` | Registra el scheme `bigdreamerss` en Android/iOS |

## Pasos del flujo

```
Usuario presiona "Login with Google"
        │
        ▼
ButtonLoginGoogle → signInWithGoogle()
        │
        ▼
supabase.auth.signInWithOAuth({ provider: 'google', skipBrowserRedirect: true })
  → Supabase devuelve una URL de autorización de Google
        │
        ▼
WebBrowser.openAuthSessionAsync(url, 'bigdreamerss://auth/callback')
  → Abre Custom Tab con la página de login de Google
  → El usuario elige su cuenta
  → Google redirige a Supabase
  → Supabase redirige a bigdreamerss://auth/callback?code=XXXX
  → Android reconoce el scheme y cierra el Custom Tab
        │
        ▼
result.url = 'bigdreamerss://auth/callback?code=XXXX'
Linking.parse(result.url) → extrae { code }
        │
        ▼
supabase.auth.exchangeCodeForSession(code)
  → Supabase devuelve { user, session }
        │
        ▼
getUserById(user.id)
  ├─ Existe → retorna el perfil de public.users
  └─ No existe (primer login) → createUser(...) inserta la fila con valores por defecto
        │
        ▼
login(user)  →  AuthContext.user = user  →  isLoggedIn = true
        │
        ▼
router.replace('/onboarding')
```

## Configuración requerida en Supabase

En **Authentication → URL Configuration**:

- **Site URL**: `bigdreamerss://auth/callback`
- **Redirect URLs**: incluir `bigdreamerss://auth/callback`

En **Authentication → Providers → Google**: activado con Client ID y Secret de Google Cloud Console.

## Configuración en app.json

```json
"scheme": "bigdreamerss"
```

Este valor registra el intent filter en el Android manifest. Sin él, el sistema operativo no sabe que la app debe abrirse cuando recibe una URL `bigdreamerss://`.

## Primer login vs. logins posteriores

| Condición | Resultado |
|---|---|
| Usuario no existe en `public.users` | `createUser()` crea la fila con `level: 'bronze'`, `gems: 0`, etc. |
| Usuario ya existe | `getUserById()` retorna el perfil existente directamente |

## Por qué PKCE y no el flujo implícito

Supabase usa **PKCE** por defecto en apps móviles. Con PKCE, el callback contiene un `code` en los query params. El flujo implícito (con `access_token` en el fragmento `#`) está desactivado por defecto y es menos seguro. `exchangeCodeForSession(code)` es el método correcto.

## Troubleshooting

| Síntoma | Causa probable |
|---|---|
| `ERR_UNKNOWN_URL_SCHEME` en Chrome | `scheme` en `app.json` no coincide con el redirect URL de Supabase |
| "No se recibió el código de autorización" | El redirect URL no está en la lista permitida de Supabase |
| Usuario en `auth.users` pero no en `public.users` | `createUser()` falló — revisar constraints de la tabla o RLS policies |
| Pantalla de login parpadea al arrancar | Normal — `AuthContext` restaura la sesión desde `SecureStore` antes de ocultar el splash |
