using AdviceHomework.Models;

namespace AdviceHomework.Repositories;

public interface IOrdersRepository
{
    Task<IEnumerable<OrderDeliveryDto>> GetOrdersAsync(string kind, int limit);
}
