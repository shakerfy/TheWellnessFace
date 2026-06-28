# 🗺️ Hoja de Ruta (Roadmap) Detallada — Shakerfy

Este documento describe la arquitectura de páginas, la estructura de la base de datos (Supabase) y el plan detallado para construir el sistema completo de Shakerfy.

---

## 📊 Estado General y Componentes

| Módulo / Vista | Estado | Progreso |
| :--- | :--- | :---: |
| **Página de Inicio (Landing Page)** | 🟢 Funcional (Mock) | 95% |
| **Perfil del Gimnasio (`/gym/$slug`)** | 🟢 Funcional (Mock) | 100% |
| **Autenticación (Auth / Login)** | 🔴 Pendiente | 0% |
| **Dashboard Gimnasio (Administrador)** | 🔴 Pendiente | 0% |
| **Dashboard Alumno (Usuario)** | 🔴 Pendiente | 0% |
| **Modelado de BD (Tablas Supabase)** | 🟡 En progreso | 10% |
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

### 🔑 Autenticación (`/auth`)
*   **Interfaz:** Tarjetas de login y registro moderna, limpia y centrada.
*   **Roles:** Flujo unificado o diferenciado para **Alumnos** y **Administradores de Gimnasio**.

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

## 🗄️ 2. Modelo de Datos de Supabase (Esquema de Tablas)

### 1. Tabla: `memberships`
```sql
CREATE TABLE memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  duration_days integer NOT NULL,
  benefits text[] NOT NULL, -- Array de beneficios
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);
```

### 2. Tabla: `members`
```sql
CREATE TABLE members (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  phone text UNIQUE,
  email text UNIQUE,
  membership_id uuid REFERENCES memberships(id) ON DELETE SET NULL,
  start_date date,
  end_date date,
  status text CHECK (status IN ('active', 'expired', 'pending')),
  created_at timestamp with time zone DEFAULT now()
);
```

### 3. Tabla: `classes`
```sql
CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  instructor text NOT NULL,
  capacity integer NOT NULL,
  duration_minutes integer NOT NULL,
  schedule_rules jsonb NOT NULL, -- Reglas de repetición
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);
```

### 4. Tabla: `class_sessions`
```sql
CREATE TABLE class_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time NOT NULL,
  instructor text NOT NULL,
  capacity integer NOT NULL,
  available_slots integer NOT NULL,
  is_cancelled boolean DEFAULT false
);
```

### 5. Tabla: `bookings`
```sql
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  session_id uuid REFERENCES class_sessions(id) ON DELETE CASCADE,
  status text CHECK (status IN ('confirmed', 'cancelled', 'attended')),
  check_in_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);
```

### 6. Tabla: `attendance_logs`
```sql
CREATE TABLE attendance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  check_in timestamp with time zone DEFAULT now(),
  method text CHECK (method IN ('qr_scan', 'manual_reception'))
);
```

### 7. Tabla: `payments`
```sql
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE RESTRICT,
  amount numeric NOT NULL,
  date date NOT NULL,
  method text CHECK (method IN ('cash', 'card', 'transfer')),
  status text CHECK (status IN ('paid', 'pending')),
  notes text,
  created_at timestamp with time zone DEFAULT now()
);
```

### 8. Tabla: `messages`
```sql
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE SET NULL,
  phone_number text NOT NULL,
  direction text CHECK (direction IN ('inbound', 'outbound')),
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
```

### 9. Tabla: `gym_config`
```sql
CREATE TABLE gym_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_name text NOT NULL,
  address text NOT NULL,
  timezone text DEFAULT 'America/Argentina/Buenos_Aires',
  opening_time time NOT NULL,
  closing_time time NOT NULL,
  webhook_url text,
  updated_at timestamp with time zone DEFAULT now()
);
```

### ⚡ Índices de Optimización Recomendados
```sql
CREATE INDEX idx_class_sessions_date ON class_sessions(date);
CREATE INDEX idx_attendance_logs_member_date ON attendance_logs(member_id, check_in);
CREATE INDEX idx_bookings_member_status ON bookings(member_id, status);
```
