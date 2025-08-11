
using AdviceHomework.Services;
using Microsoft.AspNetCore.Mvc;

namespace AdviceHomework.Controllers;

[ApiController]
[Route("api/analytics")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _svc;
    public AnalyticsController(IAnalyticsService svc) => _svc = svc;

    [HttpGet("top-products")]
    public async Task<IActionResult> GetTopProducts([FromQuery] string? city = null)
    {
       
        return Ok(await _svc.GetTop3ProductsBestCityAsync());
    }
}
