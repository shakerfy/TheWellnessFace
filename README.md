# The Wellness Face — Plataforma Integral de Bienestar con IA 🧘‍♂️✨

**The Wellness Face** es una plataforma integral de bienestar consciente impulsada por inteligencia artificial. Integra nutrición somática con porciones visuales, prescripción de entrenamientos biomecánicos personalizados, seguimiento del descanso circadiano y gestión inteligente de membresías y centros deportivos.

---

## 🚀 Características Principales

1. **Búsqueda con IA (Lenguaje Natural):** Describe lo que buscas (ej. _"CrossFit en Palermo bajo $25.000"_) y la plataforma filtrará las mejores opciones para ti.
2. **Filtros por Categoría:** Acceso rápido a disciplinas populares como CrossFit, Yoga, Pilates, Funcional, Spinning, Powerlifting y Boutique.
3. **Perfiles Completos de Gimnasios (`/gym/$slug`):**
   - **Carrusel de Imágenes:** Galería interactiva del gimnasio.
   - **Horarios en Tiempo Real:** Indicador dinámico de si el gimnasio está abierto o cerrado.
   - **Planes y Membresías:** Visualización clara de los precios mensuales y beneficios incluidos.
   - **Calendario Semanal de Clases:** Agenda de clases diaria con instructores, horarios y control de capacidad en tiempo real (lugares disponibles o lista de espera).
4. **Diseño Premium:** Interfaz oscura, limpia, minimalista y ultra responsive creada con componentes modernos y animaciones suaves.

---

## 🛠️ Stack Tecnológico

- **Framework:** [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (Framework React Full-Stack rápido y tipado).
- **Enrutado:** [TanStack Router](https://tanstack.com/router) (Rutas basadas en archivos con tipado seguro).
- **Manejo de Estado:** [TanStack Query](https://tanstack.com/query) (React Query para sincronización de datos).
- **Estilos:** [TailwindCSS](https://tailwindcss.com/) (diseño responsive y variables CSS).
- **Iconos:** [Lucide React](https://lucide.dev/).
- **Validaciones:** [Zod](https://zod.dev/) para esquemas de datos seguros.

---

## 📂 Estructura del Proyecto

- `src/routes/__root.tsx`: Estructura base de la aplicación (Layout principal, metatags, configuración de fuentes globales).
- `src/routes/index.tsx`: Página de inicio con la caja de búsqueda con IA (Typewriter) y el listado general de gimnasios con filtros rápidos de categorías.
- `src/routes/gym.$slug.tsx`: Vista dinámica de perfil de gimnasio detallado (carrusel, planes de membresía, calendario semanal).
- `src/components/ui/`: Biblioteca de componentes reutilizables (Botones, Badges, etc.) estilizados con TailwindCSS.
- `src/lib/gyms.ts`: Base de datos local simulada con la información detallada de los gimnasios y clases.
- `src/styles.css`: Estilos globales y sistema de diseño (variables de tema oscuro/claro).

---

## 💻 Desarrollo Local

Para correr el proyecto en tu entorno local, asegúrate de tener instalado [Node.js](https://nodejs.org/).

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar servidor de desarrollo

```bash
npm run dev
```

El servidor se iniciará en [http://localhost:8080](http://localhost:8080).

### 3. Compilar para producción

```bash
npm run build
```

---

## 📝 Scripts Disponibles

- `npm run dev`: Levanta el entorno de desarrollo con Vite.
- `npm run build`: Genera el bundle optimizado para producción.
- `npm run lint`: Ejecuta ESLint para analizar errores en el código.
- `npm run format`: Formatea el código automáticamente usando Prettier.
