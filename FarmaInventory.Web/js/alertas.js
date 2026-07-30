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
        'Agotado':     ['badge--red',    'ti-circle-x',       'Agotado'],
        'StockBajo':   ['badge--yellow', 'ti-alert-triangle', 'Stock Bajo'],
        'Vencimiento': ['badge--blue',   'ti-calendar-x',     'Vencimiento']
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
    const valor    = productosData.reduce((acc, p) => acc + p.precioCompra * p.stockActual, 0);
    const atencion = productosData.filter(p => p.estadoStock !== 'Disponible').length;

    document.getElementById('rep-total').textContent    = total;
    document.getElementById('rep-valor').textContent    = formatCOP(valor);
    document.getElementById('rep-atencion').textContent = atencion;
}

// ── Helpers formato ────────────────────────────────────────
function copStr(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(valor);
}

// ── Reporte PDF mejorado ───────────────────────────────────
async function generarReportePDF() {
    mostrarToast('Generando reporte PDF...', 'warning');

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const azul     = [37,  99,  235];
    const azulOsc  = [29,  78,  216];
    const verde    = [22,  163,  74];
    const rojo     = [220,  38,  38];
    const amarillo = [217, 119,   6];
    const grisOsc  = [15,  23,  42];
    const grisMed  = [100, 116, 139];
    const grisCla  = [241, 245, 249];
    const blanco   = [255, 255, 255];

    const ahora    = new Date();
    const fechaStr = ahora.toLocaleDateString('es-CO',
        { year:'numeric', month:'long', day:'numeric' });
    const horaStr  = ahora.toLocaleTimeString('es-CO',
        { hour:'2-digit', minute:'2-digit' });

    // ── Header degradado simulado ──
    doc.setFillColor(...azulOsc);
    doc.rect(0, 0, 210, 42, 'F');
    doc.setFillColor(...azul);
    doc.rect(0, 28, 210, 14, 'F');

    // Título
    doc.setTextColor(...blanco);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('FarmaInventory', 14, 16);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(191, 219, 254);
    doc.text('PRO', 110, 16);

    doc.setTextColor(...blanco);
    doc.setFontSize(9);
    doc.text('Reporte Ejecutivo de Inventario Farmacéutico', 14, 24);
    doc.setFontSize(8);
    doc.setTextColor(191, 219, 254);
    doc.text(`Generado: ${fechaStr} a las ${horaStr}`, 14, 34);
    doc.text('Confidencial — Solo para uso interno', 130, 34);

    // ── Línea decorativa tricolor ──
    doc.setFillColor(...verde);
    doc.rect(0, 42, 70, 2, 'F');
    doc.setFillColor(...amarillo);
    doc.rect(70, 42, 70, 2, 'F');
    doc.setFillColor(...rojo);
    doc.rect(140, 42, 70, 2, 'F');

    // ── KPIs con cards ──
    const total      = productosData.length;
    const valor      = productosData.reduce((a, p) => a + p.precioCompra * p.stockActual, 0);
    const atencion   = productosData.filter(p => p.estadoStock !== 'Disponible').length;
    const disponibles = productosData.filter(p => p.estadoStock === 'Disponible').length;

    const kpis = [
        { label: 'Total Productos',   valor: total,              color: azul     },
        { label: 'Disponibles',        valor: disponibles,        color: verde    },
        { label: 'Con Problemas',      valor: atencion,           color: rojo     },
        { label: 'Alertas Activas',    valor: alertasData.length, color: amarillo }
    ];

    let kx = 14;
    kpis.forEach(k => {
        // Sombra
        doc.setFillColor(210, 210, 210);
        doc.roundedRect(kx + 1, 48, 43, 28, 4, 4, 'F');
        // Card blanca
        doc.setFillColor(...blanco);
        doc.roundedRect(kx, 47, 43, 28, 4, 4, 'F');
        // Borde superior coloreado
        doc.setFillColor(...k.color);
        doc.roundedRect(kx, 47, 43, 3, 1, 1, 'F');

        doc.setTextColor(...k.color);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(String(k.valor), kx + 21.5, 63, { align: 'center' });

        doc.setTextColor(...grisMed);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(k.label, kx + 21.5, 71, { align: 'center' });
        kx += 46;
    });

    // ── Banner valor inventario ──
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(14, 79, 182, 12, 3, 3, 'F');
    doc.setDrawColor(...azul);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, 79, 182, 12, 3, 3, 'S');
    doc.setTextColor(...azul);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('💰  Valor en inventario (precio compra):', 18, 87);
    doc.setFontSize(9);
    doc.text(copStr(valor), 155, 87, { align: 'right' });

    // ── Sección tabla productos ──
    doc.setTextColor(...grisOsc);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Inventario de Productos', 14, 100);
    doc.setFillColor(...azul);
    doc.rect(14, 101.5, 35, 0.5, 'F');

    doc.autoTable({
        startY: 104,
        head: [['Código', 'Producto', 'Categoría', 'P. Venta', 'Stock', 'Mín', 'Vence', 'Estado']],
        body: productosData.map(p => [
            p.codigoBarras,
            p.nombre.length > 28 ? p.nombre.substring(0, 28) + '…' : p.nombre,
            p.categoriaNombre,
            copStr(p.precioVenta),
            p.stockActual,
            p.stockMinimo,
            p.fechaVencimiento
                ? new Date(p.fechaVencimiento).toLocaleDateString('es-CO')
                : '—',
            p.estadoStock
        ]),
        styles: {
            fontSize: 7.5,
            cellPadding: 3,
            font: 'helvetica',
            lineColor: [226, 232, 240],
            lineWidth: 0.1
        },
        headStyles: {
            fillColor: azul,
            textColor: blanco,
            fontStyle: 'bold',
            fontSize: 8,
            cellPadding: 4
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            0: { cellWidth: 24 },
            1: { cellWidth: 50 },
            2: { cellWidth: 26 },
            3: { cellWidth: 24, halign: 'right' },
            4: { cellWidth: 13, halign: 'center' },
            5: { cellWidth: 10, halign: 'center' },
            6: { cellWidth: 22, halign: 'center' },
            7: { cellWidth: 22 }
        },
        didParseCell: data => {
            if (data.column.index === 7 && data.section === 'body') {
                const v = data.cell.raw;
                data.cell.styles.fontStyle = 'bold';
                if      (v === 'Agotado')    data.cell.styles.textColor = rojo;
                else if (v === 'Stock Bajo') data.cell.styles.textColor = amarillo;
                else                         data.cell.styles.textColor = verde;
            }
            if (data.column.index === 4 && data.section === 'body') {
                data.cell.styles.fontStyle = 'bold';
            }
        },
        margin: { left: 14, right: 14 }
    });

    // ── Sección alertas ──
    if (alertasData.length) {
        const finalY = doc.lastAutoTable.finalY + 10;

        if (finalY < 258) {
            doc.setTextColor(...grisOsc);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('Alertas Activas del Sistema', 14, finalY);
            doc.setFillColor(...rojo);
            doc.rect(14, finalY + 1.5, 35, 0.5, 'F');

            doc.autoTable({
                startY: finalY + 5,
                head: [['Tipo', 'Producto', 'Stock', 'Mensaje', 'Fecha']],
                body: alertasData.map(a => [
                    a.tipoAlerta,
                    a.productoNombre,
                    a.stockActual,
                    a.mensaje.length > 52 ? a.mensaje.substring(0, 52) + '…' : a.mensaje,
                    formatFecha(a.fechaAlerta)
                ]),
                styles: {
                    fontSize: 7.5,
                    cellPadding: 3,
                    lineColor: [254, 202, 202],
                    lineWidth: 0.1
                },
                headStyles: {
                    fillColor: rojo,
                    textColor: blanco,
                    fontStyle: 'bold',
                    fontSize: 8,
                    cellPadding: 4
                },
                alternateRowStyles: { fillColor: [255, 241, 242] },
                columnStyles: {
                    0: { cellWidth: 22 },
                    1: { cellWidth: 40 },
                    2: { cellWidth: 16, halign: 'center', fontStyle: 'bold' },
                    3: { cellWidth: 82 },
                    4: { cellWidth: 26 }
                },
                didParseCell: data => {
                    if (data.column.index === 0 && data.section === 'body') {
                        data.cell.styles.fontStyle = 'bold';
                        const v = data.cell.raw;
                        if      (v === 'Agotado')    data.cell.styles.textColor = rojo;
                        else if (v === 'StockBajo')  data.cell.styles.textColor = amarillo;
                        else                         data.cell.styles.textColor = azul;
                    }
                },
                margin: { left: 14, right: 14 }
            });
        }
    }

    // ── Pie de página ──
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(...azulOsc);
        doc.rect(0, 284, 210, 13, 'F');
        doc.setTextColor(...blanco);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('FarmaInventory Pro — Documento Confidencial', 14, 291);
        doc.setTextColor(191, 219, 254);
        doc.text('farmainventory.sistema.co', 105, 291, { align: 'center' });
        doc.setTextColor(...blanco);
        doc.text(`Página ${i} de ${totalPages}`, 196, 291, { align: 'right' });
    }

    doc.save(`FarmaInventory_Reporte_${ahora.toISOString().split('T')[0]}.pdf`);
    mostrarToast('Reporte PDF descargado exitosamente.', 'success');
}

// ── Exportar Excel ─────────────────────────────────────────
async function exportarExcel() {
    mostrarToast('Generando archivo Excel...', 'warning');

    const wb = XLSX.utils.book_new();

    // ── Hoja 1: Inventario ──
    const invHeader = [
        ['FARMA INVENTORY PRO — REPORTE DE INVENTARIO'],
        [`Generado: ${new Date().toLocaleString('es-CO')}`],
        [],
        ['Código', 'Producto', 'Categoría', 'Proveedor', 'P. Compra',
         'P. Venta', 'Stock', 'Mínimo', 'Máximo', 'Unidad', 'Vencimiento', 'Estado']
    ];

    const invData = productosData.map(p => [
        p.codigoBarras,
        p.nombre,
        p.categoriaNombre,
        p.proveedorNombre,
        p.precioCompra,
        p.precioVenta,
        p.stockActual,
        p.stockMinimo,
        p.stockMaximo,
        p.unidadMedida,
        p.fechaVencimiento
            ? new Date(p.fechaVencimiento).toLocaleDateString('es-CO')
            : '—',
        p.estadoStock
    ]);

    const wsInv = XLSX.utils.aoa_to_sheet([...invHeader, ...invData]);
    wsInv['!cols'] = [
        { wch: 16 }, { wch: 35 }, { wch: 18 }, { wch: 25 },
        { wch: 12 }, { wch: 12 }, { wch: 8  }, { wch: 8  },
        { wch: 8  }, { wch: 10 }, { wch: 14 }, { wch: 12 }
    ];
    XLSX.utils.book_append_sheet(wb, wsInv, 'Inventario');

    // ── Hoja 2: Alertas ──
    const altHeader = [
        ['FARMA INVENTORY PRO — ALERTAS ACTIVAS'],
        [`Generado: ${new Date().toLocaleString('es-CO')}`],
        [],
        ['ID', 'Tipo', 'Producto', 'Stock Actual', 'Mensaje', 'Fecha']
    ];

    const altData = alertasData.map(a => [
        a.alertaID,
        a.tipoAlerta,
        a.productoNombre,
        a.stockActual,
        a.mensaje,
        formatFecha(a.fechaAlerta)
    ]);

    const wsAlt = XLSX.utils.aoa_to_sheet([...altHeader, ...altData]);
    wsAlt['!cols'] = [
        { wch: 6 }, { wch: 12 }, { wch: 35 },
        { wch: 12 }, { wch: 55 }, { wch: 14 }
    ];
    XLSX.utils.book_append_sheet(wb, wsAlt, 'Alertas');

    // ── Hoja 3: Resumen Ejecutivo ──
    const total      = productosData.length;
    const disponibles = productosData.filter(p => p.estadoStock === 'Disponible').length;
    const bajo       = productosData.filter(p => p.estadoStock === 'Stock Bajo').length;
    const agotados   = productosData.filter(p => p.estadoStock === 'Agotado').length;
    const valCompra  = productosData.reduce((a, p) => a + p.precioCompra * p.stockActual, 0);
    const valVenta   = productosData.reduce((a, p) => a + p.precioVenta  * p.stockActual, 0);

    const resumen = [
        ['FARMA INVENTORY PRO — RESUMEN EJECUTIVO'],
        [`Generado: ${new Date().toLocaleString('es-CO')}`],
        [],
        ['Indicador',                  'Valor'],
        ['Total Productos',             total],
        ['Disponibles',                 disponibles],
        ['Stock Bajo',                  bajo],
        ['Agotados',                    agotados],
        ['Alertas Activas',             alertasData.length],
        [],
        ['Valor Inventario (Compra)',   valCompra],
        ['Valor Inventario (Venta)',    valVenta],
        ['Margen Potencial',            valVenta - valCompra],
    ];

    const wsRes = XLSX.utils.aoa_to_sheet(resumen);
    wsRes['!cols'] = [{ wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsRes, 'Resumen');

    XLSX.writeFile(wb, `FarmaInventory_${new Date().toISOString().split('T')[0]}.xlsx`);
    mostrarToast('Excel descargado exitosamente.', 'success');
}

// ── Init ───────────────────────────────────────────────────
cargarAlertas();