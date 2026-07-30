using FarmaInventory.API.DTOs;
using FarmaInventory.API.Models;

namespace FarmaInventory.API.Repositories.Interfaces
{
    public interface IAuditoriaRepository
    {
        Task<IEnumerable<AuditoriaItem>> ObtenerAsync(
            string? modulo, string? accion, int? usuarioId,
            DateTime? desde, DateTime? hasta, bool soloFallidos);
        Task<IEnumerable<AuditoriaResumen>> ObtenerResumenAsync();
        Task RegistrarAsync(RegistrarAuditoriaDTO dto);
    }
}