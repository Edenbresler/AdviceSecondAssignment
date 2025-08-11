
using AdviceHomework.Models;
using AdviceHomework.Repositories;

namespace AdviceHomework.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly IAnalyticsRepository _repo;
    public AnalyticsService(IAnalyticsRepository repo) => _repo = repo;

    public Task<IEnumerable<TopProductByCityDto>> GetTop3ProductsBestCityAsync()
        => _repo.GetTop3ProductsBestCityAsync();

}
