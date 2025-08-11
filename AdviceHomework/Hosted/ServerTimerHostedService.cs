using AdviceHomework.Services;

namespace AdviceHomework.Hosted;

public class ServerTimerHostedService : BackgroundService
{
    private readonly ILogger<ServerTimerHostedService> _logger;
    private readonly INotificationsService _notifications;
    private readonly IConfiguration _cfg;

    public ServerTimerHostedService(
        ILogger<ServerTimerHostedService> logger,
        INotificationsService notifications,
        IConfiguration cfg)
    {
        _logger = logger;
        _notifications = notifications;
        _cfg = cfg;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Reads interval from appsettings.json: ServerTimer:IntervalMs
        var interval = _cfg.GetValue<int>("ServerTimer:IntervalMs", 10000);

        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.Now.ToString("HH:mm:ss");
            var msg = $"Hello from server! Current time: {now}";
            await _notifications.BroadcastAsync(msg);
            await Task.Delay(interval, stoppingToken);
        }
    }
}
