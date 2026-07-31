using Dapper;
using FarmaInventory.API.DTOs;
using FarmaInventory.API.Models;
using FarmaInventory.API.Repositories.Interfaces;
using Npgsql;

namespace FarmaInventory.API.Repositories
{
    public class ProveedorRepository : IProveedorRepository
    {
        private readonly string _connectionString;

        public ProveedorRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        private NpgsqlConnection GetConnection() => new NpgsqlConnection(_connectionString);

        public async Task<IEnumerable<Proveedor>> ObtenerTodosAsync()
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<Proveedor>(
                "SELECT * FROM sp_obtener_proveedores()");
        }

        public async Task<Proveedor?> ObtenerPorIdAsync(int id)
        {
            using var conn = GetConnection();
            return await conn.QueryFirstOrDefaultAsync<Proveedor>(
                "SELECT * FROM sp_obtener_proveedor_por_id(@ProveedorId)",
                new { ProveedorId = id });
        }

        public async Task<int> CrearAsync(CrearProveedorDTO dto)
        {
            using var conn = GetConnection();
            return await conn.QueryFirstAsync<int>(
                "SELECT sp_crear_proveedor(@RazonSocial, @NIT, @Telefono, @Email, @Direccion)",
                new {
                    dto.RazonSocial, dto.NIT,
                    dto.Telefono, dto.Email, dto.Direccion
                });
        }

        public async Task ActualizarAsync(int id, ActualizarProveedorDTO dto)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                "SELECT sp_actualizar_proveedor(@ProveedorId, @RazonSocial, @NIT, @Telefono, @Email, @Direccion)",
                new {
                    ProveedorId = id,
                    dto.RazonSocial, dto.NIT,
                    dto.Telefono, dto.Email, dto.Direccion
                });
        }

        public async Task EliminarAsync(int id)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                "SELECT sp_eliminar_proveedor(@ProveedorId)",
                new { ProveedorId = id });
        }

        public async Task<IEnumerable<ActividadItem>> ObtenerActividadRecienteAsync()
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<ActividadItem>(
                "SELECT * FROM sp_actividad_reciente()");
        }
    }
}