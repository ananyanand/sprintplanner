using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Authorize]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _service;

    public TasksController(ITaskService service)
    {
        _service = service;
    }

    // ✅ CREATE
    [HttpPost]
    public async Task<IActionResult> Create(CreateTaskDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return Ok(result);
    }

    // ✅ GET BY SPRINT
    [HttpGet("sprint/{sprintId}")]
    public async Task<IActionResult> GetBySprint(int sprintId)
    {
        var result = await _service.GetBySprintIdAsync(sprintId);
        return Ok(result);
    }

    // ✅ DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return Ok(new { message = "Task deleted successfully" });
    }

    // ✅ UPDATE (All Fields)
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateTaskDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        return Ok(result);
    }

    // ✅ UPDATE STATUS ONLY
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        await _service.UpdateStatusAsync(id, status);
        return Ok();
    }
}