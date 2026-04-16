public interface IProjectMemberService
{
    Task AssignMembersAsync(int projectId, List<int> employeeIds);
    Task<List<EmployeeResponseDto>> GetMembersByProjectAsync(int projectId);
    Task RemoveMemberAsync(int projectId, int employeeId);
}