using Microsoft.EntityFrameworkCore;
using SprintPlanner.Domain.Entities;
using SprintPlanner.Infrastructure;

public class ReminderRepository : IReminderRepository
{
    private readonly AppDbContext _context;

    public ReminderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Reminder>> GetByEmployeeAsync(int employeeId)
    {
        return await _context.Reminders
            .Where(r => r.EmployeeId == employeeId)
            .ToListAsync();
    }

    public async Task<Reminder?> GetByIdAsync(int id)
    {
        return await _context.Reminders.FindAsync(id);
    }

    public async Task AddAsync(Reminder reminder)
    {
        await _context.Reminders.AddAsync(reminder);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Reminder reminder)
    {
        _context.Reminders.Update(reminder);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var reminder = await _context.Reminders.FindAsync(id);
        if (reminder != null)
        {
            _context.Reminders.Remove(reminder);
            await _context.SaveChangesAsync();
        }
    }
}