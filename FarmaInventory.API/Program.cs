using Dapper;
using FarmaInventory.API.Models;
using FarmaInventory.API.Repositories;
using FarmaInventory.API.Repositories.Interfaces;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// ── Mapper automático snake_case → PascalCase ──────────────
static CustomPropertyTypeMap CrearMapper<T>() => new CustomPropertyTypeMap(
    typeof(T), (type, col) =>
    {
        var norm = col.Replace("_", "").ToLower();
        return type.GetProperties()
                   .FirstOrDefault(p => p.Name.ToLower() == norm);
    }
);

SqlMapper.SetTypeMap(typeof(Producto),          CrearMapper<Producto>());
SqlMapper.SetTypeMap(typeof(Alerta),            CrearMapper<Alerta>());
SqlMapper.SetTypeMap(typeof(Movimiento),        CrearMapper<Movimiento>());
SqlMapper.SetTypeMap(typeof(KardexItem),        CrearMapper<KardexItem>());
SqlMapper.SetTypeMap(typeof(KardexResumen),     CrearMapper<KardexResumen>());
SqlMapper.SetTypeMap(typeof(Lote),              CrearMapper<Lote>());
SqlMapper.SetTypeMap(typeof(AlertaVencimiento), CrearMapper<AlertaVencimiento>());
SqlMapper.SetTypeMap(typeof(AuditoriaItem),     CrearMapper<AuditoriaItem>());
SqlMapper.SetTypeMap(typeof(AuditoriaResumen),  CrearMapper<AuditoriaResumen>());
SqlMapper.SetTypeMap(typeof(Proveedor),         CrearMapper<Proveedor>());
SqlMapper.SetTypeMap(typeof(ActividadItem),     CrearMapper<ActividadItem>());

// ── Servicios ──────────────────────────────────────────────
builder.Services.AddControllers();

builder.Services.AddScoped<IProductoRepository,  ProductoRepository>();
builder.Services.AddScoped<IAlertaRepository,    AlertaRepository>();
builder.Services.AddScoped<IKardexRepository,    KardexRepository>();
builder.Services.AddScoped<ILoteRepository,      LoteRepository>();
builder.Services.AddScoped<IAuditoriaRepository, AuditoriaRepository>();
builder.Services.AddScoped<IProveedorRepository, ProveedorRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

// ── App ────────────────────────────────────────────────────
var app = builder.Build();

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();
app.Run();