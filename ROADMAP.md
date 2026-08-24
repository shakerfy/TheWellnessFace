# 🗺️ Hoja de Ruta (Roadmap) y Estado del Proyecto — Shakerfy / Studio Pulse Smart

Este documento detalla el estado real del proyecto **Studio Pulse Smart (Shakerfy)**, la arquitectura de vistas implementadas, las reglas de negocio activas y la estructura del modelo de datos para la futura integración con Firebase Firestore.

---

## 📊 Estado Actual de Módulos y Componentes

| Módulo / Vista                            | Estado                     | Progreso | Descripción / Notas                                                                     |
| :---------------------------------------- | :------------------------- | :------: | :-------------------------------------------------------------------------------------- |
| **Landing Page Principal (`/`)**          | 🟢 Completo & Funcional    |   100%   | Buscador semántico tipo IA, carrusel y tarjetas de gimnasios.                           |
| **Perfil del Gimnasio (`/gym/$slug`)**    | 🟢 Completo (Sede Única)   |   100%   | Galería, amenities, horarios semanales, staff y agenda de clases.                       |
| **Autenticación Alumnos (`/auth`)**       | 🟢 Completo                |   100%   | Login/Registro limpio para alumnos.                                                     |
| **Autenticación Gimnasios (`/auth/gym`)** | 🟢 Completo                |   100%   | Portal de acceso para administración de gimnasios.                                      |
| **Dashboard Admin (`/dashboard`)**        | 🟢 Producción (8 Pestañas) |   100%   | Asistencia, Miembros, Clases, Membresías, Staff, Reportes, Inventario y Configuración.  |
| **App Móvil Alumnos (`/app`)**            | 🟢 Completo (5 Pestañas)   |   100%   | Inicio, Check-in QR, AI Coach, Favoritos y Perfil con validación de créditos.           |
| **Analítica & Reportes Ejecutivos**       | 🟢 Completo (CSV / PDF)    |   100%   | 4 Sub-tabs (Finanzas, Asistencia, Socios, Staff), filtros dinámicos y exportación CSV.  |
| **Validación de Créditos y Planes**       | 🟢 Completo                |   100%   | Deducción y reembolso automático de créditos por clase según plan del alumno.           |
| **Depuración de Código Residual**         | 🟢 Completo                |   100%   | Removidas calificaciones de coaches, sedes secundarias, simulador RBAC y código muerto. |
| **Integración Firebase Backend**          | 🟡 Tipado & Modelado       |   30%    | Interfaces TypeScript listas para sync con Firestore & Storage.                         |

---

## 📐 1. Estructura de Vistas e Interfaces Implementadas

### 🏠 Landing Page (`/`)

- **Buscador Semántico:** Efecto _typewriter_ que simula a la IA redactando solicitudes de búsqueda.
- **Grilla de Gimnasios:** Tarjetas con foto destacada, calificación, barrio/ciudad, precio base y estado de apertura.
- **Filtros Rápidos:** Selección por disciplinas (_CrossFit_, _Yoga_, _Pilates_, _Funcional_, _Spinning_, _Powerlifting_, _Boutique_).

### 🏋️ Perfil del Gimnasio (`/gym/$slug`)

- **Ficha del Studio:** Carrusel de imágenes, dirección oficial y horarios de atención por turnos.
- **Amenities y Normas:** Badges con equipamiento incluido (WiFi, duchas, vestuarios) y requisitos de ingreso (Apto médico, toalla).
- **Staff & Coaches:** Presentación del equipo de entrenadores con foto, especialidad y certificaciones.
- **Tarifario & Membresías:** Comparador de planes (_Pase Libre_, _Por Créditos_, _Off-Peak_).
- **Reserva de Clases:** Agenda de clases por día con cupos en tiempo real.

### 🏢 Dashboard de Administración (`/dashboard`)

Interfaz de gestión basada en Sidebar accesible e intuitivo con 8 pestañas operativas:

1. 📥 **Asistencia en Vivo:** Monitor de check-ins en tiempo real por QR o recepción manual, control de aforo (42/80) e historial exportable a CSV.
2. 👥 **Miembros / Alumnos:** Gestión de socios, estado de cuenta (_Activo_, _Pendiente_, _Vencido_), asignación de planes y registro.
3. 🏋️ **Gestión de Clases & Agenda:**
   - Creación de sesiones asociadas a profesores del staff.
   - **Switch de Mapa de Lugares:** Permite activar o desactivar la selección táctil de asientos/mats individuales vs. aforo general.
   - Gestión de ausencias de profesores y solicitud de suplencias.
4. 💳 **Planes & Membresías:** Creación y edición de planes comerciales (_Pases Libres_ vs _Por Créditos_, matrículas, días de congelamiento, límite diario).
5. 🧘 **Personal / Staff:** Altas, bajas y edición de profesores, certificaciones, diplomas cargados y esquema de liquidación de sueldos.
6. 📊 **Reportes & Analítica de Negocio:**
   - **Filtros:** Por rango temporal (_Hoy_, _Semana_, _Este Mes_, _Mes Anterior_, _Trimestre_) y disciplina.
   - **Sub-Tabs:** _Finanzas e Ingresos_, _Asistencia y Ocupación_, _Retención y Alumnos_ y _Staff & Coaches_.
   - **Módulo de Alerta Temprana de Churn:** Identificación de alumnos en riesgo (14+ días sin check-in) con envío de recordatorio por WhatsApp.
   - **Exportación:** Generador dinámico de archivos CSV e informes imprimibles PDF.
7. 📦 **Inventario & Productos:** Control de stock de insumos y merchandising en recepción.
8. ⚙️ **Configuración del Studio:** Edición de datos públicos, política de cancelación de clases, gestión de salas físicas y días de cierre/feriados.

### 📱 App Móvil de Alumnos (`/app`)

Navegación inferior táctil de 5 pestañas:

1. 🏠 **Inicio:** Resumen de próximo turno, estado de membresía activa y contador de créditos restantes.
2. 🎟️ **Check-in:** Generador de Pase QR personal para acceso en recepción.
3. 🤖 **AI Coach:** Asistente inteligente de recomendaciones de rutinas y descansos.
4. ⭐ **Favoritos:** Guardado rápido de gimnasios y clases frecuentes.
5. 👤 **Mi Perfil:** Historial de clases asistidas y plan contratado.

---

## ⚙️ 2. Reglas de Negocio Implementadas

1. **Validación Rígida de Membresías y Créditos:**
   - Al reservar una clase, la app verifica si el plan incluye la actividad requerida.
   - Si la membresía es _Por Créditos_, valida que el saldo restante sea `>= 1` y descuenta 1 crédito automáticamente.
   - Al cancelar una reserva dentro de la política de anticipación, el crédito se reembolsa automáticamente.
2. **Modelo de Sede Única (_Studio Central_):**
   - El sistema opera de forma limpia para un centro deportivo, sin selectores de sucursales obsoletos ni asignaciones secundarias.
3. **Depuración de Permisos y Roles:**
   - Se removió el antiguo simulador de permisos flotante (RBAC). El Dashboard es la consola de administración directa y la App es la interfaz del alumno.
4. **Remoción de Calificación de Coaches:**
   - Se quitó la evaluación por estrellas de los profesores, reemplazándola por métricas objetivas de cumplimiento de horarios y asistencia confirmada.

---

## 🗄️ 3. Modelo de Datos de Firebase (Colecciones Firestore)

### 1. Colección: `memberships` (Planes Comercializados)

```json
{
  "id": "uuid",
  "name": "string (ej: Pase Libre Total)",
  "price": "number",
  "original_price": "number | null",
  "duration": "string ('Mensual' | 'Trimestral' | 'Anual')",
  "pass_type": "string ('Pase Libre' | 'Por Créditos')",
  "credits_count": "number | null",
  "access_hours_type": "string ('Todo Horario' | 'Off-Peak')",
  "off_peak_start": "string | null (HH:MM)",
  "off_peak_end": "string | null (HH:MM)",
  "included_activities": "array of strings",
  "included_services": "array of strings (amenities ids)",
  "registration_fee": "number",
  "freeze_days": "number",
  "daily_class_limit": "string ('Ilimitado' | '1 clase por día')"
}
```

### 2. Colección: `members` (Alumnos y Socios)

```json
{
  "id": "uuid (referencia a Firebase Auth uid)",
  "name": "string",
  "phone": "string",
  "email": "string",
  "plan": "string (nombre o ID del plan activo)",
  "status": "string ('activo' | 'vencido' | 'pendiente')",
  "expiration_date": "string (YYYY-MM-DD)",
  "remaining_credits": "number | null",
  "privacy_mode": "boolean",
  "created_at": "timestamp"
}
```

### 3. Colección: `staff` (Instructores y Personal)

```json
{
  "id": "uuid",
  "name": "string",
  "specialty": "string",
  "certifications": "array of strings",
  "photo": "string (URL Firebase Storage / CDN)",
  "certification_images": "array of strings (URLs a diplomas)",
  "status": "string ('linked' | 'pending')",
  "pay_model": "string ('fixed_class' | 'per_student' | 'hybrid')",
  "fixed_rate_per_class": "number",
  "rate_per_student": "number"
}
```

### 4. Colección: `classes` (Clases Programadas)

```json
{
  "id": "uuid",
  "name": "string",
  "discipline": "string",
  "staff_id": "string (reference to staff.id)",
  "sala_id": "string (reference to salasList.id)",
  "time": "string (HH:MM)",
  "day": "number (0=Lunes ... 6=Domingo)",
  "capacity": "number",
  "booked": "number",
  "credits_cost": "number",
  "has_spot_map": "boolean (indica si usa mapa táctil de asientos)",
  "spot_labels": "array of strings (ej: ['Mat 1', 'Mat 2'])",
  "seeking_backup": "boolean",
  "status": "string ('activa' | 'cancelada')"
}
```

### 5. Colección: `bookings` (Reservas de Alumnos)

```json
{
  "id": "uuid",
  "class_id": "string (reference to classes.id)",
  "member_id": "string (reference to members.id)",
  "spot_index": "number | null",
  "attendance": "string ('presente' | 'ausente' | 'pendiente')",
  "created_at": "timestamp"
}
```

---

## 🔮 4. Próximos Pasos (Roadmap de Desarrollo Futuro)

- [ ] **Fase 1: Sincronización Real con Firebase Firestore**
  - Reemplazar estados locales en memoria por hooks de Firebase Realtime (`onSnapshot`) para `classesList`, `membersList` y `staffList`.
- [ ] **Fase 2: Pasarela de Pagos (MercadoPago Webhook)**
  - Automatizar la renovación de cuotas y acreditación instantánea de pases de crédito al recibir webhooks de cobro aprobado.
- [ ] **Fase 3: Integración WhatsApp API (Notificaciones)**
  - Conectar el botón de _Alerta de Churn_ y confirmaciones de reservas con la API de WhatsApp Business.
