using Microsoft.EntityFrameworkCore;
using SprintPlanner.Domain.Entities;
using SprintPlanner.Infrastructure;

public class SprintRepository : ISprintRepository
{
    private readonly AppDbContext _context;

    public SprintRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddRangeAsync(List<Sprint> sprints)
    {
        await _context.Sprints.AddRangeAsync(sprints);
    }

    public async Task<List<Sprint>> GetByProjectIdAsync(int projectId)
    {
        return await _context.Sprints
            .Where(s => s.ProjectId == projectId)
            .OrderBy(s => s.StartDate)
            .ToListAsync();
    }

    public async Task<Sprint?> GetByIdAsync(int id)
    {
        return await _context.Sprints.FindAsync(id);
    }

    public async Task UpdateAsync(Sprint sprint)
    {
        _context.Sprints.Update(sprint);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Sprint sprint)
    {
        _context.Sprints.Remove(sprint);
    }

    public async Task<Sprint?> GetActiveSprintAsync()
    {
        return await _context.Sprints
            .OrderByDescending(s => s.CreatedAt)
            .FirstOrDefaultAsync();
    }
}