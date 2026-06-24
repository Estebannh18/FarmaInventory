namespace FarmaInventory.API.Models
{
    public class Alerta
    {
        public int AlertaID { get; set; }
        public int ProductoID { get; set; }
        public string ProductoNombre { get; set; } = string.Empty;
        public string TipoAlerta { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;
        public int StockActual { get; set; }
        public bool Resuelta { get; set; }
        public DateTime FechaAlerta { get; set; }
    }
}