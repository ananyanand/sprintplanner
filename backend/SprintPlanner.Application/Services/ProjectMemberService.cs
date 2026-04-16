using SprintPlanner.Domain.Entities;

public class ProjectMemberService : IProjectMemberService
{
    private readonly IProjectMemberRepository _repo;

    public ProjectMemberService(IProjectMemberRepository repo)
    {
        _repo = repo;
    }

    // ✅ ASSIGN MEMBERS (bulk replace)
    public async Task AssignMembersAsync(int projectId, List<int> employeeIds)
    {
        var existing = await _repo.GetByProjectIdAsync(projectId);

        if (existing.Any())
            await _repo.RemoveRangeAsync(existing);

        var newMembers = employeeIds.Select(empId => new ProjectMember
        {
            ProjectId = projectId,
            EmployeeId = empId
        }).ToList();

        if (newMembers.Any())
            await _repo.AddRangeAsync(newMembers);
    }

    // ✅ GET MEMBERS BY PROJECT (for Sprint page 🔥)
    public async Task<List<EmployeeResponseDto>> GetMembersByProjectAsync(int projectId)
        {
            var members = await _repo.GetByProjectIdAsync(projectId);

            return members.Select(x => new EmployeeResponseDto
            {
                Id = x.EmployeeId,
                Name = x.Employee!.Name,   // ✅ comes from employees table
                Role = x.Employee.Role
            }).ToList();
        }
    // ✅ REMOVE SINGLE MEMBER
    public async Task RemoveMemberAsync(int projectId, int employeeId)
    {
        var entity = await _repo.GetAsync(projectId, employeeId);

        if (entity == null)
            throw new Exception("Mapping not found");

        await _repo.DeleteAsync(entity);
    }
}