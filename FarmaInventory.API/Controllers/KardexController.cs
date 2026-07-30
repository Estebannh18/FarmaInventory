using FarmaInventory.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaInventory.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KardexController : ControllerBase
    {
        private readonly IKardexRepository _repo;

        public KardexController(IKardexRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> Get(
            [FromQuery] int?    productoId = null,
            [FromQuery] string? tipo       = null,
            [FromQuery] DateTime? desde    = null,
            [FromQuery] DateTime? hasta    = null)
        {
            var items = await _repo.ObtenerKardexAsync(productoId, tipo, desde, hasta);
            return Ok(items);
        }

        [HttpGet("resumen")]
        public async Task<IActionResult> GetResumen()
        {
            var resumen = await _repo.ObtenerResumenAsync();
            return Ok(resumen);
        }
    }
}