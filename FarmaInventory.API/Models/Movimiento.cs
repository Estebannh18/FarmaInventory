namespace FarmaInventory.API.Models
{
    public class Movimiento
    {
        public int MovimientoID { get; set; }
        public int ProductoID { get; set; }
        public string? ProductoNombre { get; set; }
        public int UsuarioID { get; set; }
        public string TipoMovimiento { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public int StockAnterior { get; set; }
        public int StockNuevo { get; set; }
        public string? Motivo { get; set; }
        public DateTime FechaMovimiento { get; set; }
    }
}