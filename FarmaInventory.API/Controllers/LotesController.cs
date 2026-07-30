using FarmaInventory.API.DTOs;
using FarmaInventory.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaInventory.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LotesController : ControllerBase
    {
        private readonly ILoteRepository _repo;

        public LotesController(ILoteRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? productoId = null)
        {
            var lotes = await _repo.ObtenerTodosAsync(productoId);
            return Ok(lotes);
        }

        [HttpGet("alertas-vencimiento")]
        public async Task<IActionResult> GetAlertasVencimiento([FromQuery] int dias = 90)
        {
            var alertas = await _repo.ObtenerAlertasVencimientoAsync(dias);
            return Ok(alertas);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CrearLoteDTO dto)
        {
            var nuevoId = await _repo.CrearAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = nuevoId }, new { id = nuevoId });
        }

        [HttpPut("{id}/cantidad")]
        public async Task<IActionResult> UpdateCantidad(int id, [FromBody] ActualizarCantidadLoteDTO dto)
        {
            await _repo.ActualizarCantidadAsync(id, dto.NuevaCantidad);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repo.EliminarAsync(id);
            return NoContent();
        }
    }
}