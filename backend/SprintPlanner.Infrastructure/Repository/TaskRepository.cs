using Microsoft.EntityFrameworkCore;
using SprintPlanner.Domain.Entities;
using SprintPlanner.Infrastructure;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _context;

    public TaskRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(TaskItem task)
    {
        await _context.Tasks.AddAsync(task);
        await _context.SaveChangesAsync();
    }

    public async Task<List<TaskItem>> GetBySprintIdAsync(int sprintId)
    {
        return await _context.Tasks
            .Include(t => t.Assignee) // 🔥 for name
            .Where(t => t.SprintId == sprintId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<TaskItem?> GetByIdAsync(int id)
    {
        return await _context.Tasks.FindAsync(id);
    }

    public async Task DeleteAsync(TaskItem task)
    {
        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(TaskItem task)
    {
        _context.Tasks.Update(task);
        await _context.SaveChangesAsync();
    }
    public async Task<List<TaskItem>> GetByEmployeeAsync(int employeeId)
    {
        return await _context.Tasks
            .Include(t => t.Assignee)
            .Where(t => t.AssignedTo == employeeId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }
}