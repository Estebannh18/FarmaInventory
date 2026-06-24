# 💊 FarmaInventory Pro

Sistema de gestión de inventario farmacéutico desarrollado con arquitectura N-Capas, 
diseñado para el control eficiente de medicamentos, stock y alertas automáticas.

![Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![C#](https://img.shields.io/badge/C%23-ASP.NET%20Core-blue)
![SQL Server](https://img.shields.io/badge/Database-SQL%20Server-red)
![JavaScript](https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-yellow)

---

## 🏗️ Arquitectura
FarmaInventory/

├── FarmaInventory.API/          → Backend C# ASP.NET Core Web API

│   ├── Controllers/             → Endpoints REST

│   ├── Models/                  → Entidades del dominio

│   ├── DTOs/                    → Objetos de transferencia

│   ├── Repositories/            → Patrón Repository + Dapper

│   └── Program.cs               → Configuración DI y middleware

├── FarmaInventory.DB/           → Scripts SQL Server

│   ├── 01_CreateDatabase.sql    → Tablas y relaciones

│   ├── 02_StoredProcedures.sql  → Lógica de negocio en BD

│   ├── 03_Triggers.sql          → Alertas automáticas

│   ├── 04_SeedData.sql          → Datos iniciales

│   └── 05_MoreProducts.sql      → Dataset de pruebas

└── FarmaInventory.Web/          → Frontend Vanilla JS

├── index.html               → Dashboard principal

├── productos.html           → Gestión de productos

├── alertas.html             → Alertas y reportes PDF

├── css/styles.css           → Estilos del sistema

└── js/                      → Lógica del cliente

---

## ✨ Funcionalidades

### 📊 Dashboard
- Métricas en tiempo real (total productos, disponibles, stock bajo, agotados)
- Tabla de productos críticos
- Panel de alertas activas recientes

### 💊 Gestión de Productos
- CRUD completo con validaciones
- Búsqueda en tiempo real por nombre y código de barras
- Filtrado por estado de stock
- Control de productos con receta médica
- Fechas de vencimiento

### 📦 Control de Stock
- Registro de movimientos (Entrada / Salida / Ajuste)
- Historial completo con usuario y motivo
- Validación de stock insuficiente en salidas

### 🔔 Alertas Automáticas
- Trigger SQL que detecta stock bajo y agotado en tiempo real
- Filtrado por tipo de alerta
- Resolución de alertas con registro de fecha

### 📄 Reportes PDF
- Reporte ejecutivo con KPIs
- Tabla completa de inventario con estado coloreado
- Sección de alertas activas
- Pie de página con paginación
- Descarga automática con fecha en el nombre

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript ES6+ |
| Backend | C# 12, ASP.NET Core 8, Dapper |
| Base de datos | SQL Server Express, T-SQL |
| PDF | jsPDF + jsPDF AutoTable |
| Íconos | Tabler Icons |
| Fuente | Inter (Google Fonts) |

---

## ⚙️ Instalación y configuración

### Prerrequisitos
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [SQL Server Express](https://www.microsoft.com/es-es/sql-server/sql-server-downloads)
- [SSMS](https://learn.microsoft.com/es-es/sql/ssms/download-sql-server-management-studio-ssms)
- [VS Code](https://code.visualstudio.com/) con extensión Live Server

### 1. Clonar el repositorio
```bash
git clone https://github.com/Estebannh18/FarmaInventory.git
cd FarmaInventory
```

### 2. Configurar la base de datos
Abrir SSMS y ejecutar los scripts en orden:
FarmaInventory.DB/01_CreateDatabase.sql

FarmaInventory.DB/02_StoredProcedures.sql

FarmaInventory.DB/03_Triggers.sql

FarmaInventory.DB/04_SeedData.sql

FarmaInventory.DB/05_MoreProducts.sql   ← opcional, datos de prueba

### 3. Configurar la cadena de conexión
Editar `FarmaInventory.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=FarmaInventoryDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 4. Ejecutar el backend
```bash
cd FarmaInventory.API
dotnet restore
dotnet run
```
La API quedará disponible en `http://localhost:5000`

### 5. Ejecutar el frontend
Abrir `FarmaInventory.Web/index.html` con **Live Server** en VS Code.

---

## 📡 Endpoints API

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Obtener todos los productos |
| GET | `/api/productos/{id}` | Obtener producto por ID |
| POST | `/api/productos` | Crear producto |
| PUT | `/api/productos/{id}` | Actualizar producto |
| DELETE | `/api/productos/{id}` | Eliminar producto (lógico) |
| POST | `/api/productos/movimiento` | Registrar movimiento de stock |

### Alertas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/alertas` | Obtener alertas activas |
| PUT | `/api/alertas/{id}/resolver` | Resolver una alerta |

---

## 🗄️ Modelo de datos
Categorias ──┐

├── Productos ──── MovimientosInventario

Proveedores ─┘       │

└──── Alertas

Usuarios ─────────── MovimientosInventario

### Tablas principales
- **Productos** — Catálogo completo con precios, stock y vencimiento
- **Categorias** — Clasificación farmacéutica
- **Proveedores** — Laboratorios y distribuidores
- **MovimientosInventario** — Trazabilidad completa de entradas y salidas
- **Alertas** — Generadas automáticamente por trigger T-SQL
- **Usuarios** — Control de acceso por roles

---

## 🚀 Características técnicas destacadas

- **Patrón Repository** — Separación de responsabilidades entre lógica de negocio y acceso a datos
- **Stored Procedures** — Toda la lógica de consultas en la base de datos, no en el código
- **Triggers T-SQL** — Automatización de alertas sin intervención del backend
- **Eliminación lógica** — Los productos nunca se borran físicamente, se desactivan
- **CORS configurado** — Comunicación segura entre frontend y backend
- **DTOs** — Separación entre modelos de dominio y datos expuestos por la API
- **Dapper** — ORM ligero para máximo rendimiento en consultas

---

## 👨‍💻 Autor

**Juan** — Estudiante de Ingeniería de Sistemas  
Proyecto de portafolio — Semestre 6

---

## 📄 Licencia

MIT License — libre para uso educativo y personal.