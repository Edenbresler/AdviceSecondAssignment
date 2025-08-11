using AdviceHomework.Models;
using AdviceHomework.Repositories;
using Dapper;
using System.Data;

public class AnalyticsRepository : IAnalyticsRepository
{
    private readonly IDbConnection _db;
    public AnalyticsRepository(IDbConnection db) => _db = db;

    public Task<IEnumerable<TopProductByCityDto>> GetTopProductsBestCityAsync()
        => _db.QueryAsync<TopProductByCityDto>(
            "dbo.usp_Top3ProductsByBestCity",
            commandType: CommandType.StoredProcedure);
}