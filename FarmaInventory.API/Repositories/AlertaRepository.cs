using Dapper;
using FarmaInventory.API.Models;
using FarmaInventory.API.Repositories.Interfaces;
using Npgsql;

namespace FarmaInventory.API.Repositories
{
    public class AlertaRepository : IAlertaRepository
    {
        private readonly string _connectionString;

        public AlertaRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        public async Task<IEnumerable<Alerta>> ObtenerActivasAsync()
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<Alerta>(
                "SELECT * FROM sp_obtener_alertas()");
        }

        public async Task ResolverAsync(int alertaId)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                "UPDATE alertas SET resuelta = TRUE, fecha_resolucion = NOW() WHERE alerta_id = @AlertaId",
                new { AlertaId = alertaId });
        }
    }
}