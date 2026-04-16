using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Authorize]
[Route("api/sprints")]
public class SprintController : ControllerBase
{
    private readonly ISprintService _service;

    public SprintController(ISprintService service)
    {
        _service = service;
    }

    // 🔥 SYNC SPRINTS
    [HttpPost("sync/{projectId}")]
    public async Task<IActionResult> Sync(int projectId, [FromBody] List<CreateSprintDto> dto)
    {
        await _service.SyncSprintsAsync(projectId, dto);
        return Ok(new { message = "Sprints synced successfully" });
    }

    // ✅ GET BY PROJECT
    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetByProject(int projectId)
    {
        var result = await _service.GetByProjectIdAsync(projectId);
        return Ok(result);
    }

    // ✅ GET BY ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    // ✅ UPDATE (goal/status)
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSprintDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (result == null) return NotFound();
        return Ok(result);
    }
    
}