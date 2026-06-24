let alertasData   = [];
let productosData = [];

// ── Carga ──────────────────────────────────────────────────
async function cargarAlertas() {
    [alertasData, productosData] = await Promise.all([
        fetchAPI(API.alertas),
        fetchAPI(API.productos)
    ]);

    renderAlertas(alertasData);
    calcularResumen();
}

function renderAlertas(lista) {
    const agotados  = lista.filter(a => a.tipoAlerta === 'Agotado').length;
    const stockBajo = lista.filter(a => a.tipoAlerta === 'StockBajo').length;

    document.getElementById('stat-agotados').textContent      = agotados;
    document.getElementById('stat-stock-bajo').textContent    = stockBajo;
    document.getElementById('stat-total-alertas').textContent = lista.length;

    const tbody = document.getElementById('tabla-alertas');

    if (!lista.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;padding:48px;color:#94a3b8">
                    <i class="ti ti-circle-check" style="font-size:40px;display:block;margin-bottom:8px;color:#16a34a"></i>
                    Sin alertas activas. ¡El inventario está al día!
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = lista.map(a => `
        <tr>
            <td>${badgeTipo(a.tipoAlerta)}</td>
            <td><strong>${a.productoNombre}</strong></td>
            <td>
                <span style="font-weight:700;font-size:16px;color:${a.stockActual === 0 ? '#dc2626' : '#d97706'}">
                    ${a.stockActual}
                </span>
                <span style="font-size:11px;color:#94a3b8"> unidades</span>
            </td>
            <td style="font-size:12px;color:#475569;max-width:280px">${a.mensaje}</td>
            <td style="font-size:12px">${formatFecha(a.fechaAlerta)}</td>
            <td>
                <button class="btn btn--success btn--sm" onclick="resolverAlerta(${a.alertaID})">
                    <i class="ti ti-check"></i> Resolver
                </button>
            </td>
        </tr>`).join('');
}

function badgeTipo(tipo) {
    const mapa = {
        'Agotado':     ['badge--red',    'ti-circle-x',        'Agotado'],
        'StockBajo':   ['badge--yellow', 'ti-alert-triangle',  'Stock Bajo'],
        'Vencimiento': ['badge--blue',   'ti-calendar-x',      'Vencimiento']
    };
    const [cls, icon, label] = mapa[tipo] || ['badge--blue', 'ti-bell', tipo];
    return `<span class="badge ${cls}"><i class="ti ${icon}"></i> ${label}</span>`;
}

// ── Filtro ─────────────────────────────────────────────────
document.getElementById('filtro-tipo').addEventListener('change', function () {
    const valor = this.value;
    renderAlertas(valor ? alertasData.filter(a => a.tipoAlerta === valor) : alertasData);
});

// ── Resolver alerta ────────────────────────────────────────
async function resolverAlerta(id) {
    await fetchAPI(`${API.alertas}/${id}/resolver`, { method: 'PUT' });
    mostrarToast('Alerta marcada como resuelta.', 'success');
    await cargarAlertas();
}

// ── Resumen inventario ─────────────────────────────────────
function calcularResumen() {
    const total    = productosData.length;
    const valor    = productosData.reduce((acc, p) => acc + (p.precioCompra * p.stockActual), 0);
    const atencion = productosData.filter(p => p.estadoStock !== 'Disponible').length;

    document.getElementById('rep-total').textContent    = total;
    document.getElementById('rep-valor').textContent    = formatCOP(valor);
    document.getElementById('rep-atencion').textContent = atencion;
}

// ── Reporte PDF ────────────────────────────────────────────
async function generarReportePDF() {
    mostrarToast('Generando reporte PDF...', 'warning');

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const azul    = [37,  99,  235];
    const grisOsc = [15,  23,  42];
    const grisMed = [100, 116, 139];
    const grisCla = [241, 245, 249];
    const blanco  = [255, 255, 255];
    const rojo    = [220,  38,  38];
    const verde   = [22,  163,  74];
    const amarillo= [217, 119,   6];

    const ahora    = new Date();
    const fechaStr = ahora.toLocaleDateString('es-CO',
        { year:'numeric', month:'long', day:'numeric' });
    const horaStr  = ahora.toLocaleTimeString('es-CO',
        { hour:'2-digit', minute:'2-digit' });

    // ── Encabezado ──
    doc.setFillColor(...azul);
    doc.rect(0, 0, 210, 38, 'F');

    doc.setTextColor(...blanco);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FarmaInventory Pro', 14, 16);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Gestión de Inventario Farmacéutico', 14, 24);
    doc.text(`Reporte generado: ${fechaStr} — ${horaStr}`, 14, 31);

    // ── KPIs ──
    const total    = productosData.length;
    const valor    = productosData.reduce((a, p) => a + p.precioCompra * p.stockActual, 0);
    const atencion = productosData.filter(p => p.estadoStock !== 'Disponible').length;

    const kpis = [
        { label: 'Total Productos', valor: total,             color: azul   },
        { label: 'Valor Inventario', valor: formatCOP(valor), color: verde  },
        { label: 'Requieren Atención', valor: atencion,       color: rojo   },
        { label: 'Alertas Activas',    valor: alertasData.length, color: amarillo }
    ];

    let kx = 14;
    kpis.forEach(k => {
        doc.setFillColor(...grisCla);
        doc.roundedRect(kx, 44, 43, 22, 3, 3, 'F');
        doc.setTextColor(...k.color);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(String(k.valor), kx + 21.5, 54, { align: 'center' });
        doc.setTextColor(...grisMed);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(k.label, kx + 21.5, 60, { align: 'center' });
        kx += 46;
    });

    // ── Tabla de productos ──
    doc.setTextColor(...grisOsc);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Inventario de Productos', 14, 76);

    doc.autoTable({
        startY: 80,
        head: [['Código', 'Producto', 'Categoría', 'P. Venta', 'Stock', 'Mín', 'Estado']],
        body: productosData.map(p => [
            p.codigoBarras,
            p.nombre.length > 32 ? p.nombre.substring(0, 32) + '…' : p.nombre,
            p.categoriaNombre,
            formatCOP(p.precioVenta),
            p.stockActual,
            p.stockMinimo,
            p.estadoStock
        ]),
        styles: {
            fontSize: 8,
            cellPadding: 3,
            font: 'helvetica'
        },
        headStyles: {
            fillColor: azul,
            textColor: blanco,
            fontStyle: 'bold',
            fontSize: 8
        },
        alternateRowStyles: { fillColor: grisCla },
        columnStyles: {
            0: { cellWidth: 28 },
            1: { cellWidth: 55 },
            2: { cellWidth: 28 },
            3: { cellWidth: 24, halign: 'right' },
            4: { cellWidth: 14, halign: 'center' },
            5: { cellWidth: 12, halign: 'center' },
            6: { cellWidth: 22 }
        },
        didParseCell: (data) => {
            if (data.column.index === 6 && data.section === 'body') {
                const val = data.cell.raw;
                if (val === 'Agotado')     data.cell.styles.textColor = rojo;
                else if (val === 'Stock Bajo') data.cell.styles.textColor = amarillo;
                else                           data.cell.styles.textColor = verde;
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });

    // ── Tabla de alertas ──
    if (alertasData.length) {
        const finalY = doc.lastAutoTable.finalY + 10;

        doc.setTextColor(...grisOsc);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Alertas Activas', 14, finalY);

        doc.autoTable({
            startY: finalY + 4,
            head: [['Tipo', 'Producto', 'Stock', 'Mensaje', 'Fecha']],
            body: alertasData.map(a => [
                a.tipoAlerta,
                a.productoNombre,
                a.stockActual,
                a.mensaje.length > 45 ? a.mensaje.substring(0, 45) + '…' : a.mensaje,
                formatFecha(a.fechaAlerta)
            ]),
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: rojo, textColor: blanco, fontStyle: 'bold', fontSize: 8 },
            alternateRowStyles: { fillColor: [255, 242, 242] },
            columnStyles: {
                0: { cellWidth: 24 },
                1: { cellWidth: 38 },
                2: { cellWidth: 14, halign: 'center' },
                3: { cellWidth: 85 },
                4: { cellWidth: 26 }
            }
        });
    }

    // ── Pie de página ──
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(...grisCla);
        doc.rect(0, 287, 210, 10, 'F');
        doc.setTextColor(...grisMed);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('FarmaInventory Pro — Confidencial', 14, 293);
        doc.text(`Página ${i} de ${totalPages}`, 196, 293, { align: 'right' });
    }

    doc.save(`FarmaInventory_Reporte_${ahora.toISOString().split('T')[0]}.pdf`);
    mostrarToast('Reporte PDF descargado exitosamente.', 'success');
}

// ── Init ───────────────────────────────────────────────────
cargarAlertas();