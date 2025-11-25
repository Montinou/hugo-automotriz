# Documentación de Negocio - Asistencia Vehicular AI

## 1. Visión del Proyecto

**Asistencia Vehicular AI** es una plataforma integral diseñada para transformar la experiencia de mantenimiento y asistencia vehicular. Combina la inmediatez de los servicios de emergencia (tipo Uber para grúas/mecánicos) con la gestión planificada de talleres automotrices.

### Objetivo Principal
Resolver emergencias mecánicas en tiempo real y facilitar la planificación de mantenimientos preventivos, ofreciendo un ecosistema digital confiable, rápido y accesible para conductores y proveedores de servicios.

## 2. Actores del Sistema (Roles)

### 🚗 Conductor (Driver)
- **Necesidad**: Requiere asistencia inmediata en ruta o mantenimiento programado.
- **Funcionalidades**:
    - Solicitar grúa o mecánico en tiempo real.
    - Buscar talleres cercanos y ver calificaciones.
    - Agendar citas para mantenimiento.
    - Gestionar perfil de sus vehículos.

### 🔧 Mecánico / Proveedor de Asistencia (Provider)
- **Necesidad**: Recibir solicitudes de trabajo cercanas y gestionar sus servicios.
- **Funcionalidades**:
    - Recibir alertas de solicitudes de asistencia cercanas.
    - Aceptar/Rechazar trabajos.
    - Navegación hacia el cliente.
    - Gestión de ingresos.

### 🏢 Dueño de Taller (Workshop Owner)
- **Necesidad**: Digitalizar su negocio, atraer clientes y gestionar citas.
- **Funcionalidades**:
    - Perfil de taller con servicios y precios.
    - Gestión de calendario de citas.
    - Venta de productos/repuestos.
    - Ver métricas y reportes.

### 🛡️ Administrador
- **Necesidad**: Supervisar la plataforma.
- **Funcionalidades**:
    - Gestión de usuarios y talleres.
    - Monitoreo de transacciones y calidad del servicio.

## 3. Funcionalidades Principales

### 🚨 Asistencia en Carretera (On-Demand)
- **Geolocalización**: Ubicación exacta del conductor y seguimiento en tiempo real del proveedor.
- **Tipos de Servicio**: Grúa, Batería, Neumático, Combustible, Mecánica Ligera.
- **Flujo**: Solicitud -> Asignación -> Servicio -> Pago -> Calificación.

### 📅 Gestión de Talleres y Citas
- **Directorio**: Búsqueda de talleres por ubicación, especialidad y rating.
- **Reservas**: Agenda online para evitar esperas.
- **Catálogo**: Lista transparente de servicios y precios.

### 🤖 Inteligencia Artificial (Valor Agregado)
- **Mantenimiento Predictivo**: Análisis de patrones para sugerir mantenimientos antes de fallas.
- **Estimación de Costos**: IA para estimar precios de reparaciones basándose en descripciones del problema.
- **Analítica**: Reportes inteligentes para talleres sobre demanda y tendencias.

## 4. Flujos de Usuario Clave

### Flujo de Emergencia
1. El conductor reporta una emergencia y selecciona el tipo de servicio.
2. El sistema localiza proveedores cercanos disponibles.
3. Un proveedor acepta la solicitud.
4. El conductor ve la ubicación del proveedor en tiempo real.
5. Se realiza el servicio y se completa la transacción.

### Flujo de Mantenimiento
1. El conductor busca un taller para un servicio específico (ej. cambio de aceite).
2. Selecciona un taller basado en precio y reseñas.
3. Elige una fecha y hora disponible.
4. El taller confirma la cita.
5. El conductor asiste y califica el servicio al finalizar.
