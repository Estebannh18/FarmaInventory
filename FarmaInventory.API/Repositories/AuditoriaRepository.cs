using Dapper;
using FarmaInventory.API.DTOs;
using FarmaInventory.API.Models;
using FarmaInventory.API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace FarmaInventory.API.Repositories
{
    public class AuditoriaRepository : IAuditoriaRepository
    {
        private readonly string _connectionString;

        public AuditoriaRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        private SqlConnection GetConnection() => new SqlConnection(_connectionString);

        public async Task<IEnumerable<AuditoriaItem>> ObtenerAsync(
            string? modulo, string? accion, int? usuarioId,
            DateTime? desde, DateTime? hasta, bool soloFallidos)
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<AuditoriaItem>(
                "sp_ObtenerAuditoria",
                new {
                    Modulo       = modulo,
                    Accion       = accion,
                    UsuarioID    = usuarioId,
                    FechaDesde   = desde,
                    FechaHasta   = hasta,
                    SoloFallidos = soloFallidos ? 1 : 0
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<AuditoriaResumen>> ObtenerResumenAsync()
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<AuditoriaResumen>(
                "sp_ResumenAuditoria",
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task RegistrarAsync(RegistrarAuditoriaDTO dto)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                "sp_RegistrarAuditoria",
                new {
                    dto.UsuarioID,       dto.UsuarioNombre,
                    dto.Accion,          dto.Modulo,
                    dto.EntidadID,       dto.EntidadNombre,
                    dto.ValoresAnteriores, dto.ValoresNuevos,
                    dto.DireccionIP,     dto.Exitoso,
                    dto.Detalle
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }
    }
}