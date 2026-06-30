# Guía de Agente — Shakerfy (Studio Pulse Smart) 🤖🛠️

Este documento está diseñado para orientar a cualquier agente de IA o desarrollador que empiece a trabajar en este repositorio. Define las reglas de arquitectura, convenciones técnicas y el estado actual del proyecto.

---

## 📌 Estado de la Versión Actual

*   **Commit Actual:** `8a707dbc` ("Añadido perfil de gimnasio").
*   **Servidor de Desarrollo:** Activo localmente en `http://localhost:8080/`.
*   **Firebase:** Integración planificada a futuro para la base de datos.

---

## 🛠️ Stack Tecnológico

1.  **Framework:** [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (SSR, construido sobre Vite y Nitro).
2.  **Routing:** [TanStack Router](https://tanstack.com/router) (Enrutamiento basado en archivos).
3.  **Manejo de Estado:** [TanStack Query](https://tanstack.com/query) (React Query).
4.  **Estilos:** [TailwindCSS v4](https://tailwindcss.com/) (Sin `tailwind.config.js`, tokens definidos en `src/styles.css`).
5.  **Base de Datos:** Firebase (integración planificada a futuro; por ahora se utilizan datos simulados).
6.  **Componentes:** shadcn/ui + Radix UI + Lucide React.

---

## 📐 Reglas y Convenciones de Código

### 1. Enrutamiento Basado en Archivos
*   Todas las páginas y layouts deben ir bajo la carpeta `src/routes/`.
*   **No usar** convenciones de Next.js (`app/layout.tsx` o `pages/`) ni de Remix.
*   El layout global es [__root.tsx](file:///C:/Users/shake/.gemini/antigravity/scratch/studio-pulse-smart/src/routes/__root.tsx). No modifiques ni elimines el componente `<Outlet />` ya que rompería todas las subrutas.
*   El archivo [routeTree.gen.ts](file:///C:/Users/shake/.gemini/antigravity/scratch/studio-pulse-smart/src/routeTree.gen.ts) se genera automáticamente en tiempo de desarrollo. **No lo edites manualmente**.

### 2. Estilos con Tailwind CSS v4
*   El tema oscuro y las clases se gestionan a nivel global mediante variables CSS en [styles.css](file:///C:/Users/shake/.gemini/antigravity/scratch/studio-pulse-smart/src/styles.css).
*   No intentes agregar un archivo de configuración `tailwind.config.js`. Utiliza variables inline `@theme` dentro del archivo de estilos si necesitas ampliar el tema.

### 3. Firebase (Futuro)
*   La integración con Firebase está planificada para más adelante.
*   Utiliza los datos locales mockeados de [gyms.ts](file:///c:/Users/shake/.gemini/antigravity/scratch/studio-pulse-smart/src/lib/gyms.ts) para el desarrollo de componentes y páginas.

---

## 📋 Directrices para Nuevos Agentes

1.  **Mantener la integridad de Git:** No reescribas el historial publicado (no hagas `git commit --amend` o `force push`) si el proyecto se conecta a Lovable, ya que esto podría corromper la sincronización.
2.  **Validación de Rutas:** Si agregas rutas dinámicas, implementa siempre la validación de parámetros de búsqueda (`validateSearch`) con Zod.
3.  **Actualización de Dependencias:** Al cambiar de commit, recuerda ejecutar `npm install` si los archivos de dependencias cambiaron.
