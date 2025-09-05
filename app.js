// =====================================================
// APLICACIÓN PRINCIPAL - FLOTA v.3
// =====================================================

class FlotaApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.isLoading = false;
        this.modal = null;
        this.init();
    }

    // ===== INICIALIZACIÓN =====
    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.updateUI();
    }

    setupEventListeners() {
        // Navegación
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-section]')) {
                e.preventDefault();
                this.showSection(e.target.dataset.section);
            }
        });

        // Búsquedas
        document.addEventListener('input', this.debounce((e) => {
            if (e.target.matches('[data-search]')) {
                this.handleSearch(e.target);
            }
        }, APP_CONFIG.ui.debounceDelay));

        // Filtros
        document.addEventListener('change', (e) => {
            if (e.target.matches('[data-filter]')) {
                this.handleFilter(e.target);
            }
        });

        // Modales
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-modal]')) {
                e.preventDefault();
                this.openModal(e.target.dataset.modal);
            }
        });

        // Botones de acción
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action]')) {
                e.preventDefault();
                this.handleAction(e.target);
            }
        });
    }

    // ===== NAVEGACIÓN =====
    async showSection(sectionName) {
        if (this.currentSection === sectionName) return;

        this.currentSection = sectionName;
        this.updateNavigation();
        this.updateUI();

        try {
            await this.loadSectionData(sectionName);
        } catch (error) {
            console.error(`Error cargando sección ${sectionName}:`, error);
            this.showToast(MESSAGES.error.generic, 'error');
        }
    }

    updateNavigation() {
        // Actualizar botones de navegación
        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === this.currentSection);
        });

        // Actualizar título
        const titles = {
            dashboard: 'Dashboard',
            vehiculos: 'Vehículos',
            tareas: 'Tareas',
            colaboradores: 'Colaboradores',
            marcas: 'Marcas',
            modelos: 'Modelos',
            arrendadoras: 'Arrendadoras'
        };
        
        const titleElement = document.getElementById('page-title');
        if (titleElement) {
            titleElement.textContent = titles[this.currentSection] || 'Flota v.3';
        }
    }

    // ===== CARGA DE DATOS =====
    async loadInitialData() {
        try {
            this.setLoading(true);
            await this.loadDashboard();
        } catch (error) {
            console.error('Error cargando datos iniciales:', error);
            this.showToast(MESSAGES.error.connection, 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async loadSectionData(sectionName) {
        this.setLoading(true);
        
        try {
            switch (sectionName) {
                case 'dashboard':
                    await this.loadDashboard();
                    break;
                case 'vehiculos':
                    await this.loadVehiculos();
                    break;
                case 'tareas':
                    await this.loadTareas();
                    break;
                case 'colaboradores':
                    await this.loadColaboradores();
                    break;
                case 'marcas':
                    await this.loadMarcas();
                    break;
                case 'modelos':
                    await this.loadModelos();
                    break;
                case 'arrendadoras':
                    await this.loadArrendadoras();
                    break;
                default:
                    console.warn(`Sección desconocida: ${sectionName}`);
            }
        } catch (error) {
            console.error(`Error cargando sección ${sectionName}:`, error);
            this.showToast(MESSAGES.error.generic, 'error');
        } finally {
            this.setLoading(false);
        }
    }

    // ===== DASHBOARD =====
    async loadDashboard() {
        const container = document.getElementById('dashboard-content');
        if (!container) return;

        try {
            const stats = await api.getEstadisticas();
            
            if (stats.success) {
                container.innerHTML = this.renderDashboard(stats.data);
            } else {
                container.innerHTML = this.renderError('Error cargando estadísticas');
            }
        } catch (error) {
            console.error('Error cargando dashboard:', error);
            container.innerHTML = this.renderError('Error cargando dashboard');
        }
    }

    renderDashboard(stats) {
        return `
            <div class="row">
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="card bg-primary text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4 class="card-title">${stats.totalVehiculos}</h4>
                                    <p class="card-text">Total Vehículos</p>
                                </div>
                                <div class="align-self-center">
                                    <i class="fas fa-car fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="card bg-success text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4 class="card-title">${stats.vehiculosDisponibles}</h4>
                                    <p class="card-text">Disponibles</p>
                                </div>
                                <div class="align-self-center">
                                    <i class="fas fa-check-circle fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="card bg-warning text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4 class="card-title">${stats.totalTareas}</h4>
                                    <p class="card-text">Total Tareas</p>
                                </div>
                                <div class="align-self-center">
                                    <i class="fas fa-tasks fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="card bg-info text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4 class="card-title">${stats.colaboradoresActivos}</h4>
                                    <p class="card-text">Colaboradores Activos</p>
                                </div>
                                <div class="align-self-center">
                                    <i class="fas fa-users fa-2x"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Resumen de Actividad</h5>
                        </div>
                        <div class="card-body">
                            <p class="text-muted">Sistema de gestión de flota vehicular funcionando correctamente.</p>
                            <div class="row">
                                <div class="col-md-6">
                                    <h6>Tareas Pendientes</h6>
                                    <div class="progress mb-3">
                                        <div class="progress-bar bg-warning" style="width: ${(stats.tareasPendientes / Math.max(stats.totalTareas, 1)) * 100}%"></div>
                                    </div>
                                    <small class="text-muted">${stats.tareasPendientes} de ${stats.totalTareas} tareas</small>
                                </div>
                                <div class="col-md-6">
                                    <h6>Vehículos Disponibles</h6>
                                    <div class="progress mb-3">
                                        <div class="progress-bar bg-success" style="width: ${(stats.vehiculosDisponibles / Math.max(stats.totalVehiculos, 1)) * 100}%"></div>
                                    </div>
                                    <small class="text-muted">${stats.vehiculosDisponibles} de ${stats.totalVehiculos} vehículos</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== VEHÍCULOS =====
    async loadVehiculos() {
        const container = document.getElementById('vehiculos-content');
        if (!container) return;

        try {
            const vehiculosResp = await api.getVehiculos({ limit: 1000 });
            const vehiculos = vehiculosResp.success ? vehiculosResp.data : [];
            
            container.innerHTML = this.renderVehiculos(vehiculos);
        } catch (error) {
            console.error('Error cargando vehículos:', error);
            container.innerHTML = this.renderError('Error cargando vehículos');
        }
    }

    renderVehiculos(vehiculos) {
        if (vehiculos.length === 0) {
            return `
                <div class="text-center py-5">
                    <i class="fas fa-car fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No hay vehículos registrados</h5>
                    <button class="btn btn-primary" data-modal="vehiculo">
                        <i class="fas fa-plus"></i> Agregar Vehículo
                    </button>
                </div>
            `;
        }

        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="d-flex gap-2">
                    <input type="text" class="form-control" placeholder="Buscar vehículos..." data-search="vehiculos" style="width: 300px;">
                    <select class="form-select" data-filter="vehiculos-marca" style="width: 200px;">
                        <option value="">Todas las marcas</option>
                    </select>
                </div>
                <button class="btn btn-primary" data-modal="vehiculo">
                    <i class="fas fa-plus"></i> Agregar Vehículo
                </button>
            </div>
            
            <div class="row" id="vehiculos-grid">
                ${vehiculos.map(vehiculo => this.renderVehiculoCard(vehiculo)).join('')}
            </div>
        `;
    }

    renderVehiculoCard(vehiculo) {
        const estadoClass = api.getStatusBadgeClass(vehiculo.estados_inventario?.nombre);
        
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${this.escapeHtml(vehiculo.placa)}</h6>
                        <span class="badge ${estadoClass}">${vehiculo.estados_inventario?.nombre || 'Sin estado'}</span>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6">
                                <small class="text-muted">Marca</small>
                                <p class="mb-1">${this.escapeHtml(vehiculo.marcas?.nombre || 'Sin marca')}</p>
                            </div>
                            <div class="col-6">
                                <small class="text-muted">Modelo</small>
                                <p class="mb-1">${this.escapeHtml(vehiculo.modelos?.nombre || 'Sin modelo')}</p>
                            </div>
                            <div class="col-6">
                                <small class="text-muted">Año</small>
                                <p class="mb-1">${vehiculo.anio || 'N/A'}</p>
                            </div>
                            <div class="col-6">
                                <small class="text-muted">Color</small>
                                <p class="mb-1">${this.escapeHtml(vehiculo.colores?.nombre || 'Sin color')}</p>
                            </div>
                        </div>
                        ${vehiculo.precio_semanal ? `
                            <div class="mt-2">
                                <small class="text-muted">Precio Semanal</small>
                                <p class="mb-0 fw-bold text-success">${api.formatCurrency(vehiculo.precio_semanal)}</p>
                            </div>
                        ` : ''}
                    </div>
                    <div class="card-footer">
                        <div class="btn-group w-100" role="group">
                            <button class="btn btn-sm btn-outline-primary" data-action="edit-vehiculo" data-id="${vehiculo.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-info" data-action="view-vehiculo" data-id="${vehiculo.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" data-action="delete-vehiculo" data-id="${vehiculo.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== TAREAS =====
    async loadTareas() {
        const container = document.getElementById('tareas-content');
        if (!container) return;

        try {
            const tareasResp = await api.getTareas({ limit: 1000 });
            const tareas = tareasResp.success ? tareasResp.data : [];
            
            container.innerHTML = this.renderTareas(tareas);
        } catch (error) {
            console.error('Error cargando tareas:', error);
            container.innerHTML = this.renderError('Error cargando tareas');
        }
    }

    renderTareas(tareas) {
        if (tareas.length === 0) {
            return `
                <div class="text-center py-5">
                    <i class="fas fa-tasks fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No hay tareas registradas</h5>
                    <button class="btn btn-primary" data-modal="tarea">
                        <i class="fas fa-plus"></i> Agregar Tarea
                    </button>
                </div>
            `;
        }

        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="d-flex gap-2">
                    <input type="text" class="form-control" placeholder="Buscar tareas..." data-search="tareas" style="width: 300px;">
                    <select class="form-select" data-filter="tareas-estado" style="width: 200px;">
                        <option value="">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en_progreso">En Progreso</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                </div>
                <button class="btn btn-primary" data-modal="tarea">
                    <i class="fas fa-plus"></i> Agregar Tarea
                </button>
            </div>
            
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Vehículo</th>
                            <th>Responsable</th>
                            <th>Estado</th>
                            <th>Prioridad</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tareas.map(tarea => this.renderTareaRow(tarea)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderTareaRow(tarea) {
        const estadoClass = api.getStatusBadgeClass(tarea.estado);
        const prioridadClass = api.getPriorityBadgeClass(tarea.prioridad);
        
        return `
            <tr>
                <td>#${tarea.id}</td>
                <td>${this.escapeHtml(tarea.titulo)}</td>
                <td>${this.escapeHtml(tarea.vehiculos?.placa || 'N/A')}</td>
                <td>${this.escapeHtml(tarea.colaboradores?.nombre || 'N/A')}</td>
                <td><span class="badge ${estadoClass}">${tarea.estado}</span></td>
                <td><span class="badge ${prioridadClass}">${tarea.prioridad}</span></td>
                <td>${api.formatDate(tarea.fecha_creacion)}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" data-action="edit-tarea" data-id="${tarea.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" data-action="delete-tarea" data-id="${tarea.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    // ===== COLABORADORES =====
    async loadColaboradores() {
        const container = document.getElementById('colaboradores-content');
        if (!container) return;

        try {
            const colaboradoresResp = await api.getColaboradores();
            const colaboradores = colaboradoresResp.success ? colaboradoresResp.data : [];
            
            container.innerHTML = this.renderColaboradores(colaboradores);
        } catch (error) {
            console.error('Error cargando colaboradores:', error);
            container.innerHTML = this.renderError('Error cargando colaboradores');
        }
    }

    renderColaboradores(colaboradores) {
        if (colaboradores.length === 0) {
            return `
                <div class="text-center py-5">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No hay colaboradores registrados</h5>
                    <button class="btn btn-primary" data-modal="colaborador">
                        <i class="fas fa-plus"></i> Agregar Colaborador
                    </button>
                </div>
            `;
        }

        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <input type="text" class="form-control" placeholder="Buscar colaboradores..." data-search="colaboradores" style="width: 300px;">
                <button class="btn btn-primary" data-modal="colaborador">
                    <i class="fas fa-plus"></i> Agregar Colaborador
                </button>
            </div>
            
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Identificación</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Puesto</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${colaboradores.map(colaborador => this.renderColaboradorRow(colaborador)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderColaboradorRow(colaborador) {
        const estadoClass = colaborador.activo ? 'bg-success' : 'bg-secondary';
        const estadoText = colaborador.activo ? 'Activo' : 'Inactivo';
        
        return `
            <tr>
                <td>#${colaborador.id}</td>
                <td>${this.escapeHtml(colaborador.nombre)}</td>
                <td>${this.escapeHtml(colaborador.identificacion)}</td>
                <td>${this.escapeHtml(colaborador.telefono || 'N/A')}</td>
                <td>${this.escapeHtml(colaborador.email || 'N/A')}</td>
                <td>${this.escapeHtml(colaborador.puesto || 'N/A')}</td>
                <td><span class="badge ${estadoClass}">${estadoText}</span></td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" data-action="edit-colaborador" data-id="${colaborador.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" data-action="delete-colaborador" data-id="${colaborador.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    // ===== MARCAS =====
    async loadMarcas() {
        const container = document.getElementById('marcas-content');
        if (!container) return;

        try {
            const marcasResp = await api.getMarcas();
            const marcas = marcasResp.success ? marcasResp.data : [];
            
            container.innerHTML = this.renderMarcas(marcas);
        } catch (error) {
            console.error('Error cargando marcas:', error);
            container.innerHTML = this.renderError('Error cargando marcas');
        }
    }

    renderMarcas(marcas) {
        if (marcas.length === 0) {
            return `
                <div class="text-center py-5">
                    <i class="fas fa-tags fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No hay marcas registradas</h5>
                    <button class="btn btn-primary" data-modal="marca">
                        <i class="fas fa-plus"></i> Agregar Marca
                    </button>
                </div>
            `;
        }

        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <input type="text" class="form-control" placeholder="Buscar marcas..." data-search="marcas" style="width: 300px;">
                <button class="btn btn-primary" data-modal="marca">
                    <i class="fas fa-plus"></i> Agregar Marca
                </button>
            </div>
            
            <div class="row" id="marcas-grid">
                ${marcas.map(marca => this.renderMarcaCard(marca)).join('')}
            </div>
        `;
    }

    renderMarcaCard(marca) {
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
                <div class="card">
                    <div class="card-body text-center">
                        <h5 class="card-title">${this.escapeHtml(marca.nombre)}</h5>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" data-action="edit-marca" data-id="${marca.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline-danger" data-action="delete-marca" data-id="${marca.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== MODELOS =====
    async loadModelos() {
        const container = document.getElementById('modelos-content');
        if (!container) return;

        try {
            const modelosResp = await api.getModelos();
            const modelos = modelosResp.success ? modelosResp.data : [];
            
            container.innerHTML = this.renderModelos(modelos);
        } catch (error) {
            console.error('Error cargando modelos:', error);
            container.innerHTML = this.renderError('Error cargando modelos');
        }
    }

    renderModelos(modelos) {
        if (modelos.length === 0) {
            return `
                <div class="text-center py-5">
                    <i class="fas fa-car fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No hay modelos registrados</h5>
                    <button class="btn btn-primary" data-modal="modelo">
                        <i class="fas fa-plus"></i> Agregar Modelo
                    </button>
                </div>
            `;
        }

        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="d-flex gap-2">
                    <input type="text" class="form-control" placeholder="Buscar modelos..." data-search="modelos" style="width: 300px;">
                    <select class="form-select" data-filter="modelos-marca" style="width: 200px;">
                        <option value="">Todas las marcas</option>
                    </select>
                </div>
                <button class="btn btn-primary" data-modal="modelo">
                    <i class="fas fa-plus"></i> Agregar Modelo
                </button>
            </div>
            
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Marca</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${modelos.map(modelo => this.renderModeloRow(modelo)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderModeloRow(modelo) {
        return `
            <tr>
                <td>#${modelo.id}</td>
                <td>${this.escapeHtml(modelo.nombre)}</td>
                <td>${this.escapeHtml(modelo.marcas?.nombre || 'N/A')}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" data-action="edit-modelo" data-id="${modelo.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" data-action="delete-modelo" data-id="${modelo.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    // ===== ARRENDADORAS =====
    async loadArrendadoras() {
        const container = document.getElementById('arrendadoras-content');
        if (!container) return;

        try {
            const arrendadorasResp = await api.getArrendadoras();
            const arrendadoras = arrendadorasResp.success ? arrendadorasResp.data : [];
            
            container.innerHTML = this.renderArrendadoras(arrendadoras);
        } catch (error) {
            console.error('Error cargando arrendadoras:', error);
            container.innerHTML = this.renderError('Error cargando arrendadoras');
        }
    }

    renderArrendadoras(arrendadoras) {
        if (arrendadoras.length === 0) {
            return `
                <div class="text-center py-5">
                    <i class="fas fa-building fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No hay arrendadoras registradas</h5>
                    <button class="btn btn-primary" data-modal="arrendadora">
                        <i class="fas fa-plus"></i> Agregar Arrendadora
                    </button>
                </div>
            `;
        }

        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <input type="text" class="form-control" placeholder="Buscar arrendadoras..." data-search="arrendadoras" style="width: 300px;">
                <button class="btn btn-primary" data-modal="arrendadora">
                    <i class="fas fa-plus"></i> Agregar Arrendadora
                </button>
            </div>
            
            <div class="row" id="arrendadoras-grid">
                ${arrendadoras.map(arrendadora => this.renderArrendadoraCard(arrendadora)).join('')}
            </div>
        `;
    }

    renderArrendadoraCard(arrendadora) {
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${this.escapeHtml(arrendadora.nombre)}</h5>
                        <p class="card-text">
                            <small class="text-muted">Identificación:</small><br>
                            ${this.escapeHtml(arrendadora.identificacion_juridica || 'N/A')}
                        </p>
                        ${arrendadora.apoderado ? `
                            <p class="card-text">
                                <small class="text-muted">Apoderado:</small><br>
                                ${this.escapeHtml(arrendadora.apoderado)}
                            </p>
                        ` : ''}
                    </div>
                    <div class="card-footer">
                        <div class="btn-group w-100">
                            <button class="btn btn-sm btn-outline-primary" data-action="edit-arrendadora" data-id="${arrendadora.id}">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-sm btn-outline-danger" data-action="delete-arrendadora" data-id="${arrendadora.id}">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== MODALES =====
    openModal(type, item = null) {
        // Implementar sistema de modales
        console.log(`Abriendo modal: ${type}`, item);
        this.showToast('Funcionalidad de modales en desarrollo', 'info');
    }

    // ===== ACCIONES =====
    async handleAction(element) {
        const action = element.dataset.action;
        const id = element.dataset.id;

        try {
            switch (action) {
                case 'edit-vehiculo':
                    this.openModal('vehiculo', { id });
                    break;
                case 'view-vehiculo':
                    this.viewVehiculo(id);
                    break;
                case 'delete-vehiculo':
                    await this.deleteVehiculo(id);
                    break;
                case 'edit-tarea':
                    this.openModal('tarea', { id });
                    break;
                case 'delete-tarea':
                    await this.deleteTarea(id);
                    break;
                case 'edit-colaborador':
                    this.openModal('colaborador', { id });
                    break;
                case 'delete-colaborador':
                    await this.deleteColaborador(id);
                    break;
                case 'edit-marca':
                    this.openModal('marca', { id });
                    break;
                case 'delete-marca':
                    await this.deleteMarca(id);
                    break;
                case 'edit-modelo':
                    this.openModal('modelo', { id });
                    break;
                case 'delete-modelo':
                    await this.deleteModelo(id);
                    break;
                case 'edit-arrendadora':
                    this.openModal('arrendadora', { id });
                    break;
                case 'delete-arrendadora':
                    await this.deleteArrendadora(id);
                    break;
                default:
                    console.warn(`Acción no implementada: ${action}`);
            }
        } catch (error) {
            console.error(`Error ejecutando acción ${action}:`, error);
            this.showToast(MESSAGES.error.generic, 'error');
        }
    }

    // ===== MÉTODOS DE ELIMINACIÓN =====
    async deleteVehiculo(id) {
        if (!await this.confirmDelete('este vehículo')) return;
        
        try {
            const result = await api.deleteVehiculo(id);
            if (result.success) {
                this.showToast(MESSAGES.success.deleted, 'success');
                await this.loadVehiculos();
            } else {
                this.showToast(MESSAGES.error.generic, 'error');
            }
        } catch (error) {
            console.error('Error eliminando vehículo:', error);
            this.showToast(MESSAGES.error.generic, 'error');
        }
    }

    async deleteTarea(id) {
        if (!await this.confirmDelete('esta tarea')) return;
        
        try {
            const result = await api.deleteTarea(id);
            if (result.success) {
                this.showToast(MESSAGES.success.deleted, 'success');
                await this.loadTareas();
            } else {
                this.showToast(MESSAGES.error.generic, 'error');
            }
        } catch (error) {
            console.error('Error eliminando tarea:', error);
            this.showToast(MESSAGES.error.generic, 'error');
        }
    }

    async deleteColaborador(id) {
        if (!await this.confirmDelete('este colaborador')) return;
        
        try {
            const result = await api.deleteColaborador(id);
            if (result.success) {
                this.showToast(MESSAGES.success.deleted, 'success');
                await this.loadColaboradores();
            } else {
                this.showToast(MESSAGES.error.generic, 'error');
            }
        } catch (error) {
            console.error('Error eliminando colaborador:', error);
            this.showToast(MESSAGES.error.generic, 'error');
        }
    }

    async deleteMarca(id) {
        if (!await this.confirmDelete('esta marca')) return;
        
        try {
            const result = await api.deleteMarca(id);
            if (result.success) {
                this.showToast(MESSAGES.success.deleted, 'success');
                await this.loadMarcas();
            } else {
                this.showToast(MESSAGES.error.generic, 'error');
            }
        } catch (error) {
            console.error('Error eliminando marca:', error);
            this.showToast(MESSAGES.error.generic, 'error');
        }
    }

    async deleteModelo(id) {
        if (!await this.confirmDelete('este modelo')) return;
        
        try {
            const result = await api.deleteModelo(id);
            if (result.success) {
                this.showToast(MESSAGES.success.deleted, 'success');
                await this.loadModelos();
            } else {
                this.showToast(MESSAGES.error.generic, 'error');
            }
        } catch (error) {
            console.error('Error eliminando modelo:', error);
            this.showToast(MESSAGES.error.generic, 'error');
        }
    }

    async deleteArrendadora(id) {
        if (!await this.confirmDelete('esta arrendadora')) return;
        
        try {
            const result = await api.deleteArrendadora(id);
            if (result.success) {
                this.showToast(MESSAGES.success.deleted, 'success');
                await this.loadArrendadoras();
            } else {
                this.showToast(MESSAGES.error.generic, 'error');
            }
        } catch (error) {
            console.error('Error eliminando arrendadora:', error);
            this.showToast(MESSAGES.error.generic, 'error');
        }
    }

    // ===== UTILIDADES =====
    async confirmDelete(itemType) {
        return new Promise((resolve) => {
            const confirmed = confirm(`¿Estás seguro de que quieres eliminar ${itemType}?`);
            resolve(confirmed);
        });
    }

    setLoading(loading) {
        this.isLoading = loading;
        const loader = document.getElementById('loading-overlay');
        if (loader) {
            loader.style.display = loading ? 'flex' : 'none';
        }
    }

    showToast(message, type = 'info') {
        // Implementar sistema de toasts
        console.log(`Toast [${type}]: ${message}`);
        
        // Toast simple con alert por ahora
        if (type === 'error') {
            alert(`❌ ${message}`);
        } else if (type === 'success') {
            alert(`✅ ${message}`);
        } else {
            alert(`ℹ️ ${message}`);
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    renderError(message) {
        return `
            <div class="text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h5 class="text-danger">Error</h5>
                <p class="text-muted">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-refresh"></i> Recargar
                </button>
            </div>
        `;
    }

    updateUI() {
        // Mostrar/ocultar secciones
        document.querySelectorAll('[data-section-content]').forEach(section => {
            section.style.display = section.dataset.sectionContent === this.currentSection ? 'block' : 'none';
        });
    }

    handleSearch(element) {
        const searchTerm = element.value.toLowerCase();
        const target = element.dataset.search;
        
        // Implementar búsqueda
        console.log(`Buscando en ${target}: ${searchTerm}`);
    }

    handleFilter(element) {
        const filterValue = element.value;
        const target = element.dataset.filter;
        
        // Implementar filtros
        console.log(`Filtrando ${target}: ${filterValue}`);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    viewVehiculo(id) {
        // Implementar vista de vehículo
        console.log(`Viendo vehículo: ${id}`);
        this.showToast('Funcionalidad de vista de vehículo en desarrollo', 'info');
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FlotaApp();
});
