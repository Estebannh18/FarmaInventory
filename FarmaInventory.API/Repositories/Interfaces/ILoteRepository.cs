using FarmaInventory.API.DTOs;
using FarmaInventory.API.Models;

namespace FarmaInventory.API.Repositories.Interfaces
{
    public interface ILoteRepository
    {
        Task<IEnumerable<Lote>> ObtenerTodosAsync(int? productoId);
        Task<IEnumerable<AlertaVencimiento>> ObtenerAlertasVencimientoAsync(int diasAlerta);
        Task<int> CrearAsync(CrearLoteDTO dto);
        Task ActualizarCantidadAsync(int loteId, int nuevaCantidad);
        Task EliminarAsync(int loteId);
    }
}