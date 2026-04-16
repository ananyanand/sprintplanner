using SprintPlanner.Domain.Entities;

public interface IProjectRepository
{
    Task<Project> AddAsync(Project project);
    Task<List<Project>> GetAllAsync();
    Task<Project?> GetByIdAsync(int id);
    Task UpdateAsync(Project project);
    Task DeleteAsync(Project project);
    Task SaveChangesAsync();
}