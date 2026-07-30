let lotesData      = [];
let loteEliminarID = null;

// ── Badges ─────────────────────────────────────────────────
function badgeVenc(estado, dias) {
    const mapa = {
        'Vigente':  ['badge--green',  'ti-calendar-check',       'Vigente'],
        'Próximo':  ['badge--blue',   'ti-calendar-exclamation', 'Próximo'],
        'Crítico':  ['badge--yellow', 'ti-alert-triangle',       'Crítico'],
        'Vencido':  ['badge--red',    'ti-calendar-x',           'Vencido']
    };
    const [cls, icon, label] = mapa[estado] || ['badge--blue', 'ti-calendar', estado];
    return `<span class="badge ${cls}"><i class="ti ${icon}"></i> ${label}</span>`;
}

function barraLote(actual, inicial) {
    const pct   = inicial > 0 ? Math.min((actual / inicial) * 100, 100) : 0;
    const color = pct === 0 ? 'red' : pct <= 25 ? 'yellow' : 'green';
    return `
        <div class="stock-bar-wrap">
            <div class="stock-bar-labels">
                <span class="val">${actual}</span>
                <span class="max">/ ${inicial}</span>
            </div>
            <div class="stock-bar-track">
                <div class="stock-bar-fill stock-bar-fill--${color}" style="width:${pct}%"></div>
            </div>
        </div>`;
}

function chipCategoria(nombre) {
    const mapa = {
        'Analgésicos':       'chip--analgesico',
        'Antibióticos':      'chip--antibiotico',
        'Vitaminas':         'chip--vitamina',
        'Antiinflamatorios': 'chip--antiinflamatorio',
        'Dermatológicos':    'chip--dermatologico'
    };
    return `<span class="chip ${mapa[nombre] || 'chip--default'}">${nombre}</span>`;
}

function diasLabel(dias, estado) {
    if (estado === 'Vencido')
        return `<span style="color:#dc2626;font-weight:700;font-size:12px">Vencido</span>`;
    const color = dias <= 30 ? '#d97706' : dias <= 90 ? '#2563eb' : '#16a34a';
    return `<span style="color:${color};font-weight:700;font-size:13px">${dias}d</span>`;
}

// ── Stats ──────────────────────────────────────────────────
function actualizarStats(lista) {
    document.getElementById('lt-vigentes').textContent = lista.filter(l => l.estadoVencimiento === 'Vigente').length;
    document.getElementById('lt-proximos').textContent = lista.filter(l => l.estadoVencimiento === 'Próximo').length;
    document.getElementById('lt-criticos').textContent = lista.filter(l => l.estadoVencimiento === 'Crítico').length;
    document.getElementById('lt-vencidos').textContent = lista.filter(l => l.estadoVencimiento === 'Vencido').length;
}

// ── Render tabla ───────────────────────────────────────────
function renderLotes(lista) {
    actualizarStats(lista);

    const tbody = document.getElementById('tabla-lotes');
    if (!lista.length) {
        tbody.innerHTML = `
            <tr><td colspan="9" style="text-align:center;padding:40px;color:#94a3b8">
                Sin lotes registrados
            </td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(l => `
        <tr>
            <td>
                <strong style="font-size:13px">${l.productoNombre}</strong><br>
                ${chipCategoria(l.categoriaNombre)}
            </td>
            <td>
                <code style="font-size:11px;background:#f1f5f9;padding:2px 6px;border-radius:4px">
                    ${l.numeroLote}
                </code>
            </td>
            <td>
                ${l.registroINVIMA
                    ? `<span style="font-size:11px;color:#2563eb;font-weight:500">${l.registroINVIMA}</span>`
                    : '<span style="color:#cbd5e1;font-size:12px">—</span>'}
            </td>
            <td style="font-size:12px;color:#64748b">
                ${l.fechaFabricacion
                    ? new Date(l.fechaFabricacion).toLocaleDateString('es-CO')
                    : '—'}
            </td>
            <td style="font-size:12px;font-weight:500">
                ${new Date(l.fechaVencimiento).toLocaleDateString('es-CO')}
            </td>
            <td>${diasLabel(l.diasParaVencer, l.estadoVencimiento)}</td>
            <td>${barraLote(l.cantidadActual, l.cantidadInicial)}</td>
            <td>${badgeVenc(l.estadoVencimiento, l.diasParaVencer)}</td>
            <td>
                <button class="btn btn--ghost btn--sm" title="Eliminar"
                    onclick="abrirEliminarLote(${l.loteID}, '${l.numeroLote}')">
                    <i class="ti ti-trash" style="color:#dc2626"></i>
                </button>
            </td>
        </tr>`).join('');
}

// ── Alertas de vencimiento ─────────────────────────────────
async function cargarAlertasVencimiento() {
    const dias     = document.getElementById('dias-alerta').value;
    const alertas  = await fetchAPI(`${API.alertasVencimiento}?dias=${dias}`);
    const contenedor = document.getElementById('lista-alertas-venc');

    if (!alertas.length) {
        contenedor.innerHTML = `
            <p style="color:#16a34a;font-size:13px;font-weight:500;display:flex;align-items:center;gap:6px">
                <i class="ti ti-circle-check" style="font-size:18px"></i>
                Sin lotes próximos a vencer en los próximos ${dias} días.
            </p>`;
        return;
    }

    contenedor.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">
            ${alertas.map(a => `
                <div style="border:1px solid ${a.estadoVencimiento === 'Vencido' ? '#fecaca' : a.estadoVencimiento === 'Crítico' ? '#fde68a' : '#bfdbfe'};
                     border-radius:8px;padding:12px;background:${a.estadoVencimiento === 'Vencido' ? '#fff1f2' : a.estadoVencimiento === 'Crítico' ? '#fffbeb' : '#eff6ff'}">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
                        <strong style="font-size:12px;color:#0f172a">${a.productoNombre}</strong>
                        ${badgeVenc(a.estadoVencimiento, a.diasParaVencer)}
                    </div>
                    <div style="font-size:11px;color:#64748b;display:flex;flex-direction:column;gap:3px">
                        <span><i class="ti ti-barcode" style="font-size:13px"></i> Lote: <strong>${a.numeroLote}</strong></span>
                        ${a.registroINVIMA ? `<span><i class="ti ti-certificate" style="font-size:13px"></i> INVIMA: ${a.registroINVIMA}</span>` : ''}
                        <span><i class="ti ti-calendar" style="font-size:13px"></i> Vence: ${new Date(a.fechaVencimiento).toLocaleDateString('es-CO')}</span>
                        <span><i class="ti ti-package" style="font-size:13px"></i> Stock: ${a.cantidadActual} unidades</span>
                    </div>
                    <div style="margin-top:8px;font-size:11px;font-weight:700;color:${a.estadoVencimiento === 'Vencido' ? '#dc2626' : a.estadoVencimiento === 'Crítico' ? '#d97706' : '#2563eb'}">
                        ${a.estadoVencimiento === 'Vencido' ? '⚠️ Producto vencido — retirar del inventario' : `⏱ ${a.diasParaVencer} días para vencer`}
                    </div>
                </div>`).join('')}
        </div>`;
}

// ── Filtros ────────────────────────────────────────────────
document.getElementById('filtro-lote').addEventListener('input', filtrar);
document.getElementById('filtro-estado-lote').addEventListener('change', filtrar);

function filtrar() {
    const texto  = document.getElementById('filtro-lote').value.toLowerCase();
    const estado = document.getElementById('filtro-estado-lote').value;
    const result = lotesData.filter(l => {
        const coincideTexto  = l.productoNombre.toLowerCase().includes(texto) ||
                               l.numeroLote.toLowerCase().includes(texto);
        const coincideEstado = !estado || l.estadoVencimiento === estado;
        return coincideTexto && coincideEstado;
    });
    renderLotes(result);
}

// ── Modal Crear ────────────────────────────────────────────
async function abrirModalCrear() {
    const productos = await fetchAPI(API.productos);
    const select    = document.getElementById('lote-producto');
    select.innerHTML = productos.map(p =>
        `<option value="${p.productoID}">${p.nombre}</option>`).join('');
    document.getElementById('lote-numero').value      = '';
    document.getElementById('lote-invima').value      = '';
    document.getElementById('lote-fabricacion').value = '';
    document.getElementById('lote-vencimiento').value = '';
    document.getElementById('lote-cantidad').value    = '';
    document.getElementById('lote-precio').value      = '';
    abrirModal('modal-lote');
}

async function guardarLote() {
    const numero     = document.getElementById('lote-numero').value.trim();
    const vencimiento = document.getElementById('lote-vencimiento').value;
    const cantidad   = parseInt(document.getElementById('lote-cantidad').value);

    if (!numero || !vencimiento || !cantidad) {
        mostrarToast('Número de lote, vencimiento y cantidad son obligatorios.', 'error');
        return;
    }

    await fetchAPI(API.lotes, {
        method: 'POST',
        body: JSON.stringify({
            productoID:       parseInt(document.getElementById('lote-producto').value),
            numeroLote:       numero,
            registroINVIMA:   document.getElementById('lote-invima').value.trim() || null,
            fechaFabricacion: document.getElementById('lote-fabricacion').value || null,
            fechaVencimiento: vencimiento,
            cantidadInicial:  cantidad,
            precioCompra:     parseFloat(document.getElementById('lote-precio').value) || null
        })
    });

    mostrarToast('Lote registrado correctamente.', 'success');
    cerrarModal('modal-lote');
    await cargarLotes();
    await cargarAlertasVencimiento();
}

// ── Modal Eliminar ─────────────────────────────────────────
function abrirEliminarLote(id, numero) {
    loteEliminarID = id;
    document.getElementById('eliminar-lote-numero').textContent = numero;
    abrirModal('modal-eliminar-lote');
}

async function confirmarEliminarLote() {
    await fetchAPI(`${API.lotes}/${loteEliminarID}`, { method: 'DELETE' });
    mostrarToast('Lote eliminado correctamente.', 'success');
    cerrarModal('modal-eliminar-lote');
    await cargarLotes();
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
async function cargarLotes() {
    lotesData = await fetchAPI(API.lotes);
    renderLotes(lotesData);
}

cargarLotes();
cargarAlertasVencimiento();