namespace FarmaInventory.API.Models
{
    public class Lote
    {
        public int LoteID { get; set; }
        public int ProductoID { get; set; }
        public string ProductoNombre { get; set; } = string.Empty;
        public string CodigoBarras { get; set; } = string.Empty;
        public string CategoriaNombre { get; set; } = string.Empty;
        public string NumeroLote { get; set; } = string.Empty;
        public string? RegistroINVIMA { get; set; }
        public DateTime? FechaFabricacion { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public int CantidadInicial { get; set; }
        public int CantidadActual { get; set; }
        public decimal? PrecioCompra { get; set; }
        public DateTime FechaIngreso { get; set; }
        public int DiasParaVencer { get; set; }
        public string EstadoVencimiento { get; set; } = string.Empty;
    }

    public class AlertaVencimiento
    {
        public int LoteID { get; set; }
        public string NumeroLote { get; set; } = string.Empty;
        public string? RegistroINVIMA { get; set; }
        public string ProductoNombre { get; set; } = string.Empty;
        public string CodigoBarras { get; set; } = string.Empty;
        public string CategoriaNombre { get; set; } = string.Empty;
        public DateTime FechaVencimiento { get; set; }
        public int CantidadActual { get; set; }
        public int DiasParaVencer { get; set; }
        public string EstadoVencimiento { get; set; } = string.Empty;
    }
}