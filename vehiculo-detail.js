// =====================================================
// VEHÍCULO DETAIL - CRUD COMPLETO
// =====================================================

class VehiculoDetail {
    constructor() {
        this.vehicleId = null;
        this.currentVehicle = null;
        this.isEditMode = false;
        this.originalData = null;
        this.catalogData = {};
        this.init();
    }

    // ===== INICIALIZACIÓN =====
    init() {
        this.getVehicleIdFromURL();
        this.setupEventListeners();
        this.loadVehicleData();
    }

    getVehicleIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        this.vehicleId = urlParams.get('id');
        
        if (!this.vehicleId) {
            this.showError('ID de vehículo no proporcionado');
            return;
        }
    }

    setupEventListeners() {
        // Event listeners para cambios en selects
        document.addEventListener('change', (e) => {
            if (e.target.matches('[data-cascade]')) {
                this.handleCascadeChange(e.target);
            }
        });

        // Event listeners para validación en tiempo real
        document.addEventListener('input', (e) => {
            if (e.target.matches('[data-validate]')) {
                this.validateField(e.target);
            }
        });
    }

    // ===== CARGA DE DATOS =====
    async loadVehicleData() {
        try {
            this.setLoading(true);
            
            // Cargar datos del vehículo y catálogos en paralelo
            const [vehicle, catalogs] = await Promise.all([
                this.loadVehicle(),
                this.loadCatalogs()
            ]);

            if (vehicle) {
                this.currentVehicle = vehicle;
                this.originalData = JSON.parse(JSON.stringify(vehicle));
                this.renderVehicleDetail();
                this.updatePageTitle();
            }

        } catch (error) {
            console.error('Error cargando datos del vehículo:', error);
            this.showError('Error cargando datos del vehículo');
        } finally {
            this.setLoading(false);
        }
    }

    async refreshVehicleData() {
        // Método específico para refrescar solo los datos del vehículo
        try {
            const vehicle = await this.loadVehicle();
            if (vehicle) {
                this.currentVehicle = vehicle;
                this.originalData = JSON.parse(JSON.stringify(vehicle));
                this.renderVehicleDetail();
                this.updatePageTitle();
            }
        } catch (error) {
            console.error('Error refrescando datos del vehículo:', error);
        }
    }

    async loadVehicle() {
        try {
            const vehicle = await api.getVehiculo(this.vehicleId);
            if (!vehicle) {
                this.showError('Vehículo no encontrado');
                return null;
            }
            return vehicle;
        } catch (error) {
            console.error('Error cargando vehículo:', error);
            throw error;
        }
    }

    async loadCatalogs() {
        try {
            const [
                marcasResp,
                modelosResp,
                arrendadorasResp,
                coloresResp,
                carroceriasResp,
                combustiblesResp,
                transmisionesResp,
                traccionesResp,
                estadosActualesResp,
                estadosInventarioResp,
                vendedoresResp,
                whatsappGruposResp
            ] = await Promise.all([
                api.getMarcas(),
                api.getModelos(),
                api.getArrendadoras(),
                api.getColores(),
                api.getCarrocerias(),
                api.getCombustibles(),
                api.getTransmisiones(),
                api.getTracciones(),
                api.getEstadosActuales(),
                api.getEstadosInventario(),
                api.getVendedores(),
                api.getWhatsappGrupos()
            ]);

            this.catalogData = {
                marcas: marcasResp.success ? marcasResp.data : [],
                modelos: modelosResp.success ? modelosResp.data : [],
                arrendadoras: arrendadorasResp.success ? arrendadorasResp.data : [],
                colores: coloresResp.success ? coloresResp.data : [],
                carrocerias: carroceriasResp.success ? carroceriasResp.data : [],
                combustibles: combustiblesResp.success ? combustiblesResp.data : [],
                transmisiones: transmisionesResp.success ? transmisionesResp.data : [],
                tracciones: traccionesResp.success ? traccionesResp.data : [],
                estadosActuales: estadosActualesResp.success ? estadosActualesResp.data : [],
                estadosInventario: estadosInventarioResp.success ? estadosInventarioResp.data : [],
                vendedores: vendedoresResp.success ? vendedoresResp.data : [],
                whatsappGrupos: whatsappGruposResp.success ? whatsappGruposResp.data : []
            };

        } catch (error) {
            console.error('Error cargando catálogos:', error);
            throw error;
        }
    }

    // ===== RENDERIZADO =====
    renderVehicleDetail() {
        const container = document.getElementById('vehicle-content');
        if (!container || !this.currentVehicle) return;

        container.innerHTML = `
            <div class="row">
                <!-- Información Básica -->
                <div class="col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="mb-0">
                                <i class="fas fa-info-circle me-2"></i>
                                Información Básica
                            </h5>
                        </div>
                        <div class="card-body">
                            ${this.renderBasicInfo()}
                        </div>
                    </div>
                </div>

                <!-- Información Técnica -->
                <div class="col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="mb-0">
                                <i class="fas fa-cogs me-2"></i>
                                Información Técnica
                            </h5>
                        </div>
                        <div class="card-body">
                            ${this.renderTechnicalInfo()}
                        </div>
                    </div>
                </div>

                <!-- Información Financiera -->
                <div class="col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="mb-0">
                                <i class="fas fa-dollar-sign me-2"></i>
                                Información Financiera
                            </h5>
                        </div>
                        <div class="card-body">
                            ${this.renderFinancialInfo()}
                        </div>
                    </div>
                </div>

                <!-- Información del Cliente y Contactos -->
                <div class="col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="mb-0">
                                <i class="fas fa-users me-2"></i>
                                Cliente y Contactos
                            </h5>
                        </div>
                        <div class="card-body">
                            ${this.renderClientInfo()}
                        </div>
                    </div>
                </div>

                <!-- Estado y Ubicación -->
                <div class="col-12 mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">
                                <i class="fas fa-map-marker-alt me-2"></i>
                                Estado y Ubicación
                            </h5>
                        </div>
                        <div class="card-body">
                            ${this.renderStatusInfo()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderBasicInfo() {
        const v = this.currentVehicle;
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Placa</label>
                    <div class="display-value" data-field="placa">${this.escapeHtml(v.placa || 'N/A')}</div>
                    <input type="text" class="form-control d-none" name="placa" value="${this.escapeHtml(v.placa || '')}" data-validate="required">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">VIN</label>
                    <div class="display-value" data-field="vin">${this.escapeHtml(v.vin || 'N/A')}</div>
                    <input type="text" class="form-control d-none" name="vin" value="${this.escapeHtml(v.vin || '')}">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Marca</label>
                    <div class="display-value" data-field="marca">${this.escapeHtml(v.marcas?.nombre || 'N/A')}</div>
                    <select class="form-select d-none" name="marca_id" data-cascade="modelos">
                        <option value="">Seleccionar marca</option>
                        ${this.catalogData.marcas.map(marca => 
                            `<option value="${marca.id}" ${v.marca_id == marca.id ? 'selected' : ''}>${this.escapeHtml(marca.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Modelo</label>
                    <div class="display-value" data-field="modelo">${this.escapeHtml(v.modelos?.nombre || 'N/A')}</div>
                    <select class="form-select d-none" name="modelo_id">
                        <option value="">Seleccionar modelo</option>
                        ${this.getModelosForMarca(v.marca_id).map(modelo => 
                            `<option value="${modelo.id}" ${v.modelo_id == modelo.id ? 'selected' : ''}>${this.escapeHtml(modelo.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Año</label>
                    <div class="display-value" data-field="anio">${v.anio || 'N/A'}</div>
                    <input type="number" class="form-control d-none" name="anio" value="${v.anio || ''}" 
                           min="1900" max="${new Date().getFullYear() + 1}" data-validate="required,number">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Color</label>
                    <div class="display-value" data-field="color">${this.escapeHtml(v.colores?.nombre || 'N/A')}</div>
                    <select class="form-select d-none" name="color_id">
                        <option value="">Seleccionar color</option>
                        ${this.catalogData.colores.map(color => 
                            `<option value="${color.id}" ${v.color_id == color.id ? 'selected' : ''}>${this.escapeHtml(color.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        `;
    }

    renderTechnicalInfo() {
        const v = this.currentVehicle;
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Carrocería</label>
                    <div class="display-value" data-field="carroceria">${this.escapeHtml(v.carrocerias?.nombre || 'N/A')}</div>
                    <select class="form-select d-none" name="carroceria_id">
                        <option value="">Seleccionar carrocería</option>
                        ${this.catalogData.carrocerias.map(carroceria => 
                            `<option value="${carroceria.id}" ${v.carroceria_id == carroceria.id ? 'selected' : ''}>${this.escapeHtml(carroceria.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Cilindrada (cc)</label>
                    <div class="display-value" data-field="cilindrada">${v.cilindrada_cc || 'N/A'}</div>
                    <input type="number" class="form-control d-none" name="cilindrada_cc" value="${v.cilindrada_cc || ''}" min="0">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Cilindros</label>
                    <div class="display-value" data-field="cilindros">${v.cilindros || 'N/A'}</div>
                    <input type="number" class="form-control d-none" name="cilindros" value="${v.cilindros || ''}" min="1" max="16">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Combustible</label>
                    <div class="display-value" data-field="combustible">${this.escapeHtml(v.combustibles?.nombre || 'N/A')}</div>
                    <select class="form-select d-none" name="combustible_id">
                        <option value="">Seleccionar combustible</option>
                        ${this.catalogData.combustibles.map(combustible => 
                            `<option value="${combustible.id}" ${v.combustible_id == combustible.id ? 'selected' : ''}>${this.escapeHtml(combustible.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Transmisión</label>
                    <div class="display-value" data-field="transmision">${this.escapeHtml(v.transmisiones?.nombre || 'N/A')}</div>
                    <select class="form-select d-none" name="transmision_id">
                        <option value="">Seleccionar transmisión</option>
                        ${this.catalogData.transmisiones.map(transmision => 
                            `<option value="${transmision.id}" ${v.transmision_id == transmision.id ? 'selected' : ''}>${this.escapeHtml(transmision.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Tracción</label>
                    <div class="display-value" data-field="traccion">${this.escapeHtml(v.tracciones?.nombre || 'N/A')}</div>
                    <select class="form-select d-none" name="traccion_id">
                        <option value="">Seleccionar tracción</option>
                        ${this.catalogData.tracciones.map(traccion => 
                            `<option value="${traccion.id}" ${v.traccion_id == traccion.id ? 'selected' : ''}>${this.escapeHtml(traccion.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        `;
    }

    renderFinancialInfo() {
        const v = this.currentVehicle;
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Precio Semanal</label>
                    <div class="display-value" data-field="precio_semanal">${v.precio_semanal ? api.formatCurrency(v.precio_semanal) : 'N/A'}</div>
                    <input type="number" class="form-control d-none" name="precio_semanal" value="${v.precio_semanal || ''}" min="0" step="0.01">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Plazo (semanas)</label>
                    <div class="display-value" data-field="plazo_semanas">${v.plazo_semanas || 'N/A'}</div>
                    <input type="number" class="form-control d-none" name="plazo_semanas" value="${v.plazo_semanas || ''}" min="1">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Gastos Administrativos</label>
                    <div class="display-value" data-field="gastos_adms">${v.gastos_adms ? api.formatCurrency(v.gastos_adms) : 'N/A'}</div>
                    <input type="number" class="form-control d-none" name="gastos_adms" value="${v.gastos_adms || ''}" min="0" step="0.01">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Valor de Adquisición</label>
                    <div class="display-value" data-field="valor_adquisicion">${v.valor_adquisicion ? api.formatCurrency(v.valor_adquisicion) : 'N/A'}</div>
                    <input type="number" class="form-control d-none" name="valor_adquisicion" value="${v.valor_adquisicion || ''}" min="0" step="0.01">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Fecha de Adquisición</label>
                    <div class="display-value" data-field="fecha_adquisicion">${v.fecha_adquisicion ? api.formatDate(v.fecha_adquisicion) : 'N/A'}</div>
                    <input type="date" class="form-control d-none" name="fecha_adquisicion" value="${v.fecha_adquisicion || ''}">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Renta Semanal</label>
                    <div class="display-value" data-field="renta_semanal">${v.renta_semanal ? api.formatCurrency(v.renta_semanal) : 'N/A'}</div>
                    <input type="number" class="form-control d-none" name="renta_semanal" value="${v.renta_semanal || ''}" min="0" step="0.01">
                </div>
            </div>
        `;
    }

    renderClientInfo() {
        const v = this.currentVehicle;
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Arrendadora</label>
                    <div class="display-value" data-field="arrendadora">${this.escapeHtml(v.arrendadoras?.nombre || 'N/A')}</div>
                    <select class="form-select d-none" name="arrendadora_id" data-cascade="apoderados">
                        <option value="">Seleccionar arrendadora</option>
                        ${this.catalogData.arrendadoras.map(arrendadora => 
                            `<option value="${arrendadora.id}" ${v.arrendadora_id == arrendadora.id ? 'selected' : ''}>${this.escapeHtml(arrendadora.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Identificación Jurídica</label>
                    <div class="display-value" data-field="identificacion_juridica">${this.escapeHtml(v.arrendadoras?.identificacion_juridica || 'N/A')}</div>
                    <input type="text" class="form-control d-none" name="identificacion_juridica" value="${v.arrendadoras?.identificacion_juridica || ''}" readonly>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Apoderado (Directo)</label>
                    <div class="display-value" data-field="apoderado_directo">${this.escapeHtml(v.arrendadoras?.apoderado || 'N/A')}</div>
                    <input type="text" class="form-control d-none" name="apoderado_directo" value="${v.arrendadoras?.apoderado || ''}" readonly>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Cédula Apoderado</label>
                    <div class="display-value" data-field="cedula_apoderado">${this.escapeHtml(v.arrendadoras?.cedula_apoderado || 'N/A')}</div>
                    <input type="text" class="form-control d-none" name="cedula_apoderado" value="${v.arrendadoras?.cedula_apoderado || ''}" readonly>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Apoderado (Relacionado)</label>
                    <div class="display-value" data-field="apoderado">${this.escapeHtml(v.apoderados?.nombre || 'N/A')}</div>
                    <select class="form-select d-none" name="apoderado_id">
                        <option value="">Seleccionar apoderado</option>
                        ${this.getApoderadosForArrendadora(v.arrendadora_id).map(apoderado => 
                            `<option value="${apoderado.id}" ${v.apoderado_id == apoderado.id ? 'selected' : ''}>${this.escapeHtml(apoderado.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Identificación Apoderado</label>
                    <div class="display-value" data-field="identificacion_apoderado">${this.escapeHtml(v.apoderados?.identificacion || 'N/A')}</div>
                    <input type="text" class="form-control d-none" name="identificacion_apoderado" value="${v.apoderados?.identificacion || ''}" readonly>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Vendedor</label>
                    <div class="display-value" data-field="vendedor">${this.escapeHtml(v.vendedores?.nombre || 'N/A')}</div>
                    <select class="form-select d-none" name="vendedor_id">
                        <option value="">Seleccionar vendedor</option>
                        ${this.catalogData.vendedores.map(vendedor => 
                            `<option value="${vendedor.id}" ${v.vendedor_id == vendedor.id ? 'selected' : ''}>${this.escapeHtml(vendedor.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Grupo WhatsApp</label>
                    <div class="display-value" data-field="whatsapp_grupo">${this.escapeHtml(v.whatsapp_grupos?.nombre || 'N/A')}</div>
                    <select class="form-select d-none" name="whatsapp_grupo_id">
                        <option value="">Seleccionar grupo</option>
                        ${this.catalogData.whatsappGrupos.map(grupo => 
                            `<option value="${grupo.id}" ${v.whatsapp_grupo_id == grupo.id ? 'selected' : ''}>${this.escapeHtml(grupo.nombre || grupo.group_id)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Cliente Actual</label>
                    <div class="display-value" data-field="cliente_actual">${this.escapeHtml(v.cliente_actual || 'N/A')}</div>
                    <input type="text" class="form-control d-none" name="cliente_actual" value="${this.escapeHtml(v.cliente_actual || '')}">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Grupo WhatsApp (Texto)</label>
                    <div class="display-value" data-field="grupo_whatsapp">${this.escapeHtml(v.grupo_whatsapp || 'N/A')}</div>
                    <input type="text" class="form-control d-none" name="grupo_whatsapp" value="${this.escapeHtml(v.grupo_whatsapp || '')}">
                </div>
            </div>
        `;
    }

    renderStatusInfo() {
        const v = this.currentVehicle;
        return `
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label">Estado Actual</label>
                    <div class="display-value" data-field="estado_actual">
                        ${v.estados_actuales?.nombre ? 
                            `<span class="badge ${api.getStatusBadgeClass(v.estados_actuales.nombre)}">${this.escapeHtml(v.estados_actuales.nombre)}</span>` : 
                            'N/A'
                        }
                    </div>
                    <select class="form-select d-none" name="estado_actual_id">
                        <option value="">Seleccionar estado</option>
                        ${this.catalogData.estadosActuales.map(estado => 
                            `<option value="${estado.id}" ${v.estado_actual_id == estado.id ? 'selected' : ''}>${this.escapeHtml(estado.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Estado de Inventario</label>
                    <div class="display-value" data-field="estado_inventario">
                        ${v.estados_inventario?.nombre ? 
                            `<span class="badge ${api.getStatusBadgeClass(v.estados_inventario.nombre)}">${this.escapeHtml(v.estados_inventario.nombre)}</span>` : 
                            'N/A'
                        }
                    </div>
                    <select class="form-select d-none" name="estado_inventario_id">
                        <option value="">Seleccionar estado</option>
                        ${this.catalogData.estadosInventario.map(estado => 
                            `<option value="${estado.id}" ${v.estado_inventario_id == estado.id ? 'selected' : ''}>${this.escapeHtml(estado.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Estatus</label>
                    <div class="display-value" data-field="estatus">${this.escapeHtml(v.estatus || 'N/A')}</div>
                    <input type="text" class="form-control d-none" name="estatus" value="${this.escapeHtml(v.estatus || '')}">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Ubicación</label>
                    <div class="display-value" data-field="ubicacion">${this.escapeHtml(v.ubicacion || 'N/A')}</div>
                    <input type="text" class="form-control d-none" name="ubicacion" value="${this.escapeHtml(v.ubicacion || '')}">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Link de Fotos</label>
                    <div class="display-value" data-field="link_fotos">
                        ${v.link_fotos ? 
                            `<a href="${this.escapeHtml(v.link_fotos)}" target="_blank" class="btn btn-sm btn-outline-primary">
                                <i class="fas fa-external-link-alt"></i> Ver Fotos
                            </a>` : 
                            'N/A'
                        }
                    </div>
                    <input type="url" class="form-control d-none" name="link_fotos" value="${this.escapeHtml(v.link_fotos || '')}" placeholder="https://...">
                </div>
            </div>
        `;
    }

    // ===== MÉTODOS DE UTILIDAD =====
    getModelosForMarca(marcaId) {
        if (!marcaId) return [];
        return this.catalogData.modelos.filter(modelo => modelo.marca_id == marcaId);
    }

    getApoderadosForArrendadora(arrendadoraId) {
        if (!arrendadoraId) return [];
        // Nota: Necesitarías cargar los apoderados desde la API
        return [];
    }

    // ===== MODO DE EDICIÓN =====
    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        
        if (this.isEditMode) {
            this.activateEditMode();
        } else {
            this.cancelEdit();
        }
    }

    activateEditMode() {
        // Mostrar campos de edición
        document.querySelectorAll('.display-value').forEach(el => el.classList.add('d-none'));
        document.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('d-none'));
        
        // Actualizar botones
        document.getElementById('edit-btn').style.display = 'none';
        document.getElementById('save-btn').style.display = 'inline-block';
        document.getElementById('cancel-btn').style.display = 'inline-block';
        
        this.isEditMode = true;
    }

    cancelEdit() {
        // Restaurar datos originales
        this.currentVehicle = JSON.parse(JSON.stringify(this.originalData));
        
        // Mostrar valores de visualización
        document.querySelectorAll('.display-value').forEach(el => el.classList.remove('d-none'));
        document.querySelectorAll('input, select, textarea').forEach(el => el.classList.add('d-none'));
        
        // Actualizar botones
        document.getElementById('edit-btn').style.display = 'inline-block';
        document.getElementById('save-btn').style.display = 'none';
        document.getElementById('cancel-btn').style.display = 'none';
        
        this.isEditMode = false;
        
        // Re-renderizar para mostrar datos originales
        this.renderVehicleDetail();
    }

    // ===== GUARDAR CAMBIOS =====
    async saveVehicle() {
        try {
            // Validar formulario
            if (!this.validateForm()) {
                this.showToast('Por favor corrige los errores en el formulario', 'error');
                return;
            }

            this.setLoading(true);

            // Recopilar datos del formulario
            const formData = this.collectFormData();

            // Actualizar vehículo
            const result = await api.updateVehiculo(this.vehicleId, formData);

            if (result.success) {
                this.showToast('Vehículo actualizado exitosamente', 'success');
                
                // Recargar datos del vehículo desde la API
                await this.refreshVehicleData();
                
                // Salir del modo de edición
                this.cancelEdit();
            } else {
                this.showToast('Error actualizando vehículo: ' + result.error, 'error');
            }

        } catch (error) {
            console.error('Error guardando vehículo:', error);
            this.showToast('Error guardando vehículo', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    collectFormData() {
        const formData = {};
        const form = document.querySelector('#vehicle-content');
        
        // Recopilar todos los campos del formulario
        form.querySelectorAll('input, select, textarea').forEach(field => {
            const name = field.name;
            if (name) {
                if (field.type === 'number') {
                    formData[name] = field.value ? parseFloat(field.value) : null;
                } else if (field.type === 'date') {
                    formData[name] = field.value || null;
                } else {
                    formData[name] = field.value || null;
                }
            }
        });

        return formData;
    }

    validateForm() {
        let isValid = true;
        
        // Validar campos requeridos
        document.querySelectorAll('[data-validate*="required"]').forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Este campo es requerido');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Validar números
        document.querySelectorAll('[data-validate*="number"]').forEach(field => {
            if (field.value && isNaN(field.value)) {
                this.showFieldError(field, 'Debe ser un número válido');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        return isValid;
    }

    validateField(field) {
        const validations = field.dataset.validate.split(',');
        
        validations.forEach(validation => {
            switch (validation.trim()) {
                case 'required':
                    if (!field.value.trim()) {
                        this.showFieldError(field, 'Este campo es requerido');
                    } else {
                        this.clearFieldError(field);
                    }
                    break;
                case 'number':
                    if (field.value && isNaN(field.value)) {
                        this.showFieldError(field, 'Debe ser un número válido');
                    } else {
                        this.clearFieldError(field);
                    }
                    break;
            }
        });
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.classList.add('is-invalid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // ===== CAMBIOS EN CASCADA =====
    async handleCascadeChange(select) {
        const cascadeType = select.dataset.cascade;
        const selectedValue = select.value;

        switch (cascadeType) {
            case 'modelos':
                await this.updateModelosSelect(selectedValue);
                break;
            case 'apoderados':
                await this.updateApoderadosSelect(selectedValue);
                break;
        }
    }

    async updateModelosSelect(marcaId) {
        const modeloSelect = document.querySelector('select[name="modelo_id"]');
        if (!modeloSelect) return;

        // Limpiar opciones actuales
        modeloSelect.innerHTML = '<option value="">Seleccionar modelo</option>';

        if (marcaId) {
            try {
                const modelosResp = await api.getModelos({ marca_id: marcaId });
                if (modelosResp.success) {
                    modelosResp.data.forEach(modelo => {
                        const option = document.createElement('option');
                        option.value = modelo.id;
                        option.textContent = modelo.nombre;
                        modeloSelect.appendChild(option);
                    });
                }
            } catch (error) {
                console.error('Error cargando modelos:', error);
            }
        }
    }

    async updateApoderadosSelect(arrendadoraId) {
        const apoderadoSelect = document.querySelector('select[name="apoderado_id"]');
        if (!apoderadoSelect) return;

        // Limpiar opciones actuales
        apoderadoSelect.innerHTML = '<option value="">Seleccionar apoderado</option>';

        if (arrendadoraId) {
            try {
                const apoderadosResp = await api.getApoderados({ arrendadora_id: arrendadoraId });
                if (apoderadosResp.success) {
                    apoderadosResp.data.forEach(apoderado => {
                        const option = document.createElement('option');
                        option.value = apoderado.id;
                        option.textContent = apoderado.nombre;
                        apoderadoSelect.appendChild(option);
                    });
                }
            } catch (error) {
                console.error('Error cargando apoderados:', error);
            }
        }
    }

    // ===== ELIMINAR VEHÍCULO =====
    async deleteVehicle() {
        if (!confirm('¿Estás seguro de que quieres eliminar este vehículo? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            this.setLoading(true);

            const result = await api.deleteVehiculo(this.vehicleId);

            if (result.success) {
                this.showToast('Vehículo eliminado exitosamente', 'success');
                
                // Redirigir a la lista de vehículos
                setTimeout(() => {
                    window.location.href = 'index.html?section=vehiculos';
                }, 1500);
            } else {
                this.showToast('Error eliminando vehículo: ' + result.error, 'error');
            }

        } catch (error) {
            console.error('Error eliminando vehículo:', error);
            this.showToast('Error eliminando vehículo', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    // ===== UTILIDADES =====
    updatePageTitle() {
        const titleElement = document.getElementById('page-title');
        const placaElement = document.getElementById('vehicle-placa');
        
        if (this.currentVehicle) {
            const title = `${this.currentVehicle.placa} - ${this.currentVehicle.marcas?.nombre || 'Sin marca'} ${this.currentVehicle.modelos?.nombre || 'Sin modelo'}`;
            if (titleElement) titleElement.textContent = title;
            if (placaElement) placaElement.textContent = this.currentVehicle.placa;
        }
    }

    setLoading(loading) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = loading ? 'flex' : 'none';
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <i class="fas fa-${this.getToastIcon(type)} text-${this.getToastColor(type)} me-2"></i>
                    <strong class="me-auto">Flota v.3</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${this.escapeHtml(message)}
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);

        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 5000
        });
        toast.show();

        // Limpiar el toast del DOM después de que se oculte
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    getToastIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'times-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getToastColor(type) {
        const colors = {
            'success': 'success',
            'error': 'danger',
            'warning': 'warning',
            'info': 'primary'
        };
        return colors[type] || 'primary';
    }

    showError(message) {
        const container = document.getElementById('vehicle-content');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h5 class="text-danger">Error</h5>
                    <p class="text-muted">${this.escapeHtml(message)}</p>
                    <a href="index.html?section=vehiculos" class="btn btn-primary">
                        <i class="fas fa-arrow-left"></i> Volver a Vehículos
                    </a>
                </div>
            `;
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.vehiculoDetail = new VehiculoDetail();
});

// Funciones globales para los botones
function toggleEditMode() {
    if (window.vehiculoDetail) {
        window.vehiculoDetail.toggleEditMode();
    }
}

function saveVehicle() {
    if (window.vehiculoDetail) {
        window.vehiculoDetail.saveVehicle();
    }
}

function cancelEdit() {
    if (window.vehiculoDetail) {
        window.vehiculoDetail.cancelEdit();
    }
}

function deleteVehicle() {
    if (window.vehiculoDetail) {
        window.vehiculoDetail.deleteVehicle();
    }
}
