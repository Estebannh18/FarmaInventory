let kardexData = [];

// ── Badges tipo movimiento ─────────────────────────────────
function badgeTipo(tipo) {
    const mapa = {
        'Entrada': ['badge--green',  'ti-arrow-bar-to-down', 'Entrada'],
        'Salida':  ['badge--red',    'ti-arrow-bar-up',      'Salida'],
        'Ajuste':  ['badge--yellow', 'ti-adjustments',       'Ajuste']
    };
    const [cls, icon, label] = mapa[tipo] || ['badge--blue', 'ti-circle', tipo];
    return `<span class="badge ${cls}"><i class="ti ${icon}"></i> ${label}</span>`;
}

function badgeStockCambio(anterior, nuevo) {
    const diff  = nuevo - anterior;
    const color = diff > 0 ? '#16a34a' : diff < 0 ? '#dc2626' : '#64748b';
    const icon  = diff > 0 ? 'ti-trending-up' : diff < 0 ? 'ti-trending-down' : 'ti-minus';
    return `
        <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:13px;font-weight:700;color:#334155">${nuevo}</span>
            <span style="font-size:11px;color:${color};font-weight:600">
                <i class="ti ${icon}"></i>${diff > 0 ? '+' : ''}${diff}
            </span>
        </div>`;
}

// ── Render tabla ───────────────────────────────────────────
function renderKardex(lista) {
    document.getElementById('kardex-contador').textContent =
        `${lista.length} movimiento${lista.length !== 1 ? 's' : ''}`;

    // Stats
    document.getElementById('sk-total').textContent    = lista.length;
    document.getElementById('sk-entradas').textContent = lista.filter(m => m.tipoMovimiento === 'Entrada').length;
    document.getElementById('sk-salidas').textContent  = lista.filter(m => m.tipoMovimiento === 'Salida').length;
    document.getElementById('sk-ajustes').textContent  = lista.filter(m => m.tipoMovimiento === 'Ajuste').length;

    const tbody = document.getElementById('tabla-kardex');

    if (!lista.length) {
        tbody.innerHTML = `
            <tr><td colspan="10" style="text-align:center;padding:48px;color:#94a3b8">
                <i class="ti ti-history" style="font-size:36px;display:block;margin-bottom:8px"></i>
                Sin movimientos registrados
            </td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map((m, i) => `
        <tr>
            <td style="font-size:11px;color:#94a3b8;font-weight:600">#${m.movimientoID}</td>
            <td>
                <span style="font-size:12px;font-weight:500;color:#334155">
                    ${new Date(m.fechaMovimiento).toLocaleDateString('es-CO')}
                </span><br>
                <span style="font-size:10px;color:#94a3b8">
                    ${new Date(m.fechaMovimiento).toLocaleTimeString('es-CO', {hour:'2-digit',minute:'2-digit'})}
                </span>
            </td>
            <td>
                <strong style="font-size:12px">${m.productoNombre}</strong><br>
                <code style="font-size:10px;background:#f1f5f9;padding:1px 5px;border-radius:3px">${m.codigoBarras}</code>
            </td>
            <td>${chipCategoria(m.categoriaNombre)}</td>
            <td>
                <div style="display:flex;align-items:center;gap:6px">
                    <div style="width:26px;height:26px;border-radius:50%;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#2563eb;flex-shrink:0">
                        ${m.usuarioNombre.charAt(0).toUpperCase()}
                    </div>
                    <span style="font-size:12px">${m.usuarioNombre}</span>
                </div>
            </td>
            <td>${badgeTipo(m.tipoMovimiento)}</td>
            <td style="font-size:14px;font-weight:700;text-align:center">${m.cantidad}</td>
            <td style="font-size:13px;color:#64748b;text-align:center">${m.stockAnterior}</td>
            <td>${badgeStockCambio(m.stockAnterior, m.stockNuevo)}</td>
            <td style="font-size:12px;color:#475569;max-width:160px">
                ${m.motivo || '<span style="color:#cbd5e1">—</span>'}
            </td>
        </tr>`).join('');
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

// ── Filtros ────────────────────────────────────────────────
async function aplicarFiltros() {
    const buscar = document.getElementById('filtro-buscar').value.toLowerCase();
    const tipo   = document.getElementById('filtro-tipo').value;
    const desde  = document.getElementById('filtro-desde').value;
    const hasta  = document.getElementById('filtro-hasta').value;

    let params = new URLSearchParams();
    if (tipo)  params.append('tipo',  tipo);
    if (desde) params.append('desde', desde);
    if (hasta) params.append('hasta', hasta);

    const url = params.toString()
        ? `${API.kardex}?${params.toString()}`
        : API.kardex;

    kardexData = await fetchAPI(url);

    const filtrado = buscar
        ? kardexData.filter(m => m.productoNombre.toLowerCase().includes(buscar))
        : kardexData;

    renderKardex(filtrado);
}

function limpiarFiltros() {
    document.getElementById('filtro-buscar').value = '';
    document.getElementById('filtro-tipo').value   = '';
    document.getElementById('filtro-desde').value  = '';
    document.getElementById('filtro-hasta').value  = '';
    cargarKardex();
}

document.getElementById('filtro-buscar').addEventListener('input', () => {
    const buscar = document.getElementById('filtro-buscar').value.toLowerCase();
    const filtrado = buscar
        ? kardexData.filter(m => m.productoNombre.toLowerCase().includes(buscar))
        : kardexData;
    renderKardex(filtrado);
});

// ── Exportar PDF ───────────────────────────────────────────
async function exportarKardexPDF() {
    mostrarToast('Generando PDF del Kardex...', 'warning');

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const azul   = [37, 99, 235];
    const blanco = [255, 255, 255];
    const gris   = [100, 116, 139];
    const grisCla= [241, 245, 249];

    // Header
    doc.setFillColor(...azul);
    doc.rect(0, 0, 297, 28, 'F');
    doc.setTextColor(...blanco);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FarmaInventory Pro — Kardex de Movimientos', 14, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, 14, 22);

    // Tabla
    doc.autoTable({
        startY: 34,
        head: [['#', 'Fecha', 'Producto', 'Categoría', 'Usuario', 'Tipo', 'Cantidad', 'Stock Ant.', 'Stock Nuevo', 'Motivo']],
        body: kardexData.map(m => [
            m.movimientoID,
            new Date(m.fechaMovimiento).toLocaleString('es-CO'),
            m.productoNombre.length > 25 ? m.productoNombre.substring(0, 25) + '…' : m.productoNombre,
            m.categoriaNombre,
            m.usuarioNombre,
            m.tipoMovimiento,
            m.cantidad,
            m.stockAnterior,
            m.stockNuevo,
            m.motivo || '—'
        ]),
        styles: { fontSize: 7.5, cellPadding: 3 },
        headStyles: { fillColor: azul, textColor: blanco, fontStyle: 'bold', fontSize: 8 },
        alternateRowStyles: { fillColor: grisCla },
        didParseCell: data => {
            if (data.column.index === 5 && data.section === 'body') {
                const val = data.cell.raw;
                if (val === 'Entrada') data.cell.styles.textColor = [22, 163, 74];
                else if (val === 'Salida') data.cell.styles.textColor = [220, 38, 38];
                else data.cell.styles.textColor = [217, 119, 6];
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });

    // Footer
    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFillColor(...grisCla);
        doc.rect(0, 198, 297, 8, 'F');
        doc.setTextColor(...gris);
        doc.setFontSize(7);
        doc.text('FarmaInventory Pro — Kardex Confidencial', 14, 203);
        doc.text(`Página ${i} de ${pages}`, 283, 203, { align: 'right' });
    }

    doc.save(`Kardex_${new Date().toISOString().split('T')[0]}.pdf`);
    mostrarToast('Kardex PDF descargado.', 'success');
}

// ── Init ───────────────────────────────────────────────────
async function cargarKardex() {
    kardexData = await fetchAPI(API.kardex);
    renderKardex(kardexData);
}

cargarKardex();