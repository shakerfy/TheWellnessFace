# 🗺️ Hoja de Ruta (Roadmap) Detallada — Shakerfy

Este documento describe la arquitectura de páginas, la estructura de la base de datos (Colecciones de Firebase Firestore) y el plan detallado para construir el sistema completo de Shakerfy.

---

## 📊 Estado General y Componentes

| Módulo / Vista | Estado | Progreso |
| :--- | :--- | :---: |
| **Página de Inicio (Landing Page)** | 🟢 Funcional (Mock) | 95% |
| **Perfil del Gimnasio (`/gym/$slug`)** | 🟢 Funcional (Mock) | 100% |
| **Autenticación Alumnos (`/auth`)** | 🔴 Pendiente | 0% |
| **Autenticación Gimnasios (`/auth/gym`)**| 🔴 Pendiente | 0% |
| **Dashboard Gimnasio (Administrador)** | 🔴 Pendiente | 0% |
| **Dashboard Alumno (Usuario)** | 🔴 Pendiente | 0% |
| **Modelado de Colecciones (Firebase)** | 🟡 En progreso | 10% |
| **Integración de API / Server Functions**| 🔴 Pendiente | 0% |

---

## 📐 1. Estructura de Páginas y Vistas

### 🏠 Landing Page (Página de Inicio)
*   **Hero Section:** Buscador semántico con animación de máquina de escribir (*typewriter effect*) que simula a la IA redactando prompts de búsqueda.
*   **Grilla Principal:** Tarjetas de gimnasios con estilo "Airbnb" (imagen destacada, calificación, barrio/ciudad, precio base, estado de apertura).
*   **Filtros Rápidos:** Botones interactivos para filtrar por categorías y disciplinas (CrossFit, Yoga, Pilates, Funcional, Spinning, Powerlifting, Boutique).

### 🏋️‍♂️ Perfil del Gimnasio (`/gym/$slug`)
*   **Multimedia:** Carrusel interactivo de imágenes del local.
*   **Información Básica:** Nombre, dirección, calificación de estrellas, horario de atención y badge dinámico de abierto/cerrado.
*   **Planes y Membresías:** Grid de tarjetas comparativas mostrando los beneficios detallados y precios mensuales.
*   **Agenda de Clases:** Calendario semanal interactivo filtrable por días que muestra horarios, instructores y cupos disponibles con confirmación inmediata de reserva.

### 🔑 Autenticación (Rutas Separadas)
*   **Alumnos (`/auth`):** Acceso por defecto para usuarios/alumnos. Tarjeta de ingreso y registro limpia para iniciar sesión y ser redirigidos al panel del alumno.
*   **Gimnasios (`/auth/gym`):** Acceso específico para los administradores y dueños de gimnasios. Tarjeta de ingreso adaptada a comercios para redirigir al panel del gimnasio.

### 🏢 Dashboard para Gimnasios (Vistas de Admin)
Estructura de navegación mediante Sidebar responsivo y navegación interna por pestañas (*Tabs*):
1.  **Control de Asistencias:**
    *   *Monitor en Tiempo Real (Live Feed):* Contador dinámico de aforo (ej. `42 / 80` personas) con entradas/salidas, y feed de check-ins recientes que muestra foto, nombre, hora y tags de alertas críticas (morosidad, alertas médicas/lesiones).
    *   *Historial General:* Tabla completa con filtros avanzados (rango de fechas, buscador de alumnos, método de acceso QR/Manual, clase vinculada) y opción de exportar a CSV/Excel.
2.  **Miembros:** Tabla con buscador y paginación. Muestra el estado del plan activo (Activo, Vencido, Pendiente) con badges de color.
3.  **Membresías:** Grid de tarjetas de planes indicando precio, beneficios, duración y el contador de alumnos activos inscritos en cada plan.
4.  **Clases:** Calendario semanal interactivo. Al hacer clic en un bloque de clase, despliega la lista completa de alumnos inscritos en ese bloque.
5.  **Pagos:** Registro histórico financiero. Columnas: miembro, monto, fecha, método de pago (efectivo, tarjeta, transferencia) y estado (pagado/pendiente).
6.  **Configuración:** Formulario completo para editar la información pública del gimnasio, horarios, subida de fotos y arreglos de planes y clases disponibles.

### 👤 Dashboard para Alumnos (Vistas de Usuario)
1.  **Mi Perfil / Inicio:**
    *   Card de estado de membresías (estado, días restantes, botón para renovar).
    *   Card de próxima clase reservada para hoy (con opción de cancelar reserva).
    *   Widget dinámico del código QR para ingreso sin contacto en recepción.
2.  **Clases / Reservas:**
    *   Calendario de clases disponibles en la semana con semáforo de cupos (ej. "Últimos 3 cupos").
    *   Filtros rápidos de clases por disciplina o franja horaria (Mañana/Tarde/Noche).
    *   Lista lateral de reservas activas programadas.
3.  **Mi Progreso / Actividad:**
    *   Gráfico de barras interactivo con el historial de asistencia mensual.
    *   Métricas clave (clases reservadas este mes, racha de semanas consecutivas, disciplina favorita).
4.  **Pagos y Suscripción:** Detalle del plan contratado, fecha de próxima facturación automática y tabla con historial de recibos descargables.
5.  **Configuración:** Datos de contacto (teléfono, email, foto de perfil) e interruptores de notificación (Alertas por WhatsApp / Email).

---

## 🗄️ 2. Modelo de Datos de Firebase (Colecciones y Documentos)

### 1. Colección: `memberships` (Planes)
```json
{
  "id": "uuid",
  "name": "string",
  "price": "number",
  "duration_days": "number",
  "benefits": "array of strings",
  "is_active": "boolean",
  "created_at": "timestamp"
}
```

### 2. Colección: `members` (Perfiles de Alumnos / Usuarios)
```json
{
  "id": "uuid (referencia a Firebase Auth uid)",
  "name": "string",
  "phone": "string (unique)",
  "email": "string (unique)",
  "membership_id": "string (reference to memberships.id)",
  "start_date": "timestamp",
  "end_date": "timestamp",
  "status": "string ('active' | 'expired' | 'pending')",
  "created_at": "timestamp"
}
```

### 3. Colección: `classes` (Modelos de Clases)
```json
{
  "id": "uuid",
  "name": "string",
  "instructor": "string",
  "capacity": "number",
  "duration_minutes": "number",
  "schedule_rules": {
    "days": "array of numbers (0..6)",
    "time": "string (HH:MM)"
  },
  "is_active": "boolean",
  "created_at": "timestamp"
}
```

### 4. Colección: `class_sessions` (Sesiones Reales)
```json
{
  "id": "uuid",
  "class_id": "string (reference to classes.id)",
  "date": "string (YYYY-MM-DD)",
  "start_time": "string (HH:MM)",
  "instructor": "string",
  "capacity": "number",
  "available_slots": "number",
  "is_cancelled": "boolean"
}
```

### 5. Colección: `bookings` (Reservas)
```json
{
  "id": "uuid",
  "member_id": "string (reference to members.id)",
  "session_id": "string (reference to class_sessions.id)",
  "status": "string ('confirmed' | 'cancelled' | 'attended')",
  "check_in_at": "timestamp (nullable)",
  "created_at": "timestamp"
}
```

### 6. Colección: `attendance_logs` (Asistencia General)
```json
{
  "id": "uuid",
  "member_id": "string (reference to members.id)",
  "check_in": "timestamp",
  "method": "string ('qr_scan' | 'manual_reception')"
}
```

### 7. Colección: `payments` (Finanzas)
```json
{
  "id": "uuid",
  "member_id": "string (reference to members.id)",
  "amount": "number",
  "date": "timestamp",
  "method": "string ('cash' | 'card' | 'transfer')",
  "status": "string ('paid' | 'pending')",
  "notes": "string (nullable)",
  "created_at": "timestamp"
}
```

### 8. Colección: `messages` (Interacciones)
```json
{
  "id": "uuid",
  "member_id": "string (reference to members.id, nullable)",
  "phone_number": "string",
  "direction": "string ('inbound' | 'outbound')",
  "content": "string",
  "created_at": "timestamp"
}
```

### 9. Colección: `gym_config` (Configuración de Comercio)
```json
{
  "id": "uuid",
  "gym_name": "string",
  "address": "string",
  "timezone": "string",
  "opening_time": "string (HH:MM)",
  "closing_time": "string (HH:MM)",
  "webhook_url": "string (nullable)",
  "updated_at": "timestamp"
}
```
