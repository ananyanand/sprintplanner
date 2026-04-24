using Microsoft.EntityFrameworkCore;
using SprintPlanner.Domain.Entities;
using SprintPlanner.Infrastructure;

public class BugRepository : IBugRepository
{
    private readonly AppDbContext _context;

    public BugRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Bug>> GetByProjectAsync(int projectId)
    {
        return await _context.Bugs
            .Include(b => b.Project)
            .Include(b => b.Assignee) // 🔥 IMPORTANT
            .Where(b => b.ProjectId == projectId)
            .ToListAsync();
    }

    public async Task<Bug?> GetByIdAsync(int id)
    {
        return await _context.Bugs
            .Include(b => b.Assignee)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task AddAsync(Bug bug)
    {
        await _context.Bugs.AddAsync(bug);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Bug bug)
    {
        _context.Bugs.Update(bug);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateStatusDirectAsync(int id, string status)
    {
        await _context.Bugs
            .Where(b => b.Id == id)
            .ExecuteUpdateAsync(s => s.SetProperty(b => b.Status, status));
    }

    public async Task DeleteAsync(int id)
    {
        var bug = await _context.Bugs.FindAsync(id);
        if (bug != null)
        {
            _context.Bugs.Remove(bug);
            await _context.SaveChangesAsync();
        }
    }
    public async Task<List<Bug>> GetByEmployeeAsync(int employeeId)
{
    return await _context.Bugs
        .Include(b => b.Assignee)
        .Where(b => b.AssignedTo == employeeId)
        .OrderByDescending(b => b.CreatedAt)
        .ToListAsync();
}
}