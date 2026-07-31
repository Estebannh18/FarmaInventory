using Dapper;
using FarmaInventory.API.DTOs;
using FarmaInventory.API.Models;
using FarmaInventory.API.Repositories.Interfaces;
using Npgsql;

namespace FarmaInventory.API.Repositories
{
    public class AuditoriaRepository : IAuditoriaRepository
    {
        private readonly string _connectionString;

        public AuditoriaRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        public async Task<IEnumerable<AuditoriaItem>> ObtenerAsync(
            string? modulo, string? accion, int? usuarioId,
            DateTime? desde, DateTime? hasta, bool soloFallidos)
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<AuditoriaItem>(
                "SELECT * FROM sp_obtener_auditoria(@Modulo, @Accion, @UsuarioId, @Desde, @Hasta, @SoloFallidos)",
                new {
                    Modulo       = modulo,
                    Accion       = accion,
                    UsuarioId    = usuarioId,
                    Desde        = desde,
                    Hasta        = hasta,
                    SoloFallidos = soloFallidos
                });
        }

        public async Task<IEnumerable<AuditoriaResumen>> ObtenerResumenAsync()
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<AuditoriaResumen>(
                "SELECT * FROM sp_resumen_auditoria()");
        }

        public async Task RegistrarAsync(RegistrarAuditoriaDTO dto)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                @"SELECT sp_registrar_auditoria(
                    @UsuarioID, @UsuarioNombre, @Accion, @Modulo,
                    @EntidadID, @EntidadNombre,
                    @ValoresAnteriores, @ValoresNuevos,
                    @DireccionIP, @Exitoso, @Detalle)",
                new {
                    dto.UsuarioID,         dto.UsuarioNombre,
                    dto.Accion,            dto.Modulo,
                    dto.EntidadID,         dto.EntidadNombre,
                    dto.ValoresAnteriores, dto.ValoresNuevos,
                    dto.DireccionIP,       dto.Exitoso,
                    dto.Detalle
                });
        }
    }
}