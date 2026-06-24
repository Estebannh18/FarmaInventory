document.getElementById('fecha-hoy').textContent =
    new Date().toLocaleDateString('es-CO', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

async function cargarDashboard() {
    const [productos, alertas] = await Promise.all([
        fetchAPI(API.productos),
        fetchAPI(API.alertas)
    ]);

    // Stats
    const total       = productos.length;
    const disponibles = productos.filter(p => p.estadoStock === 'Disponible').length;
    const bajo        = productos.filter(p => p.estadoStock === 'Stock Bajo').length;
    const agotados    = productos.filter(p => p.estadoStock === 'Agotado').length;

    document.getElementById('stat-total').textContent      = total;
    document.getElementById('stat-disponibles').textContent = disponibles;
    document.getElementById('stat-bajo').textContent       = bajo;
    document.getElementById('stat-agotados').textContent   = agotados;
    document.getElementById('badge-alertas').textContent   = alertas.length;

    // Tabla críticos (agotados + stock bajo)
    const criticos = productos
        .filter(p => p.estadoStock !== 'Disponible')
        .slice(0, 8);

    const tbody = document.getElementById('tabla-criticos');
    tbody.innerHTML = criticos.length ? criticos.map(p => `
        <tr>
            <td><strong>${p.nombre}</strong><br><span style="font-size:11px;color:#94a3b8">${p.categoriaNombre}</span></td>
            <td>${p.stockActual} ${p.unidadMedida}</td>
            <td>${badgeEstado(p.estadoStock)}</td>
        </tr>`).join('') :
        `<tr><td colspan="3" style="text-align:center;color:#94a3b8;padding:24px">Sin productos críticos 🎉</td></tr>`;

    // Alertas recientes
    const contenedor = document.getElementById('lista-alertas-dash');
    contenedor.innerHTML = alertas.length ? alertas.slice(0, 5).map(a => `
        <div class="alert-item">
            <div class="alert-item__icon alert-item__icon--${a.tipoAlerta === 'Agotado' ? 'red' : 'yellow'}">
                <i class="ti ti-${a.tipoAlerta === 'Agotado' ? 'circle-x' : 'alert-triangle'}"></i>
            </div>
            <div class="alert-item__info">
                <strong>${a.productoNombre}</strong>
                <span>${a.mensaje}</span>
            </div>
        </div>`).join('') :
        `<p style="color:#94a3b8;font-size:13px;text-align:center;padding:20px 0">Sin alertas activas ✅</p>`;
}

function badgeEstado(estado) {
    const mapa = {
        'Disponible': 'badge--green',
        'Stock Bajo':  'badge--yellow',
        'Agotado':     'badge--red'
    };
    return `<span class="badge ${mapa[estado] || 'badge--blue'}">${estado}</span>`;
}

cargarDashboard();