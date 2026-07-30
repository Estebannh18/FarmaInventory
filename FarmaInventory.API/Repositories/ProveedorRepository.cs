using Dapper;
using FarmaInventory.API.DTOs;
using FarmaInventory.API.Models;
using FarmaInventory.API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace FarmaInventory.API.Repositories
{
    public class ProveedorRepository : IProveedorRepository
    {
        private readonly string _connectionString;

        public ProveedorRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        private SqlConnection GetConnection() => new SqlConnection(_connectionString);

        public async Task<IEnumerable<Proveedor>> ObtenerTodosAsync()
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<Proveedor>(
                "sp_ObtenerProveedores",
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<Proveedor?> ObtenerPorIdAsync(int id)
        {
            using var conn = GetConnection();
            return await conn.QueryFirstOrDefaultAsync<Proveedor>(
                "sp_ObtenerProveedorPorID",
                new { ProveedorID = id },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<int> CrearAsync(CrearProveedorDTO dto)
        {
            using var conn = GetConnection();
            return await conn.QueryFirstAsync<int>(
                "sp_CrearProveedor",
                new {
                    dto.RazonSocial, dto.NIT,
                    dto.Telefono, dto.Email, dto.Direccion
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task ActualizarAsync(int id, ActualizarProveedorDTO dto)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                "sp_ActualizarProveedor",
                new {
                    ProveedorID = id,
                    dto.RazonSocial, dto.NIT,
                    dto.Telefono, dto.Email, dto.Direccion
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task EliminarAsync(int id)
        {
            using var conn = GetConnection();
            await conn.ExecuteAsync(
                "sp_EliminarProveedor",
                new { ProveedorID = id },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ActividadItem>> ObtenerActividadRecienteAsync()
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<ActividadItem>(
                "sp_ActividadReciente",
                commandType: System.Data.CommandType.StoredProcedure);
        }
    }
}