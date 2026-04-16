using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Authorize]
[Route("api/project-members")]
public class ProjectMembersController : ControllerBase
{
    private readonly IProjectMemberService _service;

    public ProjectMembersController(IProjectMemberService service)
    {
        _service = service;
    }

    // ✅ ASSIGN MEMBERS
    [HttpPost("assign")]
    public async Task<IActionResult> Assign([FromBody] AssignProjectMembersDto dto)
    {
        await _service.AssignMembersAsync(dto.ProjectId, dto.EmployeeIds);
        return Ok("Members assigned successfully");
    }

    // ✅ GET MEMBERS (USED IN SPRINT PAGE 🔥)
    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetByProject(int projectId)
    {
        var data = await _service.GetMembersByProjectAsync(projectId);
        return Ok(data);
    }

    // ✅ REMOVE MEMBER
    [HttpDelete]
    public async Task<IActionResult> Remove(int projectId, int employeeId)
    {
        await _service.RemoveMemberAsync(projectId, employeeId);
        return NoContent();
    }
}