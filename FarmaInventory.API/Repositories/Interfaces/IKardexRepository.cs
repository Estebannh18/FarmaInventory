using FarmaInventory.API.Models;

namespace FarmaInventory.API.Repositories.Interfaces
{
    public interface IKardexRepository
    {
        Task<IEnumerable<KardexItem>> ObtenerKardexAsync(
            int? productoId, string? tipo, DateTime? desde, DateTime? hasta);
        Task<IEnumerable<KardexResumen>> ObtenerResumenAsync();
    }
}