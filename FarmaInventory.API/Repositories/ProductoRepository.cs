using Dapper;
using FarmaInventory.API.DTOs;
using FarmaInventory.API.Models;
using FarmaInventory.API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace FarmaInventory.API.Repositories
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly string _connectionString;

        public ProductoRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        private SqlConnection GetConnection() => new SqlConnection(_connectionString);

        public async Task<IEnumerable<Producto>> ObtenerTodosAsync()
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<Producto>(
                "sp_ObtenerProductos",
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Producto?> ObtenerPorIdAsync(int id)
        {
            using var conn = GetConnection();
            return await conn.QueryFirstOrDefaultAsync<Producto>(
                "sp_ObtenerProductoPorID",
                new { ProductoID = id },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<int> CrearAsync(CrearProductoDTO dto)
        {
            using var conn = GetConnection();
            var result = await conn.QueryFirstAsync<int>(
                "sp_CrearProducto",
                new {
                    dto.CodigoBarras, dto.Nombre, dto.Descripcion,
                    dto.CategoriaID, dto.ProveedorID, dto.PrecioCompra,
                    dto.PrecioVenta, dto.StockActual, dto.StockMinimo,
                    dto.StockMaximo, dto.UnidadMedida, dto.FechaVencimiento,
                    dto.RequiereReceta
                },
                commandType: System.Data.CommandType.StoredProcedure);
            return result;
        }

        public async Task ActualizarAsync(int id, ActualizarProductoDTO dto)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                "sp_ActualizarProducto",
                new {
                    ProductoID = id,
                    dto.Nombre, dto.Descripcion, dto.CategoriaID,
                    dto.ProveedorID, dto.PrecioCompra, dto.PrecioVenta,
                    dto.StockMinimo, dto.StockMaximo, dto.UnidadMedida,
                    dto.FechaVencimiento, dto.RequiereReceta
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task EliminarAsync(int id)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                "sp_EliminarProducto",
                new { ProductoID = id },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task RegistrarMovimientoAsync(MovimientoDTO dto)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                "sp_RegistrarMovimiento",
                new {
                    dto.ProductoID, dto.UsuarioID,
                    dto.TipoMovimiento, dto.Cantidad, dto.Motivo
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }
    }
}