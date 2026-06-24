using FarmaInventory.API.DTOs;
using FarmaInventory.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaInventory.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly IProductoRepository _repo;

        public ProductosController(IProductoRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var productos = await _repo.ObtenerTodosAsync();
            return Ok(productos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var producto = await _repo.ObtenerPorIdAsync(id);
            if (producto == null) return NotFound();
            return Ok(producto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CrearProductoDTO dto)
        {
            var nuevoId = await _repo.CrearAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = nuevoId }, new { id = nuevoId });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ActualizarProductoDTO dto)
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

        [HttpPost("movimiento")]
        public async Task<IActionResult> Movimiento([FromBody] MovimientoDTO dto)
        {
            await _repo.RegistrarMovimientoAsync(dto);
            return Ok(new { mensaje = "Movimiento registrado correctamente." });
        }
    }
}