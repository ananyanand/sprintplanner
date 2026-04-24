using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Authorize] // 🔥 Add authorization if needed
[Route("api/[controller]")]
public class BugsController : ControllerBase
{
    private readonly IBugService _service;

    public BugsController(IBugService service)
    {
        _service = service;
    }

    // ✅ GET BY PROJECT
    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetByProject(int projectId)
    {
        var bugs = await _service.GetByProjectAsync(projectId);
        return Ok(bugs);
    }

    // ✅ CREATE
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBugDto dto)
    {
        var bug = await _service.CreateAsync(dto);
        return Ok(bug);
    }

    // ✅ DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }

    // ✅ UPDATE (All Fields)
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBugDto dto)
    {
        var bug = await _service.UpdateAsync(id, dto);
        return Ok(bug);
    }

    // ✅ UPDATE STATUS ONLY
    [HttpPut("{id}/status")]

        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)

        {

            await _service.UpdateStatusAsync(id, status);

            return Ok();

        }
}