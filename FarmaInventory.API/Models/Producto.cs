namespace FarmaInventory.API.Models
{
    public class Producto
    {
        public int ProductoID { get; set; }
        public string CodigoBarras { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int CategoriaID { get; set; }
        public string? CategoriaNombre { get; set; }
        public int ProveedorID { get; set; }
        public string? ProveedorNombre { get; set; }
        public decimal PrecioCompra { get; set; }
        public decimal PrecioVenta { get; set; }
        public int StockActual { get; set; }
        public int StockMinimo { get; set; }
        public int StockMaximo { get; set; }
        public string UnidadMedida { get; set; } = "Unidad";
        public DateTime? FechaVencimiento { get; set; }
        public bool RequiereReceta { get; set; }
        public bool Activo { get; set; }
        public string? EstadoStock { get; set; }
    }
}