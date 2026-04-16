using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/reminders")]
public class ReminderController : ControllerBase
{
    private readonly IReminderService _service;

    public ReminderController(IReminderService service)
    {
        _service = service;
    }

    // ✅ GET BY USER
    [HttpGet("employee/{employeeId}")]
    public async Task<IActionResult> GetByEmployee(int employeeId)
    {
        var data = await _service.GetByEmployeeAsync(employeeId);
        return Ok(data);
    }

    // ✅ CREATE
    [HttpPost]
    public async Task<IActionResult> Create(ReminderDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return Ok(result);
    }

    // ✅ UPDATE
    [HttpPut]
    public async Task<IActionResult> Update(ReminderDto dto)
    {
        await _service.UpdateAsync(dto);
        return Ok();
    }

    // ✅ DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return Ok();
    }
}