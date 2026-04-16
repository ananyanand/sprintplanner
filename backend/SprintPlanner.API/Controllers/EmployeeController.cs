using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Authorize]
[Route("api/employees")]// 🔥 protects all endpoints
public class EmployeeController : ControllerBase
{
    private readonly IEmployeeService _service;

    public EmployeeController(IEmployeeService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateEmployeeDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    // ✏️ UPDATE
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateEmployeeDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    // ❌ DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);

        if (!success)
            return NotFound();

        return Ok("Deleted successfully");
    }

    [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var employee = await _service.GetByIdAsync(id);

            if (employee == null)
                return NotFound();

            return Ok(employee);
        }
        [HttpGet("username/{username}")]
    public async Task<IActionResult> GetByUsername(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
            return BadRequest("Username is required");

        var employee = await _service.GetByUsernameAsync(username);

        if (employee == null)
            return NotFound("Employee not found");

        return Ok(employee);
    }
}