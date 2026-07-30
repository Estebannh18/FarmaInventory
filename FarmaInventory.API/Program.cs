using FarmaInventory.API.Repositories;
using FarmaInventory.API.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<IAlertaRepository, AlertaRepository>();
builder.Services.AddScoped<IKardexRepository, KardexRepository>();
builder.Services.AddScoped<ILoteRepository, LoteRepository>();
builder.Services.AddScoped<IAuditoriaRepository, AuditoriaRepository>();
builder.Services.AddScoped<IProveedorRepository, ProveedorRepository>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();
app.Run();