using System.Data;
using AdviceHomework.Models;
using Dapper;

namespace AdviceHomework.Repositories;

public class OrdersRepository : IOrdersRepository
{
    private readonly IDbConnection _db;

    public OrdersRepository(IDbConnection db) => _db = db;

    public async Task<IEnumerable<OrderDeliveryDto>> GetOrdersAsync(string kind, int limit)
    {
        // Calls stored procedure dbo.usp_GetOrdersDeliveryStatus
        var result = await _db.QueryAsync<OrderDeliveryDto>(
            "dbo.usp_GetOrdersDeliveryStatus",
            new { kind, limit },
            commandType: CommandType.StoredProcedure);

        return result;
    }
}
