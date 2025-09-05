# 🚗 Flota v.3 - Sistema de Gestión Vehicular

Sistema completo de gestión de flota vehicular desarrollado desde cero con arquitectura robusta y moderna.

## ✨ Características Principales

### 🏗️ Arquitectura Sólida
- **Diseño desde cero** basado en la estructura real de la base de datos
- **API Service robusto** con manejo de errores y cache inteligente
- **Configuración centralizada** para fácil mantenimiento
- **PWA completa** con Service Worker y manifest optimizado

### 📊 Módulos del Sistema
- **Dashboard** - Estadísticas y resumen general
- **Vehículos** - Gestión completa de la flota
- **Tareas** - Control de mantenimiento y actividades
- **Colaboradores** - Administración del personal
- **Catálogos** - Marcas, modelos, arrendadoras, etc.

### 🎨 Interfaz Moderna
- **Bootstrap 5.3.2** para diseño responsivo
- **Font Awesome 6.0.0** para iconografía
- **Estilos personalizados** con variables CSS
- **Animaciones suaves** y transiciones
- **Tema consistente** en toda la aplicación

## 🗄️ Estructura de Base de Datos

El sistema está diseñado para trabajar con la siguiente estructura:

### Tablas Principales
- `vehiculos` - Información de vehículos
- `tareas` - Tareas de mantenimiento
- `colaboradores` - Personal de la empresa

### Tablas de Catálogos
- `marcas` - Marcas de vehículos
- `modelos` - Modelos por marca
- `arrendadoras` - Empresas arrendadoras
- `apoderados` - Apoderados de arrendadoras
- `colores` - Colores disponibles
- `carrocerias` - Tipos de carrocería
- `combustibles` - Tipos de combustible
- `transmisiones` - Tipos de transmisión
- `tracciones` - Tipos de tracción
- `estados_actuales` - Estados actuales de vehículos
- `estados_inventario` - Estados de inventario
- `vendedores` - Vendedores
- `whatsapp_grupos` - Grupos de WhatsApp

### Tablas de Relaciones
- `vehiculo_fotos` - Fotos de vehículos
- `tarea_adjuntos` - Archivos adjuntos a tareas
- `tarea_colaboradores` - Asignación de colaboradores a tareas
- `tarea_comentarios` - Comentarios en tareas

## 🚀 Instalación y Configuración

### Requisitos
- Navegador web moderno
- Conexión a internet
- Acceso a Supabase

### Configuración
1. **Configurar Supabase** en `config.js`:
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'https://tu-proyecto.supabase.co',
       anonKey: 'tu-clave-anonima'
   };
   ```

2. **Desplegar archivos** en tu servidor web

3. **Acceder** a la aplicación desde el navegador

## 📁 Estructura de Archivos

```
Flota v.3/
├── index.html          # Página principal
├── config.js           # Configuración centralizada
├── api.js              # Servicio de API
├── app.js              # Aplicación principal
├── styles.css          # Estilos personalizados
├── manifest.json       # Configuración PWA
├── sw.js              # Service Worker
├── supabase_database_changes.sql  # Esquema de BD
└── README.md          # Documentación
```

## 🔧 Funcionalidades

### Dashboard
- Estadísticas generales del sistema
- Resumen de vehículos disponibles
- Estado de tareas pendientes
- Información de colaboradores activos

### Gestión de Vehículos
- Lista completa con filtros y búsqueda
- Vista de tarjetas con información clave
- Acciones rápidas (editar, ver, eliminar)
- Integración con catálogos relacionados

### Gestión de Tareas
- Lista de tareas con estados y prioridades
- Filtros por estado y responsable
- Asignación de colaboradores
- Seguimiento de progreso

### Catálogos
- **Marcas**: Gestión de marcas de vehículos
- **Modelos**: Modelos por marca con relación
- **Arrendadoras**: Empresas arrendadoras con apoderados

## 🎯 Características Técnicas

### API Service
- **Cache inteligente** con TTL configurable
- **Manejo de errores** robusto
- **Retry automático** en fallos de red
- **Validación de datos** consistente
- **Formato de respuesta** estandarizado

### PWA
- **Instalable** en dispositivos móviles
- **Funciona offline** con cache estratégico
- **Notificaciones push** (preparado)
- **Sincronización** en background
- **Actualizaciones automáticas**

### Performance
- **Carga rápida** con assets optimizados
- **Lazy loading** de contenido
- **Debounce** en búsquedas
- **Animaciones suaves** sin bloqueos

## 🔒 Seguridad

- **Validación client-side** de datos
- **Sanitización** de HTML
- **Headers de seguridad** en Service Worker
- **Manejo seguro** de tokens de API

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos
- Desktop (Windows, macOS, Linux)
- Mobile (iOS, Android)
- Tablet (iPad, Android tablets)

## 🚀 Despliegue

### Opciones de Hosting
- **Netlify** (recomendado)
- **Vercel**
- **GitHub Pages**
- **Firebase Hosting**
- **Cualquier servidor web estático**

### Variables de Entorno
Configurar en `config.js`:
- URL de Supabase
- Clave anónima de Supabase
- Configuraciones de la aplicación

## 🔄 Actualizaciones

El sistema está diseñado para actualizaciones sin interrupciones:
- **Service Worker** maneja actualizaciones automáticas
- **Cache versionado** para rollback si es necesario
- **Notificaciones** de nuevas versiones

## 📞 Soporte

Para soporte técnico o consultas:
- Revisar la documentación
- Verificar configuración de Supabase
- Comprobar logs del navegador
- Validar estructura de base de datos

## 📄 Licencia

Sistema desarrollado para gestión interna de flota vehicular.

---

**Flota v.3** - Sistema de Gestión Vehicular Moderno y Robusto 🚗✨