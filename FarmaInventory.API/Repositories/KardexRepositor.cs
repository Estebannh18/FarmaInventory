using Dapper;
using FarmaInventory.API.Models;
using FarmaInventory.API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace FarmaInventory.API.Repositories
{
    public class KardexRepository : IKardexRepository
    {
        private readonly string _connectionString;

        public KardexRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        private SqlConnection GetConnection() => new SqlConnection(_connectionString);

        public async Task<IEnumerable<KardexItem>> ObtenerKardexAsync(
            int? productoId, string? tipo, DateTime? desde, DateTime? hasta)
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<KardexItem>(
                "sp_ObtenerKardex",
                new {
                    ProductoID     = productoId,
                    TipoMovimiento = tipo,
                    FechaDesde     = desde,
                    FechaHasta     = hasta
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<KardexResumen>> ObtenerResumenAsync()
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<KardexResumen>(
                "sp_ResumenKardex",
                commandType: System.Data.CommandType.StoredProcedure);
        }
    }
}