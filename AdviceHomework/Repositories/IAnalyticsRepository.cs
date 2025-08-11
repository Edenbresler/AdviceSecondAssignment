using AdviceHomework.Models;

namespace AdviceHomework.Repositories;

public interface IAnalyticsRepository
{
    Task<IEnumerable<TopProductByCityDto>> GetTop3ProductsBestCityAsync();

}

