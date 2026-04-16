using SprintPlanner.Domain.Entities;

public interface IReminderRepository
{
    Task<List<Reminder>> GetByEmployeeAsync(int employeeId);
    Task<Reminder?> GetByIdAsync(int id);

    Task AddAsync(Reminder reminder);
    Task UpdateAsync(Reminder reminder);
    Task DeleteAsync(int id);
}