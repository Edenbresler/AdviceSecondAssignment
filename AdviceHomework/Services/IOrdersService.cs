using AdviceHomework.Models;
namespace AdviceHomework.Services;
public interface IOrdersService
{
    Task<IEnumerable<OrderDeliveryDto>> GetOrdersAsync(string kind, int limit);
}