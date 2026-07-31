using Dapper;
using FarmaInventory.API.Models;
using FarmaInventory.API.Repositories.Interfaces;
using Npgsql;

namespace FarmaInventory.API.Repositories
{
    public class KardexRepository : IKardexRepository
    {
        private readonly string _connectionString;

        public KardexRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        public async Task<IEnumerable<KardexItem>> ObtenerKardexAsync(
            int? productoId, string? tipo, DateTime? desde, DateTime? hasta)
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<KardexItem>(
                "SELECT * FROM sp_obtener_kardex(@ProductoId, @Tipo, @Desde, @Hasta)",
                new {
                    ProductoId = productoId,
                    Tipo       = tipo,
                    Desde      = desde,
                    Hasta      = hasta
                });
        }

        public async Task<IEnumerable<KardexResumen>> ObtenerResumenAsync()
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<KardexResumen>(
                "SELECT * FROM sp_resumen_kardex()");
        }
    }
}