namespace FarmaInventory.API.DTOs
{
    public class CrearProveedorDTO
    {
        public string RazonSocial { get; set; } = string.Empty;
        public string NIT { get; set; } = string.Empty;
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public string? Direccion { get; set; }
    }

    public class ActualizarProveedorDTO
    {
        public string RazonSocial { get; set; } = string.Empty;
        public string NIT { get; set; } = string.Empty;
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public string? Direccion { get; set; }
    }
}