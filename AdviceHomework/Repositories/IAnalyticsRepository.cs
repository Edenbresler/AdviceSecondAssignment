using AdviceHomework.Models;

namespace AdviceHomework.Repositories;

public interface IAnalyticsRepository
{
    Task<IEnumerable<TopProductByCityDto>> GetTopProductsBestCityAsync();
}

