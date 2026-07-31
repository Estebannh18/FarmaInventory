using Dapper;
using FarmaInventory.API.DTOs;
using FarmaInventory.API.Models;
using FarmaInventory.API.Repositories.Interfaces;
using Npgsql;

namespace FarmaInventory.API.Repositories
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly string _connectionString;

        public ProductoRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

       public async Task<IEnumerable<Producto>> ObtenerTodosAsync()
{
    using var conn = GetConnection();
    return await conn.QueryAsync<Producto>(
        "SELECT * FROM sp_obtener_productos()");
}

public async Task<Producto?> ObtenerPorIdAsync(int id)
{
    using var conn = GetConnection();
    return await conn.QueryFirstOrDefaultAsync<Producto>(
        "SELECT * FROM sp_obtener_producto_por_id(@ProductoId)",
        new { ProductoId = id });
}

public async Task<int> CrearAsync(CrearProductoDTO dto)
{
    using var conn = GetConnection();
    return await conn.QueryFirstAsync<int>(
        @"SELECT sp_crear_producto(
            @CodigoBarras, @Nombre, @Descripcion,
            @CategoriaID, @ProveedorID,
            @PrecioCompra, @PrecioVenta,
            @StockActual, @StockMinimo, @StockMaximo,
            @UnidadMedida, @FechaVencimiento, @RequiereReceta)",
        new {
            dto.CodigoBarras, dto.Nombre, dto.Descripcion,
            dto.CategoriaID, dto.ProveedorID,
            dto.PrecioCompra, dto.PrecioVenta,
            dto.StockActual, dto.StockMinimo, dto.StockMaximo,
            dto.UnidadMedida, dto.FechaVencimiento, dto.RequiereReceta
        });
}

public async Task ActualizarAsync(int id, ActualizarProductoDTO dto)
{
    using var conn = GetConnection();
    await conn.ExecuteAsync(
        @"SELECT sp_actualizar_producto(
            @ProductoID, @Nombre, @Descripcion,
            @CategoriaID, @ProveedorID,
            @PrecioCompra, @PrecioVenta,
            @StockMinimo, @StockMaximo,
            @UnidadMedida, @FechaVencimiento, @RequiereReceta)",
        new {
            ProductoID = id,
            dto.Nombre, dto.Descripcion,
            dto.CategoriaID, dto.ProveedorID,
            dto.PrecioCompra, dto.PrecioVenta,
            dto.StockMinimo, dto.StockMaximo,
            dto.UnidadMedida, dto.FechaVencimiento, dto.RequiereReceta
        });
}

public async Task EliminarAsync(int id)
{
    using var conn = GetConnection();
    await conn.ExecuteAsync(
        "SELECT sp_eliminar_producto(@ProductoId)",
        new { ProductoId = id });
}

public async Task RegistrarMovimientoAsync(MovimientoDTO dto)
{
    using var conn = GetConnection();
    await conn.ExecuteAsync(
        @"SELECT sp_registrar_movimiento(
            @ProductoID, @UsuarioID,
            @TipoMovimiento, @Cantidad, @Motivo)",
        new {
            dto.ProductoID, dto.UsuarioID,
            dto.TipoMovimiento, dto.Cantidad, dto.Motivo
        });
}
    }
}