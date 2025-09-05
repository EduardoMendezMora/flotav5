// =====================================================
// API SERVICE - FLOTA v.3
// =====================================================

class ApiService {
    constructor() {
        this.baseUrl = SUPABASE_CONFIG.url + '/rest/v1';
        this.headers = {
            'apikey': SUPABASE_CONFIG.anonKey,
            'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
        this.cache = new Map();
        this.cacheTTL = APP_CONFIG.cache.defaultTTL;
    }

    // ===== MÉTODO PRINCIPAL DE REQUEST =====
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            method: 'GET',
            headers: this.headers,
            ...options
        };

        // Log de la consulta
        console.log(`🔍 Ejecutando consulta: ${endpoint}`);

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Siempre devolver en formato consistente
            return {
                success: true,
                data: Array.isArray(data) ? data : [data],
                count: response.headers.get('content-range')?.split('/')[1] || data.length
            };
        } catch (error) {
            console.error(`❌ Error en API request:`, error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    // ===== MÉTODOS DE CACHE =====
    getCacheKey(endpoint, params = {}) {
        return `${endpoint}_${JSON.stringify(params)}`;
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clearCache(pattern = null) {
        if (pattern) {
            for (const key of this.cache.keys()) {
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                }
            }
        } else {
        this.cache.clear();
    }
    }

    // ===== MÉTODOS DE CATÁLOGOS =====
    
    // Marcas
    async getMarcas(filters = {}) {
        const cacheKey = this.getCacheKey('marcas', filters);
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        let endpoint = `${API_ENDPOINTS.marcas}?select=*&order=nombre.asc`;
        
        if (filters.search) {
            endpoint += `&nombre.ilike.*${encodeURIComponent(filters.search)}*`;
        }

        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    async createMarca(data) {
        const result = await this.request(API_ENDPOINTS.marcas, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (result.success) {
            this.clearCache('marcas');
        }
        return result;
    }

    async updateMarca(id, data) {
        const result = await this.request(`${API_ENDPOINTS.marcas}?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
        if (result.success) {
            this.clearCache('marcas');
        }
        return result;
    }

    async deleteMarca(id) {
        const result = await this.request(`${API_ENDPOINTS.marcas}?id=eq.${id}`, {
            method: 'DELETE'
        });
        if (result.success) {
            this.clearCache('marcas');
        }
        return result;
    }

    // Modelos
    async getModelos(filters = {}) {
        const cacheKey = this.getCacheKey('modelos', filters);
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        let endpoint = `${API_ENDPOINTS.modelos}?select=*,marcas(nombre)&order=nombre.asc`;
        
        if (filters.marca_id) {
            endpoint += `&marca_id=eq.${filters.marca_id}`;
            }
            if (filters.search) {
            endpoint += `&nombre.ilike.*${encodeURIComponent(filters.search)}*`;
        }

        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    async createModelo(data) {
        const result = await this.request(API_ENDPOINTS.modelos, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (result.success) {
            this.clearCache('modelos');
        }
        return result;
    }

    async updateModelo(id, data) {
        const result = await this.request(`${API_ENDPOINTS.modelos}?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
        if (result.success) {
            this.clearCache('modelos');
        }
        return result;
    }

    async deleteModelo(id) {
        const result = await this.request(`${API_ENDPOINTS.modelos}?id=eq.${id}`, {
            method: 'DELETE'
        });
        if (result.success) {
            this.clearCache('modelos');
        }
        return result;
    }

    // Arrendadoras
    async getArrendadoras(filters = {}) {
        const cacheKey = this.getCacheKey('arrendadoras', filters);
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        let endpoint = `${API_ENDPOINTS.arrendadoras}?select=*&order=nombre.asc`;
        
        if (filters.search) {
            endpoint += `&nombre.ilike.*${encodeURIComponent(filters.search)}*`;
        }

        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    async createArrendadora(data) {
        const result = await this.request(API_ENDPOINTS.arrendadoras, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (result.success) {
            this.clearCache('arrendadoras');
        }
        return result;
    }

    async updateArrendadora(id, data) {
        const result = await this.request(`${API_ENDPOINTS.arrendadoras}?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
        if (result.success) {
            this.clearCache('arrendadoras');
        }
        return result;
    }

    async deleteArrendadora(id) {
        const result = await this.request(`${API_ENDPOINTS.arrendadoras}?id=eq.${id}`, {
            method: 'DELETE'
        });
        if (result.success) {
            this.clearCache('arrendadoras');
        }
        return result;
    }

    // Colores
    async getColores() {
        const cacheKey = this.getCacheKey('colores');
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        const endpoint = `${API_ENDPOINTS.colores}?select=*&order=nombre.asc`;
        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    // Carrocerías
    async getCarrocerias() {
        const cacheKey = this.getCacheKey('carrocerias');
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        const endpoint = `${API_ENDPOINTS.carrocerias}?select=*&order=nombre.asc`;
        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    // Combustibles
    async getCombustibles() {
        const cacheKey = this.getCacheKey('combustibles');
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        const endpoint = `${API_ENDPOINTS.combustibles}?select=*&order=nombre.asc`;
        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    // Transmisiones
    async getTransmisiones() {
        const cacheKey = this.getCacheKey('transmisiones');
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        const endpoint = `${API_ENDPOINTS.transmisiones}?select=*&order=nombre.asc`;
        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    // Tracciones
    async getTracciones() {
        const cacheKey = this.getCacheKey('tracciones');
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        const endpoint = `${API_ENDPOINTS.tracciones}?select=*&order=nombre.asc`;
        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    // Estados Actuales
    async getEstadosActuales() {
        const cacheKey = this.getCacheKey('estados_actuales');
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        const endpoint = `${API_ENDPOINTS.estadosActuales}?select=*&order=nombre.asc`;
        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    // Estados Inventario
    async getEstadosInventario() {
        const cacheKey = this.getCacheKey('estados_inventario');
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        const endpoint = `${API_ENDPOINTS.estadosInventario}?select=*&order=nombre.asc`;
        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    // Vendedores
    async getVendedores() {
        const cacheKey = this.getCacheKey('vendedores');
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        const endpoint = `${API_ENDPOINTS.vendedores}?select=*&order=nombre.asc`;
        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    // WhatsApp Grupos
    async getWhatsappGrupos() {
        const cacheKey = this.getCacheKey('whatsapp_grupos');
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        const endpoint = `${API_ENDPOINTS.whatsappGrupos}?select=*&order=nombre.asc`;
        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    // Apoderados
    async getApoderados(filters = {}) {
        const cacheKey = this.getCacheKey('apoderados', filters);
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        let endpoint = `${API_ENDPOINTS.apoderados}?select=*,arrendadoras(nombre)&order=nombre.asc`;
        
        if (filters.arrendadora_id) {
            endpoint += `&arrendadora_id=eq.${filters.arrendadora_id}`;
        }

        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    // ===== MÉTODOS DE VEHÍCULOS =====
    async getVehiculos(filters = {}) {
        const cacheKey = this.getCacheKey('vehiculos', filters);
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        let endpoint = `${API_ENDPOINTS.vehiculos}?select=*,marcas(nombre),modelos(nombre),arrendadoras(nombre),colores(nombre),carrocerias(nombre),combustibles(nombre),transmisiones(nombre),tracciones(nombre),estados_actuales(nombre),estados_inventario(nombre),vendedores(nombre),whatsapp_grupos(nombre),apoderados(nombre)&order=id.desc`;
        
        if (filters.limit) {
            endpoint += `&limit=${filters.limit}`;
        }
        if (filters.search) {
            endpoint += `&or=(placa.ilike.*${encodeURIComponent(filters.search)}*,vin.ilike.*${encodeURIComponent(filters.search)}*)`;
        }
        if (filters.marca_id) {
            endpoint += `&marca_id=eq.${filters.marca_id}`;
        }
        if (filters.estado_inventario_id) {
            endpoint += `&estado_inventario_id=eq.${filters.estado_inventario_id}`;
        }

        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    async getVehiculo(id) {
        const endpoint = `${API_ENDPOINTS.vehiculos}?select=*,marcas(nombre),modelos(nombre),arrendadoras(nombre),colores(nombre),carrocerias(nombre),combustibles(nombre),transmisiones(nombre),tracciones(nombre),estados_actuales(nombre),estados_inventario(nombre),vendedores(nombre),whatsapp_grupos(nombre),apoderados(nombre)&id=eq.${id}`;
        const result = await this.request(endpoint);
        return result.success ? result.data[0] : null;
    }

    async createVehiculo(data) {
        const result = await this.request(API_ENDPOINTS.vehiculos, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (result.success) {
            this.clearCache('vehiculos');
        }
        return result;
    }

    async updateVehiculo(id, data) {
        const result = await this.request(`${API_ENDPOINTS.vehiculos}?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
        if (result.success) {
            this.clearCache('vehiculos');
        }
        return result;
    }

    async deleteVehiculo(id) {
        const result = await this.request(`${API_ENDPOINTS.vehiculos}?id=eq.${id}`, {
            method: 'DELETE'
        });
        if (result.success) {
            this.clearCache('vehiculos');
        }
        return result;
    }

    // ===== MÉTODOS DE COLABORADORES =====
    async getColaboradores(filters = {}) {
        const cacheKey = this.getCacheKey('colaboradores', filters);
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        let endpoint = `${API_ENDPOINTS.colaboradores}?select=*&order=nombre.asc`;
        
        if (filters.activo !== undefined) {
            endpoint += `&activo=eq.${filters.activo}`;
        }
        if (filters.search) {
            endpoint += `&nombre.ilike.*${encodeURIComponent(filters.search)}*`;
        }

        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    async createColaborador(data) {
        const result = await this.request(API_ENDPOINTS.colaboradores, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (result.success) {
            this.clearCache('colaboradores');
        }
        return result;
    }

    async updateColaborador(id, data) {
        const result = await this.request(`${API_ENDPOINTS.colaboradores}?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
        if (result.success) {
            this.clearCache('colaboradores');
        }
        return result;
    }

    async deleteColaborador(id) {
        const result = await this.request(`${API_ENDPOINTS.colaboradores}?id=eq.${id}`, {
            method: 'DELETE'
        });
        if (result.success) {
            this.clearCache('colaboradores');
        }
        return result;
    }

    // ===== MÉTODOS DE TAREAS =====
    async getTareas(filters = {}) {
        const cacheKey = this.getCacheKey('tareas', filters);
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        let endpoint = `${API_ENDPOINTS.tareas}?select=*,vehiculos(placa,marcas(nombre),modelos(nombre)),colaboradores(nombre)&order=id.desc`;
        
        if (filters.limit) {
            endpoint += `&limit=${filters.limit}`;
        }
        if (filters.estado) {
            endpoint += `&estado=eq.${filters.estado}`;
        }
        if (filters.responsable_id) {
            endpoint += `&responsable_id=eq.${filters.responsable_id}`;
        }

        const result = await this.request(endpoint);
        if (result.success) {
            this.setCache(cacheKey, result);
        }
        return result;
    }

    async createTarea(data) {
        const result = await this.request(API_ENDPOINTS.tareas, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (result.success) {
            this.clearCache('tareas');
        }
        return result;
    }

    async updateTarea(id, data) {
        const result = await this.request(`${API_ENDPOINTS.tareas}?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
        if (result.success) {
            this.clearCache('tareas');
        }
        return result;
    }

    async deleteTarea(id) {
        const result = await this.request(`${API_ENDPOINTS.tareas}?id=eq.${id}`, {
            method: 'DELETE'
        });
        if (result.success) {
            this.clearCache('tareas');
        }
        return result;
    }

    // ===== MÉTODOS DE UTILIDAD =====
    formatCurrency(amount) {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC'
        }).format(amount);
    }

    formatDate(date) {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('es-CR');
    }

    formatDateTime(date) {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('es-CR');
    }

    getStatusBadgeClass(estado) {
        const statusClasses = {
            'disponible': 'bg-success',
            'reservado': 'bg-warning',
            'en_uso': 'bg-info',
            'mantenimiento': 'bg-secondary',
            'fuera_servicio': 'bg-danger',
            'pendiente': 'bg-secondary',
            'en_progreso': 'bg-warning',
            'completada': 'bg-success',
            'cancelada': 'bg-danger'
        };
        return statusClasses[estado] || 'bg-secondary';
    }

    getPriorityBadgeClass(prioridad) {
        const priorityClasses = {
            'baja': 'bg-secondary',
            'media': 'bg-info',
            'alta': 'bg-warning',
            'urgente': 'bg-danger'
        };
        return priorityClasses[prioridad] || 'bg-secondary';
    }

    // ===== MÉTODOS DE ESTADÍSTICAS =====
    async getEstadisticas() {
        try {
            const [vehiculosResp, tareasResp, colaboradoresResp] = await Promise.all([
                this.getVehiculos({ limit: 1000 }),
                this.getTareas({ limit: 1000 }),
                this.getColaboradores()
            ]);

            const vehiculos = vehiculosResp.success ? vehiculosResp.data : [];
            const tareas = tareasResp.success ? tareasResp.data : [];
            const colaboradores = colaboradoresResp.success ? colaboradoresResp.data : [];

            return {
                success: true,
                data: {
                totalVehiculos: vehiculos.length,
                    vehiculosDisponibles: vehiculos.filter(v => v.estados_inventario?.nombre === 'Disponible').length,
                totalTareas: tareas.length,
                    tareasPendientes: tareas.filter(t => t.estado === 'pendiente').length,
                    totalColaboradores: colaboradores.length,
                    colaboradoresActivos: colaboradores.filter(c => c.activo).length
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: {}
            };
        }
    }
}

// Crear instancia global
const api = new ApiService();
