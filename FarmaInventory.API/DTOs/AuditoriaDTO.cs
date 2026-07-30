namespace FarmaInventory.API.DTOs
{
    public class RegistrarAuditoriaDTO
    {
        public int? UsuarioID { get; set; }
        public string UsuarioNombre { get; set; } = string.Empty;
        public string Accion { get; set; } = string.Empty;
        public string Modulo { get; set; } = string.Empty;
        public int? EntidadID { get; set; }
        public string? EntidadNombre { get; set; }
        public string? ValoresAnteriores { get; set; }
        public string? ValoresNuevos { get; set; }
        public string? DireccionIP { get; set; }
        public bool Exitoso { get; set; } = true;
        public string? Detalle { get; set; }
    }
}