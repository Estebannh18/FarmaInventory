let auditoriaData = [];

// ── Badges ─────────────────────────────────────────────────
function badgeAccion(accion) {
    const mapa = {
        'Crear':      ['badge--green',  'ti-plus',           'Crear'],
        'Actualizar': ['badge--blue',   'ti-edit',           'Actualizar'],
        'Eliminar':   ['badge--red',    'ti-trash',          'Eliminar'],
        'Movimiento': ['badge--yellow', 'ti-arrows-exchange','Movimiento']
    };
    const [cls, icon, label] = mapa[accion] || ['badge--blue', 'ti-circle', accion];
    return `<span class="badge ${cls}"><i class="ti ${icon}"></i> ${label}</span>`;
}

function badgeModulo(modulo) {
    const mapa = {
        'Productos': 'chip--analgesico',
        'Lotes':     'chip--vitamina',
        'Alertas':   'chip--antiinflamatorio',
        'Usuarios':  'chip--antibiotico'
    };
    return `<span class="chip ${mapa[modulo] || 'chip--default'}">${modulo}</span>`;
}

function badgeEstadoAudit(exitoso) {
    return exitoso
        ? `<span class="badge badge--green"><i class="ti ti-check"></i> OK</span>`
        : `<span class="badge badge--red"><i class="ti ti-x"></i> Fallido</span>`;
}

// ── Render resumen ─────────────────────────────────────────
function renderResumen(lista) {
    const grid = document.getElementById('resumen-grid');
    if (!lista.length) {
        grid.innerHTML = `<div style="color:#94a3b8;font-size:13px;padding:20px">Sin datos de resumen.</div>`;
        return;
    }

    const iconos = {
        'Productos': { icon: 'ti-pill',        color: 'blue'   },
        'Lotes':     { icon: 'ti-package',      color: 'green'  },
        'Alertas':   { icon: 'ti-bell',         color: 'yellow' },
        'Usuarios':  { icon: 'ti-users',        color: 'red'    }
    };

    grid.innerHTML = lista.map(r => {
        const cfg = iconos[r.modulo] || { icon: 'ti-circle', color: 'blue' };
        return `
            <div class="stat-card">
                <div class="stat-card__icon stat-card__icon--${cfg.color}">
                    <i class="ti ${cfg.icon}"></i>
                </div>
                <div class="stat-card__info">
                    <p>${r.modulo}</p>
                    <h2>${r.totalAcciones}</h2>
                    <div style="display:flex;gap:8px;margin-top:4px;flex-wrap:wrap">
                        ${r.creaciones     ? `<span style="font-size:10px;color:#16a34a">+${r.creaciones} creados</span>`      : ''}
                        ${r.actualizaciones? `<span style="font-size:10px;color:#2563eb">~${r.actualizaciones} edit.</span>`   : ''}
                        ${r.eliminaciones  ? `<span style="font-size:10px;color:#dc2626">-${r.eliminaciones} elim.</span>`     : ''}
                        ${r.fallidos       ? `<span style="font-size:10px;color:#dc2626;font-weight:700">⚠ ${r.fallidos} fallidos</span>` : ''}
                    </div>
                </div>
            </div>`;
    }).join('');
}

// ── Render tabla ───────────────────────────────────────────
function renderTablaAuditoria(lista) {
    document.getElementById('audit-contador').textContent =
        `${lista.length} evento${lista.length !== 1 ? 's' : ''}`;

    const tbody = document.getElementById('tabla-auditoria');
    if (!lista.length) {
        tbody.innerHTML = `
            <tr><td colspan="10" style="text-align:center;padding:48px;color:#94a3b8">
                <i class="ti ti-shield-check" style="font-size:36px;display:block;margin-bottom:8px"></i>
                Sin eventos de auditoría
            </td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(a => `
        <tr style="${!a.exitoso ? 'background:#fff1f2' : ''}">
            <td style="font-size:11px;color:#94a3b8;font-weight:600">#${a.auditoriaID}</td>
            <td>
                <span style="font-size:12px;font-weight:500;color:#334155">
                    ${new Date(a.fechaAccion).toLocaleDateString('es-CO')}
                </span><br>
                <span style="font-size:10px;color:#94a3b8">
                    ${new Date(a.fechaAccion).toLocaleTimeString('es-CO',
                        {hour:'2-digit', minute:'2-digit'})}
                </span>
            </td>
            <td>
                <div style="display:flex;align-items:center;gap:6px">
                    <div style="width:28px;height:28px;border-radius:50%;background:#dbeafe;
                         display:flex;align-items:center;justify-content:center;
                         font-size:11px;font-weight:700;color:#2563eb;flex-shrink:0">
                        ${a.usuarioNombre.charAt(0).toUpperCase()}
                    </div>
                    <span style="font-size:12px">${a.usuarioNombre}</span>
                </div>
            </td>
            <td>${badgeAccion(a.accion)}</td>
            <td>${badgeModulo(a.modulo)}</td>
            <td style="font-size:12px;color:#334155;max-width:120px">
                ${a.entidadNombre || '<span style="color:#cbd5e1">—</span>'}
                ${a.entidadID
                    ? `<br><span style="font-size:10px;color:#94a3b8">ID: ${a.entidadID}</span>`
                    : ''}
            </td>
            <td>
                ${a.valoresAnteriores
                    ? `<button class="btn btn--ghost btn--sm"
                           onclick='verJSON("Valores Anteriores", ${JSON.stringify(a.valoresAnteriores)})'>
                           <i class="ti ti-eye" style="color:#64748b"></i>
                       </button>`
                    : '<span style="color:#cbd5e1;font-size:12px">—</span>'}
            </td>
            <td>
                ${a.valoresNuevos
                    ? `<button class="btn btn--ghost btn--sm"
                           onclick='verJSON("Valores Nuevos", ${JSON.stringify(a.valoresNuevos)})'>
                           <i class="ti ti-eye" style="color:#2563eb"></i>
                       </button>`
                    : '<span style="color:#cbd5e1;font-size:12px">—</span>'}
            </td>
            <td>${badgeEstadoAudit(a.exitoso)}</td>
            <td style="font-size:11px;color:#475569;max-width:160px">
                ${a.detalle || '<span style="color:#cbd5e1">—</span>'}
            </td>
        </tr>`).join('');
}

// ── Ver JSON ───────────────────────────────────────────────
function verJSON(titulo, jsonStr) {
    document.getElementById('json-titulo').textContent = titulo;
    try {
        const parsed = JSON.parse(jsonStr);
        document.getElementById('json-contenido').textContent =
            JSON.stringify(parsed, null, 2);
    } catch {
        document.getElementById('json-contenido').textContent = jsonStr;
    }
    abrirModal('modal-json');
}

// ── Filtros ────────────────────────────────────────────────
async function aplicarFiltros() {
    const modulo       = document.getElementById('filtro-modulo').value;
    const accion       = document.getElementById('filtro-accion').value;
    const desde        = document.getElementById('filtro-desde').value;
    const hasta        = document.getElementById('filtro-hasta').value;
    const soloFallidos = document.getElementById('filtro-fallidos').checked;

    let params = new URLSearchParams();
    if (modulo)       params.append('modulo',       modulo);
    if (accion)       params.append('accion',       accion);
    if (desde)        params.append('desde',        desde);
    if (hasta)        params.append('hasta',        hasta);
    if (soloFallidos) params.append('soloFallidos', 'true');

    const url = params.toString()
        ? `${API.auditoria}?${params.toString()}`
        : API.auditoria;

    auditoriaData = await fetchAPI(url);
    renderTablaAuditoria(auditoriaData);
}

function limpiarFiltros() {
    document.getElementById('filtro-modulo').value     = '';
    document.getElementById('filtro-accion').value     = '';
    document.getElementById('filtro-desde').value      = '';
    document.getElementById('filtro-hasta').value      = '';
    document.getElementById('filtro-fallidos').checked = false;
    cargarAuditoria();
}

// ── Exportar PDF ───────────────────────────────────────────
async function exportarAuditoriaPDF() {
    mostrarToast('Generando PDF de auditoría...', 'warning');

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const azul    = [37,  99, 235];
    const rojo    = [220,  38,  38];
    const blanco  = [255, 255, 255];
    const grisCla = [241, 245, 249];
    const gris    = [100, 116, 139];

    doc.setFillColor(...azul);
    doc.rect(0, 0, 297, 28, 'F');
    doc.setTextColor(...blanco);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FarmaInventory Pro — Log de Auditoría', 14, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, 14, 22);

    doc.autoTable({
        startY: 34,
        head: [['#', 'Fecha', 'Usuario', 'Acción', 'Módulo', 'Entidad', 'Estado', 'Detalle']],
        body: auditoriaData.map(a => [
            a.auditoriaID,
            new Date(a.fechaAccion).toLocaleString('es-CO'),
            a.usuarioNombre,
            a.accion,
            a.modulo,
            a.entidadNombre || '—',
            a.exitoso ? 'OK' : 'FALLIDO',
            a.detalle  || '—'
        ]),
        styles: { fontSize: 7.5, cellPadding: 3 },
        headStyles: { fillColor: azul, textColor: blanco, fontStyle: 'bold', fontSize: 8 },
        alternateRowStyles: { fillColor: grisCla },
        didParseCell: data => {
            if (data.column.index === 6 && data.section === 'body') {
                data.cell.styles.textColor = data.cell.raw === 'OK' ? [22, 163, 74] : rojo;
                data.cell.styles.fontStyle = 'bold';
            }
            if (data.column.index === 3 && data.section === 'body') {
                const colores = {
                    'Crear':      [22,  163,  74],
                    'Actualizar': [37,   99, 235],
                    'Eliminar':   rojo,
                    'Movimiento': [217, 119,   6]
                };
                data.cell.styles.textColor = colores[data.cell.raw] || gris;
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });

    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFillColor(...grisCla);
        doc.rect(0, 198, 297, 8, 'F');
        doc.setTextColor(...gris);
        doc.setFontSize(7);
        doc.text('FarmaInventory Pro — Auditoría Confidencial', 14, 203);
        doc.text(`Página ${i} de ${pages}`, 283, 203, { align: 'right' });
    }

    doc.save(`Auditoria_${new Date().toISOString().split('T')[0]}.pdf`);
    mostrarToast('PDF de auditoría descargado.', 'success');
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
async function cargarAuditoria() {
    const [eventos, resumen] = await Promise.all([
        fetchAPI(API.auditoria),
        fetchAPI(`${API.auditoria}/resumen`)
    ]);
    auditoriaData = eventos;
    renderResumen(resumen);
    renderTablaAuditoria(eventos);
}

cargarAuditoria();