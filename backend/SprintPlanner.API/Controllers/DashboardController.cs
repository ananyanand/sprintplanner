using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Authorize]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;

    public DashboardController(IDashboardService service)
    {
        _service = service;
    }

    [HttpGet("{username}")]
    public async Task<IActionResult> GetDashboard(string username)
    {
        var data = await _service.GetDashboardByUsernameAsync(username);

        if (data == null)
            return NotFound("User not found");

        return Ok(data);
    }
}