using Dapper;
using FarmaInventory.API.DTOs;
using FarmaInventory.API.Models;
using FarmaInventory.API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace FarmaInventory.API.Repositories
{
    public class LoteRepository : ILoteRepository
    {
        private readonly string _connectionString;

        public LoteRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        private SqlConnection GetConnection() => new SqlConnection(_connectionString);

        public async Task<IEnumerable<Lote>> ObtenerTodosAsync(int? productoId)
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<Lote>(
                "sp_ObtenerLotes",
                new { ProductoID = productoId },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<AlertaVencimiento>> ObtenerAlertasVencimientoAsync(int diasAlerta)
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<AlertaVencimiento>(
                "sp_AlertasVencimiento",
                new { DiasAlerta = diasAlerta },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<int> CrearAsync(CrearLoteDTO dto)
        {
            using var conn = GetConnection();
            return await conn.QueryFirstAsync<int>(
                "sp_CrearLote",
                new {
                    dto.ProductoID,    dto.NumeroLote,
                    dto.RegistroINVIMA, dto.FechaFabricacion,
                    dto.FechaVencimiento, dto.CantidadInicial,
                    dto.PrecioCompra
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task ActualizarCantidadAsync(int loteId, int nuevaCantidad)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                "sp_ActualizarCantidadLote",
                new { LoteID = loteId, NuevaCantidad = nuevaCantidad },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task EliminarAsync(int loteId)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                "sp_EliminarLote",
                new { LoteID = loteId },
                commandType: System.Data.CommandType.StoredProcedure);
        }
    }
}