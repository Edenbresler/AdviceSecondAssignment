using AdviceHomework.Models;
using AdviceHomework.Repositories;
using Dapper;
using System.Data;

public class AnalyticsRepository : IAnalyticsRepository
{
    private readonly IDbConnection _db;
    public AnalyticsRepository(IDbConnection db) => _db = db;

    public async Task<IEnumerable<TopProductByCityDto>> GetTop3ProductsBestCityAsync()
    {
        return await _db.QueryAsync<TopProductByCityDto>(
            "dbo.usp_Top3ProductsBestCity",
            commandType: CommandType.StoredProcedure);
    }
}