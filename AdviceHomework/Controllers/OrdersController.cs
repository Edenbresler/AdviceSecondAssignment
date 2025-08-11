using AdviceHomework.Services;
using Microsoft.AspNetCore.Mvc;

namespace AdviceHomework.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrdersService _svc;

    public OrdersController(IOrdersService svc) => _svc = svc;

    [HttpGet("delivery-status")]
    public async Task<IActionResult> GetOrders([FromQuery] string kind = "late", [FromQuery] int limit = 10)
        => Ok(await _svc.GetOrdersAsync(kind, limit));
}
