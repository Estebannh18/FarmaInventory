const API_BASE = 'http://localhost:5000/api';

const API = {
    productos:   `${API_BASE}/productos`,
    alertas:     `${API_BASE}/alertas`,
    movimiento:  `${API_BASE}/productos/movimiento`,
};

async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Error ${response.status}`);
        }
        if (response.status === 204) return null;
        return await response.json();
    } catch (err) {
        mostrarToast(err.message, 'error');
        throw err;
    }
}

function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = mensaje;
    toast.className = `toast toast--${tipo} toast--visible`;
    setTimeout(() => toast.classList.remove('toast--visible'), 3500);
}

function formatCOP(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(valor);
}

function formatFecha(fecha) {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-CO');
}