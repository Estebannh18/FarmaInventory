namespace FarmaInventory.API.Models
{
    public class AuditoriaItem
    {
        public int AuditoriaID { get; set; }
        public int? UsuarioID { get; set; }
        public string UsuarioNombre { get; set; } = string.Empty;
        public string Accion { get; set; } = string.Empty;
        public string Modulo { get; set; } = string.Empty;
        public int? EntidadID { get; set; }
        public string? EntidadNombre { get; set; }
        public string? ValoresAnteriores { get; set; }
        public string? ValoresNuevos { get; set; }
        public string? DireccionIP { get; set; }
        public bool Exitoso { get; set; }
        public string? Detalle { get; set; }
        public DateTime FechaAccion { get; set; }
    }

    public class AuditoriaResumen
    {
        public string Modulo { get; set; } = string.Empty;
        public int TotalAcciones { get; set; }
        public int Creaciones { get; set; }
        public int Actualizaciones { get; set; }
        public int Eliminaciones { get; set; }
        public int Movimientos { get; set; }
        public int Fallidos { get; set; }
        public DateTime? UltimaAccion { get; set; }
    }
}