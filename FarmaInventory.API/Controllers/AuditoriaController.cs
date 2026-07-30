using FarmaInventory.API.DTOs;
using FarmaInventory.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaInventory.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuditoriaController : ControllerBase
    {
        private readonly IAuditoriaRepository _repo;

        public AuditoriaController(IAuditoriaRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> Get(
            [FromQuery] string?   modulo       = null,
            [FromQuery] string?   accion       = null,
            [FromQuery] int?      usuarioId    = null,
            [FromQuery] DateTime? desde        = null,
            [FromQuery] DateTime? hasta        = null,
            [FromQuery] bool      soloFallidos = false)
        {
            var items = await _repo.ObtenerAsync(
                modulo, accion, usuarioId, desde, hasta, soloFallidos);
            return Ok(items);
        }

        [HttpGet("resumen")]
        public async Task<IActionResult> GetResumen()
        {
            var resumen = await _repo.ObtenerResumenAsync();
            return Ok(resumen);
        }

        [HttpPost]
        public async Task<IActionResult> Registrar([FromBody] RegistrarAuditoriaDTO dto)
        {
            dto.DireccionIP = HttpContext.Connection.RemoteIpAddress?.ToString();
            await _repo.RegistrarAsync(dto);
            return Ok(new { mensaje = "Evento registrado." });
        }
    }
}