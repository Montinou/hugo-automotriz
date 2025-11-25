# Documentación Técnica - Asistencia Vehicular AI

## 1. Stack Tecnológico

El proyecto utiliza un stack moderno basado en React y Next.js, enfocado en rendimiento y experiencia de desarrollador.

### Frontend & Framework
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Librería UI**: [React 19](https://react.dev/)
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Componentes UI**: [Radix UI](https://www.radix-ui.com/) (primitivas accesibles)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Mapas**: [Leaflet](https://leafletjs.com/) / React Leaflet
- **Gráficos**: [Recharts](https://recharts.org/)

### Backend & Base de Datos
- **Base de Datos**: PostgreSQL (Serverless via [Neon](https://neon.tech/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Validación**: [Zod](https://zod.dev/)
- **IA**: OpenAI SDK / Vercel AI SDK

### Herramientas de Desarrollo
- **Lenguaje**: TypeScript
- **Linter**: ESLint
- **Gestor de Paquetes**: npm

## 2. Arquitectura del Proyecto

El proyecto sigue la arquitectura de **Next.js App Router**, organizando el código por rutas y funcionalidades.

### Estructura de Directorios (`src/`)

- **`app/`**: Contiene las rutas de la aplicación, layouts y páginas.
    - `api/`: Endpoints de API backend.
    - `dashboard/`: Área principal para usuarios autenticados.
    - `(auth)/`: Rutas de autenticación (sign-in, sign-up).
    - `actions/`: Server Actions para mutaciones de datos.
- **`components/`**: Componentes reutilizables de React.
- **`db/`**: Configuración de base de datos y esquemas.
    - `schema.ts`: Definición de tablas y relaciones.
- **`lib/`**: Utilidades y configuraciones compartidas.
- **`hooks/`**: Custom hooks de React.

## 3. Modelo de Datos (Base de Datos)

El esquema de base de datos está definido en Drizzle ORM y consta de las siguientes entidades principales:

### Usuarios (`users`)
- Roles: `driver` (conductor), `mechanic` (mecánico), `workshop_owner` (dueño de taller), `admin`.
- Datos: Email, teléfono, avatar, ID externo (Clerk/Auth).

### Vehículos (`vehicles`)
- Asociados a un usuario.
- Datos: Marca, modelo, año, placa, VIN, color.

### Talleres (`workshops`)
- Propiedad de un `workshop_owner`.
- Datos: Ubicación (lat/long), descripción, rating, imágenes.

### Servicios (`services`)
- Catálogo de servicios ofrecidos por un taller.
- Datos: Precio, duración, tipo (mantenimiento, grúa, etc.).

### Solicitudes de Asistencia (`assistance_requests`)
- Modelo tipo "Uber" para emergencias.
- Relaciona: Usuario, Proveedor, Vehículo.
- Estados: Pendiente, Aceptado, En Progreso, Completado, Cancelado.
- Ubicación en tiempo real.

### Citas (`appointments`)
- Reservas en talleres.
- Relaciona: Usuario, Taller, Vehículo, Servicio.

### Productos (`products`)
- Inventario de productos vendidos por talleres.

## 4. Instalación y Despliegue

### Requisitos Previos
- Node.js 18+
- Base de datos PostgreSQL (URL de conexión)

### Instalación Local
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno (`.env`):
   - `DATABASE_URL`: Conexión a Postgres.
   - `OPENAI_API_KEY`: Para funcionalidades de IA.
4. Ejecutar migraciones de base de datos:
   ```bash
   npx drizzle-kit push
   ```
5. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Despliegue
El proyecto está optimizado para ser desplegado en **Vercel**, aprovechando las funciones serverless y la integración con Next.js.
