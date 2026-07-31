namespace FarmaInventory.API.Models
{
    public class KardexItem
    {
        public int MovimientoID { get; set; }
        public string ProductoNombre { get; set; } = string.Empty;
        public string CodigoBarras { get; set; } = string.Empty;
        public string CategoriaNombre { get; set; } = string.Empty;
        public string UsuarioNombre { get; set; } = string.Empty;
        public string TipoMovimiento { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public int StockAnterior { get; set; }
        public int StockNuevo { get; set; }
        public string? Motivo { get; set; }
        public DateTime FechaMovimiento { get; set; }
    }

    public class KardexResumen
    {
        public int ProductoID { get; set; }
        public string ProductoNombre { get; set; } = string.Empty;
        public string CategoriaNombre { get; set; } = string.Empty;
        public int StockActual { get; set; }
        public long TotalEntradas { get; set; }
        public long TotalSalidas { get; set; }
        public long TotalAjustes { get; set; }
        public long TotalMovimientos { get; set; }
        public DateTime? UltimoMovimiento { get; set; }
    }
}