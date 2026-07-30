// ── Tema oscuro/claro ──────────────────────────────────────
const THEME_KEY = 'farma-theme';

function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem(THEME_KEY, tema);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.innerHTML = tema === 'dark'
            ? '<i class="ti ti-sun"></i>'
            : '<i class="ti ti-moon"></i>';
        btn.title = tema === 'dark' ? 'Modo claro' : 'Modo oscuro';
    }
}

function toggleTema() {
    const actual = document.documentElement.getAttribute('data-theme') || 'light';
    aplicarTema(actual === 'dark' ? 'light' : 'dark');
}

// Aplicar tema guardado al cargar
(function () {
    const guardado = localStorage.getItem(THEME_KEY) || 'light';
    aplicarTema(guardado);
})();