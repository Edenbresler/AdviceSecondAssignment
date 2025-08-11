using AdviceHomework.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace AdviceHomework.Services;

public class NotificationsService : INotificationsService
{
    private readonly IHubContext<NotificationsHub> _hub;

    public NotificationsService(IHubContext<NotificationsHub> hub) => _hub = hub;

    public Task BroadcastAsync(string message)
        => _hub.Clients.All.SendAsync("serverMessage", message);
}
