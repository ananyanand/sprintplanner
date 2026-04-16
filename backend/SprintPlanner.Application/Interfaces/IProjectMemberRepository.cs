using SprintPlanner.Domain.Entities;

public interface IProjectMemberRepository
{
    Task<List<ProjectMember>> GetByProjectIdAsync(int projectId);
    Task AddRangeAsync(List<ProjectMember> members);
    Task RemoveRangeAsync(List<ProjectMember> members);
    Task<ProjectMember?> GetAsync(int projectId, int employeeId);
    Task DeleteAsync(ProjectMember entity);
}