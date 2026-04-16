using SprintPlanner.Domain.Entities;

public interface ITaskRepository
{
    Task AddAsync(TaskItem task);

    Task<List<TaskItem>> GetBySprintIdAsync(int sprintId);

    Task<TaskItem?> GetByIdAsync(int id);

    Task DeleteAsync(TaskItem task);

    // ✅ ADD THIS
    Task UpdateAsync(TaskItem task);
     Task<List<TaskItem>> GetByEmployeeAsync(int employeeId);
}