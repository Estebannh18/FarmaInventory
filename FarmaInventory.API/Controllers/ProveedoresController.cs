using FarmaInventory.API.DTOs;
using FarmaInventory.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaInventory.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProveedoresController : ControllerBase
    {
        private readonly IProveedorRepository _repo;

        public ProveedoresController(IProveedorRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var proveedores = await _repo.ObtenerTodosAsync();
            return Ok(proveedores);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var proveedor = await _repo.ObtenerPorIdAsync(id);
            if (proveedor == null) return NotFound();
            return Ok(proveedor);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CrearProveedorDTO dto)
        {
            var nuevoId = await _repo.CrearAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = nuevoId }, new { id = nuevoId });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ActualizarProveedorDTO dto)
        {
            await _repo.ActualizarAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repo.EliminarAsync(id);
            return NoContent();
        }

        [HttpGet("actividad-reciente")]
        public async Task<IActionResult> GetActividadReciente()
        {
            var actividad = await _repo.ObtenerActividadRecienteAsync();
            return Ok(actividad);
        }
    }
}