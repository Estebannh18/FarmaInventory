using FarmaInventory.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaInventory.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlertasController : ControllerBase
    {
        private readonly IAlertaRepository _repo;

        public AlertasController(IAlertaRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetActivas()
        {
            var alertas = await _repo.ObtenerActivasAsync();
            return Ok(alertas);
        }

        [HttpPut("{id}/resolver")]
        public async Task<IActionResult> Resolver(int id)
        {
            await _repo.ResolverAsync(id);
            return Ok(new { mensaje = "Alerta resuelta." });
        }
    }
}