using AdviceHomework.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/analytics")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _svc;
    public AnalyticsController(IAnalyticsService svc) => _svc = svc;

    // GET /api/analytics/top-products
    [HttpGet("top-products")]
    public async Task<IActionResult> GetTopProducts()
        => Ok(await _svc.GetTopProductsBestCityAsync());
}
