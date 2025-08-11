using System.Data;
using AdviceHomework.Hosted;
using AdviceHomework.Hubs;
using AdviceHomework.Repositories;
using AdviceHomework.Services;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

// 1) MVC + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2) CORS – לקוח Vite על 5173 (http וגם https)
builder.Services.AddCors(opt =>
{
    opt.AddDefaultPolicy(p => p
        .WithOrigins("http://localhost:5173", "https://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

// 3) SignalR (התראות ל-UI)
builder.Services.AddSignalR();

// 4) Dapper connection – Scoped לכל בקשה
builder.Services.AddScoped<IDbConnection>(_ =>
    new SqlConnection(builder.Configuration.GetConnectionString("Default")));

// 5) Repo/Service DI
builder.Services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
builder.Services.AddScoped<IOrdersRepository, OrdersRepository>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<IOrdersService, OrdersService>();
builder.Services.AddSingleton<INotificationsService, NotificationsService>();

// 6) Hosted service לטיימר מהשרת
// אם יש לך מחלקת Options (ServerTimerOptions) – אפשר לקשר כך:
// builder.Services.Configure<ServerTimerOptions>(builder.Configuration.GetSection("ServerTimer"));
builder.Services.AddHostedService<ServerTimerHostedService>();

var app = builder.Build();

// 7) Pipeline
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
