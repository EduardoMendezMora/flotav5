// =====================================================
// MODAL DE VEHÍCULOS - CRUD COMPLETO
// =====================================================

class VehiculoModal {
    constructor() {
        this.modal = null;
        this.catalogData = {};
        this.isEditMode = false;
        this.currentVehicleId = null;
    }

    // ===== MOSTRAR MODAL =====
    async showModal(vehicleId = null) {
        this.isEditMode = !!vehicleId;
        this.currentVehicleId = vehicleId;

        try {
            // Cargar catálogos
            await this.loadCatalogs();

            // Crear modal
            this.createModal();

            // Mostrar modal
            this.modal = new bootstrap.Modal(document.getElementById('vehiculo-modal'));
            this.modal.show();

            // Si es modo edición, cargar datos del vehículo
            if (this.isEditMode) {
                await this.loadVehicleData();
            }

            // Configurar event listeners
            this.setupEventListeners();

        } catch (error) {
            console.error('Error mostrando modal de vehículo:', error);
            this.showToast('Error cargando modal de vehículo', 'error');
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

    async loadVehicleData() {
        try {
            const vehicle = await api.getVehiculo(this.currentVehicleId);
            if (vehicle) {
                this.populateForm(vehicle);
            }
        } catch (error) {
            console.error('Error cargando datos del vehículo:', error);
            throw error;
        }
    }

    // ===== CREAR MODAL =====
    createModal() {
        const modalHtml = `
            <div class="modal fade" id="vehiculo-modal" tabindex="-1" aria-labelledby="vehiculo-modal-label" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="vehiculo-modal-label">
                                <i class="fas fa-car me-2"></i>
                                ${this.isEditMode ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="vehiculo-form">
                                <div class="row">
                                    <!-- Información Básica -->
                                    <div class="col-lg-6 mb-4">
                                        <div class="card">
                                            <div class="card-header">
                                                <h6 class="mb-0">
                                                    <i class="fas fa-info-circle me-2"></i>
                                                    Información Básica
                                                </h6>
                                            </div>
                                            <div class="card-body">
                                                ${this.renderBasicInfoForm()}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Información Técnica -->
                                    <div class="col-lg-6 mb-4">
                                        <div class="card">
                                            <div class="card-header">
                                                <h6 class="mb-0">
                                                    <i class="fas fa-cogs me-2"></i>
                                                    Información Técnica
                                                </h6>
                                            </div>
                                            <div class="card-body">
                                                ${this.renderTechnicalInfoForm()}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Información Financiera -->
                                    <div class="col-lg-6 mb-4">
                                        <div class="card">
                                            <div class="card-header">
                                                <h6 class="mb-0">
                                                    <i class="fas fa-dollar-sign me-2"></i>
                                                    Información Financiera
                                                </h6>
                                            </div>
                                            <div class="card-body">
                                                ${this.renderFinancialInfoForm()}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Información del Cliente -->
                                    <div class="col-lg-6 mb-4">
                                        <div class="card">
                                            <div class="card-header">
                                                <h6 class="mb-0">
                                                    <i class="fas fa-users me-2"></i>
                                                    Cliente y Contactos
                                                </h6>
                                            </div>
                                            <div class="card-body">
                                                ${this.renderClientInfoForm()}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Estado y Ubicación -->
                                    <div class="col-12 mb-4">
                                        <div class="card">
                                            <div class="card-header">
                                                <h6 class="mb-0">
                                                    <i class="fas fa-map-marker-alt me-2"></i>
                                                    Estado y Ubicación
                                                </h6>
                                            </div>
                                            <div class="card-body">
                                                ${this.renderStatusInfoForm()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button type="button" class="btn btn-primary" onclick="vehiculoModal.saveVehicle()">
                                <i class="fas fa-save"></i> ${this.isEditMode ? 'Actualizar' : 'Crear'} Vehículo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remover modal existente si existe
        const existingModal = document.getElementById('vehiculo-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Agregar nuevo modal al body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    renderBasicInfoForm() {
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Placa <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" name="placa" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">VIN</label>
                    <input type="text" class="form-control" name="vin">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Marca <span class="text-danger">*</span></label>
                    <select class="form-select" name="marca_id" required data-cascade="modelos">
                        <option value="">Seleccionar marca</option>
                        ${this.catalogData.marcas.map(marca => 
                            `<option value="${marca.id}">${this.escapeHtml(marca.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Modelo <span class="text-danger">*</span></label>
                    <select class="form-select" name="modelo_id" required>
                        <option value="">Seleccionar modelo</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Año <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" name="anio" required 
                           min="1900" max="${new Date().getFullYear() + 1}">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Color</label>
                    <select class="form-select" name="color_id">
                        <option value="">Seleccionar color</option>
                        ${this.catalogData.colores.map(color => 
                            `<option value="${color.id}">${this.escapeHtml(color.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        `;
    }

    renderTechnicalInfoForm() {
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Carrocería</label>
                    <select class="form-select" name="carroceria_id">
                        <option value="">Seleccionar carrocería</option>
                        ${this.catalogData.carrocerias.map(carroceria => 
                            `<option value="${carroceria.id}">${this.escapeHtml(carroceria.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Cilindrada (cc)</label>
                    <input type="number" class="form-control" name="cilindrada_cc" min="0">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Cilindros</label>
                    <input type="number" class="form-control" name="cilindros" min="1" max="16">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Combustible</label>
                    <select class="form-select" name="combustible_id">
                        <option value="">Seleccionar combustible</option>
                        ${this.catalogData.combustibles.map(combustible => 
                            `<option value="${combustible.id}">${this.escapeHtml(combustible.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Transmisión</label>
                    <select class="form-select" name="transmision_id">
                        <option value="">Seleccionar transmisión</option>
                        ${this.catalogData.transmisiones.map(transmision => 
                            `<option value="${transmision.id}">${this.escapeHtml(transmision.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Tracción</label>
                    <select class="form-select" name="traccion_id">
                        <option value="">Seleccionar tracción</option>
                        ${this.catalogData.tracciones.map(traccion => 
                            `<option value="${traccion.id}">${this.escapeHtml(traccion.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        `;
    }

    renderFinancialInfoForm() {
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Precio Semanal</label>
                    <input type="number" class="form-control" name="precio_semanal" min="0" step="0.01">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Plazo (semanas)</label>
                    <input type="number" class="form-control" name="plazo_semanas" min="1">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Gastos Administrativos</label>
                    <input type="number" class="form-control" name="gastos_adms" min="0" step="0.01">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Valor de Adquisición</label>
                    <input type="number" class="form-control" name="valor_adquisicion" min="0" step="0.01">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Fecha de Adquisición</label>
                    <input type="date" class="form-control" name="fecha_adquisicion">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Renta Semanal</label>
                    <input type="number" class="form-control" name="renta_semanal" min="0" step="0.01">
                </div>
            </div>
        `;
    }

    renderClientInfoForm() {
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Arrendadora</label>
                    <select class="form-select" name="arrendadora_id" data-cascade="apoderados">
                        <option value="">Seleccionar arrendadora</option>
                        ${this.catalogData.arrendadoras.map(arrendadora => 
                            `<option value="${arrendadora.id}">${this.escapeHtml(arrendadora.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Apoderado</label>
                    <select class="form-select" name="apoderado_id">
                        <option value="">Seleccionar apoderado</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Vendedor</label>
                    <select class="form-select" name="vendedor_id">
                        <option value="">Seleccionar vendedor</option>
                        ${this.catalogData.vendedores.map(vendedor => 
                            `<option value="${vendedor.id}">${this.escapeHtml(vendedor.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Grupo WhatsApp</label>
                    <select class="form-select" name="whatsapp_grupo_id">
                        <option value="">Seleccionar grupo</option>
                        ${this.catalogData.whatsappGrupos.map(grupo => 
                            `<option value="${grupo.id}">${this.escapeHtml(grupo.nombre || grupo.group_id)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Cliente Actual</label>
                    <input type="text" class="form-control" name="cliente_actual">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Grupo WhatsApp (Texto)</label>
                    <input type="text" class="form-control" name="grupo_whatsapp">
                </div>
            </div>
        `;
    }

    renderStatusInfoForm() {
        return `
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label">Estado Actual</label>
                    <select class="form-select" name="estado_actual_id">
                        <option value="">Seleccionar estado</option>
                        ${this.catalogData.estadosActuales.map(estado => 
                            `<option value="${estado.id}">${this.escapeHtml(estado.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Estado de Inventario</label>
                    <select class="form-select" name="estado_inventario_id">
                        <option value="">Seleccionar estado</option>
                        ${this.catalogData.estadosInventario.map(estado => 
                            `<option value="${estado.id}">${this.escapeHtml(estado.nombre)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Estatus</label>
                    <input type="text" class="form-control" name="estatus">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Ubicación</label>
                    <input type="text" class="form-control" name="ubicacion">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Link de Fotos</label>
                    <input type="url" class="form-control" name="link_fotos" placeholder="https://...">
                </div>
            </div>
        `;
    }

    // ===== CONFIGURAR EVENT LISTENERS =====
    setupEventListeners() {
        // Cambios en cascada
        document.addEventListener('change', (e) => {
            if (e.target.matches('[data-cascade]')) {
                this.handleCascadeChange(e.target);
            }
        });

        // Validación en tiempo real
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select')) {
                this.validateField(e.target);
            }
        });
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
        const modeloSelect = document.querySelector('#vehiculo-modal select[name="modelo_id"]');
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
        const apoderadoSelect = document.querySelector('#vehiculo-modal select[name="apoderado_id"]');
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

    // ===== POBLAR FORMULARIO =====
    populateForm(vehicle) {
        const form = document.getElementById('vehiculo-form');
        if (!form) return;

        // Poblar campos básicos
        Object.keys(vehicle).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = vehicle[key];
                } else {
                    field.value = vehicle[key] || '';
                }
            }
        });

        // Actualizar selects en cascada
        const marcaSelect = form.querySelector('select[name="marca_id"]');
        if (marcaSelect && vehicle.marca_id) {
            marcaSelect.value = vehicle.marca_id;
            this.updateModelosSelect(vehicle.marca_id).then(() => {
                const modeloSelect = form.querySelector('select[name="modelo_id"]');
                if (modeloSelect && vehicle.modelo_id) {
                    modeloSelect.value = vehicle.modelo_id;
                }
            });
        }

        const arrendadoraSelect = form.querySelector('select[name="arrendadora_id"]');
        if (arrendadoraSelect && vehicle.arrendadora_id) {
            arrendadoraSelect.value = vehicle.arrendadora_id;
            this.updateApoderadosSelect(vehicle.arrendadora_id).then(() => {
                const apoderadoSelect = form.querySelector('select[name="apoderado_id"]');
                if (apoderadoSelect && vehicle.apoderado_id) {
                    apoderadoSelect.value = vehicle.apoderado_id;
                }
            });
        }
    }

    // ===== GUARDAR VEHÍCULO =====
    async saveVehicle() {
        try {
            // Validar formulario
            if (!this.validateForm()) {
                this.showToast('Por favor corrige los errores en el formulario', 'error');
                return;
            }

            // Recopilar datos del formulario
            const formData = this.collectFormData();

            let result;
            if (this.isEditMode) {
                result = await api.updateVehiculo(this.currentVehicleId, formData);
            } else {
                result = await api.createVehiculo(formData);
            }

            if (result.success) {
                this.showToast(
                    `Vehículo ${this.isEditMode ? 'actualizado' : 'creado'} exitosamente`, 
                    'success'
                );
                
                // Cerrar modal
                this.modal.hide();
                
                // Actualizar la lista de vehículos
                if (window.app && window.app.loadVehiculos) {
                    await window.app.loadVehiculos();
                }
                
                // Si estamos en la página de detalle, recargar los datos
                if (window.vehiculoDetail && this.isEditMode) {
                    await window.vehiculoDetail.refreshVehicleData();
                }
            } else {
                this.showToast('Error guardando vehículo: ' + result.error, 'error');
            }

        } catch (error) {
            console.error('Error guardando vehículo:', error);
            this.showToast('Error guardando vehículo', 'error');
        }
    }

    collectFormData() {
        const formData = {};
        const form = document.getElementById('vehiculo-form');
        
        if (!form) return formData;

        // Recopilar todos los campos del formulario
        form.querySelectorAll('input, select, textarea').forEach(field => {
            const name = field.name;
            if (name) {
                if (field.type === 'number') {
                    formData[name] = field.value ? parseFloat(field.value) : null;
                } else if (field.type === 'date') {
                    formData[name] = field.value || null;
                } else if (field.type === 'checkbox') {
                    formData[name] = field.checked;
                } else {
                    formData[name] = field.value || null;
                }
            }
        });

        return formData;
    }

    validateForm() {
        let isValid = true;
        const form = document.getElementById('vehiculo-form');
        
        if (!form) return false;

        // Validar campos requeridos
        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Este campo es requerido');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Validar números
        form.querySelectorAll('input[type="number"]').forEach(field => {
            if (field.value && isNaN(field.value)) {
                this.showFieldError(field, 'Debe ser un número válido');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Validar URLs
        form.querySelectorAll('input[type="url"]').forEach(field => {
            if (field.value && !this.isValidUrl(field.value)) {
                this.showFieldError(field, 'Debe ser una URL válida');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        return isValid;
    }

    validateField(field) {
        // Validar campo requerido
        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showFieldError(field, 'Este campo es requerido');
        } else {
            this.clearFieldError(field);
        }

        // Validar número
        if (field.type === 'number' && field.value && isNaN(field.value)) {
            this.showFieldError(field, 'Debe ser un número válido');
        } else if (field.type === 'number') {
            this.clearFieldError(field);
        }

        // Validar URL
        if (field.type === 'url' && field.value && !this.isValidUrl(field.value)) {
            this.showFieldError(field, 'Debe ser una URL válida');
        } else if (field.type === 'url') {
            this.clearFieldError(field);
        }
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

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // ===== UTILIDADES =====
    showToast(message, type = 'info') {
        // Usar el sistema de toast de la aplicación principal si está disponible
        if (window.app && window.app.showToast) {
            window.app.showToast(message, type);
        } else {
            // Toast simple
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Crear instancia global
const vehiculoModal = new VehiculoModal();
