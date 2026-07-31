using Dapper;
using FarmaInventory.API.DTOs;
using FarmaInventory.API.Models;
using FarmaInventory.API.Repositories.Interfaces;
using Npgsql;

namespace FarmaInventory.API.Repositories
{
    public class LoteRepository : ILoteRepository
    {
        private readonly string _connectionString;

        public LoteRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        public async Task<IEnumerable<Lote>> ObtenerTodosAsync(int? productoId)
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<Lote>(
                "SELECT * FROM sp_obtener_lotes(@ProductoId)",
                new { ProductoId = productoId });
        }

        public async Task<IEnumerable<AlertaVencimiento>> ObtenerAlertasVencimientoAsync(int diasAlerta)
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<AlertaVencimiento>(
                "SELECT * FROM sp_alertas_vencimiento(@DiasAlerta)",
                new { DiasAlerta = diasAlerta });
        }

        public async Task<int> CrearAsync(CrearLoteDTO dto)
        {
            using var conn = GetConnection();
            return await conn.QueryFirstAsync<int>(
                @"SELECT sp_crear_lote(
                    @ProductoID, @NumeroLote, @RegistroINVIMA,
                    @FechaFabricacion, @FechaVencimiento,
                    @CantidadInicial, @PrecioCompra)",
                new {
                    dto.ProductoID,       dto.NumeroLote,
                    dto.RegistroINVIMA,   dto.FechaFabricacion,
                    dto.FechaVencimiento, dto.CantidadInicial,
                    dto.PrecioCompra
                });
        }

        public async Task ActualizarCantidadAsync(int loteId, int nuevaCantidad)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                "SELECT sp_actualizar_cantidad_lote(@LoteId, @NuevaCantidad)",
                new { LoteId = loteId, NuevaCantidad = nuevaCantidad });
        }

        public async Task EliminarAsync(int loteId)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                "SELECT sp_eliminar_lote(@LoteId)",
                new { LoteId = loteId });
        }
    }
}