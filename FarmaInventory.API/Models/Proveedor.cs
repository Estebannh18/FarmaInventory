namespace FarmaInventory.API.Models
{
    public class Proveedor
    {
        public int ProveedorID { get; set; }
        public string RazonSocial { get; set; } = string.Empty;
        public string NIT { get; set; } = string.Empty;
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public string? Direccion { get; set; }
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int TotalProductos { get; set; }
        public int TotalUnidades { get; set; }
        public decimal ValorInventario { get; set; }
    }

    public class ActividadItem
    {
        public string Tipo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Detalle { get; set; } = string.Empty;
        public string Usuario { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }
    }
}