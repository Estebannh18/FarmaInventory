let productosData = [];
let productoEditandoID = null;
let productoMovimientoID = null;
let productoEliminarID = null;

// ── Carga inicial ──────────────────────────────────────────
async function cargarProductos() {
    productosData = await fetchAPI(API.productos);
    renderTabla(productosData);
}

function renderTabla(lista) {
    const tbody = document.getElementById('tabla-productos');
    document.getElementById('contador-productos').textContent =
        `${lista.length} producto${lista.length !== 1 ? 's' : ''}`;

    if (!lista.length) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:40px;color:#94a3b8">
            Sin productos que mostrar</td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(p => `
        <tr>
            <td><code style="font-size:11px;background:#f1f5f9;padding:2px 6px;border-radius:4px">${p.codigoBarras}</code></td>
            <td>
                <strong style="font-size:13px">${p.nombre}</strong>
                ${p.requiereReceta ? '<span class="badge badge--blue" style="margin-left:4px;font-size:10px">Receta</span>' : ''}
            </td>
            <td>${p.categoriaNombre}</td>
            <td>${p.proveedorNombre}</td>
            <td>${formatCOP(p.precioVenta)}</td>
            <td>
                <span style="font-weight:600">${p.stockActual}</span>
                <span style="font-size:11px;color:#94a3b8"> / mín ${p.stockMinimo}</span>
            </td>
            <td style="font-size:12px">${formatFecha(p.fechaVencimiento)}</td>
            <td>${badgeEstado(p.estadoStock)}</td>
            <td>
                <div style="display:flex;gap:4px">
                    <button class="btn btn--ghost btn--sm" title="Movimiento de stock"
                        onclick="abrirModalMovimiento(${p.productoID}, '${p.nombre.replace(/'/g,"\\'")}')">
                        <i class="ti ti-arrows-exchange"></i>
                    </button>
                    <button class="btn btn--ghost btn--sm" title="Editar"
                        onclick="abrirModalEditar(${p.productoID})">
                        <i class="ti ti-edit"></i>
                    </button>
                    <button class="btn btn--ghost btn--sm" title="Eliminar"
                        onclick="abrirModalEliminar(${p.productoID}, '${p.nombre.replace(/'/g,"\\'")}')">
                        <i class="ti ti-trash" style="color:#dc2626"></i>
                    </button>
                </div>
            </td>
        </tr>`).join('');
}

function badgeEstado(estado) {
    const mapa = {
        'Disponible': 'badge--green',
        'Stock Bajo':  'badge--yellow',
        'Agotado':     'badge--red'
    };
    return `<span class="badge ${mapa[estado] || 'badge--blue'}">${estado}</span>`;
}

// ── Filtros ────────────────────────────────────────────────
document.getElementById('buscador').addEventListener('input', filtrar);
document.getElementById('filtro-estado').addEventListener('change', filtrar);

function filtrar() {
    const texto  = document.getElementById('buscador').value.toLowerCase();
    const estado = document.getElementById('filtro-estado').value;

    const filtrados = productosData.filter(p => {
        const coincideTexto  = p.nombre.toLowerCase().includes(texto) ||
                               p.codigoBarras.toLowerCase().includes(texto);
        const coincideEstado = !estado || p.estadoStock === estado;
        return coincideTexto && coincideEstado;
    });

    renderTabla(filtrados);
}

// ── Modal Crear ────────────────────────────────────────────
function abrirModalCrear() {
    productoEditandoID = null;
    document.getElementById('modal-titulo').textContent = 'Nuevo Producto';
    limpiarFormulario();
    document.getElementById('f-stock-actual').closest('.form-group').style.display = 'flex';
    abrirModal('modal-producto');
}

// ── Modal Editar ───────────────────────────────────────────
async function abrirModalEditar(id) {
    productoEditandoID = id;
    document.getElementById('modal-titulo').textContent = 'Editar Producto';

    const p = await fetchAPI(`${API.productos}/${id}`);
    if (!p) return;

    document.getElementById('f-codigo').value         = p.codigoBarras;
    document.getElementById('f-nombre').value         = p.nombre;
    document.getElementById('f-descripcion').value    = p.descripcion || '';
    document.getElementById('f-categoria').value      = p.categoriaID;
    document.getElementById('f-proveedor').value      = p.proveedorID;
    document.getElementById('f-precio-compra').value  = p.precioCompra;
    document.getElementById('f-precio-venta').value   = p.precioVenta;
    document.getElementById('f-stock-min').value      = p.stockMinimo;
    document.getElementById('f-stock-max').value      = p.stockMaximo;
    document.getElementById('f-unidad').value         = p.unidadMedida;
    document.getElementById('f-vencimiento').value    = p.fechaVencimiento?.split('T')[0] || '';
    document.getElementById('f-receta').checked       = p.requiereReceta;

    // Al editar no se modifica el stock desde aquí, solo desde movimientos
    document.getElementById('f-stock-actual').closest('.form-group').style.display = 'none';

    abrirModal('modal-producto');
}

// ── Guardar (Crear o Editar) ───────────────────────────────
async function guardarProducto() {
    const nombre = document.getElementById('f-nombre').value.trim();
    const codigo = document.getElementById('f-codigo').value.trim();

    if (!nombre || !codigo) {
        mostrarToast('Nombre y código son obligatorios.', 'error');
        return;
    }

    const body = {
        codigoBarras:     codigo,
        nombre,
        descripcion:      document.getElementById('f-descripcion').value.trim(),
        categoriaID:      parseInt(document.getElementById('f-categoria').value),
        proveedorID:      parseInt(document.getElementById('f-proveedor').value),
        precioCompra:     parseFloat(document.getElementById('f-precio-compra').value),
        precioVenta:      parseFloat(document.getElementById('f-precio-venta').value),
        stockActual:      parseInt(document.getElementById('f-stock-actual').value) || 0,
        stockMinimo:      parseInt(document.getElementById('f-stock-min').value) || 10,
        stockMaximo:      parseInt(document.getElementById('f-stock-max').value) || 500,
        unidadMedida:     document.getElementById('f-unidad').value,
        fechaVencimiento: document.getElementById('f-vencimiento').value || null,
        requiereReceta:   document.getElementById('f-receta').checked
    };

    if (productoEditandoID) {
        await fetchAPI(`${API.productos}/${productoEditandoID}`, {
            method: 'PUT', body: JSON.stringify(body)
        });
        mostrarToast('Producto actualizado correctamente.', 'success');
    } else {
        await fetchAPI(API.productos, {
            method: 'POST', body: JSON.stringify(body)
        });
        mostrarToast('Producto creado correctamente.', 'success');
    }

    cerrarModal('modal-producto');
    await cargarProductos();
}

// ── Modal Movimiento ───────────────────────────────────────
function abrirModalMovimiento(id, nombre) {
    productoMovimientoID = id;
    document.getElementById('mov-producto-nombre').textContent = nombre;
    document.getElementById('mov-cantidad').value = '';
    document.getElementById('mov-motivo').value   = '';
    document.getElementById('mov-tipo').value     = 'Entrada';
    abrirModal('modal-movimiento');
}

async function confirmarMovimiento() {
    const cantidad = parseInt(document.getElementById('mov-cantidad').value);
    if (!cantidad || cantidad <= 0) {
        mostrarToast('Ingresa una cantidad válida.', 'error');
        return;
    }

    await fetchAPI(API.movimiento, {
        method: 'POST',
        body: JSON.stringify({
            productoID:     productoMovimientoID,
            usuarioID:      1,
            tipoMovimiento: document.getElementById('mov-tipo').value,
            cantidad,
            motivo:         document.getElementById('mov-motivo').value
        })
    });

    mostrarToast('Movimiento registrado correctamente.', 'success');
    cerrarModal('modal-movimiento');
    await cargarProductos();
}

// ── Modal Eliminar ─────────────────────────────────────────
function abrirModalEliminar(id, nombre) {
    productoEliminarID = id;
    document.getElementById('eliminar-nombre').textContent = nombre;
    abrirModal('modal-eliminar');
}

async function confirmarEliminar() {
    await fetchAPI(`${API.productos}/${productoEliminarID}`, { method: 'DELETE' });
    mostrarToast('Producto eliminado del sistema.', 'success');
    cerrarModal('modal-eliminar');
    await cargarProductos();
}

// ── Helpers modal ──────────────────────────────────────────
function abrirModal(id)  { document.getElementById(id).classList.add('open');    }
function cerrarModal(id) { document.getElementById(id).classList.remove('open'); }

function limpiarFormulario() {
    ['f-codigo','f-nombre','f-descripcion','f-precio-compra',
     'f-precio-venta','f-stock-actual','f-stock-min','f-stock-max','f-vencimiento']
        .forEach(id => document.getElementById(id).value = '');
    document.getElementById('f-categoria').value = '';
    document.getElementById('f-proveedor').value = '';
    document.getElementById('f-unidad').value    = 'Unidad';
    document.getElementById('f-receta').checked  = false;
}

// Cerrar modal al hacer clic fuera
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
    });
});

// ── Init ───────────────────────────────────────────────────
cargarProductos();