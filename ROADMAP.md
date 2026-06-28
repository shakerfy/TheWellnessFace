# 🗺️ Hoja de Ruta (Roadmap) — Shakerfy

Este documento muestra el estado del desarrollo de **Shakerfy**, las fases completadas y las tareas necesarias para terminar el proyecto.

---

## 📊 Estado General del Proyecto

| Área / Funcionalidad | Estado | Progreso |
| :--- | :--- | :---: |
| **Diseño y UI / Frontend** | 🟢 Completado | 95% |
| **Enrutamiento (TanStack Start)** | 🟢 Completado | 100% |
| **Conexión base con Supabase** | 🟢 Completado | 100% |
| **Perfil de gimnasio dinámico** | 🟢 Completado | 100% |
| **Página de inicio (Buscador)** | 🟢 Completado | 90% |
| **Esquema de BD (Tablas Supabase)** | 🟡 En progreso | 10% |
| **Autenticación (Supabase Auth)** | 🔴 Pendiente | 0% |
| **Integración de API Real** | 🔴 Pendiente | 0% |
| **Generador de QR Dinámico** | 🔴 Pendiente | 0% |
| **Control de Aforo en tiempo real** | 🔴 Pendiente | 0% |
| **Pasarela de Pagos (Mercado Pago)**| 🔴 Pendiente | 0% |
| **Notificaciones automáticas** | 🔴 Pendiente | 0% |
| **Despliegue y Testing final** | 🔴 Pendiente | 0% |

---

## 🚀 Fases de Desarrollo

### Fase 0 — Prototipo Visual e Infraestructura (COMPLETADA)
- [x] Landing page del buscador con IA (interfaz del prompt y Typewriter).
- [x] Perfil de gimnasio funcional (carrusel de imágenes, planes de membresía, horarios y clases).
- [x] Dashboards y vistas de usuario (alumno y administrador de gimnasio) usando datos mock en memoria.
- [x] Rutas de la línea de tiempo (timeline) implementadas.
- [x] Instalación del SDK de Supabase (`@supabase/supabase-js`) y configuración de las variables en `.env`.
- [x] Estilización con TailwindCSS v4 y variables CSS personalizadas para dark/light themes.

---

### Fase 1 — Modelado de Datos y Base de Datos (EN PROGRESO)
El objetivo de esta fase es crear la estructura de datos real en Supabase para reemplazar los datos mock.

- [ ] **Tablas a crear en Supabase (PostgreSQL):**
    *   `members` - Datos del perfil de alumnos (conectado a `auth.users`).
    *   `gyms` - Información de los gimnasios (dirección, fotos, horarios, disciplinas).
    *   `memberships` - Planes mensuales (nombre, precio, duración, beneficios).
    *   `classes` - Disciplinas (instructor, capacidad, reglas horarias).
    *   `class_sessions` - Instancias de clases en el calendario (fecha, hora, reservas realizadas).
    *   `bookings` - Historial de reservas de clases por alumno.
    *   `payments` - Transacciones y cobros mensuales.
    *   `attendance_logs` - Historial de asistencias registradas (por QR o manual).
- [ ] Configurar políticas **RLS (Row Level Security)** en todas las tablas para proteger la información de los usuarios.
- [ ] Crear índices de base de datos para acelerar las consultas:
    ```sql
    CREATE INDEX idx_class_sessions_date ON class_sessions(date);
    CREATE INDEX idx_attendance_logs_member_date ON attendance_logs(member_id, check_in);
    ```

---

### Fase 2 — Autenticación e Integración de Datos Reales
- [ ] Implementar **Supabase Auth** (Registro e inicio de sesión por email y Google OAuth).
- [ ] Proteger las rutas privadas `/app` y `/dashboard` mediante middleware en TanStack Start para requerir autenticación.
- [ ] Reemplazar las importaciones de datos mock en la aplicación por consultas reales utilizando el cliente de Supabase.

---

### Fase 3 — Búsqueda Semántica con IA
- [ ] Habilitar la extensión `pgvector` en la base de datos de Supabase.
- [ ] Crear una función en el servidor que vectorice las descripciones de los gimnasios (usando embeddings de Gemini o OpenAI) para permitir búsquedas semánticas reales en base al prompt escrito por el usuario.

---

### Fase 4 — Check-in mediante QR Dinámico y Aforo en Vivo
- [ ] Implementar un código **QR dinámico** basado en JWT que expire cada 60 segundos en la app del alumno.
- [ ] Crear el escáner de QR en la vista de gimnasio para registrar la asistencia instantáneamente en `attendance_logs`.
- [ ] Añadir soporte para WebSockets o Server-Sent Events (SSE) para reflejar el aforo del gimnasio en tiempo real en los paneles.

---

### Fase 5 — Pagos y Notificaciones
- [ ] Integrar **Mercado Pago** o **Stripe** para la compra y renovación de membresías directamente en la app.
- [ ] Crear webhooks en el servidor para activar automáticamente las suscripciones en la BD al completarse el pago.
- [ ] Implementar notificaciones automáticas (por WhatsApp o email) de recordatorio de clases o alertas de vencimiento.

---

### Fase 6 — Despliegue y Pruebas
- [ ] Escribir pruebas unitarias y de integración para el flujo principal (registro -> compra -> reserva -> check-in).
- [ ] Optimizar el SEO con metatags dinámicos y generación automática del `sitemap.xml`.
- [ ] Desplegar la aplicación en producción (Vercel, Zeabur o Docker en VPS).
