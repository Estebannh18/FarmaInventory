<div align="center">

<!-- HEADER ANIMADO -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00b4d8,100:0077b6&height=200&section=header&text=FarmaInventory%20Pro&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=Sistema%20de%20Gestión%20de%20Inventario%20Farmacéutico&descAlignY=58&descSize=18" width="100%"/>

<!-- BADGES PRINCIPALES -->
<p>
  <img src="https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white"/>
  <img src="https://img.shields.io/badge/C%23-12-239120?style=for-the-badge&logo=csharp&logoColor=white"/>
  <img src="https://img.shields.io/badge/SQL_Server-Express-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/ASP.NET_Core-Web_API-512BD4?style=for-the-badge&logo=dotnet&logoColor=white"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Arquitectura-N--Capas-0077b6?style=flat-square"/>
  <img src="https://img.shields.io/badge/Patrón-Repository-00b4d8?style=flat-square"/>
  <img src="https://img.shields.io/badge/ORM-Dapper-90e0ef?style=flat-square"/>
  <img src="https://img.shields.io/badge/Estado-Funcional-2dc653?style=flat-square"/>
  <img src="https://img.shields.io/badge/Licencia-MIT-gray?style=flat-square"/>
</p>

> **💊 Control total del inventario farmacéutico** — gestión de medicamentos, stock en tiempo real y alertas automáticas mediante Triggers T-SQL, todo bajo una arquitectura N-Capas limpia y escalable.

</div>

---

## 📌 Tabla de contenidos

- [Vista general](#-vista-general)
- [Características](#-características)
- [Arquitectura del sistema](#️-arquitectura-del-sistema)
- [Stack tecnológico](#️-stack-tecnológico)
- [Modelo de datos](#️-modelo-de-datos)
- [API Endpoints](#-api-endpoints)
- [Instalación](#️-instalación-y-configuración)
- [Autor](#-autor)

---

## 🔭 Vista general

FarmaInventory Pro es un sistema **fullstack** diseñado para farmacias y entidades de salud que necesitan un control riguroso de su inventario. Desarrollado como proyecto de portafolio en Semestre 6 de Ingeniería de Sistemas, implementa patrones de diseño reales usados en entornos de producción.

```
┌─────────────────────────────────────────────────────────┐
│                  FLUJO DEL SISTEMA                      │
│                                                         │
│  [Frontend JS]  ──►  [API REST C#]  ──►  [SQL Server]  │
│       │                   │                   │         │
│   Dashboard            Controllers         Stored       │
│   Productos            Repositories        Procs        │
│   Alertas              DTOs / Models       Triggers     │
│   PDF Reports          Dapper              T-SQL        │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Características

### 📊 Dashboard en tiempo real
- Métricas clave: total de productos, disponibles, stock bajo y agotados
- Tabla de productos críticos con estado visual
- Panel de alertas activas recientes

### 💊 Gestión de Productos
- CRUD completo con validaciones de negocio
- Búsqueda en tiempo real por nombre y código de barras
- Filtrado por estado de stock
- Control de productos con receta médica
- Seguimiento de fechas de vencimiento

### 📦 Control de Stock
- Registro de movimientos: **Entrada / Salida / Ajuste**
- Historial completo con usuario, fecha y motivo
- Validación de stock insuficiente en salidas

### 🔔 Alertas Automáticas via Trigger SQL
- Detección automática de stock bajo y agotado en tiempo real
- Sin intervención del backend — el Trigger escribe directamente en la tabla de alertas
- Resolución de alertas con registro de fecha

### 📄 Reportes PDF Ejecutivos
- KPIs del inventario en portada
- Tabla completa con estado coloreado por nivel de stock
- Sección de alertas activas
- Descarga automática con timestamp en el nombre del archivo

---

## 🏗️ Arquitectura del sistema

El proyecto implementa una **arquitectura N-Capas** con separación clara de responsabilidades:

```
FarmaInventory/
│
├── 📁 FarmaInventory.API/          ← Capa de Presentación / API
│   ├── Controllers/                   Endpoints REST
│   ├── Models/                        Entidades del dominio
│   ├── DTOs/                          Objetos de transferencia de datos
│   ├── Repositories/                  Patrón Repository + Dapper
│   └── Program.cs                     Configuración DI y middleware
│
├── 📁 FarmaInventory.DB/           ← Capa de Datos
│   ├── 01_CreateDatabase.sql          Tablas y relaciones
│   ├── 02_StoredProcedures.sql        Lógica de negocio en BD
│   ├── 03_Triggers.sql                Alertas automáticas
│   ├── 04_SeedData.sql                Datos iniciales
│   └── 05_MoreProducts.sql            Dataset de pruebas (opcional)
│
└── 📁 FarmaInventory.Web/          ← Capa de Presentación / Cliente
    ├── index.html                     Dashboard principal
    ├── productos.html                 Gestión de productos
    ├── alertas.html                   Alertas y reportes PDF
    ├── css/styles.css                 Estilos del sistema
    └── js/                            Lógica del cliente
```

### Decisiones de diseño destacadas

| Patrón / Técnica | Por qué se usó |
|---|---|
| **Patrón Repository** | Desacopla la lógica de negocio del acceso a datos |
| **Stored Procedures** | Centraliza la lógica de consultas en la BD, mejora rendimiento |
| **Triggers T-SQL** | Automatiza alertas sin cargar el backend |
| **Eliminación lógica** | Trazabilidad total — los datos nunca se pierden |
| **DTOs** | Evita exponer modelos internos en la API pública |
| **Dapper** | ORM ligero con control total del SQL, máximo rendimiento |

---

## 🛠️ Stack tecnológico

<div align="center">

| Capa | Tecnología | Versión |
|---|---|---|
| 🖥️ **Frontend** | HTML5, CSS3, JavaScript | ES6+ |
| ⚙️ **Backend** | C# + ASP.NET Core Web API | .NET 8 / C# 12 |
| 🗄️ **Base de datos** | SQL Server + T-SQL | Express |
| 🔗 **ORM** | Dapper | Latest |
| 📄 **PDF** | jsPDF + AutoTable | Latest |
| 🎨 **Iconos** | Tabler Icons | Latest |
| 🔤 **Fuente** | Inter | Google Fonts |

</div>

---

## 🗄️ Modelo de datos

```
┌──────────────┐        ┌──────────────────────┐
│  Categorias  │        │  MovimientosInventario│
│──────────────│        │──────────────────────│
│ Id           │◄──┐    │ Id                   │
│ Nombre       │   │    │ ProductoId  ──────────┼──►┐
└──────────────┘   │    │ UsuarioId   ──────────┼───┼──►┐
                   │    │ Tipo (E/S/A)          │   │   │
┌──────────────┐   │    │ Cantidad              │   │   │
│  Proveedores │   │    │ Motivo                │   │   │
│──────────────│   │    │ Fecha                 │   │   │
│ Id           │◄──┼──┐ └──────────────────────┘   │   │
│ Nombre       │   │  │                             │   │
│ Contacto     │   │  │ ┌──────────────────────┐   │   │
└──────────────┘   │  │ │       Alertas        │   │   │
                   │  │ │──────────────────────│   │   │
┌──────────────────┴──┴─┤ Id                   │   │   │
│      Productos         │ ProductoId  ─────────┼───┘   │
│────────────────────────│ Tipo (bajo/agotado)  │       │
│ Id                     │ Resuelta             │       │
│ CategoriaId            │ FechaResolucion      │       │
│ ProveedorId            └──────────────────────┘       │
│ Nombre, Código                                        │
│ Stock, StockMínimo                                    │
│ Precio, Vencimiento    ┌──────────────────────┐       │
│ RequiereReceta         │      Usuarios        │       │
│ Activo                 │──────────────────────│       │
└────────────────────────│ Id                   │◄──────┘
                         │ Nombre, Email        │
                         │ Rol                  │
                         └──────────────────────┘
```

---

## 📡 API Endpoints

### Productos

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/productos` | Listar todos los productos |
| `GET` | `/api/productos/{id}` | Obtener producto por ID |
| `POST` | `/api/productos` | Crear nuevo producto |
| `PUT` | `/api/productos/{id}` | Actualizar producto |
| `DELETE` | `/api/productos/{id}` | Eliminación lógica |
| `POST` | `/api/productos/movimiento` | Registrar movimiento de stock |

### Alertas

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/alertas` | Obtener alertas activas |
| `PUT` | `/api/alertas/{id}/resolver` | Resolver una alerta |

---

## ⚙️ Instalación y configuración

### Prerrequisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [SQL Server Express](https://www.microsoft.com/es-es/sql-server/sql-server-downloads)
- [SSMS](https://learn.microsoft.com/es-es/sql/ssms/download-sql-server-management-studio-ssms)
- VS Code con extensión **Live Server**

### 1. Clonar el repositorio

```bash
git clone https://github.com/Estebannh18/FarmaInventory.git
cd FarmaInventory
```

### 2. Configurar la base de datos

Abrir SSMS y ejecutar los scripts en este orden:

```sql
-- Ejecutar en orden:
01_CreateDatabase.sql       -- Crea tablas y relaciones
02_StoredProcedures.sql     -- Lógica de negocio en BD
03_Triggers.sql             -- Alertas automáticas
04_SeedData.sql             -- Datos iniciales
05_MoreProducts.sql         -- (Opcional) Dataset de pruebas
```

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

> La API queda disponible en `http://localhost:5000`

### 5. Ejecutar el frontend

Abrir `FarmaInventory.Web/index.html` con **Live Server** en VS Code.

---

## 👨‍💻 Autor

<div align="center">

**Esteban** — Estudiante de Ingeniería de Sistemas · Semestre 6

[![GitHub](https://img.shields.io/badge/GitHub-Estebannh18-181717?style=for-the-badge&logo=github)](https://github.com/Estebannh18)

*Proyecto de portafolio — construido con enfoque en buenas prácticas de arquitectura de software.*

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0077b6,100:00b4d8&height=100&section=footer" width="100%"/>

📄 Licencia MIT — libre para uso educativo y personal.

</div>
