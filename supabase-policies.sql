-- =====================================================
-- POLÍTICAS RLS PARA FLOTA v.3
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modelos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arrendadoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apoderados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carrocerias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combustibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transmisiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estados_actuales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estados_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehiculo_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarea_adjuntos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarea_colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarea_comentarios ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA TABLAS DE CATÁLOGOS (Solo lectura)
-- =====================================================

-- Marcas
CREATE POLICY "Marcas: Permitir lectura a todos" ON public.marcas
    FOR SELECT USING (true);

CREATE POLICY "Marcas: Permitir inserción a todos" ON public.marcas
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Marcas: Permitir actualización a todos" ON public.marcas
    FOR UPDATE USING (true);

CREATE POLICY "Marcas: Permitir eliminación a todos" ON public.marcas
    FOR DELETE USING (true);

-- Modelos
CREATE POLICY "Modelos: Permitir lectura a todos" ON public.modelos
    FOR SELECT USING (true);

CREATE POLICY "Modelos: Permitir inserción a todos" ON public.modelos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Modelos: Permitir actualización a todos" ON public.modelos
    FOR UPDATE USING (true);

CREATE POLICY "Modelos: Permitir eliminación a todos" ON public.modelos
    FOR DELETE USING (true);

-- Arrendadoras
CREATE POLICY "Arrendadoras: Permitir lectura a todos" ON public.arrendadoras
    FOR SELECT USING (true);

CREATE POLICY "Arrendadoras: Permitir inserción a todos" ON public.arrendadoras
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Arrendadoras: Permitir actualización a todos" ON public.arrendadoras
    FOR UPDATE USING (true);

CREATE POLICY "Arrendadoras: Permitir eliminación a todos" ON public.arrendadoras
    FOR DELETE USING (true);

-- Apoderados
CREATE POLICY "Apoderados: Permitir lectura a todos" ON public.apoderados
    FOR SELECT USING (true);

CREATE POLICY "Apoderados: Permitir inserción a todos" ON public.apoderados
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Apoderados: Permitir actualización a todos" ON public.apoderados
    FOR UPDATE USING (true);

CREATE POLICY "Apoderados: Permitir eliminación a todos" ON public.apoderados
    FOR DELETE USING (true);

-- Colores
CREATE POLICY "Colores: Permitir lectura a todos" ON public.colores
    FOR SELECT USING (true);

CREATE POLICY "Colores: Permitir inserción a todos" ON public.colores
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Colores: Permitir actualización a todos" ON public.colores
    FOR UPDATE USING (true);

CREATE POLICY "Colores: Permitir eliminación a todos" ON public.colores
    FOR DELETE USING (true);

-- Carrocerías
CREATE POLICY "Carrocerias: Permitir lectura a todos" ON public.carrocerias
    FOR SELECT USING (true);

CREATE POLICY "Carrocerias: Permitir inserción a todos" ON public.carrocerias
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Carrocerias: Permitir actualización a todos" ON public.carrocerias
    FOR UPDATE USING (true);

CREATE POLICY "Carrocerias: Permitir eliminación a todos" ON public.carrocerias
    FOR DELETE USING (true);

-- Combustibles
CREATE POLICY "Combustibles: Permitir lectura a todos" ON public.combustibles
    FOR SELECT USING (true);

CREATE POLICY "Combustibles: Permitir inserción a todos" ON public.combustibles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Combustibles: Permitir actualización a todos" ON public.combustibles
    FOR UPDATE USING (true);

CREATE POLICY "Combustibles: Permitir eliminación a todos" ON public.combustibles
    FOR DELETE USING (true);

-- Transmisiones
CREATE POLICY "Transmisiones: Permitir lectura a todos" ON public.transmisiones
    FOR SELECT USING (true);

CREATE POLICY "Transmisiones: Permitir inserción a todos" ON public.transmisiones
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Transmisiones: Permitir actualización a todos" ON public.transmisiones
    FOR UPDATE USING (true);

CREATE POLICY "Transmisiones: Permitir eliminación a todos" ON public.transmisiones
    FOR DELETE USING (true);

-- Tracciones
CREATE POLICY "Tracciones: Permitir lectura a todos" ON public.tracciones
    FOR SELECT USING (true);

CREATE POLICY "Tracciones: Permitir inserción a todos" ON public.tracciones
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Tracciones: Permitir actualización a todos" ON public.tracciones
    FOR UPDATE USING (true);

CREATE POLICY "Tracciones: Permitir eliminación a todos" ON public.tracciones
    FOR DELETE USING (true);

-- Estados Actuales
CREATE POLICY "Estados_actuales: Permitir lectura a todos" ON public.estados_actuales
    FOR SELECT USING (true);

CREATE POLICY "Estados_actuales: Permitir inserción a todos" ON public.estados_actuales
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Estados_actuales: Permitir actualización a todos" ON public.estados_actuales
    FOR UPDATE USING (true);

CREATE POLICY "Estados_actuales: Permitir eliminación a todos" ON public.estados_actuales
    FOR DELETE USING (true);

-- Estados Inventario
CREATE POLICY "Estados_inventario: Permitir lectura a todos" ON public.estados_inventario
    FOR SELECT USING (true);

CREATE POLICY "Estados_inventario: Permitir inserción a todos" ON public.estados_inventario
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Estados_inventario: Permitir actualización a todos" ON public.estados_inventario
    FOR UPDATE USING (true);

CREATE POLICY "Estados_inventario: Permitir eliminación a todos" ON public.estados_inventario
    FOR DELETE USING (true);

-- Vendedores
CREATE POLICY "Vendedores: Permitir lectura a todos" ON public.vendedores
    FOR SELECT USING (true);

CREATE POLICY "Vendedores: Permitir inserción a todos" ON public.vendedores
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Vendedores: Permitir actualización a todos" ON public.vendedores
    FOR UPDATE USING (true);

CREATE POLICY "Vendedores: Permitir eliminación a todos" ON public.vendedores
    FOR DELETE USING (true);

-- WhatsApp Grupos
CREATE POLICY "Whatsapp_grupos: Permitir lectura a todos" ON public.whatsapp_grupos
    FOR SELECT USING (true);

CREATE POLICY "Whatsapp_grupos: Permitir inserción a todos" ON public.whatsapp_grupos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Whatsapp_grupos: Permitir actualización a todos" ON public.whatsapp_grupos
    FOR UPDATE USING (true);

CREATE POLICY "Whatsapp_grupos: Permitir eliminación a todos" ON public.whatsapp_grupos
    FOR DELETE USING (true);

-- =====================================================
-- POLÍTICAS PARA TABLAS PRINCIPALES
-- =====================================================

-- Vehículos
CREATE POLICY "Vehiculos: Permitir lectura a todos" ON public.vehiculos
    FOR SELECT USING (true);

CREATE POLICY "Vehiculos: Permitir inserción a todos" ON public.vehiculos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Vehiculos: Permitir actualización a todos" ON public.vehiculos
    FOR UPDATE USING (true);

CREATE POLICY "Vehiculos: Permitir eliminación a todos" ON public.vehiculos
    FOR DELETE USING (true);

-- Colaboradores
CREATE POLICY "Colaboradores: Permitir lectura a todos" ON public.colaboradores
    FOR SELECT USING (true);

CREATE POLICY "Colaboradores: Permitir inserción a todos" ON public.colaboradores
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Colaboradores: Permitir actualización a todos" ON public.colaboradores
    FOR UPDATE USING (true);

CREATE POLICY "Colaboradores: Permitir eliminación a todos" ON public.colaboradores
    FOR DELETE USING (true);

-- Tareas
CREATE POLICY "Tareas: Permitir lectura a todos" ON public.tareas
    FOR SELECT USING (true);

CREATE POLICY "Tareas: Permitir inserción a todos" ON public.tareas
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Tareas: Permitir actualización a todos" ON public.tareas
    FOR UPDATE USING (true);

CREATE POLICY "Tareas: Permitir eliminación a todos" ON public.tareas
    FOR DELETE USING (true);

-- Vehículo Fotos
CREATE POLICY "Vehiculo_fotos: Permitir lectura a todos" ON public.vehiculo_fotos
    FOR SELECT USING (true);

CREATE POLICY "Vehiculo_fotos: Permitir inserción a todos" ON public.vehiculo_fotos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Vehiculo_fotos: Permitir actualización a todos" ON public.vehiculo_fotos
    FOR UPDATE USING (true);

CREATE POLICY "Vehiculo_fotos: Permitir eliminación a todos" ON public.vehiculo_fotos
    FOR DELETE USING (true);

-- Tarea Adjuntos
CREATE POLICY "Tarea_adjuntos: Permitir lectura a todos" ON public.tarea_adjuntos
    FOR SELECT USING (true);

CREATE POLICY "Tarea_adjuntos: Permitir inserción a todos" ON public.tarea_adjuntos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Tarea_adjuntos: Permitir actualización a todos" ON public.tarea_adjuntos
    FOR UPDATE USING (true);

CREATE POLICY "Tarea_adjuntos: Permitir eliminación a todos" ON public.tarea_adjuntos
    FOR DELETE USING (true);

-- Tarea Colaboradores
CREATE POLICY "Tarea_colaboradores: Permitir lectura a todos" ON public.tarea_colaboradores
    FOR SELECT USING (true);

CREATE POLICY "Tarea_colaboradores: Permitir inserción a todos" ON public.tarea_colaboradores
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Tarea_colaboradores: Permitir actualización a todos" ON public.tarea_colaboradores
    FOR UPDATE USING (true);

CREATE POLICY "Tarea_colaboradores: Permitir eliminación a todos" ON public.tarea_colaboradores
    FOR DELETE USING (true);

-- Tarea Comentarios
CREATE POLICY "Tarea_comentarios: Permitir lectura a todos" ON public.tarea_comentarios
    FOR SELECT USING (true);

CREATE POLICY "Tarea_comentarios: Permitir inserción a todos" ON public.tarea_comentarios
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Tarea_comentarios: Permitir actualización a todos" ON public.tarea_comentarios
    FOR UPDATE USING (true);

CREATE POLICY "Tarea_comentarios: Permitir eliminación a todos" ON public.tarea_comentarios
    FOR DELETE USING (true);
