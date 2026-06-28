---
name: studio-pulse-smart-guide
description: Guía de habilidades y desarrollo para el proyecto Shakerfy (Studio Pulse Smart).
---

# Habilidades de Desarrollo en Shakerfy 🏋️‍♂️

Este skill documenta los flujos de desarrollo, patrones comunes y comandos necesarios para construir nuevas funcionalidades en Shakerfy (buscador inteligente de gimnasios).

---

## 🛠️ Patrones y Buenas Prácticas

### 1. Manejo del Enrutador (TanStack Router)
* **Generación de Rutas:** TanStack Start utiliza enrutamiento basado en archivos. Cada vez que crees, renombres o elimines un archivo bajo `src/routes/`, el enrutador regenerará `src/routeTree.gen.ts`.
* **Rutas Dinámicas:** Se nombran usando el prefijo `$`. Por ejemplo: `src/routes/gym.$slug.tsx`.
    * En el componente, accede al parámetro de la siguiente manera:
      ```tsx
      const { slug } = Route.useParams();
      ```
* **Manejo de Errores y Carga:** Utiliza `loader` para pre-cargar datos. Siempre provee un `notFoundComponent` y un `errorComponent` al crear o modificar archivos de ruta para que la experiencia del usuario sea fluida.

### 2. Estilos y Animaciones (TailwindCSS v4)
* **Variables CSS de Tema:** El sistema de diseño se basa en variables globales definidas en [styles.css](file:///C:/Users/shake/.gemini/antigravity/scratch/studio-pulse-smart/src/styles.css).
* **Animaciones:** Habilita transiciones con `transition-all duration-300` o clases de entrada como `animate-fade-up` (implementadas en el listado de gimnasios).
* **Fuentes:** La tipografía principal es Inter, importada globalmente en `__root.tsx` a través de `@fontsource/inter`.

### 3. Integración con Supabase (Base de Datos)
* **Cliente de Base de Datos:** Para interactuar con la base de datos de Supabase, importa el cliente y realiza consultas directamente:
  ```tsx
  import { supabase } from "@/lib/supabase";
  ```
* **Seguridad:** Todas las consultas desde el cliente deben respetar las reglas de Row Level Security (RLS) configuradas en las tablas.

---

## 🏃‍♂️ Comandos Frecuentes

* **Instalación:** `cmd /c npm install`
* **Correr en desarrollo:** `cmd /c npm run dev`
* **Compilar:** `cmd /c npm run build`
* **Comprobación de errores:** `cmd /c npm run lint`
