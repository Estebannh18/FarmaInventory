using FarmaInventory.API.DTOs;
using FarmaInventory.API.Models;

namespace FarmaInventory.API.Repositories.Interfaces
{
    public interface IProductoRepository
    {
        Task<IEnumerable<Producto>> ObtenerTodosAsync();
        Task<Producto?> ObtenerPorIdAsync(int id);
        Task<int> CrearAsync(CrearProductoDTO dto);
        Task ActualizarAsync(int id, ActualizarProductoDTO dto);
        Task EliminarAsync(int id);
        Task RegistrarMovimientoAsync(MovimientoDTO dto);
    }
}   