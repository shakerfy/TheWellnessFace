# 🗺️ Hoja de Ruta (Roadmap) Detallada — Shakerfy

Este documento describe la arquitectura de páginas, la estructura de la base de datos (Colecciones de Firebase Firestore) y el plan detallado para construir el sistema completo de Shakerfy.

---

## 📊 Estado General y Componentes

| Módulo / Vista                            | Estado              | Progreso |
| :---------------------------------------- | :------------------ | :------: |
| **Página de Inicio (Landing Page)**       | 🟢 Funcional (Mock) |   95%    |
| **Perfil del Gimnasio (`/gym/$slug`)**    | 🟢 Funcional (Mock) |   100%   |
| **Autenticación Alumnos (`/auth`)**       | 🟢 Maquetado (Mock) |   100%   |
| **Autenticación Gimnasios (`/auth/gym`)** | 🟢 Maquetado (Mock) |   100%   |
| **Dashboard Gimnasio (Administrador)**    | 🟡 Modificaciones   |   85%    |
| **Dashboard Alumno (Usuario)**            | 🟡 Modificaciones   |   90%    |
| **Modelado de Colecciones (Firebase)**    | 🟡 En progreso      |   25%    |
| **Integración de API / Server Functions** | 🔴 Pendiente        |    0%    |

---

## 📐 1. Estructura de Páginas y Vistas

### 🏠 Landing Page (Página de Inicio)

- **Hero Section:** Buscador semántico con animación de máquina de escribir (_typewriter effect_) que simula a la IA redactando prompts de búsqueda.
- **Grilla Principal:** Tarjetas de gimnasios con estilo "Airbnb" (imagen destacada, calificación, barrio/ciudad, precio base, estado de apertura).
- **Filtros Rápidos:** Botones interactivos para filtrar por categorías y disciplinas (CrossFit, Yoga, Pilates, Funcional, Spinning, Powerlifting, Boutique).

### 🏋️‍♂️ Perfil del Gimnasio (`/gym/$slug`)

- **Multimedia:** Carrusel interactivo de imágenes del local.
- **Información Básica:** Nombre, dirección, calificación de estrellas, horario de apertura detallado por día (apoyando turnos cortados).
- **Normas / Obligaciones:** Banner informativo detallando exigencias físicas y materiales de ingreso (ej: Apto médico, toalla).
- **Staff & Coaches:** Panel dedicado a presentar a los profesores del centro, mostrando sus fotos, certificaciones, especialidades y diplomas adjuntos.
- **Planes y Membresías:** Grid de tarjetas comparativas mostrando los beneficios y amenities específicos incluidos en cada plan.
- **Agenda de Clases:** Calendario semanal interactivo filtrable por días que muestra horarios, instructores y cupos disponibles con confirmación inmediata de reserva.

### 🔑 Autenticación (Rutas Separadas)

- **Alumnos (`/auth`):** Acceso por defecto para usuarios/alumnos. Tarjeta de ingreso y registro limpia para iniciar sesión y ser redirigidos al panel del alumno.
- **Gimnasios (`/auth/gym`):** Acceso específico para los administradores y dueños de gimnasios. Tarjeta de ingreso adaptada a comercios para redirigir al panel del gimnasio.

### 🏢 Dashboard para Gimnasios (Vistas de Admin)

Estructura de navegación mediante Sidebar responsivo y navegación interna por pestañas (_Tabs_):

1.  **Control de Asistencias:** Monitor de entradas en tiempo real con alertas y tabla de historial con filtros avanzados y exportador.
2.  **Miembros:** Tabla con buscador para gestionar datos, planes contratados y estados de cuenta.
3.  **Membresías:** Grid de planes comerciales vinculando los amenities específicos que incluye cada suscripción.
4.  **Clases:** Calendario de sesiones vinculando los instructores del Staff.
5.  **Configuración:** Panel enriquecido para editar la información pública:
    - _Ficha Básica:_ Datos, horarios detallados individuales por día con intervalos partidos (File Uploader).
    - _Políticas:_ Horas de anticipación mínimas para cancelación de clases.
    - _Amenities (Catálogo Marketplace):_ WiFi, Estacionamiento, Sauna, etc.
    - _Requisitos / Obligaciones (Catálogo Marketplace):_ Normas de convivencia e ingreso.
    - _Staff:_ Altas, bajas y edición de instructores (foto de perfil, diplomas de certificaciones, nombre, especialidad, títulos).

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
  "included_services": "array of strings (referencias a ids de gym_config.services)",
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

### 3. Colección: `staff` (Equipo / Instructores)

```json
{
  "id": "uuid",
  "gym_id": "string (reference to gym_config.id)",
  "name": "string",
  "photo_url": "string (photo path / Firebase Storage URL)",
  "specialty": "string",
  "certifications": "array of strings",
  "certification_images": "array of strings (Firebase Storage URLs to diplomas)",
  "is_active": "boolean",
  "created_at": "timestamp"
}
```

### 4. Colección: `classes` (Modelos de Clases)

```json
{
  "id": "uuid",
  "name": "string",
  "staff_id": "string (reference to staff.id)",
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

### 5. Colección: `class_sessions` (Sesiones Reales)

```json
{
  "id": "uuid",
  "class_id": "string (reference to classes.id)",
  "date": "string (YYYY-MM-DD)",
  "start_time": "string (HH:MM)",
  "staff_id": "string (reference to staff.id)",
  "capacity": "number",
  "available_slots": "number",
  "is_cancelled": "boolean"
}
```

### 6. Colección: `bookings` (Reservas)

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

### 7. Colección: `attendance_logs` (Asistencia General)

```json
{
  "id": "uuid",
  "member_id": "string (reference to members.id)",
  "check_in": "timestamp",
  "method": "string ('qr_scan' | 'manual_reception')"
}
```

### 8. Colección: `payments` (Finanzas)

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

### 9. Colección: `gym_config` (Configuración de Comercio)

```json
{
  "id": "uuid",
  "gym_name": "string",
  "address": "string",
  "timezone": "string",
  "opening_hours": "array of objects [{ 'day': 'string', 'intervals': [{ 'from': 'string', 'to': 'string' }] }]", -- Horarios detallados por día
  "cancellation_policy_hours": "number", -- Horas de anticipación para cancelación
  "photos": "array of strings (Firebase Storage URLs)",
  "services": "array of objects [{ 'id': 'string', 'name': 'string', 'category': 'string', 'checked': 'boolean' }]", -- Amenities
  "requirements": "array of objects [{ 'id': 'string', 'name': 'string', 'category': 'string', 'checked': 'boolean' }]", -- Obligaciones
  "webhook_url": "string (nullable)",
  "updated_at": "timestamp"
}
```
