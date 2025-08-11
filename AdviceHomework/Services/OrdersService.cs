using AdviceHomework.Models;
using AdviceHomework.Repositories;
namespace AdviceHomework.Services;
public class OrdersService(IOrdersRepository repo) : IOrdersService
{
    public Task<IEnumerable<OrderDeliveryDto>> GetOrdersAsync(string kind, int limit)
        => repo.GetOrdersAsync(kind, limit);
}