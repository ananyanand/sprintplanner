using Microsoft.EntityFrameworkCore;
using SprintPlanner.Domain.Entities;
using SprintPlanner.Infrastructure;

public class ProjectMemberRepository : IProjectMemberRepository
{
    private readonly AppDbContext _context;

    public ProjectMemberRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProjectMember>> GetByProjectIdAsync(int projectId)
    {
        return await _context.ProjectMembers
            .Include(x => x.Employee) // 🔥 THIS LINE FIXES EVERYTHING
            .Where(x => x.ProjectId == projectId)
            .ToListAsync();
    }
    public async Task AddRangeAsync(List<ProjectMember> members)
    {
        await _context.ProjectMembers.AddRangeAsync(members);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveRangeAsync(List<ProjectMember> members)
    {
        _context.ProjectMembers.RemoveRange(members);
        await _context.SaveChangesAsync();
    }

    public async Task<ProjectMember?> GetAsync(int projectId, int employeeId)
    {
        return await _context.ProjectMembers
            .FirstOrDefaultAsync(x =>
                x.ProjectId == projectId &&
                x.EmployeeId == employeeId);
    }

    public async Task DeleteAsync(ProjectMember entity)
    {
        _context.ProjectMembers.Remove(entity);
        await _context.SaveChangesAsync();
    }
}