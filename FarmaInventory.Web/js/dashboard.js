// ── Fecha ──────────────────────────────────────────────────
document.getElementById('fecha-hoy').textContent =
    new Date().toLocaleDateString('es-CO', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

// ── Referencias gráficos ───────────────────────────────────
let chartDonut     = null;
let chartTendencia = null;
let kardexGlobal   = [];
let periodoActual  = 30;

// ── Helpers visuales ───────────────────────────────────────
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

function barraStock(actual, minimo, maximo) {
    const pct    = maximo > 0 ? Math.min((actual / maximo) * 100, 100) : 0;
    const minPct = maximo > 0 ? Math.min((minimo / maximo) * 100, 100) : 0;
    const color  = actual === 0 ? 'red' : actual <= minimo ? 'yellow' : 'green';
    return `
        <div class="stock-bar-wrap">
            <div class="stock-bar-labels">
                <span class="val">${actual}</span>
                <span class="max">máx ${maximo}</span>
            </div>
            <div class="stock-bar-track">
                <div class="stock-bar-fill stock-bar-fill--${color}" style="width:${pct}%"></div>
                <div class="stock-bar-min" style="left:${minPct}%" title="Mínimo: ${minimo}"></div>
            </div>
        </div>`;
}

function badgeEstado(estado) {
    const mapa = {
        'Disponible': 'badge--green',
        'Stock Bajo':  'badge--yellow',
        'Agotado':     'badge--red'
    };
    return `<span class="badge ${mapa[estado] || 'badge--blue'}">${estado}</span>`;
}

// ── Gráfico Donut ──────────────────────────────────────────
function renderDonut(disponibles, bajo, agotados) {
    const ctx = document.getElementById('chart-donut').getContext('2d');
    if (chartDonut) chartDonut.destroy();

    const gVerde = ctx.createLinearGradient(0, 0, 0, 200);
    gVerde.addColorStop(0, '#22c55e');
    gVerde.addColorStop(1, '#15803d');

    const gAmarillo = ctx.createLinearGradient(0, 0, 200, 0);
    gAmarillo.addColorStop(0, '#fbbf24');
    gAmarillo.addColorStop(1, '#d97706');

    const gRojo = ctx.createLinearGradient(0, 200, 0, 0);
    gRojo.addColorStop(0, '#f87171');
    gRojo.addColorStop(1, '#b91c1c');

    chartDonut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Disponible', 'Stock Bajo', 'Agotado'],
            datasets: [{
                data: [disponibles, bajo, agotados],
                backgroundColor: [gVerde, gAmarillo, gRojo],
                borderWidth: 3,
                borderColor: '#ffffff',
                hoverBorderWidth: 4,
                hoverOffset: 10
            }]
        },
        options: {
            cutout: '68%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    titleColor: '#f8fafc',
                    bodyColor: '#94a3b8',
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: ctx => ` ${ctx.label}: ${ctx.raw} productos`
                    }
                }
            },
            animation: { animateScale: true, duration: 800, easing: 'easeInOutQuart' }
        },
        plugins: [{
            id: 'centro',
            afterDraw(chart) {
                const { ctx, chartArea: { width, height, left, top } } = chart;
                const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const cx = left + width  / 2;
                const cy = top  + height / 2;
                ctx.save();
                ctx.textAlign    = 'center';
                ctx.textBaseline = 'middle';
                ctx.font         = 'bold 28px Inter, system-ui';
                ctx.fillStyle    = '#0f172a';
                ctx.fillText(total, cx, cy - 10);
                ctx.font         = '12px Inter, system-ui';
                ctx.fillStyle    = '#94a3b8';
                ctx.fillText('productos', cx, cy + 14);
                ctx.restore();
            }
        }]
    });

    document.getElementById('leg-disponible').textContent = disponibles;
    document.getElementById('leg-bajo').textContent       = bajo;
    document.getElementById('leg-agotado').textContent    = agotados;
}

// ── Gráfico Tendencia ──────────────────────────────────────
function renderTendencia(dias) {
    const hoy    = new Date();
    const labels = [];
    const entradas = [];
    const salidas  = [];

    // Generar etiquetas de fechas
    for (let i = dias - 1; i >= 0; i--) {
        const d = new Date(hoy);
        d.setDate(hoy.getDate() - i);
        const key = d.toISOString().split('T')[0];
        labels.push(dias <= 7
            ? d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' })
            : dias <= 30
                ? d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
                : d.toLocaleDateString('es-CO', { month: 'short', year: '2-digit' })
        );

        const movsDia = kardexGlobal.filter(m => {
            const fecha = new Date(m.fechaMovimiento).toISOString().split('T')[0];
            return fecha === key;
        });

        entradas.push(movsDia.filter(m => m.tipoMovimiento === 'Entrada').length);
        salidas.push(movsDia.filter(m => m.tipoMovimiento === 'Salida').length);
    }

    const ctx = document.getElementById('chart-tendencia').getContext('2d');
    if (chartTendencia) chartTendencia.destroy();

    // Gradiente área entrada
    const gradEntrada = ctx.createLinearGradient(0, 0, 0, 200);
    gradEntrada.addColorStop(0,   'rgba(37, 99, 235, 0.25)');
    gradEntrada.addColorStop(0.7, 'rgba(37, 99, 235, 0.05)');
    gradEntrada.addColorStop(1,   'rgba(37, 99, 235, 0)');

    // Gradiente área salida
    const gradSalida = ctx.createLinearGradient(0, 0, 0, 200);
    gradSalida.addColorStop(0,   'rgba(220, 38, 38, 0.15)');
    gradSalida.addColorStop(0.7, 'rgba(220, 38, 38, 0.03)');
    gradSalida.addColorStop(1,   'rgba(220, 38, 38, 0)');

    chartTendencia = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Entradas',
                    data: entradas,
                    borderColor: '#2563eb',
                    backgroundColor: gradEntrada,
                    borderWidth: 2.5,
                    pointRadius: dias <= 7 ? 5 : 3,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#2563eb',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    fill: true,
                    tension: 0.45
                },
                {
                    label: 'Salidas',
                    data: salidas,
                    borderColor: '#dc2626',
                    backgroundColor: gradSalida,
                    borderWidth: 2,
                    pointRadius: dias <= 7 ? 5 : 3,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#dc2626',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    fill: true,
                    tension: 0.45
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        borderRadius: 3,
                        useBorderRadius: true,
                        font: { size: 11, family: 'Inter' },
                        color: '#94a3b8',
                        padding: 12
                    }
                },
                tooltip: {
                    backgroundColor: '#0f172a',
                    titleColor: '#f8fafc',
                    bodyColor: '#94a3b8',
                    padding: 12,
                    cornerRadius: 8,
                    borderColor: '#334155',
                    borderWidth: 1,
                    callbacks: {
                        label: ctx => ` ${ctx.dataset.label}: ${ctx.raw} mov.`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: {
                        font: { size: 10, family: 'Inter' },
                        color: '#94a3b8',
                        maxTicksLimit: dias <= 7 ? 7 : dias <= 30 ? 10 : 12,
                        maxRotation: 0
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(148,163,184,0.08)',
                        drawBorder: false
                    },
                    border: { display: false, dash: [4, 4] },
                    ticks: {
                        font: { size: 10, family: 'Inter' },
                        color: '#94a3b8',
                        stepSize: 1,
                        precision: 0
                    },
                    beginAtZero: true
                }
            },
            animation: {
                duration: 700,
                easing: 'easeInOutQuart'
            }
        }
    });

    // Mini KPIs
    const movsPeriodo = kardexGlobal.filter(m => {
        const fecha = new Date(m.fechaMovimiento);
        const diff  = (hoy - fecha) / (1000 * 60 * 60 * 24);
        return diff <= dias;
    });

    const totalMov  = movsPeriodo.length;
    const totalEnt  = movsPeriodo.filter(m => m.tipoMovimiento === 'Entrada').length;
    const totalSal  = movsPeriodo.filter(m => m.tipoMovimiento === 'Salida').length;

    // Top producto
    const conteo = {};
    movsPeriodo.forEach(m => {
        conteo[m.productoNombre] = (conteo[m.productoNombre] || 0) + 1;
    });
    const topProducto = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0];

    // Top categoría
    const conteoC = {};
    movsPeriodo.forEach(m => {
        conteoC[m.categoriaNombre] = (conteoC[m.categoriaNombre] || 0) + 1;
    });
    const topCategoria = Object.entries(conteoC).sort((a, b) => b[1] - a[1])[0];

    document.getElementById('mk-movimientos').textContent = totalMov;
    document.getElementById('mk-entradas').textContent    = totalEnt;
    document.getElementById('mk-salidas').textContent     = totalSal;
    document.getElementById('mk-top').textContent         = topProducto
        ? topProducto[0].length > 16
            ? topProducto[0].substring(0, 16) + '…'
            : topProducto[0]
        : '—';
    document.getElementById('mk-categoria').textContent   = topCategoria ? topCategoria[0] : '—';

    // Badge crecimiento
    const periodoAnterior = kardexGlobal.filter(m => {
        const fecha = new Date(m.fechaMovimiento);
        const diff  = (hoy - fecha) / (1000 * 60 * 60 * 24);
        return diff > dias && diff <= dias * 2;
    }).length;

    const badge = document.getElementById('badge-crecimiento');
    if (periodoAnterior > 0) {
        const pct = Math.round(((totalMov - periodoAnterior) / periodoAnterior) * 100);
        const subida = pct >= 0;
        badge.innerHTML = `<i class="ti ti-trending-${subida ? 'up' : 'down'}"></i> ${subida ? '+' : ''}${pct}% vs período anterior`;
        badge.style.background = subida ? '#dcfce7' : '#fee2e2';
        badge.style.color      = subida ? '#16a34a' : '#dc2626';
    } else {
        badge.innerHTML = `<i class="ti ti-minus"></i> Sin datos previos`;
        badge.style.background = '#f1f5f9';
        badge.style.color      = '#64748b';
    }
}

// ── Cambiar período ────────────────────────────────────────
function cambiarPeriodo(dias, btn) {
    periodoActual = dias;
    document.querySelectorAll('.periodo-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTendencia(dias);
}

// ── Valor inventario ───────────────────────────────────────
function renderValorInventario(productos) {
    const compra = productos.reduce((a, p) => a + p.precioCompra * p.stockActual, 0);
    const venta  = productos.reduce((a, p) => a + p.precioVenta  * p.stockActual, 0);
    const margen = venta - compra;
    document.getElementById('val-compra').textContent = formatCOP(compra);
    document.getElementById('val-venta').textContent  = formatCOP(venta);
    document.getElementById('val-margen').textContent = formatCOP(margen);
}

// ── Actividad reciente ─────────────────────────────────────
function renderActividad(actividad) {
    const contenedor = document.getElementById('lista-alertas-dash');
    if (!actividad || !actividad.length) {
        contenedor.innerHTML = `<p style="color:#94a3b8;font-size:13px;text-align:center;padding:20px 0">Sin actividad reciente</p>`;
        return;
    }

    const iconos = {
        'Movimiento': { icon: 'ti-arrows-exchange', color: '#2563eb', bg: '#dbeafe' },
        'Alerta':     { icon: 'ti-bell',            color: '#d97706', bg: '#fef9c3' },
        'Auditoria':  { icon: 'ti-shield-check',    color: '#16a34a', bg: '#dcfce7' }
    };

    contenedor.innerHTML = actividad.slice(0, 4).map(a => {
        const cfg = iconos[a.tipo] || { icon: 'ti-circle', color: '#64748b', bg: '#f1f5f9' };
        return `
            <div class="alert-item">
                <div style="width:34px;height:34px;border-radius:8px;background:${cfg.bg};
                     display:flex;align-items:center;justify-content:center;
                     font-size:16px;color:${cfg.color};flex-shrink:0">
                    <i class="ti ${cfg.icon}"></i>
                </div>
                <div class="alert-item__info" style="flex:1">
                    <strong>${a.descripcion}</strong>
                    <span>${a.detalle} — ${a.usuario}</span>
                </div>
                <span style="font-size:10px;color:#94a3b8;white-space:nowrap">
                    ${new Date(a.fecha).toLocaleTimeString('es-CO',
                        {hour:'2-digit', minute:'2-digit'})}
                </span>
            </div>`;
    }).join('');
}
// ── Próximos vencimientos ──────────────────────────────────
function renderVencimientos(lotes) {
    const contenedor = document.getElementById('lista-vencimientos');
    if (!contenedor) return;

    const hoy = new Date();

    // Filtrar solo los que vencen en los próximos 90 días y tienen stock
    const proximos = lotes
        .filter(l => l.diasParaVencer >= 0 && l.diasParaVencer <= 90 && l.cantidadActual > 0)
        .sort((a, b) => a.diasParaVencer - b.diasParaVencer)
        .slice(0, 4);

    if (!proximos.length) {
        contenedor.innerHTML = `
            <div style="padding:24px;text-align:center;color:#94a3b8">
                <i class="ti ti-calendar-check" style="font-size:32px;display:block;margin-bottom:8px;color:#16a34a"></i>
                <span style="font-size:13px">Sin vencimientos próximos</span>
            </div>`;
        return;
    }

    contenedor.innerHTML = proximos.map((l, i) => {
        const dias = l.diasParaVencer;
        const fecha = new Date(l.fechaVencimiento).toLocaleDateString('es-CO', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        // Badge según urgencia
        let badgeCls, badgeLabel, badgeIcon, tiempoColor;
        if (dias <= 3) {
            badgeCls    = 'badge--red';
            badgeLabel  = 'Urgente';
            badgeIcon   = 'ti-alert-circle';
            tiempoColor = '#dc2626';
        } else if (dias <= 10) {
            badgeCls    = 'badge--yellow';
            badgeLabel  = 'Próximo';
            badgeIcon   = 'ti-clock';
            tiempoColor = '#d97706';
        } else {
            badgeCls    = 'badge--green';
            badgeLabel  = 'Normal';
            badgeIcon   = 'ti-circle-check';
            tiempoColor = '#16a34a';
        }

        // Texto de tiempo
        const tiempoTexto = dias === 0
            ? 'Vence hoy'
            : dias === 1
                ? 'En 1 día'
                : `En ${dias} días`;

        const esBorde = i < proximos.length - 1;

        return `
            <div style="padding:12px 16px;${esBorde ? 'border-bottom:1px solid var(--border);' : ''}display:flex;align-items:flex-start;gap:12px">
                <div style="width:36px;height:36px;border-radius:8px;
                     background:${dias <= 3 ? '#fee2e2' : dias <= 10 ? '#fef9c3' : '#dcfce7'};
                     display:flex;align-items:center;justify-content:center;
                     font-size:17px;color:${tiempoColor};flex-shrink:0">
                    <i class="ti ${badgeIcon}"></i>
                </div>
                <div style="flex:1;min-width:0">
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:2px">
                        <strong style="font-size:12px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px">
                            ${l.productoNombre}
                        </strong>
                        <span class="badge ${badgeCls}" style="flex-shrink:0;font-size:10px">
                            ${badgeLabel}
                        </span>
                    </div>
                    <div style="font-size:11px;color:var(--text-muted);margin-bottom:3px">
                        Lote <code style="font-size:10px;background:var(--bg);padding:1px 5px;border-radius:3px;border:1px solid var(--border)">${l.numeroLote}</code>
                    </div>
                    <div style="display:flex;align-items:center;justify-content:space-between">
                        <span style="font-size:11px;color:var(--text-muted)">
                            <i class="ti ti-calendar" style="font-size:12px"></i> ${fecha}
                        </span>
                        <span style="font-size:12px;font-weight:700;color:${tiempoColor}">
                            ${tiempoTexto}
                        </span>
                    </div>
                </div>
            </div>`;
    }).join('');
}

// ── Carga principal ────────────────────────────────────────
async function cargarDashboard() {
    try {
const [productos, alertas, actividad, kardex, lotes] = await Promise.all([
    fetchAPI(API.productos),
    fetchAPI(API.alertas),
    fetchAPI(API.actividad),
    fetchAPI(API.kardex),
    fetchAPI(API.alertasVencimiento + '?dias=90')
]);

        kardexGlobal = kardex;

        // Stats
        const total       = productos.length;
        const disponibles = productos.filter(p => p.estadoStock === 'Disponible').length;
        const bajo        = productos.filter(p => p.estadoStock === 'Stock Bajo').length;
        const agotados    = productos.filter(p => p.estadoStock === 'Agotado').length;

        document.getElementById('stat-total').textContent       = total;
        document.getElementById('stat-disponibles').textContent = disponibles;
        document.getElementById('stat-bajo').textContent        = bajo;
        document.getElementById('stat-agotados').textContent    = agotados;
        document.getElementById('badge-alertas').textContent    = alertas.length;

        // Renders
        renderDonut(disponibles, bajo, agotados);
        renderValorInventario(productos);
        renderTendencia(periodoActual);
        renderActividad(actividad);
        renderVencimientos(lotes);

        // Tabla críticos
        const criticos = productos
        .filter(p => p.estadoStock !== 'Disponible')
        .slice(0, 4);

        const tbody = document.getElementById('tabla-criticos');
tbody.innerHTML = criticos.length
    ? criticos.map(p => `
        <tr>
            <td style="max-width:0">
                <strong style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;
                    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text)">
                    ${p.nombre}
                </strong>
                ${chipCategoria(p.categoriaNombre)}
            </td>
            <td style="white-space:nowrap">
                ${barraStock(p.stockActual, p.stockMinimo, p.stockMaximo)}
            </td>
            <td style="white-space:nowrap">
                ${badgeEstado(p.estadoStock)}
            </td>
        </tr>`).join('')
    : `<tr><td colspan="3" style="text-align:center;color:#94a3b8;padding:24px">
           Sin productos críticos 
       </td></tr>`;

    } catch (err) {
        console.error('Error cargando dashboard:', err);
    }
}

// ── Init ───────────────────────────────────────────────────
cargarDashboard();