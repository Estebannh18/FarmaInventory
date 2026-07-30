using FarmaInventory.API.DTOs;
using FarmaInventory.API.Models;

namespace FarmaInventory.API.Repositories.Interfaces
{
    public interface IProveedorRepository
    {
        Task<IEnumerable<Proveedor>> ObtenerTodosAsync();
        Task<Proveedor?> ObtenerPorIdAsync(int id);
        Task<int> CrearAsync(CrearProveedorDTO dto);
        Task ActualizarAsync(int id, ActualizarProveedorDTO dto);
        Task EliminarAsync(int id);
        Task<IEnumerable<ActividadItem>> ObtenerActividadRecienteAsync();
    }
}