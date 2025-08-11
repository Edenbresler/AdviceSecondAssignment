
using AdviceHomework.Models;

namespace AdviceHomework.Services;

public interface IAnalyticsService
{
    Task<IEnumerable<TopProductByCityDto>> GetTop3ProductsBestCityAsync();
}
