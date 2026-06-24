using FarmaInventory.API.Models;

namespace FarmaInventory.API.Repositories.Interfaces
{
    public interface IAlertaRepository
    {
        Task<IEnumerable<Alerta>> ObtenerActivasAsync();
        Task ResolverAsync(int alertaId);
    }
}