using Dapper;
using FarmaInventory.API.Models;
using FarmaInventory.API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace FarmaInventory.API.Repositories
{
    public class AlertaRepository : IAlertaRepository
    {
        private readonly string _connectionString;

        public AlertaRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        private SqlConnection GetConnection() => new SqlConnection(_connectionString);

        public async Task<IEnumerable<Alerta>> ObtenerActivasAsync()
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<Alerta>(
                "sp_ObtenerAlertas",
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task ResolverAsync(int alertaId)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                "UPDATE Alertas SET Resuelta = 1, FechaResolucion = GETDATE() WHERE AlertaID = @AlertaID",
                new { AlertaID = alertaId });
        }
    }
}