// =====================================================
// CONFIGURACIÓN DE LA APLICACIÓN FLOTA v.3
// =====================================================

// Configuración de Supabase
const SUPABASE_CONFIG = {
    url: 'https://yeavqyshoamtfgyyqlyb.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllYXZxeXNob2FtdGZneXlxbHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM0NzQ4NzMsImV4cCI6MjAzOTA1MDg3M30.8K8vK8vK8vK8vK8vK8vK8vK8vK8vK8vK8vK8vK8vK8'
};

// Configuración de la aplicación
const APP_CONFIG = {
    name: 'Flota v.3',
    version: '3.0.0',
    description: 'Sistema de gestión de flota vehicular',
    author: 'Sistema Flota',
    
    // Configuración de paginación
    pagination: {
        defaultLimit: 50,
        maxLimit: 1000
    },
    
    // Configuración de validación
    validation: {
        minYear: 1900,
        maxYear: new Date().getFullYear() + 1,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    },
    
    // Configuración de UI
    ui: {
        toastDuration: 5000,
        animationDuration: 300,
        debounceDelay: 500
    },
    
    // Configuración de cache
    cache: {
        defaultTTL: 5 * 60 * 1000, // 5 minutos
        maxSize: 100
    }
};

// Configuración de endpoints de la API
const API_ENDPOINTS = {
    // Catálogos
    marcas: '/marcas',
    modelos: '/modelos',
    arrendadoras: '/arrendadoras',
    apoderados: '/apoderados',
    colores: '/colores',
    carrocerias: '/carrocerias',
    combustibles: '/combustibles',
    transmisiones: '/transmisiones',
    tracciones: '/tracciones',
    estadosActuales: '/estados_actuales',
    estadosInventario: '/estados_inventario',
    vendedores: '/vendedores',
    whatsappGrupos: '/whatsapp_grupos',
    
    // Entidades principales
    vehiculos: '/vehiculos',
    colaboradores: '/colaboradores',
    tareas: '/tareas',
    
    // Relaciones
    vehiculoFotos: '/vehiculo_fotos',
    tareaAdjuntos: '/tarea_adjuntos',
    tareaColaboradores: '/tarea_colaboradores',
    tareaComentarios: '/tarea_comentarios'
};

// Configuración de mensajes
const MESSAGES = {
    success: {
        created: 'Registro creado exitosamente',
        updated: 'Registro actualizado exitosamente',
        deleted: 'Registro eliminado exitosamente',
        saved: 'Cambios guardados exitosamente'
    },
    error: {
        connection: 'Error de conexión. Verifica tu internet.',
        server: 'Error del servidor. Intenta más tarde.',
        unauthorized: 'Error de autorización. Recarga la página.',
        notFound: 'Registro no encontrado',
        validation: 'Error de validación en los datos',
        generic: 'Ha ocurrido un error inesperado'
    },
    confirm: {
        delete: '¿Estás seguro de que quieres eliminar este registro?',
        unsavedChanges: 'Tienes cambios sin guardar. ¿Deseas continuar?'
    }
};

// Configuración de estados y prioridades
const STATUS_CONFIG = {
    tareas: {
        estados: ['pendiente', 'en_progreso', 'completada', 'cancelada'],
        prioridades: ['baja', 'media', 'alta', 'urgente']
    },
    vehiculos: {
        estados: ['disponible', 'reservado', 'en_uso', 'mantenimiento', 'fuera_servicio']
    }
};

// Configuración de roles
const ROLES = {
    colaboradores: ['ejecutor', 'supervisor', 'apoyo']
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_CONFIG,
        APP_CONFIG,
        API_ENDPOINTS,
        MESSAGES,
        STATUS_CONFIG,
        ROLES
    };
}