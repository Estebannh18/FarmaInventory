namespace FarmaInventory.API.DTOs
{
    public class CrearProductoDTO
    {
        public string CodigoBarras { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int CategoriaID { get; set; }
        public int ProveedorID { get; set; }
        public decimal PrecioCompra { get; set; }
        public decimal PrecioVenta { get; set; }
        public int StockActual { get; set; }
        public int StockMinimo { get; set; }
        public int StockMaximo { get; set; }
        public string UnidadMedida { get; set; } = "Unidad";
        public DateTime? FechaVencimiento { get; set; }
        public bool RequiereReceta { get; set; }
    }

    public class ActualizarProductoDTO
    {
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int CategoriaID { get; set; }
        public int ProveedorID { get; set; }
        public decimal PrecioCompra { get; set; }
        public decimal PrecioVenta { get; set; }
        public int StockMinimo { get; set; }
        public int StockMaximo { get; set; }
        public string UnidadMedida { get; set; } = "Unidad";
        public DateTime? FechaVencimiento { get; set; }
        public bool RequiereReceta { get; set; }
    }

    public class MovimientoDTO
    {
        public int ProductoID { get; set; }
        public int UsuarioID { get; set; }
        public string TipoMovimiento { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public string? Motivo { get; set; }
    }
}