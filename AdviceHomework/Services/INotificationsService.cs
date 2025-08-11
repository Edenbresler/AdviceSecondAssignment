namespace AdviceHomework.Services;

public interface INotificationsService
{
    Task BroadcastAsync(string message);
}
