# Publicación de BigDreamers - Notas y roadmap

## Estado actual (Google Play)

- Package name corregido: `com.bigdreamers` (antes tenía un typo: `com.bigdreamerss.bigdreamerss`).
- Se detectó mismatch de firma: el `.aab` subido estaba firmado con un keystore distinto al que Play Console esperaba.
- Se solicitó **restablecimiento de la clave de carga** (upload key reset) en Play Console, adjuntando el certificado correcto (`upload_certificate.pem`, exportado del keystore que usa EAS: `@bigdramers__bolt-expo-nativewind.jks`).
- Solicitud **aprobada**. La nueva clave de carga entra en vigencia el **Jul 11, 2026, 3:08 AM UTC** (= **Jul 10, 2026, ~11:08 PM hora Bolivia**). Es un periodo de seguridad obligatorio de Google (~72h), no una demora real. No se puede subir ningún `.aab`/`.apk` nuevo hasta esa hora.

## Comandos útiles

Generar el `.aab` (para subir a Play Console):
```
eas build --platform android --profile production
```

Generar un `.apk` (para instalar directo en un dispositivo, pruebas rápidas):
```
eas build --platform android --profile production-apk
```

Ver/gestionar credenciales de firma de Android:
```
eas credentials -p android
```

## Roadmap - Google Play (una vez aprobado el reset de la clave)

1. **Volver a subir el mismo `.aab`** a la versión de Prueba interna (ya no debería marcar error de firma).
2. **Completar info de la app** que Play Console pida antes de repartir el link:
   - Política de privacidad (URL pública)
   - Clasificación de contenido (cuestionario)
   - Público objetivo y contenido
   - Declaración de anuncios
   - Seguridad de los datos (data safety)
   - Acceso a la app (credenciales de prueba si hay login)
   - Ficha de tienda básica (ícono, descripción, capturas)
3. **Agregar testers a Prueba interna**: lista de correos en Testers, compartir el link de opt-in.
4. **Prueba cerrada**: mínimo 12 verificadores (correos de Google que acepten y instalen), corriendo 14 días continuos sin bajar de 12. Esto es requisito de Google para cuentas nuevas antes de poder pedir acceso a producción.
5. **Solicitar acceso a producción** (botón se habilita tras cumplir el paso 4).
6. **Monetización**: vincular cuenta de comerciante en "Monetiza con Play" antes de activar compras/suscripciones reales.
7. **Publicar en producción**: subir versión final, esperar revisión de Google (horas a días), queda disponible al público.

## Roadmap - Apple App Store (pendiente de iniciar)

1. **Cuenta de Apple Developer Program** (99 USD/año). Si se publica como empresa, Apple pide número D-U-N-S (puede tardar días en tramitarse).
2. **Configurar el proyecto para iOS**:
   - Falta agregar `bundleIdentifier` en `app.json` (sección `ios`), ej. `com.bigdreamers`.
   - Falta agregar un perfil `ios` en `eas.json` (build de producción tipo `app-store`).
3. **Registrar el App ID** en el portal de Apple Developer (o dejar que EAS lo haga automáticamente al buildear, si se configura con `eas credentials` / API key de App Store Connect).
4. **Crear el registro de la app en App Store Connect**: nombre, bundle ID, SKU.
5. **Completar metadata**: descripción, capturas de pantalla (varios tamaños de dispositivo), ícono, categoría, política de privacidad, "App Privacy" (nutrition label de datos recolectados), clasificación de edad, URL de soporte.
6. **Build y subida**:
   ```
   eas build --platform ios --profile production
   eas submit --platform ios
   ```
7. **TestFlight (equivalente a las pruebas de Play)**:
   - **Interno**: hasta 100 testers (miembros del equipo en App Store Connect), acceso inmediato sin revisión.
   - **Externo**: hasta 10,000 testers vía link público, requiere una revisión corta de Apple (24-48h aprox.) antes de que puedan entrar.
8. **Enviar a revisión de App Store** para el release público. Revisión de Apple suele tardar 24-48 horas (puede variar).
9. **Monetización**: configurar Acuerdos, Impuestos y Datos bancarios en App Store Connect (sección "Agreements, Tax, and Banking") antes de activar compras/suscripciones.
10. Una vez aprobada, se publica y queda disponible en el App Store.
