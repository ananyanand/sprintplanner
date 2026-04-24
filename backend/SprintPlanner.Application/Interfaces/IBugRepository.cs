using SprintPlanner.Domain.Entities;

public interface IBugRepository
{
    Task<List<Bug>> GetByProjectAsync(int projectId);
    Task<Bug?> GetByIdAsync(int id);

    Task AddAsync(Bug bug);
    Task UpdateAsync(Bug bug);
    Task UpdateStatusDirectAsync(int id, string status);
    Task DeleteAsync(int id);
    Task<List<Bug>> GetByEmployeeAsync(int employeeId);
}