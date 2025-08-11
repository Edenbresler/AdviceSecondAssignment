using AdviceHomework.Models;
using AdviceHomework.Repositories;
namespace AdviceHomework.Services;
public class AnalyticsService(IAnalyticsRepository repo) : IAnalyticsService
{
    public Task<IEnumerable<TopProductByCityDto>> GetTopProductsBestCityAsync()
        => repo.GetTopProductsBestCityAsync();
}