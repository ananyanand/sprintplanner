using SprintPlanner.Domain.Entities;

public interface ISprintRepository
{
    Task AddRangeAsync(List<Sprint> sprints);
    Task<List<Sprint>> GetByProjectIdAsync(int projectId);
    Task<Sprint?> GetByIdAsync(int id);
    Task UpdateAsync(Sprint sprint);
    Task SaveChangesAsync();
      // 🔥 ADD THIS
    Task DeleteAsync(Sprint sprint);
    Task<Sprint?> GetActiveSprintAsync();

}