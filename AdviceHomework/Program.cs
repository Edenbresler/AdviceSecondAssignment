using System.Data;
using AdviceHomework.Hosted;
using AdviceHomework.Hubs;
using AdviceHomework.Repositories;
using AdviceHomework.Services;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddCors(opt =>
{
    opt.AddDefaultPolicy(p => p
        .WithOrigins("http://localhost:5173", "https://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});


builder.Services.AddSignalR();


builder.Services.AddScoped<IDbConnection>(_ =>
    new SqlConnection(builder.Configuration.GetConnectionString("Default")));


builder.Services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
builder.Services.AddScoped<IOrdersRepository, OrdersRepository>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<IOrdersService, OrdersService>();
builder.Services.AddSingleton<INotificationsService, NotificationsService>();


builder.Services.AddHostedService<ServerTimerHostedService>();

var app = builder.Build();


app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();
app.MapHub<NotificationsHub>("/hubs/notifications");

app.Run();
