let proveedoresData  = [];
let pvEditandoID     = null;
let pvEliminarID     = null;

// ── Render tarjetas ────────────────────────────────────────
function renderTarjetas(lista) {
    const grid = document.getElementById('grid-proveedores');

    const colores = [
        { bg: '#dbeafe', color: '#1d4ed8', icon: 'ti-building' },
        { bg: '#dcfce7', color: '#15803d', icon: 'ti-flask'    },
        { bg: '#fce7f3', color: '#9d174d', icon: 'ti-truck'    },
        { bg: '#ffedd5', color: '#9a3412', icon: 'ti-pill'     },
        { bg: '#ede9fe', color: '#6d28d9', icon: 'ti-star'     }
    ];

    grid.innerHTML = lista.map((pv, i) => {
        const c = colores[i % colores.length];
        return `
            <div class="card" style="padding:20px">
                <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:16px">
                    <div style="width:46px;height:46px;border-radius:12px;background:${c.bg};
                         display:flex;align-items:center;justify-content:center;
                         font-size:22px;color:${c.color};flex-shrink:0">
                        <i class="ti ${c.icon}"></i>
                    </div>
                    <div style="flex:1">
                        <h4 style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:2px">
                            ${pv.razonSocial}
                        </h4>
                        <span style="font-size:11px;color:#64748b">NIT: ${pv.nit}</span>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
                    <div style="background:#f8fafc;border-radius:8px;padding:10px;text-align:center">
                        <p style="font-size:10px;color:#64748b;margin-bottom:2px">Productos</p>
                        <h3 style="font-size:20px;font-weight:700;color:#0f172a">${pv.totalProductos}</h3>
                    </div>
                    <div style="background:#f8fafc;border-radius:8px;padding:10px;text-align:center">
                        <p style="font-size:10px;color:#64748b;margin-bottom:2px">Unidades</p>
                        <h3 style="font-size:20px;font-weight:700;color:#0f172a">${pv.totalUnidades}</h3>
                    </div>
                </div>
                <div style="background:#f0fdf4;border-radius:8px;padding:10px;margin-bottom:14px;text-align:center">
                    <p style="font-size:10px;color:#16a34a;font-weight:600;margin-bottom:2px">Valor Inventario</p>
                    <h3 style="font-size:16px;font-weight:700;color:#16a34a">${formatCOP(pv.valorInventario)}</h3>
                </div>
                <div style="font-size:11px;color:#64748b;display:flex;flex-direction:column;gap:4px;margin-bottom:14px">
                    ${pv.telefono ? `<span><i class="ti ti-phone" style="font-size:13px"></i> ${pv.telefono}</span>` : ''}
                    ${pv.email    ? `<span><i class="ti ti-mail"  style="font-size:13px"></i> ${pv.email}</span>`    : ''}
                    ${pv.direccion? `<span><i class="ti ti-map-pin" style="font-size:13px"></i> ${pv.direccion}</span>` : ''}
                </div>
                <div style="display:flex;gap:8px">
                    <button class="btn btn--ghost btn--sm" style="flex:1"
                        onclick="abrirModalEditar(${pv.proveedorID})">
                        <i class="ti ti-edit"></i> Editar
                    </button>
                    <button class="btn btn--ghost btn--sm"
                        onclick="abrirEliminarPv(${pv.proveedorID}, '${pv.razonSocial.replace(/'/g,"\\'")}')">
                        <i class="ti ti-trash" style="color:#dc2626"></i>
                    </button>
                </div>
            </div>`;
    }).join('');
}

// ── Render tabla ───────────────────────────────────────────
function renderTabla(lista) {
    document.getElementById('pv-total').textContent    = lista.length;
    document.getElementById('pv-productos').textContent = lista.reduce((a, p) => a + p.totalProductos, 0);
    document.getElementById('pv-valor').textContent    = formatCOP(lista.reduce((a, p) => a + p.valorInventario, 0));

    const tbody = document.getElementById('tabla-proveedores');
    if (!lista.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:#94a3b8">Sin proveedores</td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(pv => `
        <tr>
            <td>
                <strong style="font-size:13px">${pv.razonSocial}</strong>
            </td>
            <td>
                <code style="font-size:11px;background:#f1f5f9;padding:2px 6px;border-radius:4px">
                    ${pv.nit}
                </code>
            </td>
            <td>
                <div style="font-size:12px;color:#475569;display:flex;flex-direction:column;gap:2px">
                    ${pv.telefono ? `<span><i class="ti ti-phone" style="font-size:12px"></i> ${pv.telefono}</span>` : ''}
                    ${pv.email    ? `<span><i class="ti ti-mail"  style="font-size:12px"></i> ${pv.email}</span>`    : ''}
                </div>
            </td>
            <td style="text-align:center;font-weight:700">${pv.totalProductos}</td>
            <td style="text-align:center;font-weight:700">${pv.totalUnidades}</td>
            <td style="font-weight:600;color:#16a34a">${formatCOP(pv.valorInventario)}</td>
            <td>
                <div style="display:flex;gap:4px">
                    <button class="btn btn--ghost btn--sm" onclick="abrirModalEditar(${pv.proveedorID})">
                        <i class="ti ti-edit"></i>
                    </button>
                    <button class="btn btn--ghost btn--sm"
                        onclick="abrirEliminarPv(${pv.proveedorID}, '${pv.razonSocial.replace(/'/g,"\\'")}')">
                        <i class="ti ti-trash" style="color:#dc2626"></i>
                    </button>
                </div>
            </td>
        </tr>`).join('');
}

// ── Filtro ─────────────────────────────────────────────────
document.getElementById('filtro-proveedor').addEventListener('input', function () {
    const texto = this.value.toLowerCase();
    const filtrado = proveedoresData.filter(p =>
        p.razonSocial.toLowerCase().includes(texto) ||
        p.nit.toLowerCase().includes(texto));
    renderTabla(filtrado);
    renderTarjetas(filtrado);
});

// ── Modal Crear ────────────────────────────────────────────
function abrirModalCrear() {
    pvEditandoID = null;
    document.getElementById('pv-modal-titulo').textContent = 'Nuevo Proveedor';
    ['pv-razon','pv-nit','pv-telefono','pv-email','pv-direccion']
        .forEach(id => document.getElementById(id).value = '');
    abrirModal('modal-proveedor');
}

// ── Modal Editar ───────────────────────────────────────────
async function abrirModalEditar(id) {
    pvEditandoID = id;
    document.getElementById('pv-modal-titulo').textContent = 'Editar Proveedor';
    const pv = await fetchAPI(`${API.proveedores}/${id}`);
    if (!pv) return;
    document.getElementById('pv-razon').value     = pv.razonSocial;
    document.getElementById('pv-nit').value       = pv.nit;
    document.getElementById('pv-telefono').value  = pv.telefono || '';
    document.getElementById('pv-email').value     = pv.email    || '';
    document.getElementById('pv-direccion').value = pv.direccion || '';
    abrirModal('modal-proveedor');
}

// ── Guardar ────────────────────────────────────────────────
async function guardarProveedor() {
    const razon = document.getElementById('pv-razon').value.trim();
    const nit   = document.getElementById('pv-nit').value.trim();
    if (!razon || !nit) {
        mostrarToast('Razón social y NIT son obligatorios.', 'error');
        return;
    }

    const body = {
        razonSocial: razon,
        nit,
        telefono:  document.getElementById('pv-telefono').value.trim() || null,
        email:     document.getElementById('pv-email').value.trim()    || null,
        direccion: document.getElementById('pv-direccion').value.trim() || null
    };

    if (pvEditandoID) {
        await fetchAPI(`${API.proveedores}/${pvEditandoID}`, {
            method: 'PUT', body: JSON.stringify(body)
        });
        mostrarToast('Proveedor actualizado correctamente.', 'success');
    } else {
        await fetchAPI(API.proveedores, {
            method: 'POST', body: JSON.stringify(body)
        });
        mostrarToast('Proveedor creado correctamente.', 'success');
    }

    cerrarModal('modal-proveedor');
    await cargarProveedores();
}

// ── Eliminar ───────────────────────────────────────────────
function abrirEliminarPv(id, nombre) {
    pvEliminarID = id;
    document.getElementById('pv-eliminar-nombre').textContent = nombre;
    abrirModal('modal-eliminar-pv');
}

async function confirmarEliminarPv() {
    await fetchAPI(`${API.proveedores}/${pvEliminarID}`, { method: 'DELETE' });
    mostrarToast('Proveedor eliminado del sistema.', 'success');
    cerrarModal('modal-eliminar-pv');
    await cargarProveedores();
}

// ── Helpers modal ──────────────────────────────────────────
function abrirModal(id)  { document.getElementById(id).classList.add('open');    }
function cerrarModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
    });
});

// ── Init ───────────────────────────────────────────────────
async function cargarProveedores() {
    proveedoresData = await fetchAPI(API.proveedores);
    renderTarjetas(proveedoresData);
    renderTabla(proveedoresData);
}

cargarProveedores();