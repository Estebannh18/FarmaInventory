using FarmaInventory.API.DTOs;

namespace FarmaInventory.API.DTOs
{
    public class CrearLoteDTO
    {
        public int ProductoID { get; set; }
        public string NumeroLote { get; set; } = string.Empty;
        public string? RegistroINVIMA { get; set; }
        public DateTime? FechaFabricacion { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public int CantidadInicial { get; set; }
        public decimal? PrecioCompra { get; set; }
    }

    public class ActualizarCantidadLoteDTO
    {
        public int NuevaCantidad { get; set; }
    }
}